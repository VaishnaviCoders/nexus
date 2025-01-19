import { z } from 'zod';

export const CreateNoticeFormSchema = z.object({
  noticeType: z.string(),
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  startDate: z.date(),
  endDate: z.date(),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
  isDraft: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  emailNotification: z.boolean().default(true),
  pushNotification: z.boolean().default(false),
  inAppNotification: z.boolean().default(true),
  targetAudience: z.array(z.string()).min(1, {
    message: 'Select at least one audience group.',
  }),
  attachments: z.array(z.any()).optional(),
});
