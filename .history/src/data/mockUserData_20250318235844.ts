import { 
  UserProfile, 
  UserBadge, 
  SavedContent
} from '@/types/user';

// Helper to generate timestamps in the past
const getRandomPastDate = (maxDaysAgo = 365): string => {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock user badges
export const mockUserBadges: UserBadge[] = [
  {
    id: 'badge1',
    name: 'Profile Star',
    description: 'Completed your profile with skin type and concerns',
    image: 'https://i.pravatar.cc/50?img=1',
    earnedDate: getRandomPastDate(30),
    category: 'achievements'
  },
  {
    id: 'badge2',
    name: 'Review Maven',
    description: 'Published 5 detailed product reviews',
    image: 'https://i.pravatar.cc/50?img=2',
    earnedDate: getRandomPastDate(60),
    category: 'contributions'
  },
  {
    id: 'badge3',
    name: 'Helpful Hand',
    description: 'Received 50 helpful votes on your comments',
    image: 'https://i.pravatar.cc/50?img=3',
    earnedDate: getRandomPastDate(90),
    category: 'contributions'
  },
  {
    id: 'badge4',
    name: 'Retinol Expert',
    description: 'Demonstrated expertise in retinol-based products',
    image: 'https://i.pravatar.cc/50?img=4',
    earnedDate: getRandomPastDate(120),
    category: 'expertise'
  }
];

// Mock saved content
export const mockSavedContent: SavedContent[] = [
  {
    id: "saved-1",
    contentId: "post-external-3",
    savedAt: "2023-06-10T18:32:00Z",
    type: "post",
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
    type: "post",
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
    contentId: "product-123",
    savedAt: "2023-06-05T12:43:00Z",
    type: "product",
    content: {
      title: "Gentle Hydrating Cleanser",
      excerpt: "A non-stripping cleanser that maintains the skin's natural moisture barrier",
      author: "CeraVe",
      tags: [
        { id: "tag-16", name: "Cleanser" },
        { id: "tag-17", name: "Sensitive Skin" },
        { id: "tag-18", name: "Budget-Friendly" }
      ]
    }
  }
];

// Mock user profile data
export const mockUserProfile: Partial<UserProfile> = {
  id: 'user1',
  username: 'glowgetter',
  displayName: 'Glow Getter',
  email: 'glow@example.com',
  profileImage: 'https://i.pravatar.cc/300?img=5',
  coverImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  bio: 'Skincare enthusiast with combination skin. On a journey to find the perfect routine without breaking the bank.',
  location: 'Seoul, South Korea',
  website: 'https://myskincareblog.com',
  joinDate: new Date(2022, 2, 15).toISOString(),
  verifiedStatus: true,
  followingCount: 127,
  followerCount: 245,
  socialLinks: [],
  skinProfile: {
    skinType: 'Combination',
    skinTone: 'Medium',
    concerns: ['Redness', 'Occasional breakouts', 'Hyperpigmentation']
  },
  stats: {
    posts: 34,
    reviews: 25,
    comments: 89,
    likes: 120,
    badges: 4,
    contributions: 45
  },
  badges: mockUserBadges,
  recentActivity: {
    posts: [],
    reviews: [],
    comments: [],
    likes: []
  },
  savedContent: mockSavedContent
};

// Function to get mock user data
export function getMockUserData(): Partial<UserProfile> {
  return mockUserProfile;
} 