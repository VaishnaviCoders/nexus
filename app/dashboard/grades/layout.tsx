import GradeListing from '@/components/dashboard/class-management/GradeListing';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export default async function GradesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { orgId } = await auth();

  if (!orgId) {
    return null;
  }
  const grades = await prisma.grade.findMany({
    where: { organizationId: orgId },
    include: {
      section: {
        include: {
          students: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col md:grid md:grid-cols-6 gap-4 border rounded-2xl  pb-4">
      {/* Sidebar */}
      <GradeListing grades={grades} />

      {/* Main Content */}
      <main className="col-span-3 p-6">{children}</main>
    </div>
  );
}
