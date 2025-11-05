'use client';

import React, { useEffect, useState } from 'react';
import FeatureBg from './FeatureBg';

import { cn } from '@/lib/utils';
import {
  Feather,
  LucideIcon,
  Zap,
  Webhook,
  Activity,
  ArrowRightIcon,
} from 'lucide-react';
import FeatureBgWhite from './FeatureBgWhite';
import { useTheme } from 'next-themes';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';

interface IconDivProps {
  icon: LucideIcon;
}
const IconsDiv: React.FC<IconDivProps> = ({ icon: Icon }) => {
  return (
    <div className="group relative w-20 h-20 flex justify-center items-center cursor-pointer">
      <div className="absolute inset-0 bg-red-50 group-hover:bg-red-300 w-20 h-20 blur-lg opacity-35 border-white border-2"></div>

      <div className="border p-4 rounded-lg border-white/10 hover:border-white">
        <Icon className="z-10 text-red-200 hover:text-red-300" size={40} />
      </div>
    </div>
  );
};

const Features = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // If theme is not yet loaded, don't render the background
  if (!mounted) {
    return null;
  }
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return (
    <div className="my-10 p-10">
      <div className="z-10 flex  items-center justify-center">
        <div
          className={cn(
            'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800'
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Nexus Features </span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>

      <div className="relative z-10">
        <h1 className="mt-8 text-2xl font-semibold text-center lg:text-3xl xl:text-4xl">
          {/* Smart Solutions That Make Your School Life Easier */}
          We Solved the Chaos You Face Every Day
        </h1>
        <p className="max-w-lg mx-auto mt-6 text-center text-neutral-500">
          Tired of messy spreadsheets, lost notices, or chasing parents for
          dues? <strong className="gradient-text"> Shiksha.Cloud</strong> turns
          your daily school headaches into smooth, automated workflows.
        </p>

        <p className="text-center text-sm text-muted-foreground mt-4">
          We didn’t just build features. We solved the daily pain points you
          silently put up with — and made your school run smoother than ever.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full h-full mt-8 pb-20   rounded-2xl">
        <div className="opacity-100 transform-none will-change-auto">
          <div className="items-center justify-center hidden w-full lg:flex">
            <div className="relative flex max-w-4xl">
              <div
                className={`absolute h-full pointer-events-none inset-0 flex items-center justify-center  [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] ${
                  currentTheme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-white'
                }`}
              ></div>

              {currentTheme === 'dark' ? <FeatureBg /> : <FeatureBgWhite />}
            </div>
          </div>
        </div>
        <div className="relative inset-0 z-20 flex flex-col items-center justify-center w-full lg:absolute lg:px-20">
          <div className="grid w-full grid-cols-1 gap-10 mt-20 md:grid-cols-2 md:gap-20">
            <div className="flex flex-col items-center justify-start w-full gap-10 md:gap-20 md:justify-center">
              <div className="flex flex-col text-center justify-center items-center max-sm:items-start">
                <IconsDiv icon={Feather} />
                <h1 className="mt-5 text-base font-medium dark:text-neutral-100">
                  Lead Management
                </h1>

                <p className="max-w-xs mt-2 text-sm text-muted-foreground text-start md:text-center">
                  No more scattered inquiry forms or forgotten follow-ups.
                  Easily manage new admission leads from interest to enrollment
                  — all in one place.
                </p>
              </div>
              <div className="flex flex-col text-center justify-center items-center  max-sm:items-start">
                <IconsDiv icon={Zap} />
                <h1 className="mt-5 text-base font-medium dark:text-neutral-100">
                  Teacher / Member Management
                </h1>
                <p className="max-w-xs mt-2 text-sm text-muted-foreground text-start md:text-center">
                  Struggling with staff data, salary logs, or attendance sheets?
                  Now manage everything about your staff — without juggling
                  files or WhatsApp groups.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start w-full gap-10 md:gap-20 md:justify-center">
              <div className="flex flex-col text-center justify-center items-center max-sm:items-start">
                <IconsDiv icon={Activity} />
                <h1 className="mt-5 text-base font-medium dark:text-neutral-100">
                  Student Performance Tracking
                </h1>

                <p className="max-w-xs mt-2 text-sm text-muted-foreground text-start md:text-center">
                  Ever wished you could spot a student's issues before exams?
                  Our dashboard gives early warnings based on attendance, marks
                  & teacher feedback.
                </p>
              </div>
              <div className="flex flex-col text-center justify-center items-center  max-sm:items-start">
                <IconsDiv icon={Webhook} />
                <h1 className="mt-5 text-base font-medium dark:text-neutral-100">
                  Seamless Integration
                </h1>
                <p className="max-w-xs mt-2 text-sm text-muted-foreground text-start md:text-center">
                  Already using other tools? Don’t worry — Nexus plugs into your
                  existing workflow so you don’t start from scratch.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center w-full mt-12 sm:mt-20 pb-4 gap-8 sm:gap-4 justify-evenly lg:mt-auto">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-2xl font-medium text-transparent md:text-4xl bg-gradient-to-b from-neutral-950 dark:from-neutral-50 to-neutral-500 dark:to-neutral-600 bg-clip-text">
                7+
              </h1>
              <span className="text-sm sm:text-xs md:text-sm text-muted-foreground text-center">
                Schools & Coaching Institutes
              </span>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-2xl font-medium text-transparent md:text-4xl bg-gradient-to-b from-neutral-950 dark:from-neutral-50 to-neutral-500 dark:to-neutral-600 bg-clip-text">
                1,760+
              </h1>
              <span className="text-sm sm:text-xs md:text-sm text-muted-foreground text-center">
                Students Tracked Daily
              </span>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-2xl font-medium text-transparent md:text-4xl bg-gradient-to-b from-neutral-950 dark:from-neutral-50 to-neutral-500 dark:to-neutral-600 bg-clip-text">
                ₹8.4L+
              </h1>
              <span className="text-sm sm:text-xs md:text-sm text-muted-foreground text-center">
                Fees Processed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
