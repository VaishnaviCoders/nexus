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
  GraduationCap,
  Loader2,
  Save,
  Users,
  RefreshCw,
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
  isPassingGrade,
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
  existingResults?: ExistingResult[];
}

export default function ExamResultsForm({
  exam,
  students,
  existingResults = [],
}: ExamResultsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedGradeScale, setSelectedGradeScale] = useState<GradeScale>(
    GRADING_SCALES[0]
  );

  const existingResultsMap = new Map(
    existingResults.map((result) => [result.studentId, result])
  );

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
      const percentage =
        Math.round((numericMarks / exam.maxMarks) * 100 * 100) / 100;
      const grade = calculateGrade(percentage, selectedGradeScale);
      const passingPercentage = exam.passingMarks
        ? (exam.passingMarks / exam.maxMarks) * 100
        : 33;

      const isPassed = isPassingGrade(percentage, passingPercentage);

      form.setValue(`results.${index}.obtainedMarks`, numericMarks);
      form.setValue(`results.${index}.percentage`, percentage);
      form.setValue(`results.${index}.gradeLabel`, grade?.label || null);
      form.setValue(`results.${index}.isPassed`, isPassed);
      form.setValue(`results.${index}.isAbsent`, false);
    } else {
      form.setValue(`results.${index}.obtainedMarks`, numericMarks);
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
      if (result.percentage !== null && !result.isAbsent) {
        const grade = calculateGrade(result.percentage, newScale);
        const passingPercentage = exam.passingMarks
          ? (exam.passingMarks / exam.maxMarks) * 100
          : 33;
        const isPassed = isPassingGrade(result.percentage, passingPercentage);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {exam.title} - Results Entry
              </CardTitle>
              <CardDescription>
                {exam.subject.name} • {exam.examSession.title} • Max Marks:{' '}
                {exam.maxMarks}
                {exam.passingMarks !== null &&
                  ` • Passing: ${exam.passingMarks}`}
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
      </Card>

      <GradeScaleSelector
        selectedScale={selectedGradeScale}
        onScaleChange={handleGradeScaleChange}
      />

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
            {/* <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.attempted}
              </div>
              <div className="text-sm text-muted-foreground">Attempted</div>
            </div> */}
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
              <div className="text-2xl font-bold text-purple-600">
                {stats.averageMarks}
              </div>
              <div className="text-sm text-muted-foreground">Avg Marks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.averagePercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Avg %</div>
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
                Enter marks for each student. Grades are calculated
                automatically using the selected scale.
                {existingResults.length > 0 &&
                  ' Existing results are pre-filled for editing.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Roll No.
                      </TableHead>
                      <TableHead className="w-[120px]">Marks</TableHead>
                      <TableHead className="w-[80px]">%</TableHead>
                      <TableHead className="w-[80px]">Grade</TableHead>
                      <TableHead className="w-[80px]">Status</TableHead>
                      <TableHead className="w-[80px]">Absent</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const student = students[index];
                      const result = watchedResults?.[index] || {
                        studentId: student.id,
                        examId: exam.id,
                        obtainedMarks: null,
                        percentage: null,
                        gradeLabel: null,
                        remarks: null,
                        isPassed: null,
                        isAbsent: false,
                      };

                      const grade =
                        result.percentage !== null
                          ? calculateGrade(
                              result.percentage,
                              selectedGradeScale
                            )
                          : null;
                      const gradeBadge =
                        grade && result.isPassed !== null
                          ? getGradeColorBadge(
                              grade,
                              result.isPassed || false,
                              exam.passingMarks || 33
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
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell className="min-w-[90px]">
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
                                      disabled={result.isAbsent}
                                      className="w-full"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            {result.percentage !== null && (
                              <Badge
                                variant={
                                  result.isPassed ? 'default' : 'destructive'
                                }
                              >
                                {result.percentage}%
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.gradeLabel && (
                              <Badge variant={gradeBadge}>
                                {result.gradeLabel}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.isPassed !== null && (
                              <Badge
                                variant={
                                  result.isAbsent
                                    ? 'absent'
                                    : result.isPassed
                                      ? 'pass'
                                      : 'failed'
                                }
                              >
                                {result.isAbsent
                                  ? 'Absent'
                                  : result.isPassed
                                    ? 'Pass'
                                    : 'Fail'}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={result.isAbsent}
                              onCheckedChange={(checked) =>
                                handleAbsentToggle(index, !!checked)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant={
                                    result.remarks ? 'outline' : 'outline'
                                  }
                                  size="sm"
                                  className="w-full"
                                >
                                  {result.remarks
                                    ? 'Edit Remark'
                                    : 'Add Remark'}
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
