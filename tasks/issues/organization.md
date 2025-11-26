Im using nextjs 15 with prisma , and clerk auth , my problem is we are using multitenant software and managing organizations so please fix this issue ?give me proper solution

'use client';

import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from './sidebar-toggle';
import { Menu } from './menu';
import { OrganizationSwitcher } from '@clerk/nextjs';
import type { Role } from '@/generated/prisma/enums';

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out',
        'bg-white/95 dark:bg-slate-900/95',
        'border-r border-slate-200/80 dark:border-slate-700/80',
        'shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50',
        'backdrop-blur-md',
        '-translate-x-full lg:translate-x-0',
        !getOpenState() ? 'w-[90px]' : 'w-72',
        settings.disabled && 'hidden'
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />

      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col overflow-hidden"
      >
        {/_ Organization Switcher Header - Fixed _/}
        <div className="flex-shrink-0 p-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <Button
            className={cn(
              'w-full transition-all duration-300 ease-in-out',
              'bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
              'border border-slate-200/60 dark:border-slate-700/60',
              'hover:border-slate-300/80 dark:hover:border-slate-600/80',
              'shadow-sm hover:shadow-md'
            )}
            variant="ghost"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <OrganizationSwitcher
                hidePersonal={true}
                appearance={{
                  elements: {
                    organizationSwitcherTrigger: {
                      width: '100%',
                      padding: '0',
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: getOpenState() ? 'flex-start' : 'center',
                      gap: '12px',
                      color: 'black',
                      '@media (prefers-color-scheme: dark)': {
                        color: 'white',
                      },
                    },
                    organizationPreviewMainIdentifier: cn(
                      'text-slate-700 dark:text-white font-semibold text-sm transition-all duration-300',
                      !getOpenState() && 'hidden' // ✅ hide org name when collapsed
                    ),
                    organizationSwitcherTriggerIcon: cn(
                      'text-slate-600 dark:text-white',
                      !getOpenState() && 'hidden' // ✅ hide caret icon when collapsed
                    ),
                    organizationPreviewSecondaryIdentifier: {
                      fontSize: '12px',
                      fontWeight: '400',
                      color: 'gray',
                      '@media (prefers-color-scheme: dark)': {
                        color: '#ccc',
                      },
                    },
                    organizationSwitcherTrigger__hover: {
                      background: 'rgba(59, 130, 246, 0.1)',
                    },
                    organizationSwitcherPopoverActionButton__createOrganization:
                      {
                        display: 'none',
                      },
                    organizationSwitcherPopoverActionButton__manageOrganization:
                      {
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                      },
                  },
                }}
              />
            </Link>
          </Button>
        </div>

        {/_ Menu Content - Scrollable _/}
        <div className="flex-1 overflow-hidden">
          <Menu isOpen={getOpenState()} role={role} />
        </div>
      </div>
    </aside>
  );
}

if ive invite user he wont able to to use this app due he have to select organization first then he can use ? but sometimes sidebar close in mobile then touch join button or select org ? also user confuse why dashboard showing empty is very big issue in my software

The real problem isn’t your <OrganizationSwitcher /> styling, it’s your multi-tenant onboarding flow with Clerk.
By default, Clerk’s OrganizationSwitcher requires a selected org for any organization-based data, but if a user is invited or signs up without joining an org, they get stuck in "No organization selected" mode — which makes your dashboard look broken/empty.

# User / Organization Onboarding Issues

User not invited and does not belong to any organization

User invited in Clerk but no user record in DB

User exists in DB but missing in Clerk (no clerkId)

User has organization in DB but not linked in Clerk membership

User has organization membership in Clerk but missing organizationId in DB

Organization exists in DB but missing in Clerk

Organization exists in Clerk but missing or inactive in DB (isActive = false)

User belongs to an inactive organization (isActive = false)

User belongs to an unpaid or expired plan organization (isPaid = false or planExpiresAt expired)

User is member of multiple organizations but no active organization selected

User has role mismatch between Clerk and DB

User role missing or not assigned in DB

User role requires linked data (teacher without subjects, parent without linked students)

Organization slug or identifier mismatch between Clerk and DB

User session expired or revoked in Clerk but still active in DB

AcademicYear missing or inactive for the user’s organization

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Make sure that the `/api/webhooks/(.*)` route is not protected here

/_ ───────────────────────── 1. Route groups ────────────────────────── _/
// Each matcher covers one “role island”.
const isStudent = createRouteMatcher([
  '/dashboard/fees/student(.*)',
  '/dashboard/assignments(.*)',
  '/dashboard/my-attendance(.*)',
  '/dashboard/documents',
  // Add other student routes here
]);

const isParent = createRouteMatcher([
  '/dashboard/fees/parent(.*)',
  '/dashboard/my-children(.*)',
  '/dashboard/child-attendance(.*)',
  // Add other parent routes here
]);

const isTeacher = createRouteMatcher([
  '/dashboard/fees/teacher(.*)',
  // '/dashboard/fees/admin/assign',
  // '/dashboard/attendance/mark(.*)',
  // '/dashboard/grades(.*)',
  // '/dashboard/holidays(.*)',
  // Add other teacher routes here
]);

const isAdmin = createRouteMatcher([
  '/dashboard/fees/admin(._)',
  // '/dashboard/admin(._)',
  // '/dashboard/grades(._)',
  // '/dashboard/holidays(._)',
  // '/dashboard/documents/verification(.\*)',

  // '/dashboard/notices/create'
  // Add any other admin routes here
]);

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  if (isStudent(req)) await auth.protect({ role: 'student' }); // 404 if wrong role
  if (isParent(req)) await auth.protect({ role: 'parent' });
  if (isTeacher(req)) await auth.protect({ role: 'teacher' });
  if (isAdmin(req)) await auth.protect({ role: 'admin' });
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};

This is my current middleware and also ive setup webhook but I want complete flow

```
└── 📁app
    └── 📁(website)
        └── 📁blogs
            ├── page.tsx
        └── 📁features
            └── 📁role-based
                ├── page.tsx
            ├── page.tsx
        └── 📁founder
            ├── page.tsx
        └── 📁why-shiksha
            ├── page.tsx
        └── 📁why-us
            ├── page.tsx
        ├── page.tsx
    └── 📁api
        └── 📁grade
            ├── route.ts
        └── 📁inngest
            ├── functions.ts
            ├── route.ts
        └── 📁phonepay-callback
            └── 📁[transactionId]
                ├── route.ts
        └── 📁section
            └── 📁[gradeId]
                ├── route.ts
        └── 📁uploadthing
            ├── core.ts
            ├── route.ts
        └── 📁webhooks
            └── 📁clerk
                ├── route.ts


        ├── layout.tsx
        ├── page.tsx
    └── 📁select-organization
        └── 📁[[...select-organization]]
            ├── page.tsx
    └── 📁support
        ├── page.tsx
    ├── actions.ts
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    ├── manifest.ts
    ├── not-found.tsx
    ├── notification-feed-overrides.css
    ├── robots.ts
    ├── sitemap.ts
    └── unauthorized.tsx
```

I have create file in (website)/page.tsx
      <header className="flex items-center justify-between my-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-green-400" />
          <h1 className="text-primary font-medium">Shiksha Cloud</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/_ <ModeToggle /> _/}

          <SignedOut>
            <SignInButton forceRedirectUrl={'/dashboard'}>
              <Button
                variant="outline"
                className="text-blue-500 hover:text-blue-600 border-blue-500/20 shadow-none"
              >
                <UserCircleIcon />
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button variant="outline" className="z-10" size={'sm'}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </header>

import BreadCrumbNavigation from '@/components/BreadCrumbNavigation';
import AdminPanelLayout from '@/components/dashboard-layout/dashboard-panel-layout';
import { Navbar } from '@/components/navbar';
import { RedirectToSignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgRole } = await auth();
  if (!userId) return <RedirectToSignIn />;

  const roleMap: Record<string, 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';

  return (
    <AdminPanelLayout role={role}>
      <Navbar />
      <BreadCrumbNavigation />
      <div className="px-0 sm:px-4">{children}</div>
    </AdminPanelLayout>
  );
}

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
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { WelcomeMessage } from './dashboard-layout/WelcomeMessage';
import NotificationFeed from '@/app/components/dashboardComponents/NotificationFeed';
import { Bell, Building2, UserCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { syncUser } from '@/lib/syncUser';
import prisma from '@/lib/db';

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
      className={`text-xs  ${config?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
    >
      {config?.display || role}
    </Badge>
  );
};

export async function Navbar() {
  try {
    // Get auth data
    const { orgId, orgRole, userId } = await auth();

    if (!orgId) throw new Error('No organization ID found');
    if (!orgRole) throw new Error('No organization role found');
    if (!userId) throw new Error('No user ID found');

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
            {/_ Left section _/}
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

            {/_ Center section - Organization switcher _/}
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

            {/_ Right section _/}
            <div className="ml-auto flex items-center space-x-3">
              {/_ <ModeToggle /> _/}

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
                  {/_ Notifications _/}
                  <Suspense fallback={<LoadingBell />}>
                    <NotificationFeed />
                  </Suspense>

                  {/_ User button _/}
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

        {/_ Welcome message section _/}
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

This i navbar But i dont want this i want proper clean flow

All Sync Conditions Covered:
✅ User exists in Clerk but not in Database → Creates new user
✅ User exists in Database but missing clerkId → Links existing user account
✅ User data out of sync → Updates email, name, image, status
✅ Organization exists in Clerk but not in Database → Creates new organization
✅ Organization data out of sync → Updates name, logo, status
✅ User has organizationId in DB but no Clerk membership → Removes invalid org link
✅ User has Clerk membership but no DB organizationId → Links user to organization
✅ User role mismatch between systems → Syncs roles properly
✅ Role transitions → Creates/updates teacher/student/parent records
✅ Orphaned data cleanup → Removes invalid references
✅ Smart role detection → Auto-detects roles from email patterns
✅ Multiple organization handling → Handles users without active org selection
