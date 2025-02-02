import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  api: {
    bodyParser: false,
  },
  experimental: {
    turbo: {
      minify: true,
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  distDir: '.next',
  reactStrictMode: true,

  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'development',
  // },
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
    ],
  },
};

// Export with PWA settings
export default withPWA(nextConfig);
