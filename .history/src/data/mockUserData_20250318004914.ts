import { 
  UserProfile, 
  GlowStats, 
  UserBadge, 
  UserActivity, 
  SavedContent,
  DraftContent,
  ProfileSection,
  ActivityType
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
    name: 'Profile Star',
    description: 'Completed your profile with skin type and concerns',
    iconUrl: 'https://i.pravatar.cc/50?img=1',
    earnedDate: getRandomPastDate(30),
    category: 'achievement'
  },
  {
    id: 'badge2',
    name: 'Review Maven',
    description: 'Published 5 detailed product reviews',
    iconUrl: 'https://i.pravatar.cc/50?img=2',
    earnedDate: getRandomPastDate(60),
    category: 'contribution',
    tier: 'silver'
  },
  {
    id: 'badge3',
    name: 'Helpful Hand',
    description: 'Received 50 helpful votes on your comments',
    iconUrl: 'https://i.pravatar.cc/50?img=3',
    earnedDate: getRandomPastDate(90),
    category: 'contribution',
    tier: 'bronze'
  },
  {
    id: 'badge4',
    name: 'Retinol Expert',
    description: 'Demonstrated expertise in retinol-based products',
    iconUrl: 'https://i.pravatar.cc/50?img=4',
    earnedDate: getRandomPastDate(120),
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

export const mockUserDrafts: DraftContent[] = [
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

// Mock user data
export const getMockUserData = () => {
  return {
    id: "user-123",
    username: "glow_enthusiast",
    displayName: "Sophia Kim",
    bio: "Skincare enthusiast, beauty blogger, and sunscreen advocate. Sharing my beauty journey and helping others find their perfect routine.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    coverImage: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    joinDate: "2022-03-15",
    location: "Seoul, South Korea",
    verifiedStatus: true,
    followingCount: 245,
    followerCount: 1234,
    stats: {
      postsCount: 47,
      reviewsCount: 36,
      upvotesReceived: 952,
      streakDays: 15
    },
    activity: {
      posts: [
        {
          id: "post-1",
          title: "My Skincare Journey: From Acne to Clear Skin",
          excerpt: "After years of struggling with acne and trying countless products, I finally found a routine that works for me. Here's how I transformed my skin...",
          date: "2023-05-15",
          likes: 86,
          comments: 24
        },
        {
          id: "post-2",
          title: "The Truth About Vitamin C Serums",
          excerpt: "Not all vitamin C serums are created equal. In this post, I break down the different forms of vitamin C, stability issues, and my top recommendations...",
          date: "2023-04-02",
          likes: 124,
          comments: 18
        },
        {
          id: "post-3",
          title: "Sunscreen Comparison: Physical vs. Chemical",
          excerpt: "The great sunscreen debate: physical vs. chemical filters. I tested 10 popular sunscreens to compare their texture, white cast, and protection...",
          date: "2023-03-10",
          likes: 103,
          comments: 32
        }
      ],
      reviews: [
        {
          id: "review-1",
          productId: "prod-101",
          productName: "Glow Essence Toner",
          rating: 5,
          excerpt: "This toner has completely transformed my skin! It's hydrating without being sticky and has helped balance my combination skin.",
          date: "2023-06-01"
        },
        {
          id: "review-2",
          productId: "prod-102",
          productName: "Ceramide Repair Cream",
          rating: 4,
          excerpt: "Great moisturizer for repairing the skin barrier. It's a bit heavy for summer but perfect for winter months.",
          date: "2023-05-12"
        },
        {
          id: "review-3",
          productId: "prod-103",
          productName: "Vitamin C 20% Serum",
          rating: 3,
          excerpt: "It does brighten the skin, but I noticed it oxidized rather quickly. The packaging could be improved to better protect the formula.",
          date: "2023-04-23"
        }
      ],
      comments: [
        {
          id: "comment-1",
          postId: "post-external-1",
          postTitle: "Best Budget Skincare Products",
          postUrl: "/community/post/external-1",
          content: "I've been using the CeraVe Hydrating Cleanser for years and totally agree with your assessment. It's gentle yet effective!",
          date: "2023-06-05",
          likes: 12
        },
        {
          id: "comment-2",
          postId: "post-external-2",
          postTitle: "How to Layer Actives Properly",
          postUrl: "/community/post/external-2",
          content: "Thank you for this clear explanation! I've been using retinol and vitamin C together which might explain the irritation I've been experiencing.",
          date: "2023-05-20",
          likes: 8
        }
      ],
      likes: [
        {
          id: "like-1",
          contentId: "post-external-3",
          contentTitle: "The Ultimate Guide to Treating Hyperpigmentation",
          contentUrl: "/community/post/external-3",
          authorName: "DermaExpert",
          date: "2023-06-10"
        },
        {
          id: "like-2",
          contentId: "post-external-4",
          contentTitle: "My Experience with Tretinoin: 6 Month Update",
          contentUrl: "/community/post/external-4",
          authorName: "RetinolQueen",
          date: "2023-06-08"
        },
        {
          id: "like-3",
          contentId: "post-external-5",
          contentTitle: "Japanese vs. Korean Sunscreens: Comprehensive Comparison",
          contentUrl: "/community/post/external-5",
          authorName: "SPF_Enthusiast",
          date: "2023-06-03"
        }
      ]
    },
    badges: [
      {
        id: "badge-1",
        name: "Top Contributor",
        description: "For consistent high-quality content",
        iconUrl: "/badges/top-contributor.svg" 
      },
      {
        id: "badge-2",
        name: "Review Pro",
        description: "Published over 25 detailed product reviews",
        iconUrl: "/badges/review-pro.svg"
      },
      {
        id: "badge-3",
        name: "Skincare Expert",
        description: "Recognized knowledge in skincare topics",
        iconUrl: "/badges/skincare-expert.svg"
      },
      {
        id: "badge-4",
        name: "Helpful Guide",
        description: "Frequently provides helpful answers",
        iconUrl: "/badges/helpful-guide.svg"
      }
    ],
    savedContent: mockSavedContent
  };
};

// Mock user profile data
export const mockUserProfileData = {
  id: "user-123",
  username: "glow_enthusiast",
  displayName: "Sophia Kim",
  email: "sophia.kim@example.com",
  bio: "Skincare enthusiast, beauty blogger, and sunscreen advocate. Sharing my beauty journey and helping others find their perfect routine.",
  profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
  coverImage: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
  joinDate: "2022-03-15",
  location: "Seoul, South Korea",
  website: "https://glowwithsophia.com",
  socialLinks: {
    instagram: "glow_with_sophia",
    twitter: "sophia_glows",
    youtube: null
  },
  verificationStatus: "verified",
  followingCount: 245,
  followerCount: 1234,
  glowStats: {
    postsCount: 47,
    reviewsCount: 36,
    upvotesReceived: 952,
    commentsCount: 129,
    savesCount: 75,
    streakDays: 15,
    contributionLevel: "expert"
  },
  skinProfile: {
    skinType: "Combination",
    concerns: ["Acne", "Hyperpigmentation", "Fine Lines"],
    skinTone: "Medium",
    allergies: ["Fragrance", "Essential Oils"]
  },
  badges: [
    {
      id: "badge-1",
      name: "Top Contributor",
      description: "For consistent high-quality content",
      earnedDate: "2023-01-15",
      iconUrl: "/badges/top-contributor.svg"
    },
    {
      id: "badge-2",
      name: "Review Pro",
      description: "Published over 25 detailed product reviews",
      earnedDate: "2022-11-03",
      iconUrl: "/badges/review-pro.svg"
    },
    {
      id: "badge-3",
      name: "Skincare Expert",
      description: "Recognized knowledge in skincare topics",
      earnedDate: "2022-08-19",
      iconUrl: "/badges/skincare-expert.svg"
    },
    {
      id: "badge-4",
      name: "Helpful Guide",
      description: "Frequently provides helpful answers",
      earnedDate: "2022-06-30",
      iconUrl: "/badges/helpful-guide.svg"
    },
    {
      id: "badge-5",
      name: "Routine Master",
      description: "Created and shared 10+ skincare routines",
      earnedDate: "2022-05-12",
      iconUrl: "/badges/routine-master.svg"
    }
  ]
};

// Mock user activities
export const mockUserActivitiesData = [
  {
    id: "activity-1",
    type: "post",
    date: "2023-06-10T14:32:00Z",
    content: {
      id: "post-1",
      title: "My Skincare Journey: From Acne to Clear Skin",
      excerpt: "After years of struggling with acne and trying countless products, I finally found a routine that works for me. Here's how I transformed my skin...",
      tags: [
        { id: "tag-1", name: "Acne" },
        { id: "tag-2", name: "Skincare Journey" },
        { id: "tag-3", name: "Before and After" }
      ],
      commentsCount: 24,
      upvotesCount: 86
    }
  },
  {
    id: "activity-2",
    type: "review",
    date: "2023-06-01T09:17:00Z",
    content: {
      id: "review-1",
      productId: "prod-101",
      productName: "Glow Essence Toner",
      brand: "SkinGlow",
      rating: 5,
      excerpt: "This toner has completely transformed my skin! It's hydrating without being sticky and has helped balance my combination skin.",
      helpfulCount: 32
    }
  },
  {
    id: "activity-3",
    type: "comment",
    date: "2023-05-28T16:43:00Z",
    content: {
      id: "comment-1",
      postId: "post-external-1",
      postTitle: "Best Budget Skincare Products",
      comment: "I've been using the CeraVe Hydrating Cleanser for years and totally agree with your assessment. It's gentle yet effective!",
      upvotesCount: 12
    }
  },
  {
    id: "activity-4",
    type: "post",
    date: "2023-05-15T11:20:00Z",
    content: {
      id: "post-2",
      title: "The Truth About Vitamin C Serums",
      excerpt: "Not all vitamin C serums are created equal. In this post, I break down the different forms of vitamin C, stability issues, and my top recommendations...",
      tags: [
        { id: "tag-4", name: "Vitamin C" },
        { id: "tag-5", name: "Antioxidants" },
        { id: "tag-6", name: "Brightening" }
      ],
      commentsCount: 18,
      upvotesCount: 124
    }
  },
  {
    id: "activity-5",
    type: "review",
    date: "2023-05-12T15:05:00Z",
    content: {
      id: "review-2",
      productId: "prod-102",
      productName: "Ceramide Repair Cream",
      brand: "BarrierRepair",
      rating: 4,
      excerpt: "Great moisturizer for repairing the skin barrier. It's a bit heavy for summer but perfect for winter months.",
      helpfulCount: 18
    }
  }
];

// Mock saved content
export const mockSavedContentData = [
  {
    id: "saved-1",
    contentId: "post-external-3",
    savedAt: "2023-06-10T18:32:00Z",
    content: {
      title: "The Ultimate Guide to Treating Hyperpigmentation",
      excerpt: "A comprehensive guide to different types of hyperpigmentation and the most effective ingredients and treatments for each type.",
      author: "DermaExpert",
      tags: [
        { id: "tag-7", name: "Hyperpigmentation" },
        { id: "tag-8", name: "Melasma" },
        { id: "tag-9", name: "Dark Spots" }
      ]
    }
  },
  {
    id: "saved-2",
    contentId: "post-external-4",
    savedAt: "2023-06-08T21:15:00Z",
    content: {
      title: "My Experience with Tretinoin: 6 Month Update",
      excerpt: "Six months into my tretinoin journey. See the before and after results, how I managed side effects, and my complete routine.",
      author: "RetinolQueen",
      tags: [
        { id: "tag-10", name: "Tretinoin" },
        { id: "tag-11", name: "Retinoids" },
        { id: "tag-12", name: "Anti-Aging" }
      ]
    }
  },
  {
    id: "saved-3",
    contentId: "post-external-5",
    savedAt: "2023-06-03T14:09:00Z",
    content: {
      title: "Japanese vs. Korean Sunscreens: Comprehensive Comparison",
      excerpt: "Detailed comparison of popular Japanese and Korean sunscreens, focusing on formulation, texture, finish, and protection level.",
      author: "SPF_Enthusiast",
      tags: [
        { id: "tag-13", name: "Sunscreen" },
        { id: "tag-14", name: "Korean Beauty" },
        { id: "tag-15", name: "Japanese Beauty" }
      ]
    }
  }
];

// Mock user drafts
export const mockUserDraftsData = [
  {
    id: "draft-1",
    title: "My Favorite Double Cleansing Products",
    lastEditedAt: "2023-06-12T11:30:00Z",
    tags: ["Cleansing", "Oil Cleanser", "Routine"]
  },
  {
    id: "draft-2",
    title: "",
    lastEditedAt: "2023-06-09T19:45:00Z",
    tags: ["Exfoliation"]
  },
];

// Define user notification types
export type UserNotificationType = 
  | "like" 
  | "comment" 
  | "follow" 
  | "mention" 
  | "badge" 
  | "system";

// Mock user notifications
export const mockUserNotificationsData = [
  {
    id: "notif-1",
    type: "like" as UserNotificationType,
    isRead: false,
    timestamp: "2023-06-14T15:32:00Z",
    data: {
      userId: "user-456",
      username: "skin_scientist",
      displayName: "Dr. Emily Chen",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      contentId: "post-1",
      contentTitle: "My Skincare Journey: From Acne to Clear Skin"
    }
  },
  {
    id: "notif-2",
    type: "comment" as UserNotificationType,
    isRead: false,
    timestamp: "2023-06-14T09:17:00Z",
    data: {
      userId: "user-789",
      username: "hydration_queen",
      displayName: "Jessica Park",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      contentId: "post-1",
      contentTitle: "My Skincare Journey: From Acne to Clear Skin",
      comment: "This is so inspiring! What cleanser do you recommend for sensitive acne-prone skin?"
    }
  },
  {
    id: "notif-3",
    type: "follow" as UserNotificationType,
    isRead: true,
    timestamp: "2023-06-13T18:43:00Z",
    data: {
      userId: "user-101",
      username: "glow_guru",
      displayName: "Aisha Johnson",
      profileImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    }
  },
  {
    id: "notif-4",
    type: "badge" as UserNotificationType,
    isRead: true,
    timestamp: "2023-06-12T10:20:00Z",
    data: {
      badgeId: "badge-3",
      badgeName: "Skincare Expert",
      badgeImage: "/badges/skincare-expert.svg",
      description: "Congratulations! You've been recognized as a Skincare Expert based on your valuable contributions to the community."
    }
  },
  {
    id: "notif-5",
    type: "mention" as UserNotificationType,
    isRead: true,
    timestamp: "2023-06-11T14:05:00Z",
    data: {
      userId: "user-202",
      username: "derma_devotee",
      displayName: "Michael Smith",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      contentId: "post-external-6",
      contentTitle: "Community Favorites: Hyaluronic Acid Products",
      excerpt: "...as @glow_enthusiast mentioned in her excellent post about hydration layers..."
    }
  }
]; 