import FeaturesList from '@/components/websiteComp/FeaturesList';
import { Metadata } from 'next';

const appUrl = new URL('https://www.shiksha.cloud');

export const metadata: Metadata = {
  title:
    'Features – School Management Software | Shiksha.cloud All-in-One School ERP',
  description:
    'Explore 9 powerful modules of Shiksha.cloud — a comprehensive school management software including student information system, attendance tracking, fee management, communication tools, analytics, and academic planning for modern educational institutions.',
  keywords: [
    // ✅ Primary Keywords (High-volume)
    'school management software',
    'school management system',
    'school ERP software',
    'student information system',
    'education management system',

    // ✅ Secondary Keywords (Feature-focused)
    'student attendance management',
    'online fee collection system',
    'parent teacher communication app',
    'student grade management',
    'school timetable software',

    // ✅ Long-tail & LSI Keywords
    'best school management software India',
    'cloud based school management system',
    'free school management software India',
    'school management system for small schools',
    'affordable school ERP software India',
    'learning management system',
    'academic management platform',
    'campus management solution',
    'K12 school software',
    'educational institution software',
  ],

  alternates: {
    canonical: `${appUrl}features`,
  },

  openGraph: {
    title: 'Shiksha.cloud Features – School Management Software & ERP Modules',
    description:
      'Discover how Shiksha.cloud simplifies school operations — student data, attendance, fees, parent communication, analytics, and more — all in one modern ERP platform.',
    url: `${appUrl}features`,
    siteName: 'Shiksha.cloud',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${appUrl}api/og?title=School%20Management%20Features&subtitle=All-in-One%20ERP%20Platform%20by%20Shiksha.cloud`,
        width: 1200,
        height: 630,
        alt: 'Shiksha.cloud School Management Software Features',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title:
      'Shiksha.cloud Features – Best School Management Software & ERP Modules',
    description:
      'All-in-one school ERP: student data, attendance, fee management, communication, and analytics — powered by Shiksha.cloud.',
    images: [
      `${appUrl}api/og?title=Shiksha.cloud%20Features&subtitle=Smart%20School%20Management%20Modules`,
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  // ✅ Structured Data for Rich Results (Schema.org)
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Shiksha.cloud Features',
      url: `${appUrl}features`,
      description:
        'Shiksha.cloud offers cloud-based school management software with modules for student information, attendance, fee collection, parent communication, analytics, and academic planning.',
      inLanguage: 'en-IN',
      publisher: {
        '@type': 'Organization',
        name: 'Shiksha.cloud',
        url: 'https://www.shiksha.cloud',
        logo: `${appUrl}logo.png`,
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Student Management System',
            url: `${appUrl}features#student-management`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Attendance Tracking',
            url: `${appUrl}features#attendance`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Fee Management',
            url: `${appUrl}features#fee-management`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Parent Communication Portal',
            url: `${appUrl}features#communication`,
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Analytics & Reports',
            url: `${appUrl}features#analytics`,
          },
        ],
      },
    }),
  },
};


export default function FeaturesPage() {
  return <FeaturesList />;
}
