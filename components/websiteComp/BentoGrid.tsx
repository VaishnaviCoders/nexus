import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  ArrowRightIcon,
  Bell,
  CreditCard,
  Feather,
  Sparkles,
  Workflow,
} from 'lucide-react';
import React from 'react';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { Globe } from '@/components/ui/globe';
import { AnimatedBeamMultipleOutput } from './AnimatedBeamMultipleOutput';
// import Image from 'next/image';

// import RealTimeImage from '@/public/images/feature-four.svg';
import { MagicCard } from '@/components/ui/magic-card';
import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-list';
import { Compare } from '@/components/ui/compare';
import DisplayCards from '../ui/display-cards';
import { LucideIcon } from 'lucide-react';
import { WhatsAppIcon } from '@/public/icons/WhatsAppIcon';

// Get Instant Notification
// Get all Data form All Platform In place
// Track Student All Data
// Manage Teacher Salary and Track Work Record
// Track Students Onboarding in Animated Globe
// Automated Fee Tracking & Payment Reminders
// Lead Management for school collages

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
          className="flex size-5 lg:size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex items-center  text-lg font-medium dark:text-white whitespace-pre">
            <span className="text-sm lg:text-lg">{name}</span>
            <span className="text-xs text-gray-500">
              . {}
              {time}
            </span>
          </figcaption>

          <p className="text-xs lg:text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: 'Featured',
    description: 'Discover amazing content',
    date: 'Just now',
    iconClassName: 'text-pink-500',
    titleClassName: 'text-pink-500',
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: 'Popular',
    description: 'Trending this week',
    date: '2 days ago',
    iconClassName: 'text-red-500',
    titleClassName: 'text-red-500',
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

// Reusable Card Header Component
const CardHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className="mb-6">
    <div className="flex items-start gap-3 mb-3">
      {/*
                  <div className="h-10 w-10 rounded-lg bg-sky-500/10 ring-1 ring-sky-400/30 flex items-center justify-center text-sky-400"> */}
      <div className="mt-0.5 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
        <Icon className="size-5 text-blue-500" />
      </div>
      <div className="flex-1">
        <h2 className="text-sm lg:text-xl font-semibold tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-xs lg:text-sm /70 leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="h-px bg-white/10" />
  </div>
);
const BentoGrid = () => {
  return (
    <>
      <div className="mx-5 mb-5 mt-20 flex text-center">
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
      <div className="mx-auto grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-3 ">
        {/* 1st col – tall card (notifications) */}
        <div className="md:col-span-1 md:row-span-2 h-[520px] overflow-hidden ">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="h-[520px] p-4 lg:p-6"
          >
            <CardHeader
              icon={Bell}
              title="Real-time Notifications"
              description="Stay updated with instant alerts for payments, admissions, attendance, complaints, and announcements—all in one place."
            />

            <AnimatedList className="">
              {notifications.map((item, idx) => (
                <AnimatedListItem>
                  <Notification {...item} key={idx} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </MagicCard>
        </div>

        {/* 2nd col – globe (hidden on small screens) */}
        <div className="md:col-span-1 md:row-span-2">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="p-4 lg:p-6"
          >
            <CardHeader
              icon={ArrowLeftRight}
              title="Transform Your Workflow"
              description="See the difference between manual chaos and automated efficiency. Watch how teachers save 2.5+ hours daily with digital tools."
            />
            <div className="flex items-center justify-center">
              <Compare
                firstImage="/images/compare-one.png"
                secondImage="/images/compare-two.png"
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="h-[370px] w-[470px] "
                slideMode="hover"
                autoplay={true}
              />
            </div>
          </MagicCard>
        </div>

        {/* 3rd col – animated beam */}
        <div className="md:col-span-1 md:row-span-2">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="h-full p-4 lg:p-6"
          >
            <CardHeader
              icon={Workflow}
              title="Smart Lead Management"
              description="Automatically capture and track leads from Google Forms, Facebook, Instagram, and WhatsApp—all flowing into your CRM dashboard."
            />
            <AnimatedBeamMultipleOutput />
          </MagicCard>
        </div>

        {/* 4th col – DisplayCardsDemo (spans 1 row) */}
        <div className="md:col-span-1 ">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            className="p-4 lg:p-6 lg:rounded-3xl  row-start-4 row-end-6 rounded-2xl border "
            gradientColor="rgba(59,130,246,0.1)"
          >
            <CardHeader
              icon={Sparkles}
              title="Continuous Innovation"
              description="We keep adding powerful features based on real feedback from educators like you. Your needs shape our roadmap."
            />
            <div className="overflow-hidden">
              <DisplayCards cards={defaultCards} />
            </div>
          </MagicCard>
        </div>

        {/* 5th col – wide footer card (spans 2 cols) */}
        <div className="md:col-span-2">
          <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="p-4 lg:p-6"
          >
            <CardHeader
              icon={CreditCard}
              title="Automated Fee Management"
              description="Watch how smart WhatsApp reminders, instant online payments, and auto-generated receipts make fee collection 3x faster."
            />

            {/* <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-blue-600/20"> */}
            {/* <div className="rounded-[11px] bg-white backdrop-blur-md ring-1 ring-slate-200 p-4 lg:p-6"> */}
            {/* <!-- Animated placeholder --> */}
            <div className="mt-2 h-48 w-full rounded-md bg-slate-50 ring-1 ring-slate-200 relative overflow-hidden">
              {/* <!-- Subtle grid pattern --> */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:22px_22px]"></div>

              {/* <!-- Soft gradient glow --> */}
              <div className="absolute -inset-20 bg-[radial-gradient(60%_40%_at_30%_50%,rgba(56,189,248,0.10),transparent_60%),radial-gradient(60%_40%_at_70%_50%,rgba(59,130,246,0.10),transparent_60%)]"></div>

              {/* <!-- Content: three animated mini-panels to visualize the flow --> */}
              <div className="relative z-10 h-full flex items-center justify-between px-4 sm:px-6">
                {/* <!-- 1) Reminder bubble --> */}
                <div className="relative group">
                  <span className="absolute -left-1 -top-1 h-6 w-6 rounded-full bg-emerald-400/20 animate-ping"></span>
                  <div className="relative w-44 sm:w-52 rounded-lg bg-white ring-1 ring-slate-200 p-3 shadow-sm hover:ring-slate-300 hover:bg-white transition">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[url('https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=120&auto=format&fit=crop')] bg-cover bg-center ring-1 ring-slate-200/70"></div>
                      <div className="h-2 w-24 sm:w-28 rounded bg-slate-200 animate-pulse"></div>
                    </div>
                    <div className="mt-2 h-2 w-28 sm:w-36 rounded bg-slate-200 animate-pulse"></div>
                    <div className="mt-2 flex items-center gap-1.5 text-emerald-600">
                      {/* <!-- lucide: message-circle --> */}
                      <WhatsAppIcon />
                      <span className="text-[11px]">WhatsApp sent</span>
                    </div>
                  </div>
                </div>

                {/* <!-- 2) Processing spinner (conic accent) --> */}
                <div className="relative hidden sm:flex items-center justify-center">
                  <div className="relative h-24 w-24">
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,_#38bdf8,_#3b82f6,_transparent_65%)] opacity-80 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full bg-white ring-1 ring-slate-200"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-sky-600">
                      {/* <!-- lucide: credit-card --> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 drop-shadow-sm"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="20"
                          height="14"
                          x="2"
                          y="5"
                          rx="2"
                          ry="2"
                        />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* <!-- 3) Receipt card --> */}
                <div className="w-44 sm:w-60 rounded-lg bg-white p-3 ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-white transition">
                  <div className="flex items-center gap-2 text-emerald-600">
                    {/* <!-- lucide: check-circle-2 --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span className="text-xs font-medium">
                      Payment received
                    </span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="h-2 w-28 sm:w-36 rounded bg-slate-200 animate-pulse"></div>
                    <div className="h-2 w-24 sm:w-32 rounded bg-slate-200 animate-pulse"></div>
                    <div className="h-2 w-20 sm:w-28 rounded bg-slate-200 animate-pulse"></div>
                    <div className="pt-1">
                      <div className="h-1.5 w-full rounded bg-emerald-100 overflow-hidden ring-1 ring-emerald-200">
                        <div className="h-1.5 w-2/3 rounded bg-emerald-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Bottom divider --> */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            </div>
            {/* </div> */}
            {/* </div> */}
          </MagicCard>
        </div>
      </div>
    </>
  );
};

export default BentoGrid;
