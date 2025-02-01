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
