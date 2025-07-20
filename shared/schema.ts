import { pgTable, text, serial, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  youtubeId: text("youtube_id").notNull().unique(),
  title: text("title").notNull(),
  channel: text("channel").notNull(),
  thumbnail: text("thumbnail").notNull(),
  duration: text("duration").notNull(),
  viewCount: text("view_count").notNull(),
  publishedAt: text("published_at").notNull(),
  likes: integer("likes").notNull(),
  comments: integer("comments").notNull(),
  shares: integer("shares").notNull(),
  subscribers: text("subscribers").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sentimentAnalysis = pgTable("sentiment_analysis", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  positivePercentage: real("positive_percentage").notNull(),
  neutralPercentage: real("neutral_percentage").notNull(),
  negativePercentage: real("negative_percentage").notNull(),
  totalComments: integer("total_comments").notNull(),
  trendingTopics: jsonb("trending_topics").notNull(), // Array of topic objects
  sentimentTimeline: jsonb("sentiment_timeline").notNull(), // Array of time-based sentiment data
  aiSummary: text("ai_summary").notNull(),
  keyInsights: jsonb("key_insights").notNull(), // Array of insight strings
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const topComments = pgTable("top_comments", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  username: text("username").notNull(),
  avatar: text("avatar").notNull(),
  text: text("text").notNull(),
  likes: integer("likes").notNull(),
  replies: integer("replies").notNull(),
  sentiment: text("sentiment").notNull(), // 'positive', 'neutral', 'negative'
  timestamp: text("timestamp").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertSentimentAnalysisSchema = createInsertSchema(sentimentAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertTopCommentSchema = createInsertSchema(topComments).omit({
  id: true,
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect;
export type InsertSentimentAnalysis = z.infer<typeof insertSentimentAnalysisSchema>;
export type TopComment = typeof topComments.$inferSelect;
export type InsertTopComment = z.infer<typeof insertTopCommentSchema>;
