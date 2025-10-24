import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shiksha.cloud';
  const currentDate = new Date();

  return [
    // Homepage
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1,
    },

    // Location-based pages
    {
      url: `${baseUrl}/location/school-management-software`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Features pages
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features/anonymous-complaint-system`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/features/holidays`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/features/role-based`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Other main pages
    {
      url: `${baseUrl}/founder`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/why-shiksha`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/why-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
