'use client';
import { usePathname } from 'next/navigation';

import React, { useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

const BreadCrumbNavigation = () => {
  const pathname = usePathname();
  const pathNames = useMemo(
    () => pathname.split('/').filter((path) => path),
    [pathname]
  );

  return (
    <Breadcrumb className="flex shrink-0 items-center px-4 my-5">
      <BreadcrumbList>
        {pathNames.map((path, index) => {
          const fullPath = `/${pathNames.slice(0, index + 1).join('/')}`; // Build the full URL for each breadcrumb

          return (
            <React.Fragment key={fullPath}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="cursor-pointer capitalize">
                <Link href={fullPath}>{path}</Link>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbNavigation;
