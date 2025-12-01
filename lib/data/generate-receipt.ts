'use server';

import jsPDF from 'jspdf';
import prisma from '../db';
import { formatCurrencyIN } from '../utils';

interface ReceiptData {
  success: boolean;
  pdf?: string;
  filename?: string;
  error?: string;
}

export async function generateReceiptPDF(
  paymentId: string
): Promise<ReceiptData> {
  try {
    // Fetch payment data with all related information

    const payment = await prisma.feePayment.findUnique({
      where: { id: paymentId },
      include: {
        fee: {
          include: {
            student: {
              include: {
                grade: true,
                section: true,
                organization: true,
              },
            },
            feeCategory: true,
          },
        },
        organization: true,
        payer: true,
      },
    });

    if (!payment) {
      return { success: false, error: 'Payment not found' };
    }

    // Get current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        organizationId: payment.organizationId,
        isCurrent: true,
      },
    });

    const { fee, organization, payer } = payment;
    const { student } = fee;

    // Create new PDF document
    const doc = new jsPDF();

    // Define colors and styling
    const primaryColor: [number, number, number] = [41, 128, 185]; // Professional blue
    const secondaryColor: [number, number, number] = [52, 73, 94]; // Dark gray
    const lightGray: [number, number, number] = [236, 240, 241];
    const darkGray: [number, number, number] = [127, 140, 141];

    // Set font
    doc.setFont('helvetica');

    // Header Section with Organization Branding
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Organization Logo placeholder (if logo exists)
    if (organization.logo) {
      // In a real implementation, you'd load and add the actual logo
      doc.setFillColor(255, 255, 255);
      doc.rect(15, 8, 24, 24, 'F');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text('LOGO', 27, 22, { align: 'center' });
    }

    // Organization Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(
      organization.name || 'School Name',
      organization.logo ? 45 : 15,
      20
    );

    // Organization Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const orgDetails = [];
    if (organization.contactEmail)
      orgDetails.push(`Email: ${organization.contactEmail}`);
    if (organization.contactPhone)
      orgDetails.push(`Phone: ${organization.contactPhone}`);
    if (organization.website)
      orgDetails.push(`Website: ${organization.website}`);

    doc.text(
      orgDetails.join(' | '),
      organization.logo ? 45 : 15,
      30
    );

    // Receipt Title
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FEE PAYMENT RECEIPT', 105, 60, { align: 'center' });

    // Receipt Number and Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: ${payment.receiptNumber}`, 15, 75);
    doc.text(
      `Date: ${payment.paymentDate.toLocaleDateString('en-IN')}`,
      150,
      75
    );

    // Student Information Section
    doc.setFillColor(...lightGray);
    doc.rect(15, 85, 180, 8, 'F');
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', 20, 91);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const studentInfo = [
      [`Student Name:`, `${student.firstName} ${student.lastName}`],
      [`Student ID:`, student.rollNumber],
      [`Class:`, `${student.grade.grade} - ${student.section.name}`],
      [`Academic Year:`, currentAcademicYear?.name || 'N/A'],
    ];

    let yPos = 105;
    studentInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, yPos);
      yPos += 8;
    });

    // Payment Information Section
    yPos += 10;
    doc.setFillColor(...lightGray);
    doc.rect(15, yPos - 5, 180, 8, 'F');
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT DETAILS', 20, yPos + 1);

    yPos += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const paymentInfo = [
      [`Fee Category:`, fee.feeCategory.name],
      [`Payment Method:`, payment.paymentMethod.replace('_', ' ')],
      [`Transaction ID:`, payment.transactionId || 'N/A'],
      [`Payment Status:`, payment.status],
    ];

    paymentInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, yPos);
      yPos += 8;
    });

    // Amount Section with highlighted total
    yPos += 10;
    doc.setFillColor(...primaryColor);
    doc.rect(15, yPos - 5, 180, 25, 'F');

    // Section Title: "AMOUNT PAID"
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AMOUNT PAID', 20, yPos + 5);

    // Right-aligned Amount Value
    const formattedAmount = formatCurrencyIN(payment.amount);

    doc.setFontSize(20);
    // Shift amount left from edge (195 → 180)

    doc.text(`INR ${formattedAmount}`, 165, yPos + 5, { align: 'right' });
    // Amount in words (placed below)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const amountInWords = numberToWords(payment.amount);
    doc.text(`Amount in words: ${amountInWords} Rupees Only`, 20, yPos + 15);

    // Payment Note (if exists)
    if (payment.note) {
      yPos += 35;
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Note:', 20, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(payment.note, 20, yPos + 8);
    }

    // Footer
    yPos = 260;
    doc.setTextColor(...darkGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'This is a computer-generated receipt and does not require a signature.',
      105,
      yPos,
      { align: 'center' }
    );
    doc.text(
      'For any queries, please contact the admin office.',
      105,
      yPos + 8,
      { align: 'center' }
    );

    // Generate timestamp
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 195, 285, {
      align: 'right',
    });

    // Convert to base64 data URL
    const pdfOutput = doc.output('datauristring');
    const filename = `receipt-${payment.receiptNumber}-${student.rollNumber}.pdf`;

    return {
      success: true,
      pdf: pdfOutput,
      filename,
    };
  } catch (error) {
    console.error('Error generating receipt PDF:', error);
    return {
      success: false,
      error: 'Failed to generate receipt PDF',
    };
  }
}

// Helper function to convert number to words (simplified version)
function numberToWords(num: number): string {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  function convertHundreds(n: number): string {
    let result = '';

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result;
    }

    if (n > 0) {
      result += ones[n] + ' ';
    }

    return result;
  }

  let integerPart = Math.floor(num);
  let result = '';
  let thousandIndex = 0;

  if (integerPart === 0) return 'Zero';

  while (integerPart > 0) {
    const chunk = integerPart % (thousandIndex === 0 ? 1000 : 100);
    if (chunk !== 0) {
      result = convertHundreds(chunk) + thousands[thousandIndex] + ' ' + result;
    }
    integerPart = Math.floor(integerPart / (thousandIndex === 0 ? 1000 : 100));
    thousandIndex++;
  }

  return result.trim();
}
