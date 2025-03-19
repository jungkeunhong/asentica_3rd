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
    id: 'saved1',
    type: 'post',
    title: 'The correct order to apply skincare products',
    excerpt: 'Learn the proper layering technique for maximum efficacy',
    date: getRandomPastDate(5),
    image: 'https://placehold.co/600x400/amber/white?text=Skincare+Order'
  },
  {
    id: 'saved2',
    type: 'post',
    title: 'Everything you need to know about chemical exfoliation',
    excerpt: 'A comprehensive guide to AHAs, BHAs, and PHAs',
    date: getRandomPastDate(8),
    image: 'https://placehold.co/600x400/blue/white?text=Chemical+Exfoliation'
  },
  {
    id: 'saved3',
    type: 'review',
    title: 'Honest review: Sunday Riley Good Genes',
    excerpt: 'Is this luxury treatment worth the price?',
    date: getRandomPastDate(12),
    image: 'https://placehold.co/600x400/pink/white?text=Product+Review'
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