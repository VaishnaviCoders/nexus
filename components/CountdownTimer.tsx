'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  targetDate: Date;
  className?: string;
};

const CountdownTimer = ({ targetDate, className }: Props) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction

  // Memoize tickSound to prevent recreation on every render
  const tickSound = useMemo(() => {
    return typeof Audio !== 'undefined'
      ? new Audio('/audio/clockTicking.mp3')
      : null;
  }, []);

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days: days > 99 ? 99 : days, hours, minutes, seconds };
  };

  // Handle sound toggle and mark user interaction
  const handleSoundToggle = () => {
    setIsSoundEnabled(!isSoundEnabled);
    setHasInteracted(true); // Mark that the user has interacted
  };

  useEffect(() => {
    // Set initial time immediately upon mount
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Only attempt to play sound if user has interacted and sound is enabled
      if (
        isSoundEnabled &&
        hasInteracted &&
        tickSound &&
        !isPlaying &&
        (newTimeLeft.days > 0 ||
          newTimeLeft.hours > 0 ||
          newTimeLeft.minutes > 0 ||
          newTimeLeft.seconds > 0)
      ) {
        setIsPlaying(true);
        tickSound.currentTime = 0;
        tickSound
          .play()
          .then(() => {
            setIsPlaying(false); // Reset when playback completes
          })
          .catch((error) => {
            console.error('Error playing tick sound:', error);
            setIsPlaying(false); // Reset on error
          });
      }

      // Stop interval if time is up
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (tickSound && !tickSound.paused) {
        tickSound.pause();
        tickSound.currentTime = 0;
      }
    };
  }, [isSoundEnabled, hasInteracted, tickSound]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const splitDigits = (num: number) => {
    const formatted = formatNumber(num);
    return [formatted.charAt(0), formatted.charAt(1)];
  };

  const [days1, days2] = splitDigits(timeLeft.days);
  const [hours1, hours2] = splitDigits(timeLeft.hours);
  const [minutes1, minutes2] = splitDigits(timeLeft.minutes);
  const [seconds1, seconds2] = splitDigits(timeLeft.seconds);

  return (
    <div className={cn('text-center', className)}>
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Days</p>
          <div className="flex justify-center gap-1">
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {days1}
            </div>
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {days2}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Hours</p>
          <div className="flex justify-center gap-1">
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {hours1}
            </div>
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {hours2}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Minutes</p>
          <div className="flex justify-center gap-1">
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {minutes1}
            </div>
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {minutes2}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Seconds</p>
          <div className="flex justify-center gap-1">
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {seconds1}
            </div>
            <div className="bg-neutral-800/5 dark:bg-secondary w-10 h-12 flex items-center justify-center rounded text-xl">
              {seconds2}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSoundToggle}
        className="mt-4 px-4 py-2 bg-neutral-800/10 dark:bg-secondary rounded text-sm"
      >
        {isSoundEnabled ? 'Mute Sound' : 'Enable Sound'}
      </button>
    </div>
  );
};

export default CountdownTimer;
