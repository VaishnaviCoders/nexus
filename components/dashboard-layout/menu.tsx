'use client';

import type React from 'react';

import Link from 'next/link';
import { Ellipsis, LogOut, type LucideIcon, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { memo, useState } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';

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
import { SignOutButton } from '@clerk/nextjs';
import { NotificationBadge } from './notification-badge';

interface MenuProps {
  isOpen?: boolean;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
}

// Enhanced MenuItem with auto-close functionality
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
    icon: LucideIcon;
    active?: boolean;
    isOpen?: boolean;
    pathname: string;
  }) => {
    const sidebar = useStore(useSidebar, (x) => x);
    const isActive =
      (active === undefined && pathname.startsWith(href)) || active;

    const handleClick = () => {
      // Close sidebar on mobile when clicking a link
      if (
        typeof window !== 'undefined' &&
        window.innerWidth < 1024 &&
        sidebar?.isOpen
      ) {
        sidebar.toggleOpen();
      }
    };

    return (
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full h-11 transition-all duration-200 ease-out group relative',
                'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80',
                'dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30',
                isActive
                  ? [
                      'bg-gradient-to-r from-blue-100/80 to-indigo-100/80',
                      'dark:from-blue-900/40 dark:to-indigo-900/40',
                      'text-blue-700 dark:text-blue-300',
                      'border border-blue-200/50 dark:border-blue-700/30',
                      'font-semibold shadow-sm shadow-blue-200/50 dark:shadow-blue-900/50',
                    ]
                  : [
                      'text-slate-700 dark:text-slate-300',
                      'hover:text-blue-700 dark:hover:text-blue-300',
                      'font-medium',
                    ],
                'justify-start',
                !isOpen && 'px-0'
              )}
              asChild
            >
              <Link
                href={href.startsWith('/') ? href : `/${href}`}
                onClick={handleClick}
              >
                {/* Enhanced active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full shadow-sm" />
                )}

                <div
                  className={cn(
                    'flex items-center w-full transition-all duration-200',
                    !isOpen ? 'justify-center' : 'justify-start gap-3 pl-3'
                  )}
                >
                  <div className="flex items-center justify-center w-5 h-5 flex-shrink-0 relative">
                    <Icon
                      size={18}
                      className="transition-all duration-200 group-hover:scale-110"
                    />
                  </div>

                  {isOpen && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{label}</span>
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

// Enhanced Submenu Component
const SubMenu = memo(
  ({
    icon: Icon,
    label,
    submenus,
    isOpen,
    active,
  }: {
    icon: LucideIcon;
    label: string;
    submenus: Array<{ href: string; label: string; active?: boolean }>;
    isOpen?: boolean;
    active?: boolean;
  }) => {
    const [isExpanded, setIsExpanded] = useState(active || false);
    const pathname = usePathname();
    const sidebar = useStore(useSidebar, (x) => x);

    const handleSubmenuClick = () => {
      // Close sidebar on mobile when clicking a submenu link
      if (
        typeof window !== 'undefined' &&
        window.innerWidth < 1024 &&
        sidebar?.isOpen
      ) {
        sidebar.toggleOpen();
      }
    };

    if (!isOpen) {
      // Collapsed state - show as tooltip
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full h-11 px-0 justify-center transition-all duration-200',
                  'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80',
                  'dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30',
                  active &&
                    'bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                )}
              >
                <Icon size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <div className="space-y-1">
                <div className="font-semibold">{label}</div>
                {submenus.map((submenu, index) => (
                  <div
                    key={index}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    {submenu.label}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div className="space-y-1">
        {/* Parent Menu Item */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full h-11 transition-all duration-200 ease-out group relative',
            'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80',
            'dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30',
            'justify-start gap-3 pl-3',
            !isOpen ? 'justify-center' : 'justify-start gap-3 pl-3',
            active
              ? [
                  'bg-gradient-to-r from-blue-100/80 to-indigo-100/80',
                  'dark:from-blue-900/40 dark:to-indigo-900/40',
                  'text-blue-700 dark:text-blue-300',
                  'font-semibold',
                ]
              : 'text-slate-700 dark:text-slate-300 font-medium'
          )}
        >
          {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
          )}

          <Icon
            size={18}
            className="flex-shrink-0 transition-all duration-200 group-hover:scale-110"
          />
          <span className="flex-1 text-left truncate">{label}</span>
          <ChevronDown
            size={16}
            className={cn(
              'transition-transform duration-200 flex-shrink-0',
              isExpanded && 'rotate-180'
            )}
          />
        </Button>

        {/* Submenu Items */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="ml-6 space-y-1 border-l-2 border-slate-200/60 dark:border-slate-700/60 pl-4">
            {submenus.map((submenu, index) => {
              const isSubmenuActive =
                pathname.startsWith(submenu.href) || submenu.active;

              return (
                <Button
                  key={index}
                  variant="ghost"
                  asChild
                  className={cn(
                    'w-full h-9 transition-all duration-200 ease-out group',
                    'hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-indigo-50/60',
                    'dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20',
                    'justify-start pl-3',
                    isSubmenuActive
                      ? [
                          'bg-gradient-to-r from-blue-50/80 to-indigo-50/80',
                          'dark:from-blue-950/30 dark:to-indigo-950/30',
                          'text-blue-600 dark:text-blue-400',
                          'font-medium',
                        ]
                      : 'text-slate-600 dark:text-slate-400 font-normal'
                  )}
                >
                  <Link
                    href={submenu.href}
                    onClick={handleSubmenuClick}
                    className="flex items-center gap-2 w-full"
                  >
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-all duration-200',
                        isSubmenuActive
                          ? 'bg-blue-500 dark:bg-blue-400'
                          : 'bg-slate-400 dark:bg-slate-600 group-hover:bg-blue-400'
                      )}
                    />
                    <span className="truncate">{submenu.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

SubMenu.displayName = 'SubMenu';

// Enhanced Group Label
const GroupLabel = memo(
  ({ groupLabel, isOpen }: { groupLabel: string; isOpen?: boolean }) => {
    if ((isOpen && groupLabel) || isOpen === undefined) {
      return (
        <div className="px-3 py-3 mt-6 first:mt-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {groupLabel}
          </p>
          <div className="mt-2 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 dark:to-transparent" />
        </div>
      );
    }

    if (!isOpen && isOpen !== undefined && groupLabel) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className="w-full">
              <div className="flex justify-center py-3 mt-6 first:mt-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-slate-200/80 to-slate-300/80 dark:from-slate-700/80 dark:to-slate-600/80 shadow-sm">
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

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Menu Items */}
      <ScrollArea className="flex-1 px-3">
        <nav className="py-3">
          <ul className="space-y-1 pb-24">
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
                        <SubMenu
                          key={menuIndex}
                          icon={Icon}
                          label={label}
                          submenus={submenus}
                          isOpen={isOpen}
                          active={
                            active === undefined
                              ? pathname.startsWith(href)
                              : active
                          }
                        />
                      )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* Enhanced Sign Out Button */}
      <div className="flex-shrink-0 p-3 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <SignOutButton redirectUrl="/">
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-11 transition-all duration-200 ease-out group',
                    'bg-gradient-to-r from-red-50/80 to-pink-50/80',
                    'dark:from-red-950/20 dark:to-pink-950/20',
                    'border-red-200/60 dark:border-red-800/40',
                    'hover:from-red-100/80 hover:to-pink-100/80',
                    'dark:hover:from-red-900/30 dark:hover:to-pink-900/30',
                    'hover:border-red-300/60 dark:hover:border-red-700/40',
                    'text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200',
                    'font-semibold shadow-sm hover:shadow-md hover:shadow-red-200/50 dark:hover:shadow-red-900/50',
                    'justify-start',
                    !isOpen && 'px-0'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center transition-all duration-200',
                      !isOpen
                        ? 'justify-center w-full'
                        : 'justify-start gap-3 pl-3'
                    )}
                  >
                    <LogOut
                      size={18}
                      className="transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                    />
                    <span
                      className={cn(
                        'transition-all duration-200 ease-out',
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
