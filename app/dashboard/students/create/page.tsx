import CreateStudentForm from '@/components/dashboard/Student/CreateStudentForm';
// import dynamic from 'next/dynamic';
import React from 'react';

// const CreateStudentForm = dynamic(
//   () => import('@/app/components/dashboardComponents/CreateStudentForm')
// );

const page = () => {
  return (
    <div>
      <CreateStudentForm />
    </div>
  );
};

export default page;
