export interface Tag {
  id: string;
  name: string;
}

export interface Author {
  id: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
  followersCount?: number;
  followingCount?: number;
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
  excerpt?: string;
  content: string;
  imageUrl?: string;
  author: Author;
  createdAt: string;
  updatedAt?: string;
  tags: Tag[];
  upvoteCount: number;
  downvoteCount?: number;
  commentCount: number;
  isSaved: boolean;
  isFactChecked?: boolean;
  factCheckScore?: number;
  readingTime?: number;
  viewCount?: number;
  beforeAfterImages?: BeforeAfterImage[];
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likeCount: number;
  replies?: Comment[];
}

export type FeedType = 'trending' | 'latest' | 'for-you';

export interface CommunityFeedProps {
  initialFeedType?: FeedType;
}

export type SortOption = 'latest' | 'popular' | 'trending';
export type FilterOption = 'all' | 'questions' | 'experiences' | 'beforeAfter';

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