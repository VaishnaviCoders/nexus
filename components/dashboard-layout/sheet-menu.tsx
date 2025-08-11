import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from './menu';
import { auth } from '@clerk/nextjs/server';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { DialogTitle } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { Role } from '@/generated/prisma';

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
        </Button>
      </SheetTrigger>

      <SheetContent
        className="sm:w-80 px-0 h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200/60 dark:border-slate-700/60"
        side="left"
      >
        <SheetHeader className="px-4 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <DialogTitle className="sr-only">Navigation menu</DialogTitle>
          <div className="w-full flex items-center justify-center">
            {/* Make the entire organization switcher clickable on mobile */}
            <div className="w-full p-3 flex items-center justify-center rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
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
                      gap: '12px',
                      color: 'black',
                      '@media (prefers-color-scheme: dark)': {
                        color: 'white',
                      },
                    },
                    organizationPreviewMainIdentifier: cn(
                      'text-slate-700 dark:text-white font-semibold text-sm transition-all duration-300'
                    ),
                    organizationSwitcherTriggerIcon: cn(
                      'text-slate-600 dark:text-white'
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
                    // Ensure the manage button is clickable
                    organizationSwitcherPopoverActionButton__manageOrganization:
                      {
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                      },
                  },
                }}
              />
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
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
