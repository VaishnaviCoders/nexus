'use client';

// import { Footer } from '@/components/admin-panel/footer';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';

interface AdminPanelLayoutProps {
  children: React.ReactNode;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'; // Add role as a prop
}

export default function AdminPanelLayout({
  children,
  role,
}: AdminPanelLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar role={role} />
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)]  overflow-hidden bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-72')
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] ease-in-out duration-300',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-72')
        )}
      >
        {/* <Footer /> */}
      </footer>
    </>
  );
}
