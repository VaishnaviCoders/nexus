import {
  ComplaintStatus,
  PaymentMethod,
  PaymentStatus,
  Severity,
} from '@/generated/prisma/enums';
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
    userId: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    email: string;
    phoneNumber: string;
    gradeId: string;
    sectionId: string;
    ParentStudent?: {
      isPrimary: boolean | null;
      parent: {
        userId: string | null;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        whatsAppNumber?: string;
      };
    }[];
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
    paymentMethod: PaymentMethod;
    receiptNumber: string;
    transactionId: string | undefined;
    feeId: string;
    status: PaymentStatus;
    payer: {
      firstName: string;
      lastName: string;
      email: string;
    };
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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsAppNumber: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
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
