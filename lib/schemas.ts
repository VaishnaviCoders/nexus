import { z } from 'zod';
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
    .max(28, {
      message: 'Title must be at most 28 characters.',
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
  isRecurring: z.boolean().default(false),
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
