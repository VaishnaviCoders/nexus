import { ModeToggle } from '@/components/mode-toggle';
import { SheetMenu } from '@/components/dashboard-layout/sheet-menu';
import { Separator } from '@/components/ui/separator';
import {
  OrganizationList,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import React, { Suspense } from 'react';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { WelcomeMessage } from './dashboard-layout/WelcomeMessage';
// import { syncUserAsync } from '@/lib/syncUser';
import NotificationFeed from '@/app/components/dashboardComponents/NotificationFeed';
import { Bell, UserCircleIcon } from 'lucide-react';
import { syncUserAsync } from '@/lib/syncUser';
import { Button } from './ui/button';
import { syncUserWithOrg } from '@/app/actions';
import { redirect } from 'next/navigation';

import prisma from '@/lib/db';

// Static loading components for better performance
const LoadingBell = () => <Bell className="h-5 w-5 text-muted-foreground" />;
const LoadingUserButton = () => (
  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
);

export async function Navbar() {
  // Get auth data first (faster than currentUser)
  const { orgId, orgRole, sessionClaims, userId } = await auth();

  const user = await currentUser();
  const client = await clerkClient();

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

  // if (!orgId) {
  //   throw new Error('Organization not found in DB');
  // }

  // if (!userId || !orgId || !orgRole) {
  //   console.warn('Missing user/org data from Clerk', {
  //     userId,
  //     orgId,
  //     orgRole,
  //   });
  //   redirect('/create-organization');
  // }

  // const clerkOrg = await client.organizations.getOrganization({
  //   organizationId: orgId,
  // }); // or from session

  // let dbOrg = await prisma.organization.findUnique({
  //   where: { id: clerkOrg.id },
  // });

  // if (!dbOrg) {
  //   // Optional: Only do this in dev
  //   if (process.env.NODE_ENV === 'development') {
  //     dbOrg = await prisma.organization.create({
  //       data: {
  //         id: clerkOrg.id,
  //         name: clerkOrg.name,
  //         organizationSlug: clerkOrg.slug || '',
  //         isActive: true,
  //       },
  //     });
  //     console.log('✅ Dev org created:', dbOrg);
  //   } else {
  //     throw new Error('Invalid organization: ' + clerkOrg.id);
  //   }
  // }

  // Background sync - don't block rendering
  // if (user) {
  //   // Fire and forget - runs in background
  //   syncUserAsync(user, orgId, orgRole).catch(console.error);
  // }

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
            <SignInButton>
              <Button className="text-blue-500 hover:text-blue-600 border-blue-500/20 shadow-none">
                <UserCircleIcon />
                Sign In
              </Button>
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
