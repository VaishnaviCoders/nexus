'use client';

import Link from 'next/link';
import { Ellipsis, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { memo, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { roleMenus } from '@/lib/menu-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { CollapseMenuButton } from './collapse-menu-button';
import { SignOutButton } from '@clerk/nextjs';
import { NotificationBadge } from './notification-badge';
interface MenuProps {
  isOpen?: boolean;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
}

// Memoized menu item component for better performance
const MenuItem = memo(
  ({
    href,
    label,
    icon: Icon,
    active,
    isOpen,
    pathname,
  }: {
    href: string;
    label: string;
    icon: any;
    active?: boolean;
    isOpen?: boolean;
    pathname: string;
  }) => {
    const isActive =
      (active === undefined && pathname.startsWith(href)) || active;

    return (
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full h-10 transition-all duration-150 ease-out group relative',
                'hover:bg-blue-50/80 dark:hover:bg-blue-950/30',
                isActive
                  ? [
                      'bg-blue-100/80 dark:bg-blue-900/40',
                      'text-blue-700 dark:text-blue-300',
                      'border border-blue-200/50 dark:border-blue-700/30',
                      'font-medium shadow-sm',
                    ]
                  : [
                      'text-slate-700 dark:text-slate-300',
                      'hover:text-blue-700 dark:hover:text-blue-300',
                    ],
                'justify-start',
                !isOpen && 'px-0'
              )}
              asChild
            >
              <Link href={href.startsWith('/') ? href : `/${href}`}>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                )}

                <div
                  className={cn(
                    'flex items-center w-full transition-all duration-150',
                    !isOpen ? 'justify-center' : 'justify-start gap-3 pl-2'
                  )}
                >
                  <div className="flex items-center justify-center w-5 h-5 flex-shrink-0 relative">
                    <Icon
                      size={18}
                      className="transition-transform duration-150 group-hover:scale-105"
                    />
                    {/* {!isOpen && (
                      <NotificationBadge label={label} isOpen={false} />
                    )} */}
                  </div>

                  {isOpen && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="font-medium truncate">{label}</span>
                      {/* <NotificationBadge label={label} isOpen={true} /> */}
                    </div>
                  )}
                </div>
              </Link>
            </Button>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right" className="font-medium">
              <div className="flex items-center gap-2">
                {label}
                <NotificationBadge label={label} isOpen={true} />
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }
);

MenuItem.displayName = 'MenuItem';

// Memoized group label component
const GroupLabel = memo(
  ({ groupLabel, isOpen }: { groupLabel: string; isOpen?: boolean }) => {
    if ((isOpen && groupLabel) || isOpen === undefined) {
      return (
        <div className="px-2 py-3 mt-4 first:mt-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {groupLabel}
          </p>
        </div>
      );
    }

    if (!isOpen && isOpen !== undefined && groupLabel) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className="w-full">
              <div className="flex justify-center py-2 mt-4 first:mt-2">
                <div className="p-1 rounded-md bg-slate-200/50 dark:bg-slate-700/50">
                  <Ellipsis className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {groupLabel}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return null;
  }
);

GroupLabel.displayName = 'GroupLabel';

export function Menu({ isOpen, role }: MenuProps) {
  const pathname = usePathname();
  const menuList = roleMenus[role] || [];
  // const { fetchNotifications } = useNotifications();

  // Fetch notifications on mount
  // useEffect(() => {
  //   fetchNotifications();
  // }, [fetchNotifications]);

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Menu Items */}
      <ScrollArea className="flex-1 px-3">
        <nav className="py-2">
          <ul className="space-y-1 pb-20">
            {' '}
            {/* Add extra padding at bottom to ensure all items are visible */}
            {menuList.map(({ groupLabel, menus }, index) => (
              <li key={index} className="space-y-1">
                <GroupLabel groupLabel={groupLabel} isOpen={isOpen} />

                {/* Menu Items */}
                <div className="space-y-1">
                  {menus.map(
                    (
                      { href, label, icon: Icon, active, submenus },
                      menuIndex
                    ) =>
                      !submenus || submenus.length === 0 ? (
                        <MenuItem
                          key={menuIndex}
                          href={href}
                          label={label}
                          icon={Icon}
                          active={active}
                          isOpen={isOpen}
                          pathname={pathname}
                        />
                      ) : (
                        <div key={menuIndex}>
                          <CollapseMenuButton
                            icon={Icon}
                            label={label}
                            active={
                              active === undefined
                                ? pathname.startsWith(href)
                                : active
                            }
                            submenus={submenus}
                            isOpen={isOpen}
                          />
                        </div>
                      )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* Fixed Sign Out Button at Bottom */}
      <div className="flex-shrink-0 p-3 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <SignOutButton redirectUrl="/">
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-10 transition-all duration-150 ease-out group',
                    'bg-red-50/80 dark:bg-red-950/20',
                    'border-red-200/60 dark:border-red-800/40',
                    'hover:bg-red-100/80 dark:hover:bg-red-900/30',
                    'hover:border-red-300/60 dark:hover:border-red-700/40',
                    'text-red-700 dark:text-red-300',
                    'justify-start',
                    !isOpen && 'px-0'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center transition-all duration-150',
                      !isOpen
                        ? 'justify-center w-full'
                        : 'justify-start gap-3 pl-2'
                    )}
                  >
                    <LogOut
                      size={18}
                      className="transition-transform duration-150 group-hover:scale-105 flex-shrink-0"
                    />
                    <span
                      className={cn(
                        'font-medium transition-all duration-200 ease-out',
                        !isOpen && 'opacity-0 w-0 overflow-hidden'
                      )}
                    >
                      Sign out
                    </span>
                  </div>
                </Button>
              </SignOutButton>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right" className="font-medium">
                Sign out
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
