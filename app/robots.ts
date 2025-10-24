// app/robots.ts - FIXED
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://www.shiksha.cloud/sitemap.xml',
    // Remove the 'host' property - it's not standard for robots.txt
  };
}
