'use server';

import { jsPDF } from 'jspdf';
import prisma from '@/lib/db';

interface ReceiptData {
  organization: {
    name: string | null;
    organizationLogo: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    website: string | null;
  };
  feePayment: {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentDate: Date;
    receiptNumber: string;
    transactionId: string | null;
    platformFee: number | null;
    fee: {
      totalFee: number;
      paidAmount: number;
      dueDate: Date;
      feeCategory: {
        name: string;
        description: string | null;
      };
      student: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        rollNumber: string | null;
        grade: {
          grade: string;
        } | null;
        section: {
          name: string;
        } | null;
      };
    };
    payer: {
      firstName: string | null;
      lastName: string | null;
      email: string | null;
    };
  };
}

export async function generateReceiptPDF(feeId: string) {
  try {
    // Fetch payment data with all related information

    const fee = await prisma.fee.findUnique({
      where: { id: feeId },
      include: {
        payments: {
          where: { status: 'COMPLETED' },
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!fee) return null;
    const paymentData = await prisma.feePayment.findUnique({
      where: { id: fee.payments[0].id },
      include: {
        organization: {
          select: {
            name: true,
            organizationLogo: true,
            contactEmail: true,
            contactPhone: true,
            website: true,
          },
        },
        fee: {
          include: {
            feeCategory: {
              select: {
                name: true,
                description: true,
              },
            },
            student: {
              include: {
                grade: {
                  select: {
                    grade: true,
                  },
                },
                section: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        payer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!paymentData) {
      throw new Error('Payment not found');
    }

    // Generate PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // Colors
    const primaryColor: [number, number, number] = [41, 128, 185]; //bluee
    const secondaryColor: [number, number, number] = [52, 73, 94];
    const lightGray: [number, number, number] = [236, 240, 241];

    // Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    // Organization name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(paymentData.organization.name || 'School Name', 20, 25);

    // Receipt title
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT RECEIPT', pageWidth - 20, 25, { align: 'right' });

    // Receipt number and date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Receipt #: ${paymentData.receiptNumber}`, pageWidth - 20, 35, {
      align: 'right',
    });
    pdf.text(
      `Date: ${paymentData.paymentDate.toLocaleDateString()}`,
      pageWidth - 20,
      42,
      { align: 'right' }
    );

    let yPosition = 60;

    // Organization details
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Organization Details', 20, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    if (paymentData.organization.contactEmail) {
      pdf.text(
        `Email: ${paymentData.organization.contactEmail}`,
        20,
        yPosition
      );
      yPosition += 7;
    }

    if (paymentData.organization.contactPhone) {
      pdf.text(
        `Phone: ${paymentData.organization.contactPhone}`,
        20,
        yPosition
      );
      yPosition += 7;
    }

    if (paymentData.organization.website) {
      pdf.text(`Website: ${paymentData.organization.website}`, 20, yPosition);
      yPosition += 7;
    }

    yPosition += 10;

    // Student details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Student Details', 20, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const studentName =
      `${paymentData.fee.student.firstName || ''} ${paymentData.fee.student.lastName || ''}`.trim();
    pdf.text(`Name: ${studentName}`, 20, yPosition);
    yPosition += 7;

    if (paymentData.fee.student.rollNumber) {
      pdf.text(
        `Roll Number: ${paymentData.fee.student.rollNumber}`,
        20,
        yPosition
      );
      yPosition += 7;
    }

    if (paymentData.fee.student.grade) {
      pdf.text(`Grade: ${paymentData.fee.student.grade.grade}`, 20, yPosition);
      yPosition += 7;
    }

    if (paymentData.fee.student.section) {
      pdf.text(
        `Section: ${paymentData.fee.student.section.name}`,
        20,
        yPosition
      );
      yPosition += 7;
    }

    yPosition += 10;

    // Payment details table
    pdf.setFillColor(...lightGray);
    pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');

    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Details', 25, yPosition + 6);

    yPosition += 15;

    // Table headers
    pdf.setFillColor(245, 245, 245);
    pdf.rect(20, yPosition, pageWidth - 40, 10, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', 25, yPosition + 7);
    pdf.text('Amount', pageWidth - 25, yPosition + 7, { align: 'right' });

    yPosition += 15;

    // Fee category
    pdf.setFont('helvetica', 'normal');
    pdf.text(paymentData.fee.feeCategory.name, 25, yPosition);
    pdf.text(`₹${paymentData.amount.toFixed(2)}`, pageWidth - 25, yPosition, {
      align: 'right',
    });

    yPosition += 10;

    // Platform fee (if applicable)
    if (paymentData.platformFee && paymentData.platformFee > 0) {
      pdf.text('Platform Fee', 25, yPosition);
      pdf.text(
        `₹${paymentData.platformFee.toFixed(2)}`,
        pageWidth - 25,
        yPosition,
        { align: 'right' }
      );
      yPosition += 10;
    }

    // Total line
    pdf.setDrawColor(...primaryColor);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Total Paid', 25, yPosition);

    pdf.text(`₹${paymentData.amount.toFixed(2)}`, pageWidth - 25, yPosition, {
      align: 'right',
    });

    // const totalAmount = paymentData.amount + (paymentData.platformFee || 0);
    // pdf.text(`₹${totalAmount.toFixed(2)}`, pageWidth - 25, yPosition, {
    //   align: 'right',
    // });

    yPosition += 20;

    // Payment method and transaction details
    pdf.setFillColor(...lightGray);
    pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');

    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Transaction Details', 25, yPosition + 6);

    yPosition += 20;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Payment Method: ${paymentData.paymentMethod}`, 25, yPosition);
    yPosition += 7;

    if (paymentData.transactionId) {
      pdf.text(`Transaction ID: ${paymentData.transactionId}`, 25, yPosition);
      yPosition += 7;
    }

    pdf.text(
      `Payment Date: ${paymentData.paymentDate.toLocaleString()}`,
      25,
      yPosition
    );
    yPosition += 7;

    if (paymentData.payer.firstName) {
      pdf.text(
        `Paid By: ${paymentData.payer.firstName} ${paymentData.payer.lastName}`,
        25,
        yPosition
      );
      yPosition += 7;
    }

    // Footer
    yPosition = pageHeight - 40;
    pdf.setDrawColor(...primaryColor);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 10;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      'This is a computer-generated receipt and does not require a signature.',
      pageWidth / 2,
      yPosition,
      {
        align: 'center',
      }
    );

    yPosition += 7;
    pdf.text(
      `Generated on ${new Date().toLocaleString()}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );

    // Convert to base64
    const pdfBase64 = pdf.output('datauristring');

    return {
      success: true,
      pdf: pdfBase64,
      filename: `receipt-${paymentData.receiptNumber}.pdf`,
    };
  } catch (error) {
    console.error('Error generating receipt PDF:', error);
    return {
      success: false,
      error: 'Failed to generate receipt',
    };
  }
}

export async function getPaymentForReceipt(feeId: string) {
  try {
    const payment = await prisma.feePayment.findFirst({
      where: {
        feeId: feeId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        receiptNumber: true,
        amount: true,
        paymentDate: true,
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    return payment;
  } catch (error) {
    console.error('Error fetching payment for receipt:', error);
    return null;
  }
}
