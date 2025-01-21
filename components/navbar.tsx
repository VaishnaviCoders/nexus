import { ModeToggle } from '@/components/mode-toggle';
import { SheetMenu } from '@/components/dashboard-layout/sheet-menu';

import { Separator } from '@/components/ui/separator';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import React from 'react';
import BreadCrumbNavigation from './BreadCrumbNavigation';
import { currentUser } from '@clerk/nextjs/server';
import { WelcomeMessage } from './dashboard-layout/WelcomeMessage';
import { ClerkUserComponent } from './ClerkUserComponent';
// import { syncUser } from '@/lib/syncUser';

export async function Navbar() {
  const user = await currentUser();
  // const { orgId, orgRole } = await auth();

  // if (!user || !orgId || !orgRole) {
  //   console.error('User and User Role or Organization ID is missing');
  //   return;
  // }

  // if (user) {
  //   await syncUser(user, orgId, orgRole);
  // }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <SheetMenu />
          <div className="flex flex-col">
            <ClerkUserComponent />
            <BreadCrumbNavigation />
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
