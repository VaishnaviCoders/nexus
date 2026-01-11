import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = 'https://shiksha.cloud';
  const currentDate = new Date();
  return [
    // Homepage

    {
      url: `${appUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 1,
    },

    // Location-based pages
    {
      url: `${appUrl}/location/school-management-software`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },

    // Blogs
    {
      url: `${appUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Features pages
    {
      url: `${appUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${appUrl}/features/anonymous-complaint-system`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${appUrl}/features/attendance`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${appUrl}/features/fee-management`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${appUrl}/features/holidays`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${appUrl}/features/role-based`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },

    // Other main pages
    {
      url: `${appUrl}/founder`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${appUrl}/why-shiksha`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${appUrl}/why-us`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${appUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
