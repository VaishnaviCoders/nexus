'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { createTeachingAssignment } from '@/lib/data/teaching-assignment/createTeachingAssignment';

const teachingAssignmentSchema = z.object({
  teacherId: z.string().min(1, 'Teacher is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  gradeId: z.string().min(1, 'Grade is required'),
  sectionId: z.string().min(1, 'Section is required'),
  academicYearId: z.string().optional(),
  notes: z.string().optional(),
});

type TeachingAssignmentFormData = z.infer<typeof teachingAssignmentSchema>;

interface FormDataProps {
  teachers: Array<{
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    employeeCode: string | null;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  grades: Array<{
    id: string;
    grade: string;
    section: Array<{
      id: string;
      name: string;
    }>;
  }>;
  academicYears: Array<{
    id: string;
    name: string;
    isCurrent: boolean;
  }>;
}
export function AddTeachingAssignmentForm({
  formData,
}: {
  formData: FormDataProps;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  const form = useForm<TeachingAssignmentFormData>({
    resolver: zodResolver(teachingAssignmentSchema),
    defaultValues: {
      teacherId: '',
      subjectId: '',
      gradeId: '',
      sectionId: '',
      academicYearId: formData.academicYears.find((y) => y.isCurrent)?.id || '',
      notes: '',
    },
  });

  const onSubmit = async (data: TeachingAssignmentFormData) => {
    startTransition(async () => {
      const result = await createTeachingAssignment(data);

      if (result.success) {
        toast.success('Teaching assignment created successfully!');
        form.reset();
        setSelectedGrade('');
      } else if (result.error) {
        form.setError('root', {
          message: result.error,
        });
        toast.error(result.error);
      }
    });
  };

  const selectedGradeData = formData.grades.find((g) => g.id === selectedGrade);
  const currentAcademicYear = formData.academicYears.find((y) => y.isCurrent);

  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    form.setValue('gradeId', gradeId);
    form.setValue('sectionId', ''); // Reset section when grade changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Teacher Selection */}
          <FormField
            control={form.control}
            name="teacherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData.teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        <div className="flex flex-col items-start">
                          <span>
                            {teacher.user.firstName} {teacher.user.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {teacher.employeeCode &&
                              `${teacher.employeeCode} • `}
                            {teacher.user.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject Selection */}
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData.subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex flex-col items-start">
                          <span>{subject.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {subject.code}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grade Selection */}
          <FormField
            control={form.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleGradeChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData.grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section Selection */}
          <FormField
            control={form.control}
            name="sectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedGradeData}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedGradeData?.section.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Academic Year Selection */}
          <FormField
            control={form.control}
            name="academicYearId"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Academic Year</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          currentAcademicYear
                            ? `${currentAcademicYear.name} (Current)`
                            : 'Select academic year'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData.academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name} {year.isCurrent && '(Current)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Defaults to current academic year if not specified
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional instructions or notes for this assignment..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Any additional information or special instructions for this
                  teaching assignment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.formState.errors.root && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setSelectedGrade('');
            }}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending ? 'Creating...' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
