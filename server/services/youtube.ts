interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

interface YouTubeComment {
  id: string;
  textDisplay: string;
  authorDisplayName: string;
  likeCount: number;
  publishedAt: string;
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

export class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY!;
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY is required');
    }
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideo> {
    const url = `${this.baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    return data.items[0];
  }

  async getVideoComments(videoId: string, maxResults: number = 300): Promise<YouTubeComment[]> {
    // Fetch 300 comments for good balance of comprehensive data and performance
    const comments: YouTubeComment[] = [];
    let nextPageToken: string | undefined;
    const batchSize = Math.min(100, maxResults); // YouTube API max per request
    let fetched = 0;

    try {
      while (fetched < maxResults) {
        const remainingToFetch = Math.min(batchSize, maxResults - fetched);
        let url = `${this.baseUrl}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${remainingToFetch}&order=relevance&key=${this.apiKey}`;
        
        if (nextPageToken) {
          url += `&pageToken=${nextPageToken}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          // Comments might be disabled
          if (response.status === 403) {
            break;
          }
          throw new Error(`YouTube API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
          break;
        }

        const batchComments = data.items.map((item: any) => ({
          id: item.id,
          textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
          authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
          likeCount: item.snippet.topLevelComment.snippet.likeCount,
          publishedAt: item.snippet.topLevelComment.snippet.publishedAt
        }));

        comments.push(...batchComments);
        fetched += batchComments.length;
        
        nextPageToken = data.nextPageToken;
        if (!nextPageToken) {
          break; // No more pages
        }
      }
    } catch (error) {
      if (comments.length > 0) {
        // Return what we have so far if we got some comments
        console.log(`Warning: Could not fetch all comments, returning ${comments.length} comments`);
        return comments;
      }
      throw error;
    }

    return comments;
  }

  formatNumber(num: string): string {
    const number = parseInt(num);
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  }
}