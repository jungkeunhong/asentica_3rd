import { CommunityPost } from '@/types/community';

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'Has anyone tried the new Ceramide Repair Cream?',
    content: 'I\'ve been looking at this product for a while but haven\'t seen many reviews. Has anyone here used it? How was your experience?',
    createdAt: '2023-06-01T12:00:00Z',
    author: {
      id: 'user1',
      username: 'skincare_lover',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
      glow: 356
    },
    tags: [
      { id: 'tag1', name: 'moisturizer' },
      { id: 'tag2', name: 'ceramides' },
      { id: 'tag3', name: 'reviews' }
    ],
    upvoteCount: 24,
    commentCount: 8,
    isSaved: false,
  },
  {
    id: '2',
    title: 'My 6-month journey with tretinoin - before & after photos',
    content: 'I started using tretinoin 0.025% six months ago for acne and fine lines. Here\'s my full experience, including before and after photos!',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: '2023-05-28T09:15:00Z',
    author: {
      id: 'user2',
      username: 'derm_enthusiast',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      isVerified: true,
      glow: 892
    },
    tags: [
      { id: 'tag4', name: 'tretinoin' },
      { id: 'tag5', name: 'acne' },
      { id: 'tag6', name: 'anti-aging' }
    ],
    upvoteCount: 156,
    commentCount: 42,
    isSaved: true,
    beforeAfterImages: [
      {
        before: 'https://randomuser.me/api/portraits/women/33.jpg',
        after: 'https://randomuser.me/api/portraits/women/32.jpg',
        caption: '6 months difference'
      }
    ]
  },
  {
    id: '3',
    title: 'Niacinamide vs Vitamin C - Which should I use?',
    content: 'I\'m confused about whether I should use niacinamide or vitamin C in my morning routine. Can they be used together? Which one works better for hyperpigmentation?',
    createdAt: '2023-05-25T16:30:00Z',
    author: {
      id: 'user3',
      username: 'skincare_newbie',
      avatarUrl: '/assets/avatars/avatar-3.png',
      isVerified: false,
      glow: 42
    },
    tags: [
      { id: 'tag7', name: 'niacinamide' },
      { id: 'tag8', name: 'vitamin-c' },
      { id: 'tag9', name: 'hyperpigmentation' }
    ],
    upvoteCount: 89,
    commentCount: 36,
    isSaved: false,
    isFactChecked: true,
    factCheckScore: 92
  },
  {
    id: '4',
    title: 'I finally figured out what was causing my fungal acne!',
    content: 'After years of struggling with persistent bumps on my forehead, I finally discovered it was fungal acne. Here\'s how I identified it and what products helped clear it up completely.',
    imageUrl: '/assets/posts/fungal-acne.jpg',
    createdAt: '2023-05-22T11:45:00Z',
    author: {
      id: 'user4',
      username: 'clear_skin_journey',
      avatarUrl: '/assets/avatars/avatar-4.png',
      isVerified: false,
      glow: 128
    },
    tags: [
      { id: 'tag7', name: 'fungal-acne' },
      { id: 'tag8', name: 'skincare-routine' },
      { id: 'tag9', name: 'success-story' }
    ],
    upvoteCount: 98,
    commentCount: 34,
    isSaved: false,
  },
  {
    id: '5',
    title: 'Sunscreen recommendations for sensitive skin?',
    content: 'I break out from most sunscreens I\'ve tried. Looking for recommendations for very sensitive, acne-prone skin that won\'t leave a white cast.',
    createdAt: '2023-05-20T14:00:00Z',
    author: {
      id: 'user5',
      username: 'sensitive_skin_gal',
      avatarUrl: '/assets/avatars/avatar-5.png',
      isVerified: false,
      glow: 73
    },
    tags: [
      { id: 'tag13', name: 'sunscreen' },
      { id: 'tag14', name: 'sensitive-skin' },
      { id: 'tag15', name: 'recommendations' }
    ],
    upvoteCount: 112,
    commentCount: 67,
    isSaved: true
  },
  {
    id: '6',
    title: 'The ordinary peeling solution results - 3 months update',
    content: 'I\'ve been using The Ordinary AHA 30% + BHA 2% Peeling Solution once a week for 3 months now. Here\'s my experience and results with before and after photos.',
    imageUrl: '/assets/posts/ordinary-peel.jpg',
    createdAt: '2023-05-18T19:20:00Z',
    author: {
      id: 'user6',
      username: 'budget_beauty',
      avatarUrl: '/assets/avatars/avatar-6.png',
      isVerified: true,
      glow: 415
    },
    tags: [
      { id: 'tag16', name: 'the-ordinary' },
      { id: 'tag17', name: 'chemical-exfoliation' },
      { id: 'tag18', name: 'before-after' }
    ],
    upvoteCount: 178,
    commentCount: 29,
    isSaved: false,
    beforeAfterImages: [
      {
        before: '/assets/posts/before-peel.jpg',
        after: '/assets/posts/after-peel.jpg',
        caption: '3 months using the peel once a week'
      }
    ]
  },
  {
    id: '4',
    title: 'What\'s your HG sunscreen for sensitive skin?',
    content: 'I\'ve tried so many sunscreens but they all either break me out or leave a white cast. I have very sensitive combination skin. What sunscreens have worked well for you?',
    createdAt: '2023-05-20T16:45:00Z',
    author: {
      id: 'user4',
      username: 'sensitive_skin_probs',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      isVerified: false,
      glow: 45
    },
    tags: [
      { id: 'tag10', name: 'sunscreen' },
      { id: 'tag11', name: 'sensitive-skin' },
      { id: 'tag12', name: 'product-recommendation' }
    ],
    upvoteCount: 32,
    commentCount: 56,
    isSaved: false,
  },
  {
    id: '5',
    title: 'Skin barrier repair journey - from damaged to healed in 8 weeks',
    content: 'After overexfoliating and destroying my moisture barrier, I spent 8 weeks focusing solely on repair. Here\'s everything I learned and the products that saved me.',
    imageUrl: 'https://randomuser.me/api/portraits/women/77.jpg',
    createdAt: '2023-05-18T08:30:00Z',
    author: {
      id: 'user5',
      username: 'barrier_repaired',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      isVerified: true,
      glow: 267
    },
    tags: [
      { id: 'tag13', name: 'skin-barrier' },
      { id: 'tag14', name: 'repair' },
      { id: 'tag15', name: 'moisturizer' }
    ],
    upvoteCount: 143,
    commentCount: 29,
    isSaved: true,
    beforeAfterImages: [
      {
        before: 'https://randomuser.me/api/portraits/women/63.jpg',
        after: 'https://randomuser.me/api/portraits/women/62.jpg',
        caption: 'Week 1 vs Week 8'
      }
    ]
  },
  {
    id: '6',
    title: 'Are expensive serums worth it? My experience with luxury vs. drugstore',
    content: 'I spent 6 months using a $165 vitamin C serum, then switched to a $20 one. Here\'s what happened to my skin and my honest thoughts on whether luxury skincare is worth the price.',
    createdAt: '2023-05-15T11:10:00Z',
    author: {
      id: 'user6',
      username: 'budget_beauty',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
      isVerified: false,
      glow: 132
    },
    tags: [
      { id: 'tag16', name: 'vitamin-c' },
      { id: 'tag17', name: 'luxury-skincare' },
      { id: 'tag18', name: 'drugstore-skincare' }
    ],
    upvoteCount: 105,
    commentCount: 42,
    isSaved: false
  }
]; 