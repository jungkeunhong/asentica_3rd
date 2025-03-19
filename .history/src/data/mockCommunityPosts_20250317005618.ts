import { CommunityPost } from '@/types/community';

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'My experience with laser hair removal at MedSpa NYC',
    excerpt: 'I wanted to share my journey with laser hair removal at MedSpa NYC. The results have been amazing and the staff was incredibly professional.',
    content: `
      <p>I've been struggling with unwanted hair for years and finally decided to try laser hair removal. After researching several options in NYC, I chose MedSpa NYC based on their reviews and pricing.</p>
      
      <p>From the moment I walked in, I was impressed with the cleanliness and modern feel of the facility. The staff was incredibly welcoming and took the time to explain the entire process to me.</p>
      
      <p>I've now completed 4 out of 6 sessions, and the results are already amazing. I've noticed about 70% reduction in hair growth, and the remaining hair is much finer and lighter.</p>
      
      <p>The procedure itself is quick - about 15 minutes for my underarms and bikini area. There's some discomfort, like a rubber band snapping against your skin, but it's totally manageable.</p>
      
      <p>Cost-wise, I paid $900 for a package of 6 sessions, which seems to be competitive for NYC. They also offer financing options.</p>
      
      <p>If you're considering laser hair removal, I highly recommend MedSpa NYC. Has anyone else had experience with them or other places in the city?</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    author: {
      id: 'user1',
      username: 'SarahJ',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      isVerified: true
    },
    createdAt: '2023-09-15T14:48:00.000Z',
    updatedAt: '2023-09-15T14:48:00.000Z',
    tags: [
      { id: 'tag1', name: 'Laser Hair Removal' },
      { id: 'tag2', name: 'NYC' },
      { id: 'tag3', name: 'Review' }
    ],
    upvoteCount: 42,
    commentCount: 12,
    isSaved: false
  },
  {
    id: '2',
    title: 'Comparing different types of chemical peels - my journey to better skin',
    excerpt: 'After trying various chemical peels over the past year, I wanted to share my experiences and results with different types and strengths.',
    content: `
      <p>Over the past year, I've been on a mission to improve my skin texture and reduce some sun damage and fine lines. I decided to try chemical peels, starting with milder options and gradually moving to stronger ones.</p>
      
      <p><strong>Glycolic Acid Peel (30%)</strong><br>
      I started with this milder option. It caused slight tingling but no real discomfort. After 3 treatments (one month apart), I noticed improved texture and brightness, but the effects were subtle.</p>
      
      <p><strong>Salicylic Acid Peel (20%)</strong><br>
      As someone with occasional breakouts, I tried this next. It was great for clearing pores and reducing oiliness. The downtime was minimal - just some flaking for 2-3 days.</p>
      
      <p><strong>TCA Peel (15%)</strong><br>
      This was a step up in intensity. There was definite stinging during application, and my face was red for about 24 hours. Peeling lasted about 5 days, but the results were worth it! My sun spots were noticeably lighter, and my skin texture improved significantly.</p>
      
      <p><strong>Jessner Peel</strong><br>
      This was the strongest peel I tried, combining resorcinol, lactic acid, and salicylic acid. The downtime was about a week with significant peeling, but wow - the results were dramatic. My skin looks years younger, more even-toned, and the fine lines around my eyes are much less noticeable.</p>
      
      <p>For reference, I'm 35 with combination skin and mild sun damage. I had all these treatments done at MedSpa Boston with Dr. Chen, who was fantastic at customizing each treatment to my needs.</p>
      
      <p>Has anyone else tried chemical peels? What was your experience?</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    author: {
      id: 'user2',
      username: 'BeautyExplorer',
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      isVerified: false
    },
    createdAt: '2023-09-10T09:23:00.000Z',
    updatedAt: '2023-09-10T09:23:00.000Z',
    tags: [
      { id: 'tag4', name: 'Chemical Peels' },
      { id: 'tag5', name: 'Skin Care' },
      { id: 'tag6', name: 'Anti-Aging' }
    ],
    upvoteCount: 78,
    commentCount: 23,
    isSaved: true
  },
  {
    id: '3',
    title: 'Botox vs Dysport - My experience with both',
    excerpt: 'After using Botox for years, I switched to Dysport. Here\'s my comparison of both treatments for forehead lines and crow\'s feet.',
    content: `
      <p>I've been getting Botox for my forehead lines and crow's feet for about 5 years now, typically every 4 months. Recently, my regular medspa suggested I try Dysport as an alternative, claiming it might last longer for me. I was hesitant to switch from something that was working well, but decided to give it a try.</p>
      
      <p><strong>My Botox Experience:</strong></p>
      <ul>
        <li>Results typically visible within 4-7 days</li>
        <li>Lasts about 3-4 months for me</li>
        <li>Very predictable results</li>
        <li>Cost: About $400 for my treatment areas</li>
      </ul>
      
      <p><strong>My Dysport Experience:</strong></p>
      <ul>
        <li>Results visible within 2-3 days (definitely faster!)</li>
        <li>Seems to spread a bit more, giving a slightly more natural look</li>
        <li>Has lasted nearly 5 months now and still looking good</li>
        <li>Cost: About $350 for the same areas</li>
      </ul>
      
      <p>The injection experience was very similar for both. My injector used more units of Dysport than Botox (which is normal - the conversion isn't 1:1), but the overall cost was slightly less.</p>
      
      <p>I've now had Dysport twice, and I think I'm a convert! The faster onset and longer duration work better for my lifestyle, and I appreciate the slightly more natural movement I have while still eliminating the lines.</p>
      
      <p>Has anyone else tried both? Which do you prefer?</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    author: {
      id: 'user3',
      username: 'JennyM',
      avatarUrl: 'https://randomuser.me/api/portraits/women/90.jpg',
      isVerified: true
    },
    createdAt: '2023-09-05T16:30:00.000Z',
    updatedAt: '2023-09-05T16:30:00.000Z',
    tags: [
      { id: 'tag7', name: 'Botox' },
      { id: 'tag8', name: 'Dysport' },
      { id: 'tag9', name: 'Anti-Aging' }
    ],
    upvoteCount: 103,
    commentCount: 45,
    isSaved: false
  },
  {
    id: '4',
    title: 'My first experience with microneedling - worth the hype?',
    excerpt: 'I recently tried microneedling for acne scars. Here\'s my detailed experience, recovery process, and results after 3 sessions.',
    content: `
      <p>After struggling with acne in my early 20s, I've been left with some textural issues and light scarring. I researched various treatments and decided to try microneedling after seeing so many positive reviews.</p>
      
      <p><strong>The Procedure:</strong><br>
      I went to Glow MedSpa in Chicago. They applied numbing cream for about 30 minutes before starting. The procedure itself took about 20 minutes. It felt like light pinpricks - uncomfortable but not painful. My face was very red afterward, almost like a sunburn.</p>
      
      <p><strong>Recovery:</strong><br>
      Day 1: Intense redness and slight swelling<br>
      Day 2: Redness started to fade, skin felt tight and dry<br>
      Day 3-4: Skin started to flake and peel lightly<br>
      Day 5: Back to normal but with a nice glow</p>
      
      <p>I followed their aftercare instructions carefully - gentle cleanser, hyaluronic acid serum, moisturizer, and religious SPF application. No active ingredients (retinol, AHAs, etc.) for a week.</p>
      
      <p><strong>Results:</strong><br>
      After one session, I noticed my skin had a nice glow but not much change in texture.<br>
      After the second session (4 weeks later), I started to see improvement in my shallow scars.<br>
      After the third session (another 4 weeks later), the improvement was significant! My skin texture is much smoother, pores appear smaller, and the shallow boxcar scars are much less noticeable.</p>
      
      <p>The entire package of 3 sessions cost $750, which seems to be average for my area.</p>
      
      <p>I'm planning to do one more session to target some deeper scars. For anyone considering microneedling, I'd say it's definitely worth trying if you have textural issues or light scarring. Just make sure you go to a reputable place and follow the aftercare instructions!</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    author: {
      id: 'user4',
      username: 'MikeT',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      isVerified: false
    },
    createdAt: '2023-08-28T11:15:00.000Z',
    updatedAt: '2023-08-28T11:15:00.000Z',
    tags: [
      { id: 'tag10', name: 'Microneedling' },
      { id: 'tag11', name: 'Acne Scars' },
      { id: 'tag12', name: 'Skin Texture' }
    ],
    upvoteCount: 67,
    commentCount: 19,
    isSaved: true
  },
  {
    id: '5',
    title: 'Hydrafacial vs. Traditional Facial - Is the price difference justified?',
    excerpt: 'I\'ve tried both regular facials and Hydrafacials multiple times. Here\'s my comparison and whether I think the extra cost is worth it.',
    content: `
      <p>I've been getting traditional facials for years, usually spending around $80-100 per session. Recently, I decided to try the much-hyped Hydrafacial, which cost me $175. I've now had three of each in the past year, and I wanted to share my comparison for anyone trying to decide between them.</p>
      
      <p><strong>Traditional Facial:</strong></p>
      <ul>
        <li>More relaxing and spa-like experience</li>
        <li>Includes massage elements that are great for stress relief</li>
        <li>Results last about 2 weeks for me</li>
        <li>Good for maintenance and relaxation</li>
        <li>Cost: ~$90 average</li>
      </ul>
      
      <p><strong>Hydrafacial:</strong></p>
      <ul>
        <li>More clinical feeling, less relaxing</li>
        <li>No downtime at all - I could apply makeup immediately after</li>
        <li>Immediate visible results - clearer pores, brighter skin</li>
        <li>Results lasted 3-4 weeks</li>
        <li>Better for specific skin concerns (congestion, dullness)</li>
        <li>Cost: $175</li>
      </ul>
      
      <p>The Hydrafacial uses a machine with different attachments to cleanse, extract, and hydrate. It's satisfying to see all the gunk extracted from your face in the waste container! The process takes about 30 minutes, compared to an hour for my traditional facials.</p>
      
      <p>For me, the Hydrafacial is worth the extra cost when I have a special event coming up or when my skin is particularly congested. The results are more dramatic and longer-lasting. However, I still enjoy traditional facials for the relaxation benefits and will continue to get both depending on what my skin needs.</p>
      
      <p>Has anyone else tried both? Which do you prefer?</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    author: {
      id: 'user5',
      username: 'GlowGetter',
      avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      isVerified: true
    },
    createdAt: '2023-08-20T08:45:00.000Z',
    updatedAt: '2023-08-20T08:45:00.000Z',
    tags: [
      { id: 'tag13', name: 'Hydrafacial' },
      { id: 'tag14', name: 'Facial' },
      { id: 'tag15', name: 'Skin Care' }
    ],
    upvoteCount: 89,
    commentCount: 31,
    isSaved: false
  },
  {
    id: '6',
    title: 'CoolSculpting results - 3 months post-treatment',
    excerpt: 'I tried CoolSculpting for my stubborn love handles. Here are my honest results with before and after observations.',
    content: `
      <p>After years of working out and eating well but still struggling with stubborn fat on my love handles, I decided to try CoolSculpting. I wanted to share my experience for anyone considering this treatment.</p>
      
      <p><strong>The Procedure:</strong><br>
      I went to Elite MedSpa in Los Angeles. The technician applied a gel pad to the area, then attached the CoolSculpting applicator. There was intense cold for about 5-10 minutes, then the area went numb. Each side took 35 minutes. It wasn't painful, just a bit uncomfortable.</p>
      
      <p><strong>Immediately After:</strong><br>
      The area was red, swollen, and numb. The technician massaged the treated area (which was uncomfortable). I was told this helps improve results.</p>
      
      <p><strong>Days 1-7:</strong><br>
      Numbness continued, with occasional tingling and "pins and needles" sensations. No pain, just weird feelings. Some bruising appeared on day 2-3.</p>
      
      <p><strong>Weeks 1-4:</strong><br>
      Numbness gradually subsided. No visible results yet, which they warned me about. The area felt a bit firmer.</p>
      
      <p><strong>Months 1-2:</strong><br>
      Started to notice subtle changes. My pants fit a bit better, and I could see a slight reduction when looking in the mirror.</p>
      
      <p><strong>Month 3 (Now):</strong><br>
      The results are definitely noticeable! I'd estimate about a 20-25% reduction in the fat on my love handles. My clothes fit better, and I feel more confident in fitted shirts. The area is smooth with no irregularities.</p>
      
      <p>I paid $1,500 for both sides (one treatment each). Was it worth it? For me, yes. The results aren't dramatic - I didn't drop a pants size or anything - but the improvement is meaningful to me. I'm considering doing a second treatment to enhance the results further.</p>
      
      <p>Important notes: I maintained my regular diet and exercise throughout. Also, results vary significantly between individuals, so this is just my personal experience.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    author: {
      id: 'user6',
      username: 'FitnessFan',
      avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
      isVerified: false
    },
    createdAt: '2023-08-15T13:20:00.000Z',
    updatedAt: '2023-08-15T13:20:00.000Z',
    tags: [
      { id: 'tag16', name: 'CoolSculpting' },
      { id: 'tag17', name: 'Body Contouring' },
      { id: 'tag18', name: 'Fat Reduction' }
    ],
    upvoteCount: 112,
    commentCount: 38,
    isSaved: true
  }
]; 