import prisma from '../../db';
import { unstable_cache } from 'next/cache';

const GetFeesByParentId = async () => {
  const start = performance.now();

  const userId = 'cm965kxvk0002vhr87jn4nsyi';

  const parent = await prisma.parent.findUnique({
    where: { id: userId },
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
                  FeePayment: {
                    select: {
                      id: true,
                      organizationId: true,
                      amountPaid: true,
                      paymentDate: true,
                      paymentMethod: true,
                      receiptNumber: true,
                      payerName: true,
                      payerPhone: true,
                      transactionId: true,
                      note: true,
                      createdAt: true,
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
      fee.FeePayment.map((payment) => ({
        id: payment.id,
        organizationId: payment.organizationId,
        amount: payment.amountPaid,
        childName: student.firstName + ' ' + student.lastName,
        date: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        category: fee.feeCategory?.name || 'Unknown',
        receiptNumber: payment.receiptNumber,
        payerName: payment.payerName,
        payerPhone: payment.payerPhone,
        transactionId: payment.transactionId,
        notes: payment.note,
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
