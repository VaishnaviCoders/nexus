'use client';

import { useState, useRef, type JSXElementConstructor } from 'react';
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from '@knocklabs/react';
import '@knocklabs/react/dist/index.css';
import { useUser } from '@clerk/nextjs';

// Type assertion for Knock components
const TypedNotificationIconButton =
  NotificationIconButton as JSXElementConstructor<any>;
const TypedNotificationFeedPopover =
  NotificationFeedPopover as JSXElementConstructor<any>;

const NotificationFeed = () => {
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
          <TypedNotificationIconButton
            ref={notifButtonRef}
            onClick={() => setIsVisible(!isVisible)}
          />
          <TypedNotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default NotificationFeed;
