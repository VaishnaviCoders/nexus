import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Bookmark,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// ==================== BLOG CONTENT ====================
const BLOG_DATA = {
  slug: 'school-management-systems-save-time',
  title: 'How Modern School Management Systems Save 20+ Hours Weekly',
  description:
    'Discover how 500+ Indian schools are transforming administrative tasks through smart automation and AI-powered solutions.',
  date: '2024-01-15',
  category: 'Productivity',
  tags: [
    'Automation',
    'Time Management',
    'School Efficiency',
    'Digital Transformation',
    'AI',
  ],
  readTime: '6 min read',
  author: 'Sarah Chen',
  authorRole: 'Education Technology Specialist',
  authorAvatar:
    'https://unsplash.com/photos/people-sitting-down-near-table-with-assorted-laptop-computers-SYTO3xs06fU',
  views: '2.4K',

  // Unsplash Images
  heroImage: {
    src: 'https://unsplash.com/s/photos/analytics-dashboard',
    alt: 'Modern school management dashboard showing analytics',
  },

  content: {
    introduction: `
      What if we told you that 500+ Indian schools are already saving 20+ hours every week on administrative tasks? 
      While most school administrators struggle with endless paperwork, smart institutions have discovered the secret to 
      getting their weekends back through intelligent automation.
    `,

    stats: [
      { value: '20+', label: 'Hours Saved Weekly' },
      { value: '500+', label: 'Schools Transformed' },
      { value: '95%', label: 'Reduced Paperwork' },
      { value: '400%', label: 'Average ROI' },
    ],

    sections: [
      {
        title: 'The Hidden Time Drain in School Administration',
        content: `
          Most school administrators spend 35-40 hours weekly on tasks that should take minutes. From manual attendance 
          tracking to fee collection follow-ups, the administrative burden is real and overwhelming.
        `,
        image: {
          src: 'https://unsplash.com/photos/person-writing-on-white-paper-gcsNOsPEXfs',
          alt: 'Administrative paperwork and time management',
          caption: 'Traditional vs digital administrative workflows',
        },
        highlights: [
          'Manual attendance takes 2-3 hours daily',
          'Fee collection follow-ups consume 12+ hours weekly',
          'Parent communication eats up 8+ hours weekly',
          'Report generation requires 6+ hours weekly',
        ],
      },
      {
        title: 'AI-Powered Automation in Action',
        content: `
          Modern systems leverage AI to automate repetitive tasks. Smart attendance tracking, automated fee reminders, 
          and instant report generation are just the beginning.
        `,
        image: {
          src: 'https://unsplash.com/photos/a-classroom-with-orange-chairs-and-white-desks-PKc7TnZr9tE',
          alt: 'AI and automation in education technology',
          caption: 'AI-driven automation reduces manual work by 80%',
        },
        highlights: [
          'Biometric integration for instant attendance',
          'AI-powered fee reminder system',
          'Automated report generation in minutes',
          'Smart parent communication portals',
        ],
      },
      {
        title: "Real Impact: St. Xavier's Success Story",
        content: `
          St. Xavier's School transformed from 42 hours of weekly administrative work to just 18 hours. 
          Their staff now focuses on education quality rather than paperwork.
        `,
        image: {
          src: 'https://unsplash.com/photos/a-classroom-with-orange-chairs-and-white-desks-PKc7TnZr9tEhttps://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
          alt: 'School success story and transformation',
          caption: "St. Xavier's School achieved 24 hours weekly time savings",
        },
      },
    ],

    conclusion: `
      Modern school management systems aren't just about technology - they're about giving educators 
      their most valuable resource back: time. With 20+ hours saved weekly, schools can focus on what 
      truly matters: quality education and student development.
    `,
  },
};

// Related posts
const RELATED_POSTS = [
  {
    slug: 'digital-fee-collection',
    title: 'Complete Guide to Digital Fee Collection',
    description:
      'Transform your fee collection process with automated payment systems.',
    image:
      'https://unsplash.com/photos/a-man-sitting-at-a-desk-talking-on-a-phone-xyCT3RHdCTshttps://unsplash.com/photos/a-classroom-with-orange-chairs-and-white-desks-PKc7TnZr9tE',
    category: 'Finance',
    readTime: '5 min read',
  },
  {
    slug: 'parent-communication',
    title: 'Modern Parent Communication Strategies',
    description: 'Boost engagement with AI-powered communication tools.',
    image:
      'https://unsplash.com/photos/a-classroom-with-orange-chairs-and-white-desks-PKc7TnZr9tE',
    category: 'Communication',
    readTime: '4 min read',
  },
];

// ==================== METADATA ====================
export const metadata: Metadata = {
  title: `${BLOG_DATA.title} | Shiksha Cloud`,
  description: BLOG_DATA.description,
  keywords: BLOG_DATA.tags,
  authors: [{ name: BLOG_DATA.author }],
  openGraph: {
    title: BLOG_DATA.title,
    description: BLOG_DATA.description,
    type: 'article',
    publishedTime: BLOG_DATA.date,
    authors: [BLOG_DATA.author],
    tags: BLOG_DATA.tags,
    images: [BLOG_DATA.heroImage.src],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_DATA.title,
    description: BLOG_DATA.description,
    images: [BLOG_DATA.heroImage.src],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: BLOG_DATA.title,
  description: BLOG_DATA.description,
  author: { '@type': 'Person', name: BLOG_DATA.author },
  datePublished: BLOG_DATA.date,
  articleSection: BLOG_DATA.category,
  keywords: BLOG_DATA.tags.join(', '),
};

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900">
        {/* ===== ENHANCED HEADER ===== */}
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 dark:bg-slate-950/80 dark:border-slate-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="group flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-all duration-300 dark:text-slate-400 dark:hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:group-hover:bg-slate-700">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Back to Blog</span>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Eye className="w-4 h-4" />
                  <span>{BLOG_DATA.views} views</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===== PREMIUM HERO SECTION ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30">
                  {BLOG_DATA.category}
                </Badge>
                {BLOG_DATA.tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs text-slate-500 dark:text-slate-400"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Title with Gradient */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6 bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                {BLOG_DATA.title}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed text-pretty mb-8 dark:text-slate-300">
                {BLOG_DATA.description}
              </p>

              {/* Enhanced Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8 dark:text-slate-400">
                <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2 backdrop-blur-sm dark:bg-slate-800/50">
                  <Image
                    src={BLOG_DATA.authorAvatar}
                    alt={BLOG_DATA.author}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {BLOG_DATA.author}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {' '}
                      • {BLOG_DATA.authorRole}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2 backdrop-blur-sm dark:bg-slate-800/50">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={BLOG_DATA.date}>
                    {new Date(BLOG_DATA.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2 backdrop-blur-sm dark:bg-slate-800/50">
                  <Clock className="w-4 h-4" />
                  {BLOG_DATA.readTime}
                </div>
              </div>

              {/* Premium Hero Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-200/50 dark:border-slate-800">
                <Image
                  src={BLOG_DATA.heroImage.src}
                  alt={BLOG_DATA.heroImage.alt}
                  width={1200}
                  height={600}
                  className="w-full h-64 md:h-96 object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS OVERVIEW ===== */}
        <section className="relative -mt-8 mb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-blue-500/5 dark:bg-slate-900/80 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {BLOG_DATA.content.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ===== PREMIUM CONTENT ===== */}
        <main className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-lg max-w-none prose-slate dark:prose-invert">
                {/* Introduction */}
                <section className="mb-16">
                  <div className="text-lg leading-relaxed text-slate-700 bg-blue-50/50 rounded-2xl p-8 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-slate-300">
                    <TrendingUp className="w-8 h-8 text-blue-500 mb-4" />
                    {BLOG_DATA.content.introduction}
                  </div>
                </section>

                {/* Content Sections */}
                {BLOG_DATA.content.sections.map((section, index) => (
                  <section
                    key={index}
                    className="mb-20 scroll-m-20"
                    id={`section-${index}`}
                  >
                    <div className="flex items-start gap-4 mb-8">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold mt-1 flex-shrink-0">
                        {index + 1}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>

                    <p className="text-lg leading-relaxed text-slate-700 mb-6 dark:text-slate-300">
                      {section.content}
                    </p>

                    {/* Highlights */}
                    {section.highlights && (
                      <div className="grid gap-3 mb-6">
                        {section.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Image */}
                    {section.image && (
                      <figure className="my-8 group">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-500/10 border border-slate-200/50 dark:border-slate-800">
                          <Image
                            src={section.image.src}
                            alt={section.image.alt}
                            width={800}
                            height={400}
                            className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
                        </div>
                        <figcaption className="text-center text-sm text-slate-500 mt-3 dark:text-slate-400">
                          {section.image.caption}
                        </figcaption>
                      </figure>
                    )}
                  </section>
                ))}

                {/* Enhanced Conclusion */}
                <section className="mb-16">
                  <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-0 shadow-2xl text-white">
                    <CardContent className="p-8">
                      <Star className="w-8 h-8 text-yellow-400 mb-4" />
                      <h2 className="text-2xl font-bold mb-4">Key Takeaways</h2>
                      <p className="text-lg leading-relaxed text-slate-200">
                        {BLOG_DATA.content.conclusion}
                      </p>
                    </CardContent>
                  </Card>
                </section>
              </article>

              {/* Enhanced CTA */}
              <section className="mt-16">
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-2xl shadow-blue-500/25">
                  <CardContent className="p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-3">
                      Ready to Transform Your School?
                    </h3>
                    <p className="text-blue-100 mb-6 text-lg">
                      Join 500+ schools already saving 20+ hours weekly
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                      >
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 font-semibold"
                      >
                        Book Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Related Posts */}
              <section className="mt-20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Continue Reading
                  </h2>
                  <Link
                    href="/blog"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {RELATED_POSTS.map((post, index) => (
                    <Card
                      key={index}
                      className="group hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-slate-700 backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-300">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400">
                            {post.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2 dark:text-slate-400">
                            {post.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500">
                            <span>{post.readTime}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* ===== PREMIUM FOOTER ===== */}
        <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/50">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Main Footer Content */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                    Shiksha Cloud
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    India's leading school management platform, transforming
                    education through technology and innovation.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">
                    Explore
                  </h4>
                  <div className="space-y-2">
                    {[
                      'All Articles',
                      'Productivity',
                      'Finance',
                      'Communication',
                    ].map((item) => (
                      <Link
                        key={item}
                        href={`/blog/category/${item.toLowerCase()}`}
                        className="block text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">
                    Connect
                  </h4>
                  <div className="space-y-2">
                    {[
                      'Book Demo',
                      'Contact Sales',
                      'Support',
                      'Documentation',
                    ].map((item) => (
                      <Link
                        key={item}
                        href={`/${item.toLowerCase().replace(' ', '-')}`}
                        className="block text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-slate-500 text-sm dark:text-slate-500">
                    © 2024 Shiksha Cloud. Transforming education, one school at
                    a time.
                  </p>
                  <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-500">
                    <Link
                      href="/privacy"
                      className="hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/terms"
                      className="hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Terms
                    </Link>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
