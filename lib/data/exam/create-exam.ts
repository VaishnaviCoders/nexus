'use server';

import { Prisma } from '@/generated/prisma/client';
import { EvaluationType, ExamMode, ExamStatus } from '@/generated/prisma/enums';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const ExamFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().max(1000).optional().or(z.literal('')),
  subjectId: z.string().min(1, 'Subject is required'),
  gradeSectionKey: z.string().min(1, 'Class & Section is required'), // "GradeName||SectionName"
  maxMarks: z.coerce
    .number()
    .positive('Max marks must be > 0')
    .max(1000, 'Max too large'),
  passingMarks: z
    .union([z.coerce.number(), z.literal('')])
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  weightage: z.coerce.number().optional(),
  evaluationType: z.enum(
    Object.values(EvaluationType) as [string, ...string[]]
  ),
  mode: z.enum(Object.values(ExamMode) as [string, ...string[]]),
  status: z
    .enum(Object.values(ExamStatus) as [string, ...string[]])
    .default('UPCOMING'),
  instructions: z.string().max(2000).optional().or(z.literal('')),
  durationInMinutes: z.coerce.number().optional(),
  venueMapUrl: z.string().optional(),
  venue: z.string().max(200).optional().or(z.literal('')),
  supervisors: z.array(z.string()).default([]), // teacher IDs
  startDate: z.string().min(1, 'Start date/time is required'), // ISO string
  endDate: z.string().min(1, 'End date/time is required'),
  // Optional: link to session later. DB schema requires, but allow backend to attach by policy.
  examSessionId: z.string().or(z.literal('')),
});

export type ExamFormData = z.infer<typeof ExamFormSchema>;

export async function createExam(data: ExamFormData) {
  try {
    console.log('formData', data);
    const validatedData = ExamFormSchema.safeParse(data);

    const organizationId = await getOrganizationId();

    if (!validatedData.success || !validatedData.data) {
      return { error: 'Invalid form data' };
    }

    const form = validatedData.data;

    // Get a default exam session if none provided
    let examSessionId = form.examSessionId;
    if (!examSessionId) {
      const defaultSession = await prisma.examSession.findFirst({
        where: {
          academicYear: {
            organizationId: organizationId,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (!defaultSession) {
        return {
          error: 'No exam session found. Please create an exam session first.',
        };
      }
      examSessionId = defaultSession.id;
    }

    await prisma.exam.create({
      data: {
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        title: form.title,
        description: form.description,
        instructions: form.instructions,
        venueMapUrl: form.venueMapUrl,
        venue: form.venue,
        durationInMinutes: form.durationInMinutes,
        examSessionId: examSessionId,
        maxMarks: form.maxMarks,
        passingMarks: form.passingMarks,
        weightage: form.weightage,
        mode: form.mode as ExamMode,
        evaluationType: form.evaluationType as EvaluationType,
        gradeId: form.gradeSectionKey.split(' || ')[1], // grade.id
        sectionId: form.gradeSectionKey.split(' || ')[0], // section.id
        supervisors: form.supervisors,
        subjectId: form.subjectId,
        organizationId,

        status: form.status as ExamStatus,
      },
    });
    revalidatePath('/dashboard/exams');
    return { success: 'Exam created successfully' };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return {
        error:
          'This Exam is already created for the subject , selected grade, section, and academic year.',
      };
    }
    throw err;
  }
}
