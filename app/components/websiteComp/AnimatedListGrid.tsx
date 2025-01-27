'use client';

import { AnimatedList } from '@/components/ui/animated-list';
import { cn } from '@/lib/utils';

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
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
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

export function AnimatedListGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex h-full max-h-[500px] w-full flex-col overflow-hidden rounded-lg bg-transparent md:shadow-xl',
        className
      )}
    >
      {' '}
      <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
        Real-time Notifications
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-3 mb-3">
        Get Instant Update{' '}
      </p>
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
