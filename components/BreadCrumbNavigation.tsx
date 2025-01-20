'use client';
import { usePathname } from 'next/navigation';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const BreadCrumbNavigation = () => {
  const pathname = usePathname();
  const pathNames = pathname.split('/').filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathNames.map((path, index) => {
          const fullPath = `/${pathNames.slice(0, index + 1).join('/')}`; // Build the full URL for each breadcrumb

          return (
            <React.Fragment key={fullPath}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="cursor-pointer capitalize">
                <BreadcrumbLink href={fullPath}>{path}</BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbNavigation;
