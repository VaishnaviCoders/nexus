import dynamic from 'next/dynamic';
import React from 'react';
import Loading from '../loading';

const CreateNotice = dynamic(
  () => import('@/app/components/dashboardComponents/create-notice'),
  {
    // ssr: false,
    loading: () => <Loading />,
  }
);

const page = () => {
  return <CreateNotice />;
};

export default page;
