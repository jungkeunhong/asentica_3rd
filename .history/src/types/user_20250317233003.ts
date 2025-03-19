import { Tag, CommunityPost, Comment } from './community';

export interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl: string;
  coverImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  isVerified: boolean;
  isAnonymous: boolean;
  privacyLevel: 'public' | 'private' | 'friends';
  memberTier: MemberTier;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  commentsCount: number;
  glowStats: GlowStats;
  badges: UserBadge[];
  skinType?: string;
  skinConcerns?: string[];
  favoriteIngredients?: string[];
}

export type MemberTier = 'Dewdrop' | 'Radiance' | 'Luminous' | 'Gleaming' | 'Ethereal';

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

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: string;
  category: 'achievement' | 'contribution' | 'special' | 'expert';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export type ActivityType = 
  | 'post_created' 
  | 'post_liked' 
  | 'comment_created' 
  | 'post_saved' 
  | 'review_created' 
  | 'badge_earned' 
  | 'level_up';

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  timestamp: string;
  contentId?: string; // ID of related post/comment
  contentTitle?: string;
  contentPreview?: string;
  points?: number; // Glow points earned
  tagIds?: string[]; // Related tags
  badgeId?: string; // For badge activities
}

export interface SavedContent {
  id: string;
  userId: string;
  contentType: 'post' | 'comment' | 'product' | 'review';
  contentId: string;
  savedAt: string;
  content?: CommunityPost | Comment | any; // Any for other types
  tags?: Tag[];
}

export interface UserDraft {
  id: string;
  userId: string;
  title?: string;
  content?: string;
  type: 'post' | 'review' | 'comment';
  lastEditedAt: string;
  tags?: string[];
  imageUrls?: string[];
  productId?: string;
}

export type ProfileSection = 'posts' | 'saved' | 'drafts' | 'reviews' | 'settings'; 