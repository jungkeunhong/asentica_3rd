export interface Tag {
  id: string;
  name: string;
}

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
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  upvoteCount: number;
  commentCount: number;
  isSaved: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  upvoteCount: number;
  replies?: Comment[];
}

export type FeedType = 'trending' | 'latest' | 'for-you';

export interface CommunityFeedProps {
  initialFeedType?: FeedType;
}

export type SortOption = 'latest' | 'popular' | 'trending';
export type FilterOption = 'all' | 'following' | 'saved'; 