import { ModeToggle } from '@/components/mode-toggle';
import { SheetMenu } from '@/components/dashboard-layout/sheet-menu';

import { Separator } from '@/components/ui/separator';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import React from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { WelcomeMessage } from './dashboard-layout/WelcomeMessage';
import { syncUser } from '@/lib/syncUser';
import NotificationFeed from '@/app/components/dashboardComponents/NotificationFeed';
import { SyncActiveOrganization } from './SyncActiveOrganization';

export async function Navbar() {
  const user = await currentUser();
  const { orgId, orgRole, sessionClaims } = await auth();

  // console.log('Clerk Session Claims', sessionClaims);

  if (!user || !orgId || !orgRole) {
    console.error('User and User Role or Organization ID is missing');
    return;
  }

  if (user) {
    await syncUser(user, orgId, orgRole);
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center px-4">
        <SyncActiveOrganization membership={sessionClaims?.membership} />
        <div className="flex items-center space-x-4 lg:space-x-6">
          <SheetMenu />
          <div className="flex space-x-2 items-center">
            <h1 className="text-lg font-bold flex items-center">
              Welcome {user?.firstName ?? 'Guest'}{' '}
            </h1>
            <span className="hidden text-lg font-bold sm:flex">{orgRole}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <NotificationFeed />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <Separator orientation="horizontal" className="my-1" />
      <WelcomeMessage
        userName={user?.firstName ?? 'Guest'}
        lastVisit={user?.lastSignInAt ? new Date(user.lastSignInAt) : null}
      />
    </>
  );
}
