/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'skinlyaesthetics.com' },
      { protocol: 'https', hostname: 'www.tribecamedspa.com' },
      { protocol: 'https', hostname: 'jameschristiancosmetics.com' },
      { protocol: 'https', hostname: 'diamondadvancedaesthetics.com' },
      { protocol: 'https', hostname: 'korunyc.com' },
      { protocol: 'https', hostname: 'www.beyondbeautifulaesthetics.com' },
      { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
      { protocol: 'https', hostname: 'collagenbar.nyc' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'maps.gstatic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'charettecosmetics.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'cdn-prod.medicalnewstoday.com' },
      { protocol: 'https', hostname: 'sa1s3optim.patientpop.com' },
    ],
  },
  // For Google Maps API key, create a .env.local file in the root directory with:
  // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
  env: {
    // This is just a fallback - you should use .env.local for your actual API key
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    // Supabase 설정
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // 리다이렉트 URL 설정 - localhost 대신 상대 경로 사용
    NEXT_PUBLIC_SUPABASE_REDIRECT_URL: '/auth/callback',
  }
};

module.exports = nextConfig;