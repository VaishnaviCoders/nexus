import { BlogCard } from '@/components/websiteComp/blog/blog-card';
import { FeaturedBlogSection } from '@/components/websiteComp/blog/featured-blog-section';
import Footer from '@/components/websiteComp/Footer';
import React from 'react';

const BlogPage = () => {
  return (
    <div>
      {/* Blog Hero/Header */}
      <section className="relative mx-2 mb-4 overflow-hidden rounded-xl bg-white py-16 sm:mx-4 sm:py-24 dark:bg-black">
        <div
          className="-bottom-12 -right-16 sm:-bottom-16 sm:-right-20 pointer-events-none absolute origin-bottom-right"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="select-none font-bold text-[12rem] text-black/[0.03] tracking-tighter sm:text-[14rem] md:text-[16rem] lg:text-[18rem] dark:text-white/[0.03]">
            Education
          </span>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="inline-flex items-center text-black/70 text-md tracking-tighter dark:text-white/70">
                Updates, guides, and best practices.
              </div>
            </div>
            <h1 className="font-semibold text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Shiksha Cloud{' '}
              <span className="text-red-500/85 dark:text-red-500/85">
                Blogs
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-black/60 tracking-tighter sm:text-lg md:text-xl dark:text-white/60">
              Discover insights, tutorials, and stories about school management.
              Stay updated with the latest in education technology.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Blog */}
      <FeaturedBlogSection />

      {/* Latest Articles */}
      <section className="relative mx-2 mb-4 py-12 sm:mx-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="font-medium text-black/40 text-xs uppercase tracking-wider dark:text-white/40">
              Latest Articles
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* You can replace this with an array map for multiple articles */}
            <BlogCard />
            <BlogCard /> <BlogCard />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BlogPage;
