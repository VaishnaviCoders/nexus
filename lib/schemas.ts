import { z } from 'zod';

export const CreateNoticeFormSchema = z.object({
  noticeType: z.string().min(1, { message: 'Notice type is required' }),
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters.',
    })
    .max(18, {
      message: 'Title must be at most 18 characters.',
    }),
  startDate: z
    .date()
    .min(new Date(), { message: 'Start date must be in the future' }),
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

// ... existing code ...

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
  sectionId: z.string().optional(),
  gradeId: z.string(),

  emergencyContact: z.string().min(1, 'Emergency contact is required'),

  // profileImage: z.string().url().optional(),

  motherName: z.string().optional(),
  fullName: z.string().optional(),
  // documents: z
  //   .array(
  //     z.object({
  //       // Define document validation schema if needed
  //     })
  //   )
  //   .optional(),
  // parents: z
  //   .array(
  //     z.object({
  //       // Define parent validation schema if needed
  //     })
  //   )
  //   .optional(),
});
