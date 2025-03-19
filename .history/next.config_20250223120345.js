/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'skinlyaesthetics.com',
      'www.tribecamedspa.com',
      'jameschristiancosmetics.com',
      'diamondadvancedaesthetics.com',
      'korunyc.com',
      'www.beyondbeautifulaesthetics.com',
      'images.squarespace-cdn.com',
      'collagenbar.nyc',
      'maps.googleapis.com',
      'maps.gstatic.com'
    ]
  },
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  }
}

module.exports = nextConfig
