import Link from 'next/link';
import { MenuIcon, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Menu } from './menu';
import { auth } from '@clerk/nextjs/server';
import { OrganizationSwitcher } from '@clerk/nextjs';
import type { Role } from '@prisma/client';

export async function SheetMenu() {
  const { userId, orgRole } = await auth();
  if (!userId) return null;

  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button
          className="h-9 w-9 relative group transition-all duration-200 hover:shadow-md"
          variant="outline"
          size="icon"
        >
          <MenuIcon
            size={18}
            className="transition-transform duration-200 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 opacity-0 group-hover:opacity-35 transition-opacity duration-200 rounded-md" />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="sm:w-80 px-0 h-full flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-l border-slate-200/60 dark:border-slate-700/60"
        side="left"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none" />

        <SheetHeader className="relative z-10 px-6 py-4">
          <div className="relative">
            {/* Header background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/30 dark:border-blue-700/30" />

            <Button
              className="relative flex justify-center items-center w-full py-6 bg-transparent hover:bg-transparent"
              variant="link"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <SheetTitle className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <OrganizationSwitcher
                    hidePersonal={true}
                    afterSelectOrganizationUrl="/orgs/:slug"
                    appearance={{
                      elements: {
                        organizationSwitcherPopoverActionButton__createOrganization:
                          {
                            display: 'none',
                          },
                        organizationSwitcherTrigger: {
                          background: 'transparent',
                          border: 'none',
                          boxShadow: 'none',
                          padding: '0',
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: 'transparent',
                          backgroundImage:
                            'linear-gradient(to right, rgb(37 99 235), rgb(79 70 229))',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                        },
                        organizationSwitcherTrigger__hover: {
                          background: 'transparent',
                        },
                      },
                    }}
                  />
                </SheetTitle>
              </Link>
            </Button>
          </div>
        </SheetHeader>

        <div className="relative z-10 flex-1 px-3">
          {role ? (
            <Menu isOpen role={role} />
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  Role not assigned
                </p>
                <p className="text-red-500 dark:text-red-500 text-sm mt-1">
                  Contact admin for access
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
