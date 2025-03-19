import { CommunityPost } from '@/types/community';

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'My experience with retinol for the first time',
    content: 'I recently started using retinol in my skincare routine, and I wanted to share my experience with everyone. The first few weeks were challenging with some peeling and redness, but after a month, my skin texture has improved dramatically. I started with a low concentration (0.3%) and used it only twice a week before gradually increasing frequency.',
    excerpt: 'I recently started using retinol in my skincare routine, and I wanted to share my experience with everyone...',
    author: {
      id: 'user1',
      username: 'skincare_enthusiast',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      isVerified: true
    },
    createdAt: '2024-03-15T14:30:00Z',
    tags: [
      { id: 'tag1', name: 'Retinol', color: 'amber' },
      { id: 'tag2', name: 'Anti-Aging', color: 'blue' }
    ],
    upvoteCount: 124,
    commentCount: 32,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    isVerified: true,
    isSaved: false
  },
  {
    id: '2',
    title: 'Has anyone tried this new vitamin C serum?',
    content: 'I\'ve been seeing ads everywhere for this new vitamin C serum that claims to brighten skin in just one week. It\'s a bit pricey, so I wanted to check if anyone here has tried it before I make the investment. The brand is relatively new but has been getting a lot of attention on social media lately.',
    excerpt: 'I\'ve been seeing ads everywhere for this new vitamin C serum that claims to brighten skin in just one week...',
    author: {
      id: 'user2',
      username: 'glow_getter',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      isVerified: false
    },
    createdAt: '2024-03-18T09:15:00Z',
    tags: [
      { id: 'tag3', name: 'Vitamin C', color: 'orange' },
      { id: 'tag4', name: 'Product Question', color: 'purple' }
    ],
    upvoteCount: 56,
    commentCount: 28,
    isVerified: false,
    isSaved: true
  },
  {
    id: '3',
    title: 'Before and after: 6 months of consistent skincare routine',
    content: 'I wanted to share my skincare journey with this community. Six months ago, I started a consistent routine focusing on hydration and barrier repair. The difference has been incredible! My routine includes gentle cleansing, hyaluronic acid serum, moisturizer, and SPF in the morning. At night, I double cleanse and use peptides and a thicker moisturizer.',
    excerpt: 'I wanted to share my skincare journey with this community. Six months ago, I started a consistent routine...',
    author: {
      id: 'user3',
      username: 'skin_transformation',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      isVerified: true
    },
    createdAt: '2024-03-10T18:45:00Z',
    tags: [
      { id: 'tag5', name: 'Before & After', color: 'green' },
      { id: 'tag6', name: 'Success Story', color: 'pink' }
    ],
    upvoteCount: 312,
    commentCount: 87,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    isVerified: true,
    isSaved: false
  },
  {
    id: '4',
    title: 'How to deal with maskne?',
    content: 'Ever since I started wearing masks regularly, I\'ve been dealing with breakouts around my chin and cheeks. I\'ve tried changing my mask more frequently and using salicylic acid, but the problem persists. Has anyone found an effective solution for mask-related acne? I\'d appreciate any tips or product recommendations!',
    excerpt: 'Ever since I started wearing masks regularly, I\'ve been dealing with breakouts around my chin and cheeks...',
    author: {
      id: 'user4',
      username: 'clear_skin_seeker',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      isVerified: false
    },
    createdAt: '2024-03-17T11:20:00Z',
    tags: [
      { id: 'tag7', name: 'Acne', color: 'red' },
      { id: 'tag8', name: 'Help Needed', color: 'gray' }
    ],
    upvoteCount: 89,
    commentCount: 42,
    isVerified: false,
    isSaved: false
  },
  {
    id: '5',
    title: 'My dermatologist recommended this routine for rosacea',
    content: 'After struggling with rosacea for years, I finally consulted a dermatologist who recommended a simple but effective routine. I wanted to share it here in case it helps others with similar concerns. The key was eliminating irritating ingredients and focusing on gentle, soothing products with ingredients like centella asiatica and azelaic acid.',
    excerpt: 'After struggling with rosacea for years, I finally consulted a dermatologist who recommended a simple but effective routine...',
    author: {
      id: 'user5',
      username: 'rosacea_warrior',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      isVerified: true
    },
    createdAt: '2024-03-12T15:10:00Z',
    tags: [
      { id: 'tag9', name: 'Rosacea', color: 'red' },
      { id: 'tag10', name: 'Dermatologist Approved', color: 'blue' }
    ],
    upvoteCount: 176,
    commentCount: 53,
    isVerified: true,
    isSaved: true
  },
  {
    id: '6',
    title: 'Budget-friendly dupes for luxury skincare',
    content: 'I\'ve been testing affordable alternatives to high-end skincare products, and I\'ve found some amazing dupes! Here\'s my comprehensive list comparing ingredients, textures, and results. You don\'t always have to break the bank for effective skincare - sometimes the drugstore version works just as well or even better!',
    excerpt: 'I\'ve been testing affordable alternatives to high-end skincare products, and I\'ve found some amazing dupes!...',
    author: {
      id: 'user6',
      username: 'savvy_skinshopper',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
      isVerified: false
    },
    createdAt: '2024-03-16T13:25:00Z',
    tags: [
      { id: 'tag11', name: 'Budget Friendly', color: 'green' },
      { id: 'tag12', name: 'Product Dupes', color: 'purple' }
    ],
    upvoteCount: 245,
    commentCount: 78,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    isVerified: false,
    isSaved: false
  },
  {
    id: '7',
    title: 'How I finally got rid of my hyperpigmentation',
    content: 'After years of struggling with post-inflammatory hyperpigmentation, I\'ve finally found a routine that works for me. The key was consistency and patience - it took about 4 months to see significant results. I used a combination of vitamin C in the morning, alpha arbutin, and tranexamic acid at night, along with religious sunscreen use.',
    excerpt: 'After years of struggling with post-inflammatory hyperpigmentation, I\'ve finally found a routine that works for me...',
    author: {
      id: 'user7',
      username: 'even_tone',
      avatarUrl: 'https://i.pravatar.cc/150?img=7',
      isVerified: true
    },
    createdAt: '2024-03-14T10:05:00Z',
    tags: [
      { id: 'tag13', name: 'Hyperpigmentation', color: 'amber' },
      { id: 'tag14', name: 'Success Story', color: 'pink' }
    ],
    upvoteCount: 198,
    commentCount: 61,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    isVerified: true,
    isSaved: false
  },
  {
    id: '8',
    title: 'Skincare for men: where to start?',
    content: 'I\'m a guy in my 30s who has never had a skincare routine beyond washing my face with whatever soap is in the shower. I\'m starting to notice some fine lines and dullness, and I want to take better care of my skin. What would be a good, simple routine to start with? I\'m completely lost with all the products out there.',
    excerpt: 'I\'m a guy in my 30s who has never had a skincare routine beyond washing my face with whatever soap is in the shower...',
    author: {
      id: 'user8',
      username: 'skincare_newbie',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
      isVerified: false
    },
    createdAt: '2024-03-19T08:30:00Z',
    tags: [
      { id: 'tag15', name: 'Men\'s Skincare', color: 'blue' },
      { id: 'tag16', name: 'Beginners', color: 'green' }
    ],
    upvoteCount: 67,
    commentCount: 39,
    isVerified: false,
    isSaved: false
  },
  {
    id: '9',
    title: 'The importance of sunscreen: my skin cancer story',
    content: 'I wanted to share my personal experience with skin cancer as a reminder of how important sun protection is. Last year, I was diagnosed with basal cell carcinoma on my cheek. After treatment and recovery, I\'ve become an advocate for daily sunscreen use. Please don\'t make the same mistake I did - protect your skin every day, even when it\'s cloudy.',
    excerpt: 'I wanted to share my personal experience with skin cancer as a reminder of how important sun protection is...',
    author: {
      id: 'user9',
      username: 'sun_safety_advocate',
      avatarUrl: 'https://i.pravatar.cc/150?img=9',
      isVerified: true
    },
    createdAt: '2024-03-11T16:40:00Z',
    tags: [
      { id: 'tag17', name: 'Sun Protection', color: 'yellow' },
      { id: 'tag18', name: 'Skin Health', color: 'red' }
    ],
    upvoteCount: 287,
    commentCount: 94,
    isVerified: true,
    isSaved: true
  },
  {
    id: '10',
    title: 'Review: I tried slugging for a month',
    content: 'I decided to try the "slugging" trend (applying a thin layer of petroleum jelly as the last step of your nighttime routine) for a month, and here are my results. For context, I have dry, sensitive skin and live in a very dry climate. The first week was a bit uncomfortable getting used to the feeling, but by week two, I noticed a significant improvement in my skin\'s hydration levels.',
    excerpt: 'I decided to try the "slugging" trend (applying a thin layer of petroleum jelly as the last step of your nighttime routine) for a month...',
    author: {
      id: 'user10',
      username: 'hydration_queen',
      avatarUrl: 'https://i.pravatar.cc/150?img=10',
      isVerified: false
    },
    createdAt: '2024-03-13T19:55:00Z',
    tags: [
      { id: 'tag19', name: 'Slugging', color: 'green' },
      { id: 'tag20', name: 'Product Review', color: 'purple' }
    ],
    upvoteCount: 132,
    commentCount: 47,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    isVerified: false,
    isSaved: false
  },
  {
    id: '11',
    title: 'How to layer actives properly',
    content: 'I see a lot of confusion about how to properly layer active ingredients in a skincare routine. Here\'s a comprehensive guide based on research and dermatologist recommendations. The key is to understand pH levels and potential interactions between ingredients like vitamin C, retinoids, AHAs/BHAs, and niacinamide.',
    excerpt: 'I see a lot of confusion about how to properly layer active ingredients in a skincare routine. Here\'s a comprehensive guide...',
    author: {
      id: 'user11',
      username: 'science_of_skin',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      isVerified: true
    },
    createdAt: '2024-03-15T12:15:00Z',
    tags: [
      { id: 'tag21', name: 'Skincare Science', color: 'blue' },
      { id: 'tag22', name: 'Active Ingredients', color: 'purple' }
    ],
    upvoteCount: 276,
    commentCount: 83,
    isVerified: true,
    isSaved: false
  },
  {
    id: '12',
    title: 'Dealing with hormonal acne in your 30s',
    content: 'I never had acne as a teenager, but now in my 30s, I\'m dealing with persistent hormonal breakouts along my jawline and chin. After consulting with my dermatologist and making some lifestyle changes, I\'ve finally found some relief. Here\'s what worked for me, including dietary changes, stress management, and specific skincare ingredients.',
    excerpt: 'I never had acne as a teenager, but now in my 30s, I\'m dealing with persistent hormonal breakouts along my jawline and chin...',
    author: {
      id: 'user12',
      username: 'adult_acne_fighter',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      isVerified: false
    },
    createdAt: '2024-03-17T14:50:00Z',
    tags: [
      { id: 'tag23', name: 'Hormonal Acne', color: 'red' },
      { id: 'tag24', name: 'Adult Skincare', color: 'amber' }
    ],
    upvoteCount: 154,
    commentCount: 68,
    imageUrl: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    isVerified: false,
    isSaved: true
  }
]; 