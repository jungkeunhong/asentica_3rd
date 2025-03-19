export interface Author {
  id: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
}

export interface PostTag {
  id: string;
  name: string;
  color?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: Author;
  createdAt: string;
  updatedAt?: string;
  tags: PostTag[];
  upvoteCount: number;
  commentCount: number;
  imageUrl?: string;
  isVerified: boolean;
  isSaved: boolean;
}

export type FeedType = 'trending' | 'latest' | 'for-you';

export interface CommunityFeedProps {
  initialFeedType?: FeedType;
} 