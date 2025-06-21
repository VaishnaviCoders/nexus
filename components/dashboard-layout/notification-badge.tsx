'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  label: string;
  isOpen?: boolean;
}

// Mock function to get notification counts - replace with your actual API call
const getNotificationCount = (label: string): number => {
  const notificationMap: Record<string, number> = {
    'Notice Board': 3,
    Complaints: 1,
    'Teachers Feedback': 5,
    'Class Management': 2,
    // Add more mappings as needed
  };

  return notificationMap[label] || 0;
};

export const NotificationBadge = memo(
  ({ label, isOpen }: NotificationBadgeProps) => {
    const count = getNotificationCount(label);

    if (count === 0) return null;

    return (
      <div
        className={cn(
          'flex items-center justify-center min-w-[18px] h-[18px] rounded-full',
          'bg-blue-500 dark:bg-blue-600 text-white text-xs font-medium',
          'shadow-sm border border-white/20',
          'transition-all duration-150 ease-out ml-auto',

          !isOpen && 'scale-75'
        )}
      >
        <span className="px-1 leading-none">{count > 99 ? '99+' : count}</span>
      </div>
    );
  }
);

NotificationBadge.displayName = 'NotificationBadge';
