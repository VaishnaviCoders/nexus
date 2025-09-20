'use server';

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

import {
  type EvaluationType,
  type ExamMode,
  ExamStatus,
} from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import { type bulkExamFormData, bulkExamSchema } from '@/lib/schemas';
import type z from 'zod';
import { GeneratedExam } from '@/components/dashboard/exam/AIExamPromptDialog';

type BulkExamRow = z.infer<typeof bulkExamSchema>['exams'][number];

const google = createGoogleGenerativeAI({
  apiKey:
    process.env.NEXT_PUBLIC_GOOGLE_GEMINI_AI ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error('No GOOGLE_GENERATIVE_AI_API_KEY API key available');
}

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
  const today = new Date().toISOString().split('T')[0]; // "2025-09-21"
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
9. Use only future dates relative to ${today}
10. Start between 07:00 and 17:00
11. Return only JSON array, no extra text


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
  exams,
}: {
  exams: BulkExamRow[];
}): Promise<{ issues: string[] }> {
  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system:
        'You are an expert exam scheduler. Analyze the exam schedule and identify any conflicts or issues. Return a JSON array of strings describing each issue found. If no issues are found, return an empty array.',
      prompt: `Analyze this exam schedule for conflicts and issues:

Common issues to check for:
1. Time overlaps (same date/time conflicts)
2. Venue double-booking
3. Teacher/supervisor conflicts
4. Invalid passing marks (pass > max marks)
5. End time before start time
6. Unrealistic durations
7. Missing required information
8. Scheduling outside session dates

Exam Schedule:
${JSON.stringify(exams, null, 2)}

Return only a JSON array of issue descriptions. If no issues found, return [].`,
      temperature: 0.1,
    });

    let cleanText = text.trim();

    // 🧹 Remove code fences if model added them
    if (cleanText.startsWith('```')) {
      cleanText = cleanText
        .replace(/```[a-z]*\n?/gi, '')
        .replace(/```$/, '')
        .trim();
    }

    // ✅ Validate JSON structure
    if (!cleanText.startsWith('[')) {
      console.warn('AI returned unexpected output:', cleanText);
      return { issues: ['AI returned invalid format. Please try again.'] };
    }

    try {
      const parsed = JSON.parse(cleanText);

      if (Array.isArray(parsed)) {
        return { issues: parsed };
      } else {
        return { issues: ['AI returned invalid format. Please try again.'] };
      }
    } catch (parseError) {
      console.error('AI response parsing error:', parseError);
      return { issues: ['AI returned unreadable result. Please try again.'] };
    }
  } catch (aiError) {
    console.error('AI conflict check failed:', aiError);
    return {
      issues: [
        'AI conflict check failed. Please check your API configuration.',
      ],
    };
  }
}

export async function createBulkExams(data: bulkExamFormData) {
  const organizationId = await getOrganizationId();
  const validatedData = bulkExamSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error('Validation failed. Please fix form errors.');
  }

  const createdExams = [];

  for (const r of validatedData.data.exams) {
    try {
      const exam = await prisma.exam.create({
        data: {
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
          status: ExamStatus.UPCOMING,
          supervisors: r.supervisors,
          durationInMinutes: computeDurationFromRange(r.startDate, r.endDate),
          evaluationType: r.evaluationType as EvaluationType,
          venueMapUrl: r.venueMapUrl,
          weightage: r.weightage,
        },
      });

      createdExams.push(exam);
    } catch (error) {
      console.error('Failed to create exam:', error);

      throw new Error(`Failed to create exam: ${r.title}`);
    }
  }

  revalidatePath('/dashboard/exams');
  return { success: true, createdExams };
}

// The detectConflicts function is no longer needed as we rely on AI for all conflict checking
