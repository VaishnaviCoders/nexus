'use server';

import { Feedback } from '@/components/Feedback';
import prisma from '@/lib/db';

async function test() {
  const organization = await prisma.academicYear.findMany();
  return organization;
}

const page = async () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Feedback />
    </div>
  );
};

export default page;
