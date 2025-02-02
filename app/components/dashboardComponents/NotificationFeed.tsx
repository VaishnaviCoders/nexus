'use client';

import { useState, useRef } from 'react';
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from '@knocklabs/react';

// Required CSS import, unless you're overriding the styling
import '@knocklabs/react/dist/index.css';
// import '../../notification-feed-overrides.css';
import { useUser } from '@clerk/nextjs';

const NotificationFeed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  const { user } = useUser();
  if (!user) return;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY || ''}
      userId={user.id}
    >
      <KnockFeedProvider
        feedId={String(process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID)}
      >
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={() => setIsVisible(!isVisible)}
          />

          {notifButtonRef.current && (
            <NotificationFeedPopover
              buttonRef={notifButtonRef as React.RefObject<HTMLButtonElement>}
              isVisible={isVisible}
              onClose={() => setIsVisible(false)}
            />
          )}
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default NotificationFeed;
