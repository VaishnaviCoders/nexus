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
import prisma from '@/lib/db';

export async function SheetMenu() {
  const { userId } = await auth();
  if (!userId) return null;

  const orgRole = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  // console.log('orgRole', orgRole);
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
        <Menu isOpen role={orgRole?.role as 'ADMIN' | 'TEACHER' | 'STUDENT'} />
      </SheetContent>
    </Sheet>
  );
}
