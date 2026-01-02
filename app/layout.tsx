import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';

import './globals.css';
import './notification-feed-overrides.css';

import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CustomGoogleOneTap } from '@/components/CustomGoogleOneTap';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

// Define viewport separately for better TypeScript support
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // REMOVED: maximum-scale: 1 - this was causing the accessibility issue
  viewportFit: 'cover', // for notch support
  userScalable: true, // explicitly allow zooming
};
const appUrl = new URL('https://www.shiksha.cloud');
export const metadata: Metadata = {
  metadataBase: new URL('https://www.shiksha.cloud'),
  alternates: {
    canonical: '/',
    languages: {
      'en': 'https://www.shiksha.cloud/',
      'x-default': 'https://www.shiksha.cloud/',
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent', // 👈 hides notch area
    'apple-mobile-web-app-title': 'Shiksha Cloud',
    'theme-color': '#000000',
    // viewport:
    //   'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover', // 👈 important for notch fit
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: 'School CRM | All-in-One School Management Platform',
    template: '%s | School CRM',
  },
  description:
    'All-in-one school management platform to streamline students, fees, attendance, and reports. Powerful and easy-to-use for schools, colleges, and coaching institutes.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords:
    'School CRM, School Management Software, Educational CRM, Student Management System, Attendance Tracker, Fee Management, School Administration Software, Coaching Institute Software',
  authors: [{ name: 'Sameer Kad', url: 'https://github.com/DevSammyKad' }],
  creator: 'Sameer Kad',
  applicationName: 'shiksha.cloud',
  publisher: 'Sameer Kad',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    url: appUrl,
    title: 'School CRM | All-in-One School Management Platform',
    description:
      'Streamline school operations, manage students, attendance, and fees effortlessly with School CRM.',
    type: 'website',
    siteName: 'shiksha.cloud',
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'School CRM Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shiksha_cloud',
    creator: '@DevSammyKad',
    title: 'School CRM | All-in-One School Management Platform',
    description:
      'Simplify school operations with an integrated CRM for students, fees, and attendance.',
    images: [`${appUrl}/og-image.png`],
  },
};

function DeferredAnalytics() {
  return (
    <>
      <GoogleAnalytics gaId="G-Z9HW1EQ694" />
      <GoogleTagManager gtmId="GTM-5KFRG7HG" />
      {/* GTM-WNFTTCM4 */}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning data-clerk-suppress>
        <head>
          <link rel="preconnect" href="https://uploadthing.com" />
          <link rel="dns-prefetch" href="https://uploadthing.com" />
        </head>
        <body className={GeistSans.className}>
          {/* <CustomGoogleOneTap /> */}
          <DeferredAnalytics />
          {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster position="bottom-right" />
          {/* </ThemeProvider> */}

          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
