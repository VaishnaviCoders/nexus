'use client';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from './sidebar-toggle';
import { Menu } from './menu';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { Role } from '@prisma/client';

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
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        !getOpenState() ? 'w-[90px]' : 'w-72',
        settings.disabled && 'hidden'
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 "
      >
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1 z-10',
            !getOpenState() ? 'translate-x-1' : 'translate-x-0'
          )}
          variant="ghost"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <OrganizationSwitcher
              hidePersonal={true}
              appearance={{
                elements: {
                  organizationPreviewMainIdentifier: cn(
                    'transition-opacity duration-300',
                    !getOpenState() && 'opacity-0 hidden' // Hide organization name when collapsed
                  ),

                  organizationSwitcherTrigger: cn(
                    'w-full flex items-center rounded-md',
                    !getOpenState() ? 'justify-center p-2' : 'justify-start p-3'
                  ),
                  organizationSwitcherPopoverActionButton__createOrganization: {
                    display: 'none',
                  },
                },
              }}
            />
          </Link>
        </Button>

        <Menu isOpen={getOpenState()} role={role} />
      </div>
    </aside>
  );
}
