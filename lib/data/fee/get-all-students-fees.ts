import prisma from '@/lib/db';
import { FeeRecord } from '@/types';
import { FeeStatus } from '@prisma/client';

export async function getFeeRecords(count: number = 50): Promise<FeeRecord[]> {
  try {
    const start = performance.now();
    const fees = await prisma.fee.findMany({
      take: count, // Limit the number of records
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            rollNumber: true,
            email: true,
            phoneNumber: true,
            gradeId: true,
            sectionId: true,

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
        feeCategory: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        FeePayments: {
          select: {
            id: true,
            amountPaid: true,
            paymentDate: true,
            paymentMethod: true,
            receiptNumber: true,
            transactionId: true,
            feeId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Optional: Sort by creation date
      },
    });

    // Map the Prisma data to the FeeRecord type
    const feeRecords: FeeRecord[] = fees.map((fee) => ({
      fee: {
        id: fee.id,
        totalFee: fee.totalFee,
        paidAmount: fee.paidAmount,
        pendingAmount: fee.pendingAmount ?? fee.totalFee - fee.paidAmount,
        dueDate: fee.dueDate,
        status: fee.status as FeeStatus,
        studentId: fee.studentId,
        feeCategoryId: fee.feeCategoryId,
        organizationId: fee.organizationId,
        createdAt: fee.createdAt,
        updatedAt: fee.updatedAt,
      },
      student: {
        id: fee.student.id,
        firstName: fee.student.firstName,
        lastName: fee.student.lastName,
        rollNumber: fee.student.rollNumber,
        email: fee.student.email,
        phoneNumber: fee.student.phoneNumber,
        gradeId: fee.student.gradeId,
        sectionId: fee.student.sectionId,
      },
      feeCategory: {
        id: fee.feeCategory.id,
        name: fee.feeCategory.name,
        description: fee.feeCategory.description,
      },
      grade: {
        id: fee.student.gradeId,
        grade: fee.student.grade.grade,
      },
      section: {
        id: fee.student.sectionId,
        name: fee.student.section.name,
      },
      payments: fee.FeePayments.map((payment) => ({
        id: payment.id,
        amountPaid: payment.amountPaid,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        receiptNumber: payment.receiptNumber,
        transactionId: payment.transactionId ?? undefined,
        feeId: payment.feeId,
      })),
    }));

    const end = performance.now();

    console.log(
      `Fetched ${fees.length} fee records in ${(end - start) / 1000} seconds`
    );

    return feeRecords;
  } catch (error) {
    console.error('Error fetching fee records:', error);
    throw new Error('Failed to fetch fee records');
  }
}
