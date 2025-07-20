import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertSentimentAnalysisSchema, insertTopCommentSchema } from "@shared/schema";
import { z } from "zod";
import { YouTubeService } from "./services/youtube";
import { GeminiService } from "./services/gemini";

const youtubeUrlSchema = z.object({
  url: z.string().url().refine(
    (url) => url.includes('youtube.com') || url.includes('youtu.be'),
    "Must be a valid YouTube URL"
  ),
});

const youtubeService = new YouTubeService();
const geminiService = new GeminiService();

// Helper function to parse formatted numbers (e.g., "1.2M views" -> 1200000)
function parseFormattedNumber(str: string): number {
  const cleanStr = str.replace(/[^\d.KMB]/gi, '');
  const num = parseFloat(cleanStr);
  
  if (str.toLowerCase().includes('b')) return Math.floor(num * 1000000000);
  if (str.toLowerCase().includes('m')) return Math.floor(num * 1000000);
  if (str.toLowerCase().includes('k')) return Math.floor(num * 1000);
  
  return Math.floor(num) || 0;
}

// Function to decode HTML entities and handle HTML formatting
function decodeHtmlEntities(text: string): string {
  const htmlEntities: { [key: string]: string } = {
    '&quot;': '"',
    '&#39;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  
  // First, convert <br> tags to line breaks
  let decoded = text.replace(/<br\s*\/?>/gi, '\n');
  
  // Remove other HTML tags
  decoded = decoded.replace(/<[^>]*>/g, '');
  
  // Then decode HTML entities
  decoded = decoded.replace(/&[#\w]+;/g, (entity) => {
    return htmlEntities[entity] || entity;
  });
  
  // Clean up extra whitespace but preserve intentional line breaks
  decoded = decoded.replace(/\n\s*\n/g, '\n\n'); // Preserve double line breaks
  decoded = decoded.replace(/[ \t]+/g, ' '); // Clean up spaces and tabs
  decoded = decoded.trim();
  
  return decoded;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Extract YouTube video ID from URL
  app.post("/api/videos/analyze", async (req, res) => {
    try {
      const { url } = youtubeUrlSchema.parse(req.body);
      
      // Extract YouTube ID from URL
      const youtubeId = youtubeService.extractVideoId(url);
      if (!youtubeId) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }

      // Check if video already exists
      let video = await storage.getVideo(youtubeId);
      
      if (!video) {
        // Fetch real video data from YouTube API
        const youtubeVideo = await youtubeService.getVideoDetails(youtubeId);
        
        const videoData = {
          youtubeId,
          title: youtubeVideo.snippet.title,
          channel: youtubeVideo.snippet.channelTitle,
          thumbnail: youtubeVideo.snippet.thumbnails.high.url,
          duration: "N/A", // YouTube API v3 doesn't provide duration in contentDetails
          viewCount: youtubeService.formatNumber(youtubeVideo.statistics.viewCount) + " views",
          publishedAt: youtubeService.formatDate(youtubeVideo.snippet.publishedAt),
          likes: parseInt(youtubeVideo.statistics.likeCount || "0"),
          comments: parseInt(youtubeVideo.statistics.commentCount || "0"),
          shares: 0, // Not available in API
          subscribers: "N/A", // Would need separate channel API call
        };

        video = await storage.createVideo(videoData);
      }

      // Check if sentiment analysis already exists
      let sentimentAnalysis = await storage.getSentimentAnalysis(video.id);
      let topComments = await storage.getTopComments(video.id);
      
      // If either analysis or comments are missing, fetch and analyze
      if (!sentimentAnalysis || topComments.length === 0) {
        console.log('Fetching comments from YouTube...');
        
        // Fetch 1000 comments to have maximum pool for ultimate analysis
        const comments = await youtubeService.getVideoComments(youtubeId, 1000);
        
        if (comments.length === 0) {
          console.log('No comments found or comments disabled');
          // Handle videos with no comments - return authentic "no data" state
          if (!sentimentAnalysis) {
            sentimentAnalysis = await storage.createSentimentAnalysis({
              videoId: video.id,
              positivePercentage: 0,
              neutralPercentage: 0,
              negativePercentage: 0,
              totalComments: 0,
              trendingTopics: [],
              sentimentTimeline: [],
              aiSummary: "Comments are disabled or unavailable for this video.",
              keyInsights: ["No comment data available for analysis"],
            });
          }
          
          if (topComments.length === 0) {
            topComments = [];
          }
        } else {
          console.log(`Fetched ${comments.length} comments, analyzing top 500 with Lightning-Fast Gemini...`);
          
          // Prepare comments for Gemini analysis

          const commentsForAnalysis = comments.map(c => ({
            text: decodeHtmlEntities(c.textDisplay),
            author: decodeHtmlEntities(c.authorDisplayName),
            likes: c.likeCount
          }));

          // Analyze sentiment using Gemini
          const analysis = await geminiService.analyzeBatchSentiment(commentsForAnalysis);
          
          // Create sentiment analysis if missing
          if (!sentimentAnalysis) {
            // Convert trending topics to our format
            const trendingTopics = analysis.insights.trending_topics.map((topic, index) => ({
              text: topic,
              size: ['sm', 'md', 'lg', 'xl'][Math.floor(Math.random() * 4)] as 'sm' | 'md' | 'lg' | 'xl',
              color: ['emerald', 'blue', 'purple', 'yellow', 'red', 'indigo', 'teal', 'violet'][index % 8] as any
            }));

            // Generate timeline data based on sentiment
            const sentimentTimeline = [
              { time: "00:00", positive: analysis.overall.positive, neutral: analysis.overall.neutral, negative: analysis.overall.negative },
              { time: "25%", positive: Math.max(10, analysis.overall.positive - 10), neutral: analysis.overall.neutral + 5, negative: analysis.overall.negative + 5 },
              { time: "50%", positive: analysis.overall.positive + 5, neutral: Math.max(5, analysis.overall.neutral - 5), negative: analysis.overall.negative },
              { time: "75%", positive: analysis.overall.positive, neutral: analysis.overall.neutral, negative: analysis.overall.negative },
              { time: "100%", positive: Math.min(95, analysis.overall.positive + 10), neutral: Math.max(2, analysis.overall.neutral - 5), negative: Math.max(2, analysis.overall.negative - 5) },
            ];

            const analysisData = {
              videoId: video.id,
              positivePercentage: analysis.overall.positive,
              neutralPercentage: analysis.overall.neutral,
              negativePercentage: analysis.overall.negative,
              totalComments: comments.length,
              trendingTopics,
              sentimentTimeline,
              aiSummary: analysis.insights.summary,
              keyInsights: analysis.insights.key_emotions.map(emotion => 
                `Strong ${emotion} sentiment detected in viewer responses`
              ),
            };

            sentimentAnalysis = await storage.createSentimentAnalysis(analysisData);
          }
          
          // Create top comments if missing
          if (topComments.length === 0) {
            // Convert Gemini's top comments to our format
            const topCommentsData = analysis.top_comments.map(comment => ({
              videoId: video.id,
              username: `@${comment.author.toLowerCase().replace(/\s+/g, '')}`,
              avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=100&h=100&fit=crop&crop=face`,
              text: comment.text,
              likes: comment.likes,
              replies: Math.floor(Math.random() * 50),
              sentiment: comment.sentiment,
              timestamp: `${Math.floor(Math.random() * 24) + 1} hours ago`,
              youtubeUrl: `https://youtube.com/watch?v=${youtubeId}`,
            }));

            topComments = await storage.createTopComments(topCommentsData);
          }
        }
      }

      // Transform data to match frontend expectations
      const response = {
        video: {
          title: video.title,
          thumbnail: video.thumbnail,
          channelTitle: video.channel,
          viewCount: parseFormattedNumber(video.viewCount)
        },
        sentiment: {
          positive: sentimentAnalysis.positivePercentage,
          negative: sentimentAnalysis.negativePercentage,
          neutral: sentimentAnalysis.neutralPercentage,
        },
        insights: {
          summary: sentimentAnalysis.aiSummary,
          trending_topics: Array.isArray(sentimentAnalysis.trendingTopics) 
            ? (sentimentAnalysis.trendingTopics as any[]).map((topic: any) => typeof topic === 'string' ? topic : topic.text)
            : [],
          totalCommentsAnalyzed: sentimentAnalysis.totalComments
        },
        topComments: topComments.map(comment => ({
          text: comment.text,
          author: comment.username,
          sentiment: comment.sentiment,
          likes: comment.likes,
        })),
      };

      res.json(response);
    } catch (error) {
      console.error("Analysis error:", error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('Video not found')) {
          return res.status(404).json({ message: "Video not found. Please check the URL." });
        }
        if (error.message.includes('YouTube API error')) {
          return res.status(503).json({ message: "YouTube service is temporarily unavailable. Please try again later." });
        }
        if (error.message.includes('YOUTUBE_API_KEY')) {
          return res.status(500).json({ message: "YouTube API configuration error. Please contact support." });
        }
        if (error.message.includes('GEMINI_API_KEY')) {
          return res.status(500).json({ message: "AI analysis service configuration error. Please contact support." });
        }
      }
      
      res.status(500).json({ message: "Failed to analyze video. Please try again later." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
