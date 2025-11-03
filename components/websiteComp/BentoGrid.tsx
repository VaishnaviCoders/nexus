import { cn } from '@/lib/utils';
import { ArrowRightIcon, Feather } from 'lucide-react';
import React from 'react';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { Globe } from '@/components/ui/globe';
import { AnimatedBeamMultipleOutput } from './AnimatedBeamMultipleOutput';
// import Image from 'next/image';

// import RealTimeImage from '@/public/images/feature-four.svg';
import { MagicCard } from '@/components/ui/magic-card';
import { DisplayCardsDemo } from './display-card-demo';
import { AnimatedList, AnimatedListItem } from '../ui/animated-list';

//- KEY Features

// Get Instant Notification
// Get all Data form All Platform In place
// Track Student All Data
// Manage Teacher Salary and Track Work Record
// Track Students Onboarding in Animated Globe
// Automated Fee Tracking & Payment Reminders
// Lead Management & Enrollment

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: 'Fee Payment Received',
    description: 'A payment was successfully processed.',
    time: '15m ago',
    icon: '💰',
    color: '#00C9A7',
  },
  {
    name: 'Student Admission Approved',
    description: 'A new student has been enrolled.',
    time: '10m ago',
    icon: '🎓',
    color: '#28A745',
  },
  {
    name: 'New Complaint Filed',
    description: 'A complaint has been registered.',
    time: '5m ago',
    icon: '📝',
    color: '#FF3D71',
  },
  {
    name: 'New Notice Published',
    description: 'A new holiday or event notice is available.',
    time: '2m ago',
    icon: '📢',
    color: '#1E86FF',
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        // light styles
        '[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex items-center  text-lg font-medium dark:text-white whitespace-pre">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="text-xs text-gray-500">
              . {}
              {time}
            </span>
          </figcaption>

          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

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
            <span>✨ Key Feature of this Cloud CRM</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>
      <div className="md:mx-5 flex grid-cols-3 flex-col gap-10 p-2 md:grid">
        <div className="row-start-1 row-end-4 rounded-lg h-[500px] overflow-hidden">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            className="p-4 lg:p-6 lg:rounded-3xl"
            gradientColor="rgba(59,130,246,0.1)"
          >
            <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
              Real-time Notifications
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-3 mb-3">
              Get Instant Update{' '}
            </p>
            <AnimatedList className="">
              {notifications.map((item, idx) => (
                <AnimatedListItem>
                  <Notification {...item} key={idx} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </MagicCard>
        </div>
        {/* <div className="max-sm:hidden bg-gradient-to-tb row-start-1 row-end-4 animate-pulse rounded-2xl border ">
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl border px-40 pb-40 pt-8 md:pb-60 md:shadow-xl ">
            <Globe className="-top-36 z-50" />

            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
            <span className="pointer-events-none absolute bottom-10 whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
              Track Globe
            </span>
          </div>
        </div> */}
        <div className="max-sm:hidden bg-gradient-to-tb row-start-1 row-end-4 animate-pulse rounded-2xl border ">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            className="p-4 lg:p-6 lg:rounded-3xl"
            gradientColor="rgba(59,130,246,0.1)"
          >
            <Globe className="-top-36 z-50" />
          </MagicCard>
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
