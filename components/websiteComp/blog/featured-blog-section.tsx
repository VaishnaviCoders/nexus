// components/FeaturedSection.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

export function FeaturedBlogSection() {
  return (
    <section className="relative mx-2 mb-4 sm:mx-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="font-medium text-black/40 text-xs uppercase tracking-wider dark:text-white/40">
            Featured
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Link
            href="/"
            className="group block overflow-hidden rounded-2xl border border-black/10 bg-black/5 transition-all duration-300 hover:border-black/30 dark:border-white/5 dark:bg-zinc-900/50 dark:hover:border-white/30"
          >
            <div className="grid grid-cols-1 gap-8 p-8 sm:p-12 lg:grid-cols-2">
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-red-500/10 px-3 py-1 text-red-500 text-xs tracking-tighter">
                    Product
                  </div>
                  <h2 className="font-medium text-3xl text-black tracking-tighter transition-colors sm:text-4xl md:text-5xl dark:text-white">
                    Introducing Multi-Agent Workflows
                  </h2>
                  <p className="text-base text-black/60 tracking-tighter sm:text-lg dark:text-white/60">
                    Learn how to orchestrate multiple AI agents working together
                    to solve complex tasks efficiently and seamlessly.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-black/50 text-sm tracking-tighter dark:text-white/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Mar 15, 2025</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm group/btn h-9 rounded-lg bg-black px-6 text-white tracking-tighter transition-all duration-300 hover:bg-black/90 sm:h-10 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    <span className="flex items-center gap-2">
                      Read Article
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </span>
                  </button>
                </div>
              </div>
              <div className="relative min-h-[300px] overflow-hidden rounded-xl">
                <Image
                  src="/images/blogBanner.jpg"
                  alt="Introducing Multi-Agent Workflows"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
