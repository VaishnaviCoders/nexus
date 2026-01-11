import type { DocumentType } from '@/generated/prisma/enums';

export interface StudentDocument {
  id: string;
  type: DocumentType;
  fileName?: string | null;
  fileSize?: number;
  fileType?: string;
  documentUrl: string;
  studentId: string;
  rejected: boolean;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  uploadedBy?: string;
  uploadedAt: Date;
  note?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentWithStudent = {
  id: string;
  type: keyof typeof DOCUMENT_TYPE_LABELS;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  documentUrl: string;
  studentId: string;
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  rejected: boolean;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  uploadedBy: string | null;
  uploadedAt: Date;
  note: string | null;
  rejectReason?: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    grade: { grade: string };
    section: { name: string };
  };
};


export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  AADHAAR: 'Aadhaar Card',
  PAN: 'PAN Card',
  PASSPORT: 'Passport',
  BIRTH_CERTIFICATE: 'Birth Certificate',
  TRANSFER_CERTIFICATE: 'Transfer Certificate',
  BANK_PASSBOOK: 'Bank Passbook',
  PARENT_ID: 'Parent ID',
  AGREEMENT: 'Agreement',
};
