/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 하이드레이션 문제 방지를 위해 엄격 모드 비활성화
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
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'example.com' },
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
  },
  // Disable static generation for user routes that cause build errors
  output: "standalone"
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "asentica",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
