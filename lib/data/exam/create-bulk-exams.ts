'use server';

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import {
  type bulkExamFormData,
  type bulkExamRowFormData,
  bulkExamSchema,
  RowSchema,
} from '@/lib/schemas';
import { EvaluationType, ExamMode } from '@/generated/prisma';
import z from 'zod';
import { GeneratedExam } from '@/components/dashboard/exam/AIExamPromptDialog';
import { revalidatePath } from 'next/cache';

const google = createGoogleGenerativeAI({
  apiKey:
    process.env.NEXT_PUBLIC_GOOGLE_GEMINI_AI ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_AI;

if (!apiKey) {
  throw new Error('No API key available');
}

function formatDateOnly(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type Subject = { id: string; name: string; code?: string | null };
type Teacher = { id: string; firstName: string; lastName: string };
type Section = { id: string; name: string; gradeId: string };
type Grade = { id: string; grade: string };
type ExamSession = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
};

type GenerateExamScheduleParams = {
  prompt: string;
  examSession: ExamSession;
  grade: Grade;
  section: Section;
  subjects: Subject[];
  teachers: Teacher[];
};

export async function generateExamSchedule({
  prompt,
  examSession,
  grade,
  section,
  subjects,
  teachers,
}: GenerateExamScheduleParams): Promise<{
  success: boolean;
  data?: GeneratedExam[];
  error?: string;
}> {
  try {
    const systemPrompt = `You are an AI exam scheduler for educational institutions. Generate a comprehensive exam schedule based on the user's natural language prompt.

Context:
- Session: ${examSession.title} (${examSession.startDate} to ${examSession.endDate})
- Grade: ${grade.grade}
- Section: ${section.name}
- Available Subjects: ${subjects.map((s) => s.name).join(', ')}
- Available Teachers: ${teachers.map((t) => `${t.firstName} ${t.lastName}`).join(', ')}
- Available Venues: Classroom A, Classroom B, Science Lab, Computer Lab, Main Hall, Library, Auditorium

Rules:
1. Only use subjects from the available list
2. Only assign teachers from the available list
3. Ensure no scheduling conflicts (same teacher, venue, or time)
4. Use appropriate venues for subjects (labs for science, main hall for large exams)
5. Schedule exams within the session date range
6. Provide realistic durations and marks
7. Include proper instructions and descriptions
8. alway return durationMinutes in minutes 

Return a JSON array of exam objects with this exact structure:
[{
  "subjectId": "subject_id_from_list",
  "subjectName": "Subject Name",
  "title": "Descriptive exam title",
  "startDate": "2024-01-15T09:00:00.000Z",
  "endDate": "2024-01-15T12:00:00.000Z",
  "maxMarks": 100,
  "passingMarks": 33,
  "mode": "OFFLINE",
  "evaluationType": "EXAM",
  "venue": "Classroom A",
  "supervisors": ["teacher_id1", "teacher_id2"],
  "supervisorNames": ["Teacher Name 1", "Teacher Name 2"],
  "description": "Brief description",
  "instructions": "Exam instructions",
  "durationMinutes": 180
}]

User Prompt: ${prompt}`;

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: systemPrompt,
      temperature: 0.3,
    });

    // Parse the AI response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return {
        success: false,
        error:
          'Invalid AI response format. Please try again with a more specific prompt.',
      };
    }

    const parsedExams: GeneratedExam[] = JSON.parse(jsonMatch[0]);

    // Validate and enhance the generated exams
    const validatedExams = parsedExams.map((exam) => {
      const subject = subjects.find(
        (s) => s.id === exam.subjectId || s.name === exam.subjectName
      );
      const conflicts = detectExamConflicts(exam, parsedExams);

      return {
        ...exam,
        subjectId: subject?.id || exam.subjectId,
        subjectName: subject?.name || exam.subjectName,
        conflicts,
      };
    });

    return {
      success: true,
      data: validatedExams,
    };
  } catch (error) {
    console.error('Error generating exam schedule:', error);
    return {
      success: false,
      error:
        'Failed to generate exam schedule. Please check your prompt and try again.',
    };
  }
}

function detectExamConflicts(
  exam: GeneratedExam,
  allExams: GeneratedExam[]
): string[] {
  const conflicts: string[] = [];

  allExams.forEach((otherExam) => {
    if (otherExam === exam) return;

    const examStart = new Date(exam.startDate);
    const examEnd = new Date(exam.endDate);
    const otherStart = new Date(otherExam.startDate);
    const otherEnd = new Date(otherExam.endDate);

    // Check time overlap
    if (examStart < otherEnd && examEnd > otherStart) {
      // Venue conflict
      if (exam.venue === otherExam.venue) {
        conflicts.push(`Venue conflict with ${otherExam.title}`);
      }

      // Supervisor conflict
      const commonSupervisors = exam.supervisors.filter((s) =>
        otherExam.supervisors.includes(s)
      );
      if (commonSupervisors.length > 0) {
        conflicts.push(`Supervisor conflict with ${otherExam.title}`);
      }
    }
  });

  return conflicts;
}

export async function aiConflictCheck({
  rows,
}: {
  rows: bulkExamRowFormData[];
}): Promise<{ issues: string[] }> {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (key) {
    try {
      console.log('[aiConflictCheck] Using AI for conflict detection');
      const google = createGoogleGenerativeAI({ apiKey: key });
      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        system:
          'You find scheduling conflicts. Output JSON array of strings only.',
        prompt: `Find overlapping times (same date), duplicate subjects per day, pass > max, end before start.
Return JSON array of strings only for issues.
Rows: ${JSON.stringify(rows)}`,
      });
      try {
        const parsed = JSON.parse(text) as string[];
        if (Array.isArray(parsed)) {
          console.log('[aiConflictCheck] AI found issues:', parsed.length);
          return { issues: parsed };
        } else {
          console.warn('[aiConflictCheck] AI returned non-array');
          return { issues: ['AI returned invalid format.'] };
        }
      } catch (parseError) {
        console.warn('[aiConflictCheck] AI parse failed:', parseError);
        return { issues: ['AI returned unreadable result.'] };
      }
    } catch (aiError) {
      console.warn('[aiConflictCheck] AI call failed:', aiError);
      // fall back to local
    }
  }

  console.log('[aiConflictCheck] Using local conflict detection');
  return { issues: await detectConflicts(rows) };
}

export async function createBulkExams(
  data: bulkExamFormData
): Promise<{ ok: boolean; message: string }> {
  // Validate payload server-side

  const organizationId = await getOrganizationId();
  const parsed = bulkExamSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: 'Validation failed. Please fix form errors.' };
  }

  // Enforce session window on server (if provided)
  const issues = await detectConflicts(data.rows);
  if (issues.length > 0) {
    return { ok: false, message: `Resolve conflicts first: ${issues[0]}` };
  }

  // Check for existing exams to prevent duplicates
  const existingExams = await prisma.exam.findMany({
    where: {
      examSessionId: data.sessionId,
      gradeId: data.gradeId,
      sectionId: data.sectionId,
      subjectId: { in: data.rows.map((r) => r.subjectId) },
    },
    select: { subjectId: true, title: true },
  });

  if (existingExams.length > 0) {
    const duplicateSubjects = existingExams.map((e) => e.title || e.subjectId);
    return {
      ok: false,
      message: `Exams already exist for these subjects: ${duplicateSubjects.join(', ')}. Please remove duplicates or use a different session.`,
    };
  }

  // Check if supervisors (teachers) are available and active
  const supervisorIds = data.rows
    .flatMap((r) => r.supervisors || [])
    .filter(Boolean);
  if (supervisorIds.length > 0) {
    const availableSupervisors = await prisma.teacher.findMany({
      where: {
        id: { in: supervisorIds },
        isActive: true,
        employmentStatus: 'ACTIVE',
      },
      select: {
        id: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });

    if (availableSupervisors.length !== supervisorIds.length) {
      const missingSupervisors = supervisorIds.filter(
        (id) => !availableSupervisors.find((s) => s.id === id)
      );
      return {
        ok: false,
        message: `Some supervisors are not available or inactive. Please check supervisor assignments.`,
      };
    }
  }

  //   Function For Calculate durationInMinutes from startDate/ Time and EndDate Time
  function computeDurationFromRange(
    startDate?: string | Date,
    endDate?: string | Date
  ) {
    if (!startDate || !endDate) return undefined;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;

    const diffMs = end.getTime() - start.getTime();
    const mins = Math.max(0, Math.round(diffMs / 60000));
    return mins > 0 ? mins : undefined;
  }

  try {
    await prisma.exam.createMany({
      data: data.rows.map((r) => ({
        title: r.title,
        description: r.description,
        instructions: r.instructions,
        mode: r.mode as ExamMode,
        maxMarks: r.max,
        passingMarks: r.pass,
        venue: r.venue,
        startDate: r.startDate,
        endDate: r.endDate,
        subjectId: r.subjectId,
        examSessionId: data.sessionId,
        organizationId,
        gradeId: data.gradeId,
        sectionId: data.sectionId,
        status: 'UPCOMING',
        supervisors: r.supervisors,
        durationInMinutes: computeDurationFromRange(r.startDate, r.endDate),
        evaluationType: r.evaluationType as EvaluationType,
        venueMapUrl: r.venueMapUrl,
        weightage: r.weightage,
      })),
    });

    revalidatePath('/dashboard/exams');

    return {
      ok: true,
      message: `Successfully created ${data.rows.length} exams.`,
    };
  } catch (error) {
    console.error('Failed to create exams:', error);

    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return {
            ok: false,
            message:
              'Duplicate exam detected. Some subjects already have exams in this session.',
          };
        case 'P2003':
          return {
            ok: false,
            message:
              'Invalid reference. Please check if all subjects, grades, and sections exist.',
          };
        case 'P2025':
          return {
            ok: false,
            message:
              'Record not found. Please verify all referenced data exists.',
          };
        default:
          return {
            ok: false,
            message: `Database error (${error.code}): ${error.message}`,
          };
      }
    }

    // Handle Prisma validation errors
    if (error instanceof PrismaClientValidationError) {
      return {
        ok: false,
        message: 'Data validation failed. Please check all required fields.',
      };
    }

    // Handle other Prisma errors
    if (error instanceof PrismaClientUnknownRequestError) {
      return {
        ok: false,
        message: 'Unknown database error occurred. Please try again.',
      };
    }

    // Handle generic errors
    return {
      ok: false,
      message:
        'Failed to create exams. Please check for duplicates or try again.',
    };
  }
}

// Local conflict detection based on ISO startDate/endDate
export async function detectConflicts(
  rows: bulkExamRowFormData[]
): Promise<string[]> {
  const issues: string[] = [];

  rows.forEach((r, idx) => {
    if (!r.subjectId) issues.push(`#${idx + 1} Select a subject.`);
    if (!r.title) issues.push(`#${idx + 1} Title is empty.`);

    const hasStart =
      r.startDate && !Number.isNaN(new Date(r.startDate).getTime());
    const hasEnd = r.endDate && !Number.isNaN(new Date(r.endDate).getTime());
    if (!hasStart || !hasEnd)
      issues.push(`#${idx + 1} Start/End date-time missing or invalid.`);

    if (hasStart && hasEnd) {
      if (new Date(r.endDate).getTime() <= new Date(r.startDate).getTime()) {
        issues.push(`#${idx + 1} End time must be after start time.`);
      }
    }

    if (r.pass > r.max)
      issues.push(`#${idx + 1} Pass (${r.pass}) > Max (${r.max}).`);
  });

  // Overlaps by date
  const byDate = new Map<
    string,
    { start: number; end: number; title: string }[]
  >();
  rows.forEach((r) => {
    if (!r.startDate || !r.endDate) return;
    const s = new Date(r.startDate);
    const e = new Date(r.endDate);
    const dateKey = formatDateOnly(s);
    const arr = byDate.get(dateKey) ?? [];
    arr.push({ start: s.getTime(), end: e.getTime(), title: r.title });
    byDate.set(dateKey, arr);
  });
  for (const [date, arr] of byDate.entries()) {
    arr.sort((a, b) => a.start - b.start);
    for (let i = 0; i < arr.length - 1; i++) {
      const a = arr[i];
      const b = arr[i + 1];
      if (a.end > b.start)
        issues.push(
          `Time overlap on ${date}: "${a.title}" overlaps with "${b.title}".`
        );
    }
  }

  // Duplicate subject on same date
  const seen = new Set<string>();
  rows.forEach((r) => {
    if (!r.subjectId || !r.startDate) return;
    const dateKey = formatDateOnly(new Date(r.startDate));
    const key = `${dateKey}:${r.subjectId}`;
    if (seen.has(key)) issues.push(`Duplicate subject on ${dateKey}.`);
    else seen.add(key);
  });

  return issues;
}
