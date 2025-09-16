import { object, z } from 'zod';
import {
  DocumentType,
  EvaluationType,
  ExamMode,
  PaymentMethod,
} from '@/generated/prisma/enums';
// const ACCEPTED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp',git
// ];
// const MAX_FILE_SIZE = 5000000;

export const CreateNoticeFormSchema = z.object({
  noticeType: z.string().min(1, { message: 'Notice type is required' }),
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters.',
    })
    .max(48, {
      message: 'Title must be at most 48 characters.',
    }),
  startDate: z.date(),
  // startDate: z
  // .date()
  // .min(new Date(), { message: 'Start date must be in the future' }),
  endDate: z.date(),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
  isDraft: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  emailNotification: z.boolean().default(true),
  pushNotification: z.boolean().default(false),
  WhatsAppNotification: z.boolean().default(true),
  targetAudience: z.array(z.string()).min(1, {
    message: 'Select at least one audience group.',
  }),
  attachments: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      type: z.string(),
      size: z.number(),
    })
  ),
});

export const gradeSchema = z.object({
  grade: z.string().min(1, 'Grade name is required'),
});
export const sectionSchema = z.object({
  gradeId: z.string(),
  name: z.string().min(1, 'Section name is required'),
});

export const parentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  whatsAppNumber: z.string().optional(),
  relationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']),
  isPrimary: z.boolean().optional().default(false),
});

export const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),

  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  whatsAppNumber: z
    .string()
    .min(10, 'WhatsApp number must be at least 10 digits'),

  rollNumber: z.string().min(1, 'Roll number is required'),

  dateOfBirth: z
    .date()
    .max(new Date(), { message: 'Date of birth must be in the past' }),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  sectionId: z.string().min(1, 'Section ID is required'),
  gradeId: z.string().min(1, 'Grade ID is required'),

  emergencyContact: z.string().min(1, 'Emergency contact is required'),

  profileImage: z.string(),

  motherName: z.string().optional(),
  fullName: z.string().optional(),
  parents: z
    .array(parentSchema)
    .min(1, 'At least one parent is required')
    .optional(),
});
export const updateStudentSchema = studentSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export const documentUploadSchema = z.object({
  type: z.nativeEnum(DocumentType, {
    required_error: 'Please select a document type',
  }),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'File size must be less than 10MB'
    )
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(
          file.type
        ),
      'Only JPEG, PNG, WebP, and PDF files are allowed'
    ),
  note: z.string().optional(),
});

export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

// Fees

export const feeCategorySchema = z.object({
  categoryName: z.string().min(1, 'Fee Category is required'),
  description: z.string().min(1, 'Description is required'),
});

export const feeAssignmentSchema = z.object({
  feeCategoryId: z.string().min(1, 'Fee Category ID is required'),

  feeAmount: z
    .string()
    .min(1, 'Fee Amount is required')
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
      message: 'Fee Amount must be greater than 0',
    }),
  dueDate: z.date({
    required_error: 'A due date is required',
  }),
  studentIds: z.union([
    z.string().min(1), // for single student
    z.array(z.string().min(1)), // for multiple students
  ]),
});

export const singleHolidayFormSchema = z.object({
  name: z.string().min(1, { message: 'Holiday name is required' }),
  startDate: z.date(),
  endDate: z.date(),
  type: z.enum(['PLANNED', 'SUDDEN', 'INSTITUTION_SPECIFIC']),
  reason: z.string().min(1, { message: 'Reason is required' }),
  isRecurring: z.boolean().default(false).optional(),
});

export const goggleImportHolidayFormSchema = z.array(
  z.object({
    name: z.string().min(1, { message: 'Holiday name is required' }),
    startDate: z.date(),
    endDate: z.date(),
    type: z.enum(['PLANNED', 'SUDDEN', 'INSTITUTION_SPECIFIC']),
    reason: z.string().min(1, { message: 'Reason is required' }),
    isRecurring: z.boolean().default(false),
  })
);

export const studentProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  middleName: z.string().optional(),
  motherName: z.string().min(2, "Mother's name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: 'Please select a gender',
  }),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  whatsAppNumber: z
    .string()
    .min(10, 'WhatsApp number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  emergencyContact: z
    .string()
    .min(10, 'Emergency contact must be at least 10 digits'),
  profileImage: z.string().optional(),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;

export const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  organizationSlug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  contactEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  contactPhone: z.string().optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  organizationType: z
    .enum([
      'SCHOOL',
      'COLLEGE',
      'COACHING_CLASS',
      'UNIVERSITY',
      'KINDERGARTEN',
      'TRAINING_INSTITUTE',
      'OTHER',
    ])
    .optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// Teacher

export const teacherProfileSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  profilePhoto: z.string().optional(),

  // Contact Information
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Please enter a complete address'),
  city: z.string().optional(),
  state: z.string().optional(),
  dateOfBirth: z
    .date()
    .max(new Date(), { message: 'Date of birth must be in the past' }),

  // Professional Information
  qualification: z.string().min(5, 'Please enter your qualification details'),
  experienceInYears: z
    .number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience seems too high'),
  resumeUrl: z.string().optional(),

  // Teaching Preferences
  specializedSubjects: z
    .array(z.string())
    .min(1, 'Please select at least one subject'),
  preferredGrades: z
    .array(z.string())
    .min(1, 'Please select at least one grade'),

  // Optional Information
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  linkedinPortfolio: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  languagesKnown: z.array(z.string()).optional(),
  teachingPhilosophy: z
    .string()
    .max(1000, 'Teaching philosophy must be less than 1000 characters')
    .optional(),

  // Documents
  certificateUrls: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
      })
    )
    .optional(),
  idProofUrl: z.string().optional(),
});

export type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>;

export const createTeacherSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  employeeCode: z
    .string()
    .min(3, 'Employee code must be at least 3 characters'),

  // Contact Information
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),

  // Professional Information
  dateOfBirth: z
    .date()
    .max(new Date(), { message: 'Date of birth must be in the past' }),
  qualification: z.string().min(2, 'Qualification is required'),
  experienceInYears: z.number().min(0, 'Experience cannot be negative'),
  joinedAt: z.date({ required_error: 'Joining date is required' }),

  idProofUrl: z.string().url().optional(),

  // Teaching Information
  specializedSubjects: z
    .array(z.string())
    .min(1, 'At least one subject is required'),
  preferredGrades: z.array(z.string()).min(1, 'At least one grade is required'),

  // Optional Information
  bio: z.string().optional(),
  teachingPhilosophy: z.string().optional(),
  linkedinPortfolio: z.string().url().optional().or(z.literal('')),
  languagesKnown: z.array(z.string()).optional(),
});

export type CreateTeacherFormData = z.infer<typeof createTeacherSchema>;

export const academicYearSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  type: z.enum(['ANNUAL', 'SEMESTER', 'TRIMESTER', 'BATCH']),
  description: z.string().optional(),
  isCurrent: z.boolean().default(false),
  organizationId: z.string().min(1, 'Organization ID is required'),
});

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;

export const academicYearUpdateSchema = academicYearSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export type AcademicYearUpdateFormData = z.infer<
  typeof academicYearUpdateSchema
>;

//  Payment Reminder schema
export const reminderFormSchema = z.object({
  recipients: z.array(z.string()).min(1, 'Select at least one recipient'),
  channels: z
    .array(z.enum(['email', 'sms', 'whatsapp']))
    .min(1, 'Select at least one channel'),
  templateId: z.string().min(1, 'Please select a template'),

  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
  sendNow: z.boolean().default(true),
});

export type ReminderFormValues = z.infer<typeof reminderFormSchema>;

// Offline Payment

export const offlinePaymentSchema = z.object({
  feeId: z.string().min(1),
  amount: z.coerce.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  transactionId: z.string().optional(),
  note: z.string().optional(),
  payerId: z.string(),
});

export type offlinePaymentFormData = z.infer<typeof offlinePaymentSchema>;

export const subjectSchema = z.object({
  name: z
    .string()
    .min(2, 'Subject name must be at least 2 characters')
    .max(100, 'Subject name must be less than 100 characters'),
  code: z
    .string()
    .min(1, 'Subject code is required')
    .min(2, 'Subject code must be at least 2 characters')
    .regex(
      /^[A-Z0-9]+$/,
      'Subject code must contain only uppercase letters and numbers'
    )
    .transform((val) => val.toUpperCase()),

  description: z
    .string()
    .max(512, 'Description must be less than 512 characters')
    .optional(),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;

// Exams

export const RowSchema = z
  .object({
    subjectId: z.string().min(1, 'Select a subject'),
    title: z.string().min(1, 'Title is required'),
    startDate: z.string().min(1, 'Start date/time must be an ISO date-time'),
    endDate: z.string().min(1, 'End date/time must be an ISO date-time'),
    max: z.coerce.number().min(1).max(1000),
    pass: z.coerce.number().min(0),
    mode: z.enum(Object.values(ExamMode) as [string, ...string[]]),
    weightage: z.coerce.number().min(0).optional().default(0),
    evaluationType: z
      .enum(Object.values(EvaluationType) as [string, ...string[]])
      .optional()
      .default(EvaluationType.EXAM),
    venue: z.string().optional().default(''),
    venueMapUrl: z.string().optional(),
    supervisors: z.array(z.string()).default([]),
    description: z.string().optional(),
    instructions: z.string().optional(),
  })
  .refine(
    (v) => new Date(v.endDate).getTime() > new Date(v.startDate).getTime(),
    {
      message: 'End time must be after start time',
      path: ['endDate'],
    }
  )
  .refine((v) => v.pass <= v.max, {
    message: 'Pass must be <= Max',
    path: ['pass'],
  });

export type bulkExamRowFormData = z.infer<typeof RowSchema>;

export const bulkExamSchema = z.object({
  sessionId: z.string().min(1, 'Pick session'),
  gradeId: z.string().min(1, 'Pick grade'),
  sectionId: z.string().min(1, 'Pick section'),
  // Optional session window for client-side validation; server will also enforce
  rows: z.array(RowSchema).min(1, 'Add at least one exam'),
});

export type bulkExamFormData = z.infer<typeof bulkExamSchema>;

export const studentExamResultSchema = z.object({
  results: z.array(
    z.object({
      studentId: z.string(),
      examId: z.string(),
      obtainedMarks: z.number().nullable(),
      percentage: z.number().nullable(),
      gradeLabel: z.string().optional().nullable(),
      remarks: z.string().optional().nullable(),
      isPassed: z.boolean().optional().nullable(),
      isAbsent: z.boolean().default(false),
    })
  ),
});

export type studentExamResultFormData = z.infer<typeof studentExamResultSchema>;
