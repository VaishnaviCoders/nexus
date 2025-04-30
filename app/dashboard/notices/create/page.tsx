import dynamic from 'next/dynamic';
import React from 'react';
import Loading from '../loading';

const CreateNotice = dynamic(
  () => import('@/components/dashboard/notice/create-notice'),
  {
    // ssr: false,
    loading: () => <Loading />,
  }
);

const page = () => {
  return <CreateNotice />;
};

export default page;
