// User types for the Asentica application

// Type for profile section tabs
export type ProfileSection = "posts" | "reviews" | "comments" | "likes" | "saved" | "drafts";

// Activity types
export type ActivityType = 
  | 'post_created' 
  | 'post_liked' 
  | 'comment_created' 
  | 'post_saved' 
  | 'review_created' 
  | 'badge_earned' 
  | 'level_up';

// GlowStats for legacy component support
export interface GlowStats {
  total: number;
  level: number;
  nextLevelAt: number;
  progress: number; // percentage to next level
  breakdown: {
    posts: number;
    comments: number;
    reviews: number;
    helpfulVotes: number;
    verifiedPurchases: number;
  };
  rank?: string; // optional rank in community
  percentile?: number; // optional percentile in community
}

// Member tier type for legacy component support
export type MemberTier = 'Dewdrop' | 'Radiance' | 'Luminous' | 'Gleaming' | 'Ethereal';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  bio: string;
  profileImage: string;
  coverImage?: string;
  joinDate: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  verificationStatus?: "verified" | "pending" | "none";
  followingCount: number;
  followerCount: number;
  glowStats: UserGlowStats;
  skinProfile?: UserSkinProfile;
  badges: UserBadge[];
}

export interface UserGlowStats {
  postsCount: number;
  reviewsCount: number;
  upvotesReceived: number;
  commentsCount: number;
  savesCount: number;
  streakDays: number;
  contributionLevel?: "beginner" | "intermediate" | "expert" | "master";
}

export interface UserSkinProfile {
  skinType?: string;
  concerns?: string[];
  skinTone?: string;
  allergies?: string[];
  favoriteIngredients?: string[];
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  earnedDate?: string;
  iconUrl: string;
}

export interface UserActivity {
  id: string;
  type: "post" | "review" | "comment" | "like" | "save" | "badge";
  date: string;
  content?: PostContent | ReviewContent | CommentContent;
  title?: string;
  productId?: string;
  productName?: string;
  link?: string;
  targetTitle?: string;
  badgeName?: string;
}

export interface PostContent {
  id: string;
  title: string;
  excerpt?: string;
  tags?: TagItem[];
  commentsCount: number;
  upvotesCount: number;
}

export interface ReviewContent {
  id: string;
  productId: string;
  productName: string;
  brand?: string;
  rating: number;
  excerpt?: string;
  helpfulCount?: number;
}

export interface CommentContent {
  id: string;
  postId: string;
  postTitle: string;
  comment: string;
  upvotesCount: number;
}

export interface TagItem {
  id: string;
  name: string;
}

export interface SavedContent {
  id: string;
  contentId: string;
  savedAt: string;
  type: "post" | "product" | "review" | "routine";
  content: {
    title: string;
    excerpt?: string;
    author?: string;
    brand?: string;
    tags?: TagItem[];
  };
}

export interface DraftContent {
  id: string;
  title: string;
  lastEditedAt: string;
  tags?: string[];
}

export interface UserNotification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "badge" | "system";
  isRead: boolean;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface PostActivity {
  id: string;
  title: string;
  excerpt?: string;
  date: string;
  likes: number;
  comments: number;
}

export interface ReviewActivity {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  excerpt?: string;
  date: string;
}

export interface CommentActivity {
  id: string;
  postId: string;
  postTitle: string;
  postUrl: string;
  content: string;
  date: string;
  likes: number;
}

export interface LikeActivity {
  id: string;
  contentId: string;
  contentTitle: string;
  contentUrl: string;
  authorName: string;
  date: string;
}

export interface UserData {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  coverImage?: string;
  joinDate: string;
  location?: string;
  verifiedStatus: boolean;
  followingCount: number;
  followerCount: number;
  stats: {
    postsCount: number;
    reviewsCount: number;
    upvotesReceived: number;
    streakDays: number;
  };
  activity: {
    posts: PostActivity[];
    reviews: ReviewActivity[];
    comments: CommentActivity[];
    likes: LikeActivity[];
  };
  badges: UserBadge[];
} 