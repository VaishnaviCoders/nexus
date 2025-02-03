import { cn } from '@/lib/utils';
import { ArrowRightIcon, Feather } from 'lucide-react';
import React from 'react';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import Globe from '@/components/ui/globe';
import { AnimatedListGrid } from './AnimatedListGrid';
import { AnimatedBeamMultipleOutput } from './AnimatedBeamMultipleOutput';
// import Image from 'next/image';

// import RealTimeImage from '@/public/images/feature-four.svg';
import { MagicCard } from '@/components/ui/magic-card';
import { DisplayCardsDemo } from './display-card-demo';

//- KEY Features

// Get Instant Notification
// Get all Data form All Platform In place
// Track Student All Data
// Manage Teacher Salary and Track Work Record
// Track Students Onboarding in Animated Globe
// Automated Fee Tracking & Payment Reminders
// Lead Management & Enrollment

const BentoGrid = () => {
  return (
    <>
      <div className="mx-5 mb-5 mt-20 flex">
        <div
          className={cn(
            'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800'
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Key Feature of this School CRM</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>
      <div className="md:mx-5 flex grid-cols-3 flex-col gap-10 p-2 md:grid">
        <div className="row-start-1 row-end-4 rounded-lg">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            className="p-4 lg:p-6 lg:rounded-3xl"
            gradientColor="rgba(59,130,246,0.1)"
          >
            <AnimatedListGrid />
          </MagicCard>
        </div>
        <div className="max-sm:hidden bg-gradient-to-tb row-start-1 row-end-4 animate-pulse rounded-2xl border ">
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl border px-40 pb-40 pt-8 md:pb-60 md:shadow-xl ">
            <Globe className="-top-36 z-50" />

            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
            <span className="pointer-events-none absolute bottom-10 whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
              Track Globe
            </span>
          </div>
        </div>
        <div className="row-start-1 row-end-3 rounded-2xl ">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            className="p-4 lg:p-6 lg:rounded-3xl"
            gradientColor="rgba(59,130,246,0.1)"
          >
            <AnimatedBeamMultipleOutput />
          </MagicCard>
        </div>

        <DisplayCardsDemo />
        <MagicCard
          gradientFrom="#38bdf8"
          gradientTo="#3b82f6"
          className="p-4 lg:p-6 lg:rounded-3xl col-span-2 row-start-4 row-end-6 rounded-2xl "
          gradientColor="rgba(59,130,246,0.1)"
        >
          <div className="flex items-center space-x-4 mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Feather className="size-5 text-primary" />
              Real-Time Update, What happen in your Organization .
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {' '}
            Take the pain out of book keeping! Wave goodbye to mountains of
            paperwork and endless email reminders. There`s now a new way of
            accounting.
          </p>
          <div className="w-full mt-6 bg-card/50 overflow-hidden">
            {/* <Image
              src={RealTimeImage}
              alt={'Feature Four'}
              width={500}
              height={500}
              className="w-fit h-full object-contain"
            /> */}
          </div>
        </MagicCard>
        <div className="row-start-3 row-end-4 rounded-2xl border  ">
          {/* <BentoGridAnimatedBeam /> */}
        </div>
      </div>
    </>
  );
};

export default BentoGrid;
