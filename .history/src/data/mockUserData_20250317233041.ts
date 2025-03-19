import { 
  UserProfile, 
  GlowStats, 
  UserBadge, 
  UserActivity, 
  SavedContent,
  UserDraft
} from '@/types/user';
import { formatDistanceToNow } from 'date-fns';

// Helper to generate timestamps in the past
const getRandomPastDate = (maxDaysAgo = 365): string => {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const mockUserBadges: UserBadge[] = [
  {
    id: 'badge1',
    name: 'Skincare Starter',
    description: 'Completed your profile with skin type and concerns',
    iconUrl: 'https://i.pravatar.cc/50?img=1',
    earnedAt: getRandomPastDate(30),
    category: 'achievement'
  },
  {
    id: 'badge2',
    name: 'Review Maven',
    description: 'Published 5 detailed product reviews',
    iconUrl: 'https://i.pravatar.cc/50?img=2',
    earnedAt: getRandomPastDate(60),
    category: 'contribution',
    tier: 'silver'
  },
  {
    id: 'badge3',
    name: 'Helpful Guide',
    description: 'Received 50 helpful votes on your comments',
    iconUrl: 'https://i.pravatar.cc/50?img=3',
    earnedAt: getRandomPastDate(90),
    category: 'contribution',
    tier: 'bronze'
  },
  {
    id: 'badge4',
    name: 'Ingredient Expert: Retinol',
    description: 'Demonstrated expertise in retinol-based products',
    iconUrl: 'https://i.pravatar.cc/50?img=4',
    earnedAt: getRandomPastDate(120),
    category: 'expert'
  }
];

export const mockGlowStats: GlowStats = {
  total: 2345,
  level: 18,
  nextLevelAt: 2500,
  progress: 74, // percentage to next level
  breakdown: {
    posts: 850,
    comments: 625,
    reviews: 470,
    helpfulVotes: 320,
    verifiedPurchases: 80
  },
  rank: 'Top 5%',
  percentile: 95
};

export const mockUserActivities: UserActivity[] = [
  {
    id: 'activity1',
    userId: 'user1',
    type: 'post_created',
    timestamp: getRandomPastDate(2),
    contentId: 'post123',
    contentTitle: 'My experience with Korean skincare routine',
    contentPreview: 'After three months of following a 10-step Korean skincare routine...',
    points: 15,
    tagIds: ['korean-skincare', 'routine']
  },
  {
    id: 'activity2',
    userId: 'user1',
    type: 'comment_created',
    timestamp: getRandomPastDate(3),
    contentId: 'comment456',
    contentTitle: 'Re: Best retinol for beginners',
    contentPreview: 'I would recommend starting with a very low percentage...',
    points: 8
  },
  {
    id: 'activity3',
    userId: 'user1',
    type: 'post_liked',
    timestamp: getRandomPastDate(4),
    contentId: 'post789',
    contentTitle: 'How to layer actives properly',
    points: 1
  },
  {
    id: 'activity4',
    userId: 'user1',
    type: 'badge_earned',
    timestamp: getRandomPastDate(7),
    badgeId: 'badge2',
    points: 25
  },
  {
    id: 'activity5',
    userId: 'user1',
    type: 'review_created',
    timestamp: getRandomPastDate(10),
    contentId: 'review101',
    contentTitle: 'Review: CeraVe Hydrating Cleanser',
    contentPreview: 'This gentle cleanser has been a game changer for my dry skin...',
    points: 20,
    tagIds: ['cleansers', 'dry-skin']
  },
  {
    id: 'activity6',
    userId: 'user1',
    type: 'level_up',
    timestamp: getRandomPastDate(14),
    points: 50
  }
];

export const mockSavedContent: SavedContent[] = [
  {
    id: 'saved1',
    userId: 'user1',
    contentType: 'post',
    contentId: 'post555',
    savedAt: getRandomPastDate(5),
    content: {
      id: 'post555',
      title: 'The correct order to apply skincare products',
      excerpt: 'Learn the proper layering technique for maximum efficacy',
      tags: [{ id: 'tag1', name: 'skincare-routine' }, { id: 'tag2', name: 'how-to' }]
    }
  },
  {
    id: 'saved2',
    userId: 'user1',
    contentType: 'post',
    contentId: 'post666',
    savedAt: getRandomPastDate(8),
    content: {
      id: 'post666',
      title: 'Everything you need to know about chemical exfoliation',
      excerpt: 'A comprehensive guide to AHAs, BHAs, and PHAs',
      tags: [{ id: 'tag3', name: 'exfoliation' }, { id: 'tag4', name: 'acids' }]
    }
  },
  {
    id: 'saved3',
    userId: 'user1',
    contentType: 'review',
    contentId: 'review777',
    savedAt: getRandomPastDate(12),
    content: {
      id: 'review777',
      title: 'Honest review: Sunday Riley Good Genes',
      excerpt: 'Is this luxury treatment worth the price?',
      tags: [{ id: 'tag5', name: 'luxury' }, { id: 'tag6', name: 'lactic-acid' }]
    }
  }
];

export const mockUserDrafts: UserDraft[] = [
  {
    id: 'draft1',
    userId: 'user1',
    title: 'My journey with tretinoin: Month 3 update',
    content: 'It\'s been three months since I started using prescription tretinoin...',
    type: 'post',
    lastEditedAt: getRandomPastDate(1),
    tags: ['tretinoin', 'retinoids', 'acne']
  },
  {
    id: 'draft2',
    userId: 'user1',
    title: 'Comparison: Hyaluronic acid serums at different price points',
    content: 'I\'ve tested hyaluronic acid serums ranging from $8 to $300...',
    type: 'review',
    lastEditedAt: getRandomPastDate(2),
    tags: ['hyaluronic-acid', 'comparison', 'budget-friendly', 'luxury']
  }
];

export const mockUserProfile: UserProfile = {
  id: 'user1',
  username: 'glowgetter',
  displayName: 'Glow Getter',
  avatarUrl: 'https://i.pravatar.cc/300?img=5',
  coverImageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  bio: 'Skincare enthusiast with combination skin. On a journey to find the perfect routine without breaking the bank.',
  location: 'Seoul, South Korea',
  website: 'https://myskincareblog.com',
  joinDate: new Date(2022, 2, 15).toISOString(),
  isVerified: true,
  isAnonymous: false,
  privacyLevel: 'public',
  memberTier: 'Luminous',
  followersCount: 245,
  followingCount: 127,
  postsCount: 34,
  commentsCount: 89,
  glowStats: mockGlowStats,
  badges: mockUserBadges,
  skinType: 'Combination',
  skinConcerns: ['Redness', 'Occasional breakouts', 'Hyperpigmentation'],
  favoriteIngredients: ['Niacinamide', 'Vitamin C', 'Peptides', 'Hyaluronic Acid']
}; 