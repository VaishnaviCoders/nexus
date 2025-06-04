import { ComplaintStatus, Severity } from '@prisma/client';
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

// Parent Child Attendance Monitor

export type ParentData = {
  firstName: string;
  lastName: string;
  students: {
    student: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage: string | null;
      grade: {
        grade: string;
      };
      section: {
        name: string;
      };
      StudentAttendance: {
        id: string;
        date: Date;
        status: string;
        note: string | null;
        recordedBy: string;
        present: boolean;
      }[];
    };
  }[];
};

export interface AttendanceRecord {
  id: string;
  date: Date;
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  note: string | null;
  recordedBy: string;
}

// Aynonymous Complaints

export interface ComplaintTimelineEntry {
  id: string;
  status: ComplaintStatus;
  changedBy: string | null;
  createdAt: Date;
  note?: string | null;
  complaintId: string;
}

export interface Complaint {
  id: string;
  trackingId: string;
  category: string;
  severity: Severity;
  subject: string;
  description: string;
  evidenceUrls: string[];
  submittedAt: Date;
  currentStatus: ComplaintStatus;
  updatedAt: Date;
  createdAt: Date;
  ComplaintStatusTimeline: ComplaintTimelineEntry[];
}
