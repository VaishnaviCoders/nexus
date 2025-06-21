'use client';

import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from './sidebar-toggle';
import { Menu } from './menu';
import { OrganizationSwitcher } from '@clerk/nextjs';
import type { Role } from '@/lib/generated/prisma';

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
        {/* Organization Switcher Header - Fixed */}
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

        {/* Role Badge - Only show when expanded */}
        {/* <div
          className={cn(
            'flex-shrink-0 px-4 py-2 transition-all duration-300',
            !getOpenState() && 'opacity-0 h-0 py-0 overflow-hidden'
          )}
        >
          <div className="px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide text-center">
              {role}
            </p>
          </div>
        </div> */}

        {/* Menu Content - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <Menu isOpen={getOpenState()} role={role} />
        </div>
      </div>
    </aside>
  );
}
