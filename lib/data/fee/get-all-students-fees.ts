import prisma from '@/lib/db';
import { FeeRecord } from '@/types';
import { FeeStatus, PaymentStatus } from '@/generated/prisma/enums';

export async function getFeeRecords(count: number = 50): Promise<FeeRecord[]> {
  try {
    const fees = await prisma.fee.findMany({
      take: count,
      include: {
        organization: {
          select: {
            organizationLogo: true,
            contactEmail: true,
            contactPhone: true,
            name: true,
          },
        },
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
            userId: true,
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
            parents: {
              where: { isPrimary: true },
              select: {
                isPrimary: true,
                parent: {
                  select: {
                    userId: true,
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phoneNumber: true,
                    whatsAppNumber: true,
                  },
                },
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
        payments: {
          select: {
            id: true,
            amount: true,
            paymentDate: true,
            paymentMethod: true,
            receiptNumber: true,
            transactionId: true,
            feeId: true,
            status: true,
            payer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            paymentDate: 'desc',
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
        organizationName: fee.organization.name ?? undefined,
        organizationEmail: fee.organization.contactEmail ?? undefined,
        organizationPhone: fee.organization.contactPhone ?? undefined,
        createdAt: fee.createdAt,
        updatedAt: fee.updatedAt,
      },
      student: {
        id: fee.student.id,
        userId: fee.student.userId,
        firstName: fee.student.firstName,
        lastName: fee.student.lastName,
        rollNumber: fee.student.rollNumber,
        email: fee.student.email,
        phoneNumber: fee.student.phoneNumber,
        gradeId: fee.student.gradeId,
        sectionId: fee.student.sectionId,
        parents: fee.student.parents,
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
      payments: fee.payments.map((payment) => ({
        id: payment.id,
        amountPaid: payment.amount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        receiptNumber: payment.receiptNumber,
        transactionId: payment.transactionId ?? undefined,
        feeId: payment.feeId,
        status: payment.status as PaymentStatus,
        payer: {
          firstName: payment.payer.firstName,
          lastName: payment.payer.lastName,
          email: payment.payer.email,
        },
      })),
    }));

    return feeRecords;
  } catch (error) {
    console.error('Error fetching fee records:', error);
    throw new Error('Failed to fetch fee records');
  }
}
