import HolidayLandingPage from '@/components/websiteComp/holiday/holiday-landing-page';
import React from 'react';

// app/features/holidays/page.tsx
import type { Metadata } from 'next';

// ============================================
// SEO METADATA (Server Component)
// ============================================
export const metadata: Metadata = {
  title:
    'School Holiday Management System | Auto-Calculate Working Days & WhatsApp Alerts',
  description:
    'Declare & manage school holidays instantly. Real-time working day calculation, WhatsApp notifications, bulk import from Google Sheets. Save 40+ hours yearly. Trusted by 500+ schools.',
  keywords: [
    'school holiday management system',
    'academic calendar software',
    'emergency holiday declaration',
    'school calendar app for parents',
    'parent notification system',
    'WhatsApp school alerts',
    'bulk import holidays',
    'working day calculator for schools',
    'school holiday tracking',
    'academic year planner',
  ],
  authors: [{ name: 'Shiksha Cloud' }],
  creator: 'Shiksha Cloud',
  publisher: 'Shiksha Cloud',
  openGraph: {
    title: 'Smart Holiday Management for Schools - Shiksha Cloud',
    description:
      'Declare holidays in 8 seconds. WhatsApp notifications. Real-time working day calculator. Trusted by 500+ schools across India.',
    url: 'https://www.shiksha.cloud/features/holidays',
    siteName: 'Shiksha Cloud',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.shiksha.cloud/og-holiday-management.jpg',
        width: 1200,
        height: 630,
        alt: 'School Holiday Management Dashboard - Shiksha Cloud',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Holiday Management System - Shiksha Cloud',
    description:
      'Never miss a school holiday. Instant WhatsApp notifications. 8-second emergency declaration. Save 40+ hours yearly.',
    images: ['https://www.shiksha.cloud/twitter-holiday-management.jpg'],
    creator: '@ShikshaCloud',
  },
  alternates: {
    canonical: 'https://www.shiksha.cloud/features/holidays',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// ============================================
// STRUCTURED DATA SCHEMAS (JSON-LD)
// ============================================
const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Shiksha Cloud Holiday Management System',
  description:
    'Comprehensive school holiday management system with emergency declaration, WhatsApp notifications, and real-time working day calculation.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://www.shiksha.cloud/features/holidays',
  author: {
    '@type': 'Organization',
    name: 'Shiksha Cloud',
    url: 'https://www.shiksha.cloud',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    priceValidUntil: '2025-12-31',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '500',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Emergency Holiday Declaration in 8 Seconds',
    'Real-time Working Day Calculation',
    'WhatsApp Notifications to Parents',
    'Bulk Import from Google Sheets',
    'Academic Calendar Dashboard',
    'Multi-Channel Notifications (WhatsApp, Push, Email)',
    'Parent Portal with Calendar Sync',
    'Smart Delete and Cleanup',
    '5 Import Methods (Google Sheets, Excel, CSV, Paste, Upload)',
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.shiksha.cloud',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Features',
      item: 'https://www.shiksha.cloud/features',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Holiday Management',
      item: 'https://www.shiksha.cloud/features/holidays',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How quickly can I declare an emergency school holiday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With our one-click emergency declaration system, you can notify all parents, students, and teachers within 30 seconds via WhatsApp and push notifications. Simply click "Declare Emergency Holiday," add an optional reason, confirm, and the system automatically sends alerts and updates all calendars.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import holidays from my existing Excel sheet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Upload Excel/CSV files, paste data directly, or connect Google Sheets. Import 100+ holidays in under 2 minutes using any of our 5 import methods: Google Sheets integration, single holiday addition, paste data, template download, or instant file upload.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do parents receive notifications automatically when holidays are declared?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Parents receive instant WhatsApp messages and push notifications for all holidays, with priority alerts for emergency declarations. Our system achieves 98% notification acknowledgment within 10 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the working day calculation work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Our system automatically calculates remaining working days based on your academic calendar, updating in real-time whenever holidays are added or removed. It recognizes your school's working days (configurable) and excludes weekends, holidays, and any other non-working days from calculations.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I delete all holidays at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, admins have a secure bulk delete option with confirmation safeguards and automatic backup creation. You can delete single holidays or reset the entire academic year. Safety confirmations are required for bulk actions, and an undo option is available within 24 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can parents add holidays to their personal calendars?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Parents can download the school calendar to Google Calendar, Apple Calendar, Outlook, or any calendar app with one click. The calendar syncs automatically and updates when new holidays are declared.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do WhatsApp notifications work for school holidays?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use WhatsApp Business API (official, secure, and compliant). Parents receive professional messages directly in WhatsApp with full holiday details including date, reason, and holiday type. This is completely automated and achieves 98% open rates within 10 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a limit on the number of holidays I can declare?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No limits. Declare as many holidays as needed. Import 100+ at once if required. All features including notifications, calendar updates, and working day calculations work regardless of the number of holidays.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I make a mistake declaring a holiday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Easy fix! Delete the holiday with one click, and parents get an automatic notification about the correction. You can also edit holiday details without deleting. An undo option is available within 24 hours, and all changes are logged for audit purposes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need technical knowledge to use the holiday management system?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not at all. Our system works with simple Excel sheets, Google Sheets, or even copy-paste from anywhere. If you can use email, you can use our holiday management system. We also provide dedicated onboarding support and video tutorials for every feature.',
      },
    },
  ],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shiksha Cloud',
  url: 'https://www.shiksha.cloud',
  logo: 'https://www.shiksha.cloud/logo.png',
  description:
    'Complete school management system with holiday management, attendance tracking, fee management, and more.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXX-XXX-XXXX',
    contactType: 'Customer Support',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.facebook.com/ShikshaCloud',
    'https://twitter.com/ShikshaCloud',
    'https://www.linkedin.com/company/shiksha-cloud',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Declare School Holidays Using Shiksha Cloud',
  description:
    'Step-by-step guide to declaring and managing school holidays with automated notifications and calendar updates.',
  totalTime: 'PT30S',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Choose Declaration Method',
      text: 'Select your preferred method: single add, bulk import, Google Sheets, paste data, or upload file.',
      url: 'https://www.shiksha.cloud/features/holidays#import-methods',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'System Processes Instantly',
      text: 'System validates dates, checks for conflicts, and calculates working day impact automatically.',
      url: 'https://www.shiksha.cloud/features/holidays#validation',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Automatic Notifications Sent',
      text: 'WhatsApp, push notifications, and emails are sent automatically to all relevant users within 30 seconds.',
      url: 'https://www.shiksha.cloud/features/holidays#notifications',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Calendars Update in Real-Time',
      text: 'Student, parent, and teacher calendars sync automatically across all devices and platforms.',
      url: 'https://www.shiksha.cloud/features/holidays#calendar-sync',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Analytics Dashboard Refreshes',
      text: 'Working days recalculated, dashboard refreshed, and reports updated automatically.',
      url: 'https://www.shiksha.cloud/features/holidays#analytics',
    },
  ],
};

const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: {
    '@type': 'SoftwareApplication',
    name: 'Shiksha Cloud Holiday Management System',
  },
  author: {
    '@type': 'Organization',
    name: 'Mumbai International School',
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: '5',
    bestRating: '5',
  },
  reviewBody:
    "During last month's unexpected storm, we declared an emergency holiday and had 98% parent acknowledgment within 5 minutes. This system has saved us 40+ hours per academic year on calendar management.",
};

// ============================================
// SERVER COMPONENT
// ============================================
export default function page() {
  return (
    <>
      {/* Structured Data - JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema),
        }}
      />

      {/* Main Content - Client Component */}
      <HolidayLandingPage />
    </>
  );
}

// ============================================
// STATIC DATA EXPORT FOR SEO
// ============================================
// export const holidayManagementData = {
//   hero: {
//     h1: 'Smart Holiday Management System',
//     subtitle:
//       'Never Miss a School Holiday Again. Declare, Track & Notify in Seconds.',
//     trustBadges: [
//       'Trusted by 500+ Schools',
//       '99.9% Notification Delivery',
//       'Zero Setup Time',
//     ],
//   },
//   stats: [
//     {
//       value: '8',
//       unit: 'Seconds',
//       label: 'Emergency Declaration Time',
//       description: 'From click to full parent notification via WhatsApp',
//     },
//     {
//       value: '98',
//       unit: '%',
//       label: 'WhatsApp Open Rate',
//       description: 'Parents acknowledge within 10 minutes',
//     },
//     {
//       value: '500',
//       unit: '+',
//       label: 'Schools Using',
//       description: 'Educational institutions across India',
//     },
//     {
//       value: '40',
//       unit: 'Hours',
//       label: 'Saved Per Year',
//       description: 'Average time saved on calendar management',
//     },
//   ],
//   features: [
//     {
//       id: 'academic-dashboard',
//       question: 'How Can Schools Track Their Academic Calendar Effectively?',
//       directAnswer:
//         'Schools can use our Academic Year Overview Dashboard to get real-time visibility into total holidays declared, working days remaining, holiday impact analysis, and category-wise breakdowns—all automatically calculated and updated.',
//       title: 'Academic Year Overview Dashboard',
//       subtitle: 'Real-Time Working Day Intelligence',
//       description:
//         'Get complete visibility into your school calendar with live tracking of working days, holidays, and their impact on your academic schedule. No more manual calculations or spreadsheet errors.',
//       benefits: [
//         'Total holidays declared with live count',
//         'Automatic working day calculation',
//         'Holiday impact analysis on schedule',
//         'Category-wise breakdown (National, Religious, Emergency)',
//         'Visual calendar with color-coding',
//         'Term-wise distribution analytics',
//       ],
//       icon: 'Calendar',
//       gradient: 'from-purple-500 to-indigo-600',
//       stats: {
//         timeSaved: '12+ hours monthly',
//         accuracy: '100% calculation accuracy',
//       },
//     },
//     {
//       id: 'emergency-declaration',
//       question: 'How to Declare Emergency School Holiday Instantly?',
//       directAnswer:
//         'Click "Declare Emergency Holiday," add an optional reason, confirm, and the system automatically sends WhatsApp alerts, push notifications, and updates all calendars within 30 seconds.',
//       title: 'Emergency Holiday Declaration',
//       subtitle: 'Handle Unexpected Situations in Seconds',
//       description:
//         'When severe weather, emergencies, or unexpected events occur, declare holidays instantly and notify everyone automatically through multiple channels.',
//       benefits: [
//         'One-click emergency declaration',
//         'WhatsApp alerts sent in 30 seconds',
//         'Push notifications to mobile apps',
//         'Automatic calendar updates',
//         'Real-time working day recalculation',
//         'Complete activity logging',
//       ],
//       useCases: [
//         'Extreme weather conditions',
//         'Public health emergencies',
//         'Infrastructure failures',
//         'Government directives',
//         'Community emergencies',
//       ],
//       icon: 'AlertTriangle',
//       gradient: 'from-red-500 to-orange-600',
//       stats: {
//         notificationSpeed: '30 seconds',
//         acknowledgmentRate: '98% within 10 minutes',
//       },
//     },
//     {
//       id: 'bulk-import',
//       question: 'How to Add Multiple School Holidays Quickly?',
//       directAnswer:
//         "Import your entire academic year's holidays in under 2 minutes using 5 methods: Google Sheets integration, single holiday addition, paste data, template download, or drag-and-drop file upload.",
//       title: 'Bulk Import Holidays',
//       subtitle: '5 Powerful Import Methods',
//       description:
//         'Stop adding holidays one by one. Import 100+ holidays in minutes using your preferred method—no technical knowledge required.',
//       methods: [
//         {
//           name: 'Google Sheets Integration',
//           description:
//             'Connect your existing Google Sheet directly with automatic column mapping and real-time sync',
//         },
//         {
//           name: 'Single Holiday Quick Add',
//           description:
//             'Fast interface for individual entries with smart date picker and conflict detection',
//         },
//         {
//           name: 'Paste Data Directly',
//           description:
//             'Copy from Excel, Word, PDF, or anywhere with intelligent parsing that recognizes dates automatically',
//         },
//         {
//           name: 'Download Template',
//           description:
//             'Use pre-formatted Excel/CSV template with example data and instant validation',
//         },
//         {
//           name: 'Drag & Drop Upload',
//           description:
//             'Drop your Excel/CSV file with automatic column detection and error highlighting',
//         },
//       ],
//       icon: 'Upload',
//       gradient: 'from-green-500 to-emerald-600',
//       stats: {
//         importTime: '90 seconds for 100+ holidays',
//         manualTime: '4 hours saved vs manual entry',
//       },
//     },
//     {
//       id: 'smart-delete',
//       question: 'How to Manage Wrong Holiday Entries?',
//       directAnswer:
//         'Delete single holidays with one click or use bulk cleanup for major changes. All deletions include safety confirmations, automatic backups, and optional parent notifications.',
//       title: 'Smart Delete & Cleanup',
//       subtitle: 'Safe Holiday Management',
//       description:
//         'Made a mistake? Need to adjust your calendar? Delete holidays with built-in safeguards and automatic notifications.',
//       features: [
//         {
//           type: 'Delete Single Holiday',
//           benefits: [
//             'One-click removal with confirmation',
//             'Automatic working day recalculation',
//             'Optional notification to parents',
//             'Undo available within 24 hours',
//           ],
//         },
//         {
//           type: 'Delete All Holidays',
//           benefits: [
//             'Reset entire academic year',
//             'Safety confirmation required',
//             'Automatic backup before deletion',
//             'Admin-only permission',
//           ],
//         },
//       ],
//       safeguards: [
//         'Prevent deletion of past holidays',
//         'Confirmation for bulk actions',
//         'Complete activity log maintained',
//         'Role-based permissions',
//         'Data recovery available',
//       ],
//       icon: 'Trash2',
//       gradient: 'from-gray-500 to-slate-600',
//     },
//     {
//       id: 'parent-experience',
//       question: 'What Makes This the Best School Calendar App for Parents?',
//       directAnswer:
//         'Parents get a beautiful visual calendar with color-coded holidays, multiple view modes, one-click export to personal calendars, and instant notifications via WhatsApp, push, and email.',
//       title: 'Parent Portal Experience',
//       subtitle: 'Beautiful, Simple, Effective',
//       description:
//         'Parents see a clean, easy-to-understand calendar with instant notifications and seamless integration with their personal calendars.',
//       features: [
//         {
//           category: 'Visual Academic Calendar',
//           items: [
//             'Month, Week, Day view modes',
//             'Color-coded holiday categories',
//             'Download to Google/Apple/Outlook Calendar',
//             'Print-friendly format',
//             'Search and filter capabilities',
//           ],
//         },
//         {
//           category: 'Multi-Channel Notifications',
//           items: [
//             'Push notifications on mobile app',
//             'WhatsApp messages with details',
//             'Email summaries',
//             'Priority alerts for emergencies',
//           ],
//         },
//         {
//           category: 'Upcoming Holidays Widget',
//           items: [
//             'Next 5 holidays at a glance',
//             'Days remaining counter',
//             'Holiday type indicators',
//             'Add reminder option',
//           ],
//         },
//       ],
//       testimonial: {
//         quote:
//           'I used to miss school holidays and plan family trips on school days. Now I get WhatsApp alerts instantly. Life-changing!',
//         author: 'Priya Sharma',
//         role: 'Parent of 2 students',
//       },
//       icon: 'Smartphone',
//       gradient: 'from-blue-500 to-cyan-600',
//       stats: {
//         satisfaction: '96% parent satisfaction',
//         missedHolidays: '0% holidays missed',
//       },
//     },
//   ],
//   howItWorks: {
//     title: 'How Does the Holiday Management System Work?',
//     description: 'From declaration to notification in just 30 seconds',
//     steps: [
//       {
//         step: 1,
//         title: 'Admin Declares Holiday',
//         description:
//           'Choose your method: single add, bulk import, Google Sheets, paste data, or upload file',
//         time: '5 seconds',
//       },
//       {
//         step: 2,
//         title: 'System Processes Instantly',
//         description:
//           'Validates dates, checks conflicts, calculates working day impact',
//         time: '3 seconds',
//       },
//       {
//         step: 3,
//         title: 'Everyone Gets Notified',
//         description:
//           'WhatsApp + Push + Email sent automatically to relevant users',
//         time: '20 seconds',
//       },
//       {
//         step: 4,
//         title: 'Calendars Update Automatically',
//         description: 'Student, parent, and teacher calendars sync in real-time',
//         time: '1 second',
//       },
//       {
//         step: 5,
//         title: 'Analytics Update',
//         description:
//           'Working days recalculated, dashboard refreshed, reports updated',
//         time: '1 second',
//       },
//     ],
//     totalTime: '30 seconds',
//   },
//   comparison: {
//     title: 'Why Traditional Holiday Management Fails Schools',
//     description: 'See the difference modern technology makes',
//     items: [
//       {
//         traditional: 'Manual Excel sheets prone to errors',
//         shiksha: 'Automated calculation engine with 100% accuracy',
//       },
//       {
//         traditional: 'Parents miss holiday announcements (70% open rate)',
//         shiksha: 'WhatsApp + Push notifications (98% acknowledgment)',
//       },
//       {
//         traditional: 'Emergency holidays create chaos (2-3 hours)',
//         shiksha: 'One-click emergency declaration (30 seconds)',
//       },
//       {
//         traditional: 'Hours updating calendars manually',
//         shiksha: 'Bulk import from Google Sheets (90 seconds)',
//       },
//       {
//         traditional: 'Lost productivity calculating working days',
//         shiksha: 'Real-time automatic recalculation',
//       },
//       {
//         traditional: 'No parent calendar integration',
//         shiksha: 'One-click export to Google/Apple/Outlook',
//       },
//     ],
//   },
//   socialProof: {
//     title: 'What Schools Say About Our Holiday Management',
//     testimonials: [
//       {
//         school: 'Mumbai International School',
//         quote:
//           "During last month's unexpected storm, we declared an emergency holiday and had 98% parent acknowledgment within 5 minutes.",
//         author: 'Dr. Rajesh Kumar',
//         role: 'Principal',
//         results: {
//           timeSaved: '40+ hours per year',
//           satisfaction: '96% parent satisfaction',
//         },
//         rating: 5,
//       },
//       {
//         school: 'Delhi Public School Branch',
//         quote:
//           'Parents used to miss 30% of holiday announcements via email. With WhatsApp notifications, we now have 98% engagement.',
//         author: 'Anjali Verma',
//         role: 'Admin Head',
//         results: {
//           engagement: '98% acknowledgment rate',
//           complaints: 'Zero missed holiday complaints',
//         },
//         rating: 5,
//       },
//       {
//         school: 'Bangalore Academy',
//         quote:
//           'The bulk import feature saved us during annual planning. We imported 50+ holidays in under 2 minutes.',
//         author: 'Suresh Reddy',
//         role: 'Academic Coordinator',
//         results: {
//           setupTime: '2 minutes vs 4 hours',
//           accuracy: '100% data accuracy',
//         },
//         rating: 5,
//       },
//     ],
//   },
// };
