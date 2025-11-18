'use client';

import { useTransition, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calculator,
  Loader2,
  Save,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  GRADING_SCALES,
  calculateGrade,
  getGradeColorBadge,
  type GradeScale,
} from '@/lib/utils';
import ExamResultEntry from '@/lib/data/exam/exam-result-entry';
import GradeScaleSelector from './GradeScaleSelector';
import {
  studentExamResultSchema,
  type studentExamResultFormData,
} from '@/lib/schemas';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  email?: string;
}

type Enrollment = {
  id: string;
  studentId: string;
  status: string;
  enrolledAt: Date;
  hallTicketIssued: boolean;
};

interface Exam {
  id: string;
  title: string;
  maxMarks: number;
  passingMarks: number | null;
  subject: {
    name: string;
  };
  examSession: {
    title: string;
  };
}

interface ExistingResult {
  studentId: string;
  obtainedMarks: number | null;
  percentage: number | null;
  gradeLabel: string | null;
  remarks: string | null;
  isPassed: boolean | null;
  isAbsent: boolean;
}

interface ExamResultsFormProps {
  exam: Exam;
  students: Student[];
  enrollments: Enrollment[];
  existingResults?: ExistingResult[];
}

// Helper: Check if student passes (>= not >)
const checkIfPassed = (
  obtainedMarks: number,
  passingMarks: number
): boolean => {
  return obtainedMarks >= passingMarks;
};

export default function ExamResultsForm({
  exam,
  students,
  enrollments,
  existingResults = [],
}: ExamResultsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedGradeScale, setSelectedGradeScale] = useState<GradeScale>(
    GRADING_SCALES[0]
  );

  // Create maps for quick lookups
  const enrollmentMap = new Map(enrollments.map((e) => [e.studentId, e]));

  const existingResultsMap = new Map(
    existingResults.map((result) => [result.studentId, result])
  );

  // Calculate passing marks (use ceil to avoid fractional passing marks)
  const passingMarks = exam.passingMarks ?? Math.ceil(exam.maxMarks * 0.33);

  const form = useForm<studentExamResultFormData>({
    resolver: zodResolver(studentExamResultSchema),
    defaultValues: {
      results: students.map((student) => {
        const existing = existingResultsMap.get(student.id);
        return {
          studentId: student.id,
          examId: exam.id,
          obtainedMarks: existing?.obtainedMarks ?? null,
          percentage: existing?.percentage ?? null,
          gradeLabel: existing?.gradeLabel ?? null,
          remarks: existing?.remarks ?? null,
          isPassed: existing?.isPassed ?? null,
          isAbsent: existing?.isAbsent ?? false,
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'results',
  });

  const watchedResults = form.watch('results');

  const handleMarksChange = (index: number, marks: string) => {
    const numericMarks = marks === '' ? null : Number.parseFloat(marks);

    if (numericMarks !== null && !isNaN(numericMarks)) {
      // Validate marks range
      if (numericMarks < 0 || numericMarks > exam.maxMarks) {
        toast.error(`Marks must be between 0 and ${exam.maxMarks}`);
        return;
      }

      const percentage =
        Math.round((numericMarks / exam.maxMarks) * 100 * 100) / 100;
      const grade = calculateGrade(percentage, selectedGradeScale);

      // Check if passed using >= (not >)
      const isPassed = checkIfPassed(numericMarks, passingMarks);

      form.setValue(`results.${index}.obtainedMarks`, numericMarks);
      form.setValue(`results.${index}.percentage`, percentage);
      form.setValue(`results.${index}.gradeLabel`, grade?.label || null);
      form.setValue(`results.${index}.isPassed`, isPassed);
      form.setValue(`results.${index}.isAbsent`, false);
    } else {
      form.setValue(`results.${index}.obtainedMarks`, null);
      form.setValue(`results.${index}.percentage`, null);
      form.setValue(`results.${index}.gradeLabel`, null);
      form.setValue(`results.${index}.isPassed`, null);
    }
  };

  const handleAbsentToggle = (index: number, isAbsent: boolean) => {
    if (isAbsent) {
      form.setValue(`results.${index}.isAbsent`, true);
      form.setValue(`results.${index}.obtainedMarks`, null);
      form.setValue(`results.${index}.percentage`, null);
      form.setValue(`results.${index}.isPassed`, false);
      form.setValue(`results.${index}.gradeLabel`, 'AB');
    } else {
      form.setValue(`results.${index}.isAbsent`, false);
      form.setValue(`results.${index}.gradeLabel`, null);
      form.setValue(`results.${index}.isPassed`, null);
    }
  };

  const handleGradeScaleChange = (newScale: GradeScale) => {
    setSelectedGradeScale(newScale);

    // Recalculate all grades with new scale
    watchedResults.forEach((result, index) => {
      if (
        result.percentage !== null &&
        !result.isAbsent &&
        result.obtainedMarks !== null
      ) {
        const grade = calculateGrade(result.percentage, newScale);
        const isPassed = checkIfPassed(result.obtainedMarks, passingMarks);

        form.setValue(`results.${index}.gradeLabel`, grade?.label || null);
        form.setValue(`results.${index}.isPassed`, isPassed);
      }
    });
  };

  const onSubmit = (data: studentExamResultFormData) => {
    startTransition(async () => {
      try {
        const result = await ExamResultEntry(data);
        if (result.success) {
          toast.success('Exam results submitted successfully!');
        } else {
          toast.error('Failed to submit results');
        }
      } catch (error) {
        toast.error('Submission failed', {
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        });
      }
    });
  };

  const calculateStats = () => {
    const results = watchedResults || [];
    const validResults = results.filter(
      (r) => r.obtainedMarks !== null && !r.isAbsent
    );
    const passedCount = validResults.filter((r) => r.isPassed).length;
    const absentCount = results.filter((r) => r.isAbsent).length;
    const averageMarks =
      validResults.length > 0
        ? validResults.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0) /
          validResults.length
        : 0;

    return {
      total: students.length,
      attempted: validResults.length,
      passed: passedCount,
      failed: validResults.length - passedCount,
      absent: absentCount,
      averageMarks: Math.round(averageMarks * 100) / 100,
      averagePercentage:
        Math.round((averageMarks / exam.maxMarks) * 100 * 100) / 100,
    };
  };

  const stats = calculateStats();

  // Get enrollment info for a student
  const getEnrollmentInfo = (studentId: string) => {
    const enrollment = enrollmentMap.get(studentId);
    return {
      isEnrolled: !!enrollment,
      hallTicketIssued: enrollment?.hallTicketIssued || false,
      status: enrollment?.status || 'NOT_ENROLLED',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {exam.title} - Results Entry
              </CardTitle>
              <CardDescription>
                {exam.subject.name} • {exam.examSession.title} • Max Marks:{' '}
                {exam.maxMarks} • Passing: {passingMarks}
              </CardDescription>
            </div>
            <div className="items-center gap-2 hidden md:flex">
              {existingResults.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Editing Mode
                </Badge>
              )}
              <Badge
                variant="outline"
                className="hidden items-center gap-1 md:flex"
              >
                <Users className="h-3 w-3" />
                {students.length} Students
              </Badge>
            </div>
          </div>
        </CardHeader>
        <GradeScaleSelector
          selectedScale={selectedGradeScale}
          onScaleChange={handleGradeScaleChange}
        />
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Live Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.attempted}
              </div>
              <div className="text-sm text-muted-foreground">Attempted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.passed}
              </div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.failed}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.absent}
              </div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.averageMarks}/{exam.maxMarks}
              </div>
              <div className="text-sm text-muted-foreground">Avg Marks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
              <CardDescription>
                Enter marks for each student. Passing threshold: {passingMarks}/
                {exam.maxMarks} marks
                {existingResults.length > 0 &&
                  ' • Existing results are pre-filled for editing.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead className="min-w-[200px]">Student</TableHead>
                      <TableHead className="min-w-[100px]">Roll No.</TableHead>
                      <TableHead className="min-w-[150px]">Status</TableHead>
                      <TableHead className="w-[120px] truncate">
                        Marks (/{exam.maxMarks})
                      </TableHead>
                      <TableHead className="w-[80px]">%</TableHead>
                      <TableHead className="w-[80px]">Grade</TableHead>
                      <TableHead className="w-[100px]">Result</TableHead>
                      <TableHead className="w-[80px]">Absent</TableHead>
                      <TableHead className="min-w-[120px]">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const student = students[index];
                      const enrollmentInfo = getEnrollmentInfo(student.id);
                      const result = watchedResults?.[index];

                      const grade =
                        result?.percentage !== null &&
                        result?.percentage !== undefined
                          ? calculateGrade(
                              result.percentage,
                              selectedGradeScale
                            )
                          : null;

                      const gradeBadge =
                        grade && result?.isPassed !== null
                          ? getGradeColorBadge(
                              grade,
                              result.isPassed || false,
                              passingMarks
                            )
                          : 'outline';

                      return (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                              {student.email && (
                                <div className="text-sm text-muted-foreground">
                                  {student.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {student.rollNumber}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {enrollmentInfo.isEnrolled ? (
                              <>
                                <Badge
                                  variant="ENROLLED"
                                  className="gap-1 justify-start"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  Enrolled
                                </Badge>
                                {enrollmentInfo.hallTicketIssued && (
                                  <Badge
                                    variant="secondary"
                                    className="gap-1 justify-start"
                                  >
                                    <FileCheck className="h-3 w-3" />
                                    Hall Ticket
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <Badge
                                variant="NOT_ENROLLED"
                                className="gap-1 justify-start"
                              >
                                <XCircle className="h-3 w-3" />
                                Not Enrolled
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`results.${index}.obtainedMarks`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      max={exam.maxMarks}
                                      step="0.5"
                                      placeholder="0"
                                      {...field}
                                      value={field.value ?? ''}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleMarksChange(
                                          index,
                                          e.target.value
                                        );
                                      }}
                                      disabled={
                                        result?.isAbsent ||
                                        !enrollmentInfo.isEnrolled
                                      }
                                      className="w-full"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            {!enrollmentInfo.isEnrolled && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                Not enrolled
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            {result?.percentage !== null &&
                              result?.percentage !== undefined && (
                                <Badge
                                  variant={result.isPassed ? 'PASS' : 'FAILED'}
                                >
                                  {result.percentage}%
                                </Badge>
                              )}
                          </TableCell>
                          <TableCell>
                            {result?.gradeLabel && (
                              <Badge variant={gradeBadge}>
                                {result.gradeLabel}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {result?.isAbsent ? (
                              <Badge variant="ABSENT" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Absent
                              </Badge>
                            ) : result?.isPassed !== null &&
                              result?.isPassed !== undefined ? (
                              <Badge
                                variant={result.isPassed ? 'PASS' : 'FAILED'}
                                className="gap-1"
                              >
                                {result.isPassed ? (
                                  <>
                                    <CheckCircle className="h-3 w-3" />
                                    Pass
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3" />
                                    Fail
                                  </>
                                )}
                              </Badge>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={result?.isAbsent || false}
                              onCheckedChange={(checked) =>
                                handleAbsentToggle(index, !!checked)
                              }
                              disabled={!enrollmentInfo.isEnrolled}
                            />
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={!enrollmentInfo.isEnrolled}
                                >
                                  {result?.remarks ? 'Edit' : 'Add'}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Teacher Remarks - {student.firstName}{' '}
                                    {student.lastName}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Add optional remarks for this student's
                                    performance.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <FormField
                                  control={form.control}
                                  name={`results.${index}.remarks`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Optional remarks about student's performance..."
                                          {...field}
                                          value={field.value || ''}
                                          rows={3}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>
                                    Save Remark
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {existingResults.length > 0
                    ? 'Update Results'
                    : 'Submit Results'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
