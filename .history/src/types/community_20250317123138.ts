export interface Tag {
  id: string;
  name: string;
  count?: number;
  category?: string;
  color?: string;
  description?: string;
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
  glow?: number;
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
  isEdited?: boolean;
  parentId?: string | null;
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
  glow?: number;
}

export type PostFormat = 'discussion' | 'question' | 'review' | 'beforeAfter';

export interface PostDraft {
  id?: string;
  title?: string;
  content?: string;
  format?: PostFormat;
  tags?: string[];
  images?: string[];
  beforeImage?: string;
  afterImage?: string;
  rating?: number;
}

export interface TagCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  tags: Tag[];
  count?: number;
}

export type TagSortOption = 'popular' | 'trending' | 'alphabetical' | 'newest';

export interface TagCloudItem extends Tag {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: number; // For popularity weighting
} 