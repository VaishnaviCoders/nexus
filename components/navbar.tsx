import { ModeToggle } from '@/components/mode-toggle';
import { SheetMenu } from '@/components/dashboard-layout/sheet-menu';
import { Separator } from '@/components/ui/separator';
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Suspense } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { WelcomeMessage } from './dashboard-layout/WelcomeMessage';
import NotificationFeed from '@/app/components/dashboardComponents/NotificationFeed';
import { Bell, Building2, UserCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { syncUser } from '@/lib/syncUser';

// Improved loading components
const LoadingBell = () => (
  <div className="relative">
    <Bell className="h-5 w-5 text-muted-foreground animate-pulse" />
  </div>
);

const LoadingUserButton = () => <Skeleton className="h-8 w-8 rounded-full" />;

const LoadingOrgSwitcher = () => <Skeleton className="h-8 w-32 rounded-md" />;

const RoleBadge = ({ role }: { role: string }) => {
  const roleConfig = {
    'org:admin': {
      display: 'ADMIN',
      color: 'bg-green-100 text-green-800 dark:bg-red-900 dark:text-red-200',
    },
    'org:teacher': {
      display: 'TEACHER',
      color:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    'org:student': {
      display: 'STUDENT',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    'org:parent': {
      display: 'PARENT',
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig];

  return (
    <Badge
      variant="secondary"
      className={`text-xs  ${config?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
    >
      {config?.display || role}
    </Badge>
  );
};

export async function Navbar() {
  try {
    // Get auth data
    const { orgId, orgRole, userId } = await auth();

    // If not authenticated, show guest navbar
    if (!userId) {
      return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-4">
              <SheetMenu />
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <Badge variant="outline" className="text-xs">
                  Guest
                </Badge>
              </div>
            </div>

            <div className="ml-auto flex items-center space-x-3">
              <ModeToggle />
              <SignInButton mode="modal">
                <Button size="sm" className="gap-2">
                  <UserCircleIcon className="h-4 w-4" />
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
          <Separator />
        </header>
      );
    }

    // Get user data for authenticated users
    const user = await currentUser();

    const firstName = user?.firstName ?? 'User';
    const lastName = user?.lastName ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    const lastVisit = user?.lastSignInAt ? new Date(user.lastSignInAt) : null;

    return (
      <>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <SheetMenu />

              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold leading-none">
                    Dashboard
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {fullName}
                    </span>
                    {orgRole && <RoleBadge role={orgRole} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Center section - Organization switcher */}
            {!orgId && (
              <div className="flex items-center justify-center flex-1 max-w-md mx-4">
                <Suspense fallback={<LoadingOrgSwitcher />}>
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md border bg-muted/50">
                    <Building2 className="h-4 w-4 text-muted-foreground max-sm:hidden" />
                    <OrganizationSwitcher
                      hidePersonal={true}
                      appearance={{
                        elements: {
                          organizationSwitcherTrigger:
                            'border-0 shadow-none bg-transparent hover:bg-transparent',
                          organizationSwitcherTriggerIcon:
                            'text-muted-foreground',
                        },
                      }}
                    />
                  </div>
                </Suspense>
              </div>
            )}

            {/* Right section */}
            <div className="ml-auto flex items-center space-x-3">
              {/* <ModeToggle /> */}

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <UserCircleIcon className="h-4 w-4" />
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center space-x-2">
                  {/* Notifications */}
                  <Suspense fallback={<LoadingBell />}>
                    <NotificationFeed />
                  </Suspense>

                  {/* User button */}
                  <Suspense fallback={<LoadingUserButton />}>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'h-8 w-8',
                        },
                      }}
                    />
                  </Suspense>
                </div>
              </SignedIn>
            </div>
          </div>
        </header>

        <Separator className="mb-4" />

        {/* Welcome message section */}
        {userId && (
          <div className="px-4 mb-6">
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              }
            >
              <WelcomeMessage userName={firstName} lastVisit={lastVisit} />
            </Suspense>
          </div>
        )}
      </>
    );
  } catch (error) {
    // Error fallback
    console.error('Navbar error:', error);
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <SheetMenu />
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <Badge variant="destructive" className="text-xs">
              Error
            </Badge>
          </div>

          <div className="ml-auto flex items-center space-x-3">
            <ModeToggle />
            <Button variant="outline" size="sm" disabled>
              Reload
            </Button>
          </div>
        </div>
        <Separator />
      </header>
    );
  }
}
