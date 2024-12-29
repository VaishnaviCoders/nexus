'use client';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { Cloud, LifeBuoy, LogOut, Users } from 'lucide-react';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ModeToggle } from './mode-toggle';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

const KindeUserComponent = () => {
  const { user, getUser } = useKindeBrowserClient();

  // if (!user) {
  //   redirect('/api/auth/login');
  // }

  // const dbUser = await prisma.user.findUnique({
  //   where: {
  //     id: user.id,
  //   },
  //   include: {
  //     organization: true,
  //   },
  // });

  // console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <ChevronDown className="mr-2 h-4 w-4 hidden hover:visible" /> */}
        <div className="relative ml-2 flex cursor-pointer items-center gap-2">
          <div className="relative h-12 w-12 cursor-pointer rounded-full">
            {user?.picture ? (
              <Image
                src={user?.picture}
                alt="Profile Picture"
                width={46}
                height={46}
                className="rounded-full object-cover"
              />
            ) : (
              <Avatar className="w-10 h-10 md:w-16 md:h-16">
                <AvatarImage
                  src="/placeholder.svg?height=80&width=80"
                  alt="Student"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            )}

            <div className="absolute bottom-0 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <div className="z-10 h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="text-left max-sm:hidden">
            <h4 className="text-sm font-medium">
              {user?.given_name || 'User Name'}
            </h4>
            <p className="text-sm">{user?.email || 'UserName@gmail.com'}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenu>
          <DropdownMenuLabel>
            {/* Organization Name : {dbUser?.organizationId} */}
          </DropdownMenuLabel>

          <DropdownMenuItem className="mx-3 my-2 flex cursor-pointer items-center gap-5 hover:bg-gray-100 dark:hover:bg-gray-900">
            <LifeBuoy className="mr-2 h-4 w-4" />
            {/* {dbUser?.organization.subdomain} */}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            //   onClick={handleShowTeamMemberDialog}
            className="mx-3 my-2 flex cursor-pointer items-center gap-5 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Add Teachers / Staff</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="my-2 flex cursor-pointer items-center gap-5 hover:bg-gray-100 dark:hover:bg-gray-900">
            <ModeToggle />
            Theme
          </DropdownMenuItem>

          <DropdownMenuItem className="mx-3 my-2 flex cursor-pointer items-center gap-5 hover:bg-gray-100 dark:hover:bg-gray-900">
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="mx-3 my-2 flex cursor-pointer items-center gap-5 hover:bg-gray-100 dark:hover:bg-gray-900">
            <LogoutLink
              postLogoutRedirectURL="/"
              className="flex w-full items-center gap-5"
            >
              <LogOut />
              <span> Log Out</span>
            </LogoutLink>
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled
            className="my-2 flex cursor-pointer items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <span>API</span>
            <Cloud className="mr-2 h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenu>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem
        onClick={handleOpenPlanModal}
        className="flex w-full justify-center"
      >
        <Button className="w-full">Upgrade to Pro</Button>
      </DropdownMenuItem> */}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KindeUserComponent;
