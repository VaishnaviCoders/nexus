// components/BlogCard.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

// You can further split SVGs/shapes as separate components if you want
const AnimatedThumbnail = () => (
  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-black/[0.03] to-black/[0.08] dark:from-white/[0.03] dark:to-white/[0.08]">
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="relative h-full w-full">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <title>Workflow connections</title>
          <line
            stroke="rgba(59,130,246,0.2)"
            strokeWidth="1"
            x1="20%"
            x2="50%"
            y1="30%"
            y2="50%"
          />
          <line
            stroke="rgba(239,68,68,0.2)"
            strokeWidth="1"
            x1="80%"
            x2="50%"
            y1="30%"
            y2="50%"
          />
          <line
            stroke="rgba(251,146,60,0.2)"
            strokeWidth="1"
            x1="50%"
            x2="50%"
            y1="50%"
            y2="80%"
          />
        </svg>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-[30%] left-[20%] h-6 w-6 rounded-full border border-blue-500/20 bg-blue-500/10" />
        <div className="-translate-y-1/2 absolute top-[30%] right-[20%] h-6 w-6 translate-x-1/2 rounded-full border border-red-500/20 bg-red-500/10" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-8 w-8 rounded-lg border border-black/15 bg-black/10 dark:border-white/15 dark:bg-white/10" />
        <div className="-translate-x-1/2 absolute bottom-[20%] left-1/2 h-6 w-6 translate-y-1/2 rounded-full border border-orange-500/20 bg-orange-500/10" />
      </div>
    </div>
  </div>
);

export function BlogCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Link
        href="/blog/2"
        className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition-all duration-300 hover:border-black/30 dark:border-white/5 dark:bg-zinc-950 dark:hover:border-white/30"
      >
        <AnimatedThumbnail />
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 text-black/70 text-xs tracking-tighter dark:bg-white/5 dark:text-white/70">
              Engineering
            </div>
            <h3 className="font-medium text-black text-xl tracking-tighter transition-colors group-hover:text-red-500/85 dark:text-white dark:group-hover:text-red-500/85">
              Building Autonomous Systems with Sonae
            </h3>
            <p className="text-black/60 text-sm tracking-tighter dark:text-white/60">
              Deep dive into the architecture behind our autonomous agent system
              and how it scales.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-black/10 border-t pt-4 dark:border-white/10">
            <div className="flex flex-col gap-1 text-black/50 text-xs tracking-tighter dark:text-white/50">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>Mar 10, 2025</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>8 min read</span>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-black/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-red-500/85 dark:text-white/40 dark:group-hover:text-red-500/85" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
