import Link from 'next/link';
import { MenuIcon, PanelsTopLeft } from 'lucide-react';

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

export async function SheetMenu() {
  const { userId, orgRole } = await auth();
  if (!userId) return null;

  const roleMap: Record<string, 'ADMIN' | 'TEACHER' | 'STUDENT'> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';
  console.log('Detected Clerk Role:', role);

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <SheetTitle className="font-bold text-lg">Nexus</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>

        {role ? (
          <Menu isOpen role={role} />
        ) : (
          <div className="text-red-500">Role not assigned. Contact admin.</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
