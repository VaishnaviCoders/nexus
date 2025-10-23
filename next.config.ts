import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  distDir: '.next',
  reactStrictMode: true,
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },

  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'development',
  // },

  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.shiksha.cloud' }],
        headers: [{ key: 'X-Robots-Tag', value: 'index, follow' }],
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'schoolnexus.vercel.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        // Cache the manifest file (default: public, max-age=0, must-revalidate)
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=3600',
          },
        ],
        source: '/no/api/manifest',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
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
export default withPWA(nextConfig);
