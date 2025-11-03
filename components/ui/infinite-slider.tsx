'use client';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use ResizeObserver to track dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let controls;
    const size =
      direction === 'horizontal' ? dimensions.width : dimensions.height;

    // Only start animation when we have valid dimensions
    if (size > 0) {
      const contentSize = size + gap;
      const from = reverse ? -contentSize / 2 : 0;
      const to = reverse ? 0 : -contentSize / 2;

      const distanceToTravel = Math.abs(to - from);
      const duration = distanceToTravel / currentSpeed;

      if (isTransitioning) {
        const remainingDistance = Math.abs(translation.get() - to);
        const transitionDuration = remainingDistance / currentSpeed;

        controls = animate(translation, [translation.get(), to], {
          ease: 'linear',
          duration: transitionDuration,
          onComplete: () => {
            setIsTransitioning(false);
            setKey((prevKey) => prevKey + 1);
          },
        });
      } else {
        controls = animate(translation, [from, to], {
          ease: 'linear',
          duration: duration,
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 0,
          onRepeat: () => {
            translation.set(from);
          },
        });
      }
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentSpeed,
    dimensions.width,
    dimensions.height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speedOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speed);
        },
      }
    : {};

  return (
    <div className={cn('overflow-visible py-2', className)}>
      {' '}
      {/* Changed to overflow-visible and added padding */}
      <motion.div
        className="flex w-max items-center"
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={containerRef}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
