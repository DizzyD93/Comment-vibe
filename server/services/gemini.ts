import { GoogleGenAI } from "@google/genai";

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

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning?: string;
}

interface BatchSentimentResult {
  overall: {
    positive: number;
    negative: number;
    neutral: number;
  };
  insights: {
    summary: string;
    trending_topics: string[];
    key_emotions: string[];
  };
  top_comments: Array<{
    text: string;
    author: string;
    sentiment: string;
    likes: number;
  }>;
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeBatchSentiment(comments: Array<{
    text: string;
    author: string;
    likes: number;
  }>): Promise<BatchSentimentResult> {
    if (comments.length === 0) {
      return {
        overall: { positive: 0, negative: 0, neutral: 100 },
        insights: {
          summary: "No comments available for analysis.",
          trending_topics: [],
          key_emotions: []
        },
        top_comments: []
      };
    }

    // Use top 500 comments for comprehensive analysis with optimal speed/insight balance
    // This ensures we get maximum insights while maintaining excellent speed
    const topComments = comments.slice(0, Math.min(500, comments.length));
    
    const prompt = `Analyze the sentiment of these YouTube comments and provide insights:

Comments:
${topComments.map((c, i) => `${i + 1}. "${c.text}" (${c.likes} likes) - by ${c.author}`).join('\n')}

Provide analysis in this exact JSON format:
{
  "overall": {
    "positive": <percentage>,
    "negative": <percentage>, 
    "neutral": <percentage>
  },
  "insights": {
    "summary": "<2-3 sentence summary of overall sentiment and key themes>",
    "trending_topics": ["<topic1>", "<topic2>", "<topic3>"],
    "key_emotions": ["<emotion1>", "<emotion2>", "<emotion3>"]
  },
  "top_comments": [
    {
      "text": "<comment text>",
      "author": "<author>",
      "sentiment": "<positive/negative/neutral>",
      "likes": <number>
    }
  ]
}

Rules:
- Percentages must add up to 100
- Include 20-25 top comments in top_comments array (select the most engaging and representative ones)
- Focus on meaningful trending topics (not generic words)
- Key emotions should be specific (excited, frustrated, amazed, etc.)
- Keep summary concise but insightful
- Be accurate and honest in sentiment analysis`;

    try {
      console.log(`Starting Gemini analysis of ${topComments.length} comments...`);
      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              overall: {
                type: "object",
                properties: {
                  positive: { type: "number" },
                  negative: { type: "number" },
                  neutral: { type: "number" }
                },
                required: ["positive", "negative", "neutral"]
              },
              insights: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  trending_topics: {
                    type: "array",
                    items: { type: "string" }
                  },
                  key_emotions: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["summary", "trending_topics", "key_emotions"]
              },
              top_comments: {
                type: "array",
                minItems: 10,
                maxItems: 15,
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    author: { type: "string" },
                    sentiment: { type: "string" },
                    likes: { type: "number" }
                  },
                  required: ["text", "author", "sentiment", "likes"]
                }
              }
            },
            required: ["overall", "insights", "top_comments"]
          }
        },
        contents: prompt
      });

      const rawJson = response.text;
      console.log(`Gemini API success! Response length: ${rawJson?.length || 0} characters`);
      
      if (!rawJson) {
        throw new Error("Empty response from Gemini");
      }

      const result: BatchSentimentResult = JSON.parse(rawJson);
      
      // Decode HTML entities in the results
      result.top_comments = result.top_comments.map(comment => ({
        ...comment,
        text: decodeHtmlEntities(comment.text),
        author: decodeHtmlEntities(comment.author)
      }));
      
      result.insights.summary = decodeHtmlEntities(result.insights.summary);
      result.insights.trending_topics = result.insights.trending_topics.map(topic => decodeHtmlEntities(topic));
      result.insights.key_emotions = result.insights.key_emotions.map(emotion => decodeHtmlEntities(emotion));
      
      // Validate percentages add up to 100
      const total = result.overall.positive + result.overall.negative + result.overall.neutral;
      if (Math.abs(total - 100) > 1) {
        // Normalize if they don't add up exactly
        const factor = 100 / total;
        result.overall.positive = Math.round(result.overall.positive * factor);
        result.overall.negative = Math.round(result.overall.negative * factor);
        result.overall.neutral = Math.round(result.overall.neutral * factor);
      }

      return result;
    } catch (error) {
      console.error('Gemini API error details:', {
        message: (error as any).message,
        status: (error as any).status,
        code: (error as any).code,
        model: "gemini-1.5-flash"
      });
      
      // Fallback analysis based on basic keyword matching
      const positiveKeywords = ['good', 'great', 'awesome', 'love', 'amazing', 'perfect', 'excellent', 'fantastic'];
      const negativeKeywords = ['bad', 'hate', 'terrible', 'awful', 'worst', 'horrible', 'stupid', 'trash'];
      
      let positive = 0, negative = 0, neutral = 0;
      
      topComments.forEach(comment => {
        const text = comment.text.toLowerCase();
        const hasPositive = positiveKeywords.some(word => text.includes(word));
        const hasNegative = negativeKeywords.some(word => text.includes(word));
        
        if (hasPositive && !hasNegative) positive++;
        else if (hasNegative && !hasPositive) negative++;
        else neutral++;
      });

      const total = positive + negative + neutral;
      
      return {
        overall: {
          positive: Math.round((positive / total) * 100),
          negative: Math.round((negative / total) * 100),
          neutral: Math.round((neutral / total) * 100)
        },
        insights: {
          summary: "Analysis completed using fallback method due to API limitations.",
          trending_topics: ["General Discussion", "Video Content", "Community"],
          key_emotions: ["Mixed", "Engaged", "Responsive"]
        },
        top_comments: topComments.slice(0, 6).map(c => ({
          text: c.text.slice(0, 150) + (c.text.length > 150 ? '...' : ''),
          author: c.author,
          sentiment: 'neutral',
          likes: c.likes
        }))
      };
    }
  }
}