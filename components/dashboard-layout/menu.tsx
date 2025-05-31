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
import { CollapseMenuButton } from './collapse-menu-button';
import { SignOutButton } from '@clerk/nextjs';

interface MenuProps {
  isOpen?: boolean;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
}

export function Menu({ isOpen, role }: MenuProps) {
  const pathname = usePathname();
  const menuList = roleMenus[role] || [];

  return (
    <div className="relative h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200/60 dark:border-slate-700/60">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none" />

      <ScrollArea className="relative z-10 h-full [&>div>div[style]]:!block">
        <nav className="mt-6 h-full w-full">
          <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-3">
            {menuList.map(({ groupLabel, menus }, index) => (
              <li
                className={cn('w-full', groupLabel ? 'pt-6' : '')}
                key={index}
              >
                {(isOpen && groupLabel) || isOpen === undefined ? (
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200/50 to-transparent dark:from-slate-700/50 dark:to-transparent rounded-lg" />
                    <p className="relative text-xs font-semibold text-slate-600 dark:text-slate-400 px-4 py-2 uppercase tracking-wider">
                      {groupLabel}
                    </p>
                  </div>
                ) : !isOpen && isOpen !== undefined && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full">
                        <div className="w-full flex justify-center items-center mb-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 shadow-sm">
                            <Ellipsis className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-slate-900 text-white border-slate-700"
                      >
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="pb-2" />
                )}

                <div className="space-y-1">
                  {menus.map(
                    ({ href, label, icon: Icon, active, submenus }, index) =>
                      !submenus || submenus.length === 0 ? (
                        <div className="w-full" key={index}>
                          <TooltipProvider disableHoverableContent>
                            <Tooltip delayDuration={100}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    'w-full justify-start h-11 mb-1 relative group transition-all duration-200 ease-in-out',
                                    'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50',
                                    'hover:shadow-sm hover:border-blue-200/50 dark:hover:border-blue-700/50',
                                    (active === undefined &&
                                      pathname.startsWith(href)) ||
                                      active
                                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50'
                                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300'
                                  )}
                                  asChild
                                >
                                  <Link
                                    href={
                                      href.startsWith('/') ? href : `/${href}`
                                    }
                                    passHref
                                  >
                                    {/* Active indicator */}
                                    {((active === undefined &&
                                      pathname.startsWith(href)) ||
                                      active) && (
                                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                                    )}

                                    <span
                                      className={cn(
                                        'flex items-center justify-center w-5 h-5 transition-all duration-200',
                                        isOpen === false ? '' : 'mr-3'
                                      )}
                                    >
                                      <Icon
                                        size={18}
                                        className="transition-transform duration-200 group-hover:scale-110"
                                      />
                                    </span>

                                    <p
                                      className={cn(
                                        'font-medium transition-all duration-300 ease-in-out',
                                        isOpen === false
                                          ? '-translate-x-96 opacity-0'
                                          : 'translate-x-0 opacity-100'
                                      )}
                                    >
                                      {label}
                                    </p>
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              {isOpen === false && (
                                <TooltipContent
                                  side="right"
                                  className="bg-slate-900 text-white border-slate-700"
                                >
                                  {label}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : (
                        <div className="w-full" key={index}>
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

            {/* Enhanced Sign Out Button */}
            <li className="w-full grow flex items-end pb-4">
              <div className="w-full">
                {/* Decorative separator */}
                <div className="mb-4 mx-2">
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
                            'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30',
                            'border-red-200/50 dark:border-red-800/50',
                            'hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/50 dark:hover:to-pink-900/50',
                            'hover:border-red-300/50 dark:hover:border-red-700/50',
                            'hover:shadow-sm text-red-700 dark:text-red-300',
                            isOpen === false
                              ? 'justify-center'
                              : 'justify-start'
                          )}
                        >
                          <span
                            className={cn(
                              'flex items-center justify-center transition-all duration-200',
                              isOpen === false ? '' : 'mr-3'
                            )}
                          >
                            <LogOut
                              size={18}
                              className="transition-transform duration-200 group-hover:scale-110"
                            />
                          </span>
                          <p
                            className={cn(
                              'font-medium transition-all duration-300 ease-in-out',
                              isOpen === false
                                ? 'opacity-0 hidden'
                                : 'opacity-100'
                            )}
                          >
                            Sign out
                          </p>
                        </Button>
                      </SignOutButton>
                    </TooltipTrigger>
                    {isOpen === false && (
                      <TooltipContent
                        side="right"
                        className="bg-slate-900 text-white border-slate-700"
                      >
                        Sign out
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </li>
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
}
