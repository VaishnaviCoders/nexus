'use client';

import DisplayCards from '@/components/ui/display-cards';
import { MagicCard } from '@/components/ui/magic-card';
import { Feather, Sparkles } from 'lucide-react';

const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: 'Featured',
    description: 'Discover amazing content',
    date: 'Just now',
    iconClassName: 'text-blue-500',
    titleClassName: 'text-blue-500',
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: 'Popular',
    description: 'Trending this week',
    date: '2 days ago',
    iconClassName: 'text-blue-500',
    titleClassName: 'text-blue-500',
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: 'New',
    description: 'Latest updates and features',
    date: 'Today',
    iconClassName: 'text-blue-500',
    titleClassName: 'text-blue-500',
    className:
      '[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10',
  },
];

function DisplayCardsDemo() {
  return (
    <MagicCard
      gradientFrom="#38bdf8"
      gradientTo="#3b82f6"
      className="p-4 lg:p-6 lg:rounded-3xl  row-start-4 row-end-6 rounded-2xl border "
      gradientColor="rgba(59,130,246,0.1)"
    >
      <div className="flex items-center space-x-4 mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Feather className="size-5 text-primary" />
          Continues adding new Features.
        </h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Take the pain out of book keeping! Wave goodbye to mountains of
        paperwork and endless email reminders.
      </p>
      <div className="w-full max-md:overflow-hidden mt-20 max-sm:mt-10">
        <DisplayCards cards={defaultCards} />
      </div>
    </MagicCard>
  );
}

export { DisplayCardsDemo };
