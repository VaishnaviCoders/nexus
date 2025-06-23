import type { DocumentType } from '@/lib/generated/prisma';

export interface StudentDocument {
  id: string;
  type: DocumentType;
  fileName?: string | null;
  fileSize?: number;
  fileType?: string;
  documentUrl: string;
  studentId: string;
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
