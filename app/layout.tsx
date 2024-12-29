import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';

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
    title: 'shadcn/ui sidebar',
    description:
      'A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'shadcn/ui sidebar',
    description:
      'A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.',
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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
