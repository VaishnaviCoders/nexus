'use client';

import Link from 'next/link';
import { Ellipsis, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

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
import { CollapseMenuButton } from '../dashboard-layout/collapse-menu-button';

interface MenuProps {
  isOpen?: boolean;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
}

export function Menu({ isOpen, role }: MenuProps) {
  const pathname = usePathname();
  const menuList = roleMenus[role] || [];

  return (
    <ScrollArea className="flex-1 -mx-2">
      <nav className="px-2">
        <ul className="space-y-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li key={index} className="space-y-2">
              {/* Group Label */}
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <div className="px-3 py-2 mt-6 first:mt-0">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600 dark:to-transparent" />
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {groupLabel}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-l from-slate-300 to-transparent dark:from-slate-600 dark:to-transparent" />
                  </div>
                </div>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex justify-center py-2 mt-6 first:mt-0">
                        <div className="p-1.5 rounded-md bg-slate-200/50 dark:bg-slate-700/50">
                          <Ellipsis className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="font-medium text-sm"
                    >
                      {groupLabel}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}

              {/* Menu Items */}
              <div className="space-y-1">
                {menus.map(
                  ({ href, label, icon: Icon, active, submenus }, menuIndex) =>
                    !submenus || submenus.length === 0 ? (
                      <div key={menuIndex}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className={cn(
                                  'w-full h-11 flex items-start justify-start transition-all duration-200 ease-in-out group relative',
                                  'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50',
                                  'dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30',
                                  'hover:shadow-sm hover:scale-[1.02]',
                                  (active === undefined &&
                                    pathname.startsWith(href)) ||
                                    active
                                    ? [
                                        'bg-gradient-to-r from-blue-100 to-indigo-100',
                                        'dark:from-blue-900/40 dark:to-indigo-900/40',
                                        'text-blue-700 dark:text-blue-300',
                                        'shadow-sm border border-blue-200/50 dark:border-blue-700/30',
                                        'font-medium',
                                      ]
                                    : [
                                        'text-slate-700 dark:text-slate-300',
                                        'hover:text-blue-700 dark:hover:text-blue-300',
                                      ],
                                  !isOpen && 'justify-center px-0'
                                )}
                                asChild
                              >
                                <Link
                                  href={
                                    href.startsWith('/') ? href : `/${href}`
                                  }
                                >
                                  {/* Active indicator */}
                                  {((active === undefined &&
                                    pathname.startsWith(href)) ||
                                    active) && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full shadow-sm" />
                                  )}

                                  <div
                                    className={cn(
                                      'flex items-start transition-all duration-200',
                                      !isOpen
                                        ? 'justify-start'
                                        : 'justify-start gap-3'
                                    )}
                                  >
                                    <div className="flex items-center justify-center w-5 h-5">
                                      <Icon
                                        size={18}
                                        className="transition-all duration-200 group-hover:scale-110"
                                      />
                                    </div>

                                    <span
                                      className={cn(
                                        'font-medium transition-all duration-300 ease-in-out',
                                        !isOpen &&
                                          'opacity-0 w-0 overflow-hidden'
                                      )}
                                    >
                                      {label}
                                    </span>
                                  </div>
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            {!isOpen && (
                              <TooltipContent
                                side="right"
                                className="font-medium"
                              >
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
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

          {/* Sign Out Button */}
          <li className="pt-6 mt-auto">
            <div className="px-3 py-2 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
            </div>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <SignOutButton redirectUrl="/">
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full h-11 transition-all duration-200 ease-in-out group',
                        'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20',
                        'border-red-200/60 dark:border-red-800/40',
                        'hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/30 dark:hover:to-rose-900/30',
                        'hover:border-red-300/60 dark:hover:border-red-700/40',
                        'hover:shadow-sm hover:scale-[1.02]',
                        'text-red-700 dark:text-red-300',
                        !isOpen && 'justify-center px-0'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center transition-all duration-200',
                          !isOpen ? 'justify-center' : 'justify-start gap-3'
                        )}
                      >
                        <LogOut
                          size={18}
                          className="transition-all duration-200 group-hover:scale-110"
                        />
                        <span
                          className={cn(
                            'font-medium transition-all duration-300 ease-in-out',
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
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
