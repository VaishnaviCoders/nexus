import prisma from '../db';

export default async function getAllChildrenByParentId(parentId: string) {
  return await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      students: {
        select: {
          student: {
            select: {
              profileImage: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phoneNumber: true,
              rollNumber: true,
              StudentAttendance: true,
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
}
