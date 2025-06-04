import { ModeToggle } from '@/components/mode-toggle';
import { SheetMenu } from '@/components/dashboard-layout/sheet-menu';
import { Separator } from '@/components/ui/separator';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import React, { Suspense } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { WelcomeMessage } from './dashboard-layout/WelcomeMessage';
import { syncUserAsync } from '@/lib/syncUser';
import NotificationFeed from '@/app/components/dashboardComponents/NotificationFeed';
import { Bell } from 'lucide-react';

// Static loading components for better performance
const LoadingBell = () => <Bell className="h-5 w-5 text-muted-foreground" />;
const LoadingUserButton = () => (
  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
);

export async function Navbar() {
  // Get auth data first (faster than currentUser)
  const { orgId, orgRole, sessionClaims, userId } = await auth();

  // Early return if not authenticated
  if (!userId || !orgId || !orgRole) {
    return (
      <header className="flex h-16 shrink-0 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <SheetMenu />
          <h1 className="text-lg font-bold">Welcome Guest</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <SignInButton mode="modal">
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Sign In
            </button>
          </SignInButton>
        </div>
      </header>
    );
  }

  // Get user data only when needed and run sync in background
  const user = await currentUser();

  // Background sync - don't block rendering
  if (user) {
    // Fire and forget - runs in background
    syncUserAsync(user, orgId, orgRole).catch(console.error);
  }

  const firstName = user?.firstName ?? 'Guest';
  const lastVisit = user?.lastSignInAt ? new Date(user.lastSignInAt) : null;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <SheetMenu />
          <div className="flex space-x-2 items-center">
            <h1 className="text-lg font-bold flex items-center">
              Welcome {firstName}
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

          <SignedIn>
            {/* Lazy load notifications */}
            <Suspense fallback={<LoadingBell />}>
              <NotificationFeed />
            </Suspense>

            {/* Lazy load user button */}
            <Suspense fallback={<LoadingUserButton />}>
              <UserButton />
            </Suspense>
          </SignedIn>
        </div>
      </header>

      <Separator orientation="horizontal" className="my-1" />

      {/* Lazy load welcome message */}
      <Suspense
        fallback={<div className="h-12 animate-pulse bg-muted rounded" />}
      >
        <WelcomeMessage userName={firstName} lastVisit={lastVisit} />
      </Suspense>
    </>
  );
}
