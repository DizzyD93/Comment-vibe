import { videos, sentimentAnalysis, topComments, type Video, type InsertVideo, type SentimentAnalysis, type InsertSentimentAnalysis, type TopComment, type InsertTopComment } from "@shared/schema";

export interface IStorage {
  getVideo(youtubeId: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  getSentimentAnalysis(videoId: number): Promise<SentimentAnalysis | undefined>;
  createSentimentAnalysis(analysis: InsertSentimentAnalysis): Promise<SentimentAnalysis>;
  getTopComments(videoId: number): Promise<TopComment[]>;
  createTopComments(comments: InsertTopComment[]): Promise<TopComment[]>;
}

export class MemStorage implements IStorage {
  private videos: Map<number, Video>;
  private sentimentAnalyses: Map<number, SentimentAnalysis>;
  private topComments: Map<number, TopComment[]>;
  private currentVideoId: number;
  private currentAnalysisId: number;
  private currentCommentId: number;

  constructor() {
    this.videos = new Map();
    this.sentimentAnalyses = new Map();
    this.topComments = new Map();
    this.currentVideoId = 1;
    this.currentAnalysisId = 1;
    this.currentCommentId = 1;
  }

  async getVideo(youtubeId: string): Promise<Video | undefined> {
    return Array.from(this.videos.values()).find(
      (video) => video.youtubeId === youtubeId,
    );
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = { 
      ...insertVideo, 
      id,
      createdAt: new Date(),
    };
    this.videos.set(id, video);
    return video;
  }

  async getSentimentAnalysis(videoId: number): Promise<SentimentAnalysis | undefined> {
    return Array.from(this.sentimentAnalyses.values()).find(
      (analysis) => analysis.videoId === videoId,
    );
  }

  async createSentimentAnalysis(insertAnalysis: InsertSentimentAnalysis): Promise<SentimentAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: SentimentAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.sentimentAnalyses.set(id, analysis);
    return analysis;
  }

  async getTopComments(videoId: number): Promise<TopComment[]> {
    return this.topComments.get(videoId) || [];
  }

  async createTopComments(insertComments: InsertTopComment[]): Promise<TopComment[]> {
    const comments: TopComment[] = insertComments.map(comment => ({
      ...comment,
      id: this.currentCommentId++,
    }));
    
    const videoId = comments[0]?.videoId;
    if (videoId) {
      this.topComments.set(videoId, comments);
    }
    
    return comments;
  }
}

export const storage = new MemStorage();
