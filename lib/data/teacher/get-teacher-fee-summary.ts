import prisma from '@/lib/db';

export async function getTeacherFeeSummary(userId: string) {
  // Step 1: Find teacher
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teacher: true },
  });

  const teacherId = user?.teacher?.id;
  if (!teacherId) throw new Error('Teacher not found');

  // Step 2: Find assigned sections
  const assignments = await prisma.teachingAssignment.findMany({
    where: { teacherId },
    select: { sectionId: true },
  });

  const sectionIds = assignments.map((a) => a.sectionId);

  if (sectionIds.length === 0) {
    return {
      totalStudents: 0,
      paidFees: 0,
      unpaidFees: 0,
      overdueFees: 0,
    };
  }

  // Step 3: Find students in those sections
  const students = await prisma.student.findMany({
    where: {
      sectionId: { in: sectionIds },
    },
    select: { id: true },
  });

  const studentIds = students.map((s) => s.id);

  if (studentIds.length === 0) {
    return {
      totalStudents: 0,
      paidFees: 0,
      unpaidFees: 0,
      overdueFees: 0,
      studentsWithUnpaidFees: 0,
      studentsWithOverdueFees: 0,
    };
  }

  // Step 4: Aggregate fee data
  const fees = await prisma.fee.findMany({
    where: { studentId: { in: studentIds } },
    select: {
      totalFee: true,
      paidAmount: true,
      pendingAmount: true,
      status: true,
      studentId: true,
    },
  });

  let paidFees = 0;
  let unpaidFees = 0;
  let overdueFees = 0;

  const unpaidStudentSet = new Set<string>();
  const overdueStudentSet = new Set<string>();

  for (const fee of fees) {
    const pending = fee.pendingAmount ?? fee.totalFee - fee.paidAmount;

    paidFees += fee.paidAmount;
    unpaidFees += pending;

    if (pending > 0) unpaidStudentSet.add(fee.studentId);
    if (fee.status === 'OVERDUE' && pending > 0) {
      overdueFees += pending;
      overdueStudentSet.add(fee.studentId);
    }
  }

  return {
    totalStudents: studentIds.length,
    paidFees,
    unpaidFees,
    overdueFees,
    studentsWithUnpaidFees: unpaidStudentSet.size,
    studentsWithOverdueFees: overdueStudentSet.size,
  };
}
