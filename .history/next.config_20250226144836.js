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
      { protocol: 'https', hostname: 'placehold.co/' },
    ],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  }
};

module.exports = nextConfig;