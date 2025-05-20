import { type ClientUploadedFileData } from 'uploadthing/types';

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

// In Application Types

export interface FeeRecord {
  fee: {
    id: string;
    totalFee: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: Date;
    status: 'PAID' | 'UNPAID' | 'OVERDUE';
    studentId: string;
    feeCategoryId: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    email: string;
    phoneNumber: string;
    gradeId: string;
    sectionId: string;
  };
  feeCategory: {
    id: string;
    name: string;
    description: string | null;
  };
  grade: {
    id: string;
    grade: string;
  };
  section: {
    id: string;
    name: string;
  };
  payments: {
    id: string;
    amountPaid: number;
    paymentDate: Date;
    paymentMethod:
      | 'CASH'
      | 'UPI'
      | 'CARD'
      | 'BANK_TRANSFER'
      | 'CHEQUE'
      | 'ONLINE';
    receiptNumber: string;
    transactionId: string | undefined;
    feeId: string;
  }[];
}

export interface FeeReminderRecipient {
  id: string; // unique for this reminder
  studentId: string;
  studentName: string;
  parentId: string;
  parentName: string;
  parentEmail?: string;
  parentPhone?: string;
  parentWhatsapp?: string;
  relation: string;
  pendingFees: Array<{ category: string; amount: number }>;
  dueDate: Date;
  channels: ('email' | 'sms' | 'whatsapp')[];
}
