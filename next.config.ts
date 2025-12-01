import type { NextConfig } from 'next';
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',

// });


const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors:true,
  },
  reactStrictMode: true,
  typedRoutes:true,
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
    typedEnv:true,
    turbopackFileSystemCacheForDev:true
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value:
              'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    //   {
    //     source: '/api/:path*',
    //     headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    //   },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

// Export with PWA settings
// export default withPWA(nextConfig);

export default nextConfig;
