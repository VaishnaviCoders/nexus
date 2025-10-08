import type { Metadata } from 'next';
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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.NEXT_PUBLIC_APP_URL
        ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
        : `http://localhost:3000`)
  ),
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
  alternates: {
    canonical: appUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          {/* <CustomGoogleOneTap /> */}
          <GoogleAnalytics gaId="G-Z9HW1EQ694" />
          <GoogleTagManager gtmId="GTM-WNFTTCM4" />
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
