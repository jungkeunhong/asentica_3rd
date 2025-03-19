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
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?q=80&w=1024&auto=format&fit=crop',
    createdAt: '2023-05-28T09:15:00Z',
    author: {
      id: 'user2',
      username: 'derm_enthusiast',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
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
        before: 'https://images.unsplash.com/photo-1595276753435-5e46e318e549?q=80&w=512&auto=format&fit=crop',
        after: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=512&auto=format&fit=crop',
        caption: '6 months difference'
      }
    ]
  },
  {
    id: '3',
    title: 'How I finally cured my fungal acne after years of struggle',
    content: '<p>After battling fungal acne for over 3 years and trying countless products, I finally found a routine that worked for me! Here\'s my full journey and the products that saved my skin.</p><h3>What didn\'t work</h3><ul><li>Regular anti-acne products with salicylic acid</li><li>Benzoyl peroxide</li><li>Niacinamide serums</li></ul><h3>What finally worked</h3><ul><li>Nizoral (ketoconazole) used as a mask 2x weekly</li><li>Completely cutting out oils and fatty alcohols from my routine</li><li>Squalane as my only moisturizer</li><li>Consistent use of sunscreen without fungal acne triggers</li></ul><p>The most important thing I learned is that fungal acne requires a completely different approach than bacterial acne. Check ingredients carefully!</p>',
    imageUrl: 'https://images.unsplash.com/photo-1573461160357-28c261f0f769?q=80&w=1024&auto=format&fit=crop',
    createdAt: '2023-05-25T14:20:00Z',
    author: {
      id: 'user3',
      username: 'clear_skin_finally',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop',
      isVerified: false,
      glow: 124
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
    id: '4',
    title: 'What\'s your HG sunscreen for sensitive skin?',
    content: 'I\'ve tried so many sunscreens but they all either break me out or leave a white cast. I have very sensitive combination skin. What sunscreens have worked well for you?',
    createdAt: '2023-05-20T16:45:00Z',
    author: {
      id: 'user4',
      username: 'sensitive_skin_probs',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1024&auto=format&fit=crop',
    createdAt: '2023-05-18T08:30:00Z',
    author: {
      id: 'user5',
      username: 'barrier_repaired',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop',
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
        before: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=512&auto=format&fit=crop',
        after: 'https://images.unsplash.com/photo-1601412436465-922fadaba0e4?q=80&w=512&auto=format&fit=crop',
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
      avatarUrl: 'https://images.unsplash.com/photo-1563620915-8478189e41c1?q=80&w=256&auto=format&fit=crop',
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