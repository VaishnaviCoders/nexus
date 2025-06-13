import CreateStudentForm from '@/components/dashboard/Student/CreateStudentForm';
import { Skeleton } from '@/components/ui/skeleton';
// import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// const CreateStudentForm = dynamic(
//   () => import('@/app/components/dashboardComponents/CreateStudentForm')
// );

const page = () => {
  return (
    <Suspense fallback={<Skeleton className="container mx-auto h-56" />}>
      <CreateStudentForm />
    </Suspense>
  );
};

export default page;
