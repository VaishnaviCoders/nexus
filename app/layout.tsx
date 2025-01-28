import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider, GoogleOneTap } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: 'School CRM',
  description: 'Entire School Management Software',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords:
    'Sameer Kad, School CRM, Full-Stack Developer, School Management Software, Educational CRM, Attendance Tracker, Fee Management, Next.js Developer',
  authors: [{ name: 'Sameer Kad', url: 'https://github.com/DevSammyKad' }],
  creator: 'Sameer Kad',
  applicationName: 'School CRM',
  publisher: 'Sameer Kad',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    title: 'School CRM',
    description: 'Entire School Management Software',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School CRM',
    description: 'Entire School Management Software',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <GoogleOneTap />

          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
