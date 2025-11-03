'use client';

import { useState, useRef, type JSXElementConstructor } from 'react';
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
  NotificationFeed,
} from '@knocklabs/react';
import '@knocklabs/react/dist/index.css';
import { useUser } from '@clerk/nextjs';
import NotificationEmptyState from '@/components/dashboard/shared/notification-empty-state';

const CustomNotificationFeed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  const { user } = useUser();
  if (!user) return null;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY || ''}
      userId={user.id}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID || ''}
      >
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={() => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            EmptyComponent={<NotificationEmptyState />}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default CustomNotificationFeed;
