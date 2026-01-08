import prisma from '@/lib/db';

export default async function getAllChildrenByParentId(parentId: string) {
  const data = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      students: {
        select: {
          student: {
            select: {
              id: true,
              profileImage: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phoneNumber: true,
              rollNumber: true,
              StudentAttendance: {
                take: 7,
              },
              section: {
                select: {
                  name: true,
                },
              },
              grade: {
                select: {
                  grade: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}
