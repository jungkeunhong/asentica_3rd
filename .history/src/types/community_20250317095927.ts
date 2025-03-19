export interface Tag {
  id: string;
  name: string;
}

export interface Author {
  id: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  reputation?: number;
  karma?: number;
  bio?: string;
}

export interface PostTag {
  id: string;
  name: string;
  color?: string;
}

export interface BeforeAfterImage {
  before: string;
  after: string;
  caption?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  beforeAfterImages?: BeforeAfterImage[];
  author: Author;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  upvoteCount: number;
  downvoteCount?: number;
  commentCount: number;
  isSaved: boolean;
  isFactChecked?: boolean;
  factCheckScore?: number; // 0-100 score for AI fact checking
  readingTime?: number; // in minutes
  viewCount?: number;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  upvoteCount: number;
  downvoteCount?: number;
  replies?: Comment[];
  isEdited?: boolean;
  parentId?: string | null;
}

export type FeedType = 'trending' | 'latest' | 'for-you';

export interface CommunityFeedProps {
  initialFeedType?: FeedType;
}

export type SortOption = 'latest' | 'popular' | 'trending';
export type FilterOption = 'all' | 'following' | 'saved';

export type CommentSortOption = 'newest' | 'top' | 'controversial';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  coverImageUrl: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  reputation?: number;
  karma?: number;
} 