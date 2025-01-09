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
          Smart Solutions That Make Your School Life Easier
        </h1>
        <p className="max-w-lg mx-auto mt-6 text-center text-neutral-500">
          Unlock a New Era of Learning: Experience the Power of Our Cutting-Edge
          Features Designed for Seamless School Management!
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
                  Manage, track, and convert leads efficiently with our
                  all-in-one lead management system.
                </p>
              </div>
              <div className="flex flex-col text-center justify-center items-center  max-sm:items-start">
                <IconsDiv icon={Zap} />
                <h1 className="mt-5 text-base font-medium dark:text-neutral-100">
                  Teacher / Member Management
                </h1>
                <p className="max-w-xs mt-2 text-sm text-muted-foreground text-start md:text-center">
                  Handle teacher and member records, from attendance to salary
                  management, with ease.
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
                  Get detailed insights into student performance, attendance,
                  and progress for improved decision-making.
                </p>
              </div>
              <div className="flex flex-col text-center justify-center items-center  max-sm:items-start">
                <IconsDiv icon={Webhook} />
                <h1 className="mt-5 text-base font-medium dark:text-neutral-100">
                  Seamless Integration
                </h1>
                <p className="max-w-xs mt-2 text-sm text-muted-foreground text-start md:text-center">
                  Effortlessly connect and integrate with your existing tools
                  for a seamless workflow experience.
                </p>
              </div>
            </div>
          </div>
          <div className="bottom-0 flex items-center w-full mt-20 pb- justify-evenly lg:mt-auto">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-medium text-transparent md:text-4xl bg-gradient-to-b from-neutral-50 to-neutral-600 bg-clip-text">
                5+
              </h3>
              <span className="text-sm text-muted-foreground">
                Organizations
              </span>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-medium text-transparent md:text-4xl bg-gradient-to-b from-neutral-50 to-neutral-600 bg-clip-text">
                21.2k
              </h3>
              <span className="text-sm text-muted-foreground">
                Active Users
              </span>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-medium text-transparent md:text-4xl bg-gradient-to-b from-neutral-50 to-neutral-600 bg-clip-text">
                10.5k
              </h3>
              <span className="text-sm text-muted-foreground">Projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
