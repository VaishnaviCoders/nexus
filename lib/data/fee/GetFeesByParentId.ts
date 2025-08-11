import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';

const GetFeesByParentId = async () => {
  const start = performance.now();

  const userId = await getCurrentUserId();

  const parent = await prisma.parent.findUnique({
    where: {
      userId: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      students: {
        select: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              rollNumber: true,
              grade: { select: { grade: true } },
              section: { select: { name: true } },
              Fee: {
                select: {
                  id: true,
                  dueDate: true,
                  totalFee: true,
                  paidAmount: true,
                  pendingAmount: true,
                  status: true,
                  updatedAt: true,
                  feeCategory: { select: { name: true } },
                  payments: {
                    select: {
                      id: true,
                      amount: true,
                      paymentDate: true,
                      paymentMethod: true,
                      receiptNumber: true,
                      note: true,
                      transactionId: true,
                      payerId: true,
                      feeId: true,
                      platformFee: true,
                      status: true,
                      recordedBy: true,
                      organizationId: true,
                      createdAt: true,
                      updatedAt: true,
                      payer: {
                        select: {
                          firstName: true,
                          lastName: true,
                          email: true,
                        },
                      },
                    },
                    orderBy: { paymentDate: 'asc' },
                  },
                },
                orderBy: { dueDate: 'asc' },
              },
            },
          },
        },
      },
    },
  });

  if (!parent) return null;

  const children = parent.students.map(({ student }) => {
    const totalFees = student.Fee.reduce(
      (sum, fee) => sum + (fee.totalFee ?? 0),
      0
    );
    const paidFees = student.Fee.reduce(
      (sum, fee) => sum + (fee.paidAmount ?? 0),
      0
    );
    const pendingFees = student.Fee.reduce(
      (sum, fee) => sum + (fee.pendingAmount ?? 0),
      0
    );

    const unpaidFees = student.Fee.filter((fee) => fee.status !== 'PAID').map(
      (fee) => ({
        id: fee.id,
        dueDate: fee.dueDate,
        amount: fee.pendingAmount ?? 0,
        category: fee.feeCategory?.name || 'Unknown',
        status: fee.status,
      })
    );

    const paymentHistory = student.Fee.flatMap((fee) =>
      fee.payments.map((payment) => ({
        id: payment.id,
        amountPaid: payment.amount,
        platformFee: payment.platformFee,
        paymentDate: payment.paymentDate,
        receiptNumber: payment.receiptNumber,
        note: payment.note || '',
        payerId: payment.payerId,
        feeId: payment.feeId,
        status: payment.status,
        recordedBy: payment.recordedBy || 'System',
        transactionId: payment.transactionId,
        organizationId: payment.organizationId,
        studentName: student.firstName + ' ' + student.lastName,
        paymentMethod: payment.paymentMethod,
        category: fee.feeCategory?.name || 'Unknown',
        payer: {
          firstName: payment.payer.firstName,
          lastName: payment.payer.lastName,
          email: payment.payer.email,
        },
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      }))
    );

    return {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      grade: student.grade?.grade || 'Unknown',
      section: student.section?.name || 'Unknown',
      rollNo: student.rollNumber || 'N/A',
      totalFees,
      paidFees,
      pendingFees,
      unpaidFees,
      paymentHistory: paymentHistory,
    };
  });

  const parentData = {
    name: `Mr. ${parent.firstName} ${parent.lastName}`,
    email: parent.email || '',
    phone: parent.phoneNumber || '',
    children,
  };

  const end = performance.now();
  console.log(
    `⏱️ Fully Optimized GetFeesByParentId took ${(end - start).toFixed(2)} ms`
  );

  // console.log('Backend ParentData with unpaid fees', parentData);

  // console.log(
  //   'Backend ParentData with unpaid fees',
  //   parentData.children.map((child) => child.unpaidFees)
  // );

  // console.log(
  //   'Backend ParentData with paid fees',
  //   parentData.children.map((child) => child.paymentHistory)
  // );

  return parentData;
};

export default GetFeesByParentId;
