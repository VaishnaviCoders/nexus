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
