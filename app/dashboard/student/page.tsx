import prisma from '@/lib/db';
import React from 'react';

const page = async () => {
  const data = await prisma.notice.findMany();
  return (
    <div>
      <h1>Students</h1>
      {data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};

export default page;
