'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

import { useTransition } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { createExam } from '@/lib/data/exam/create-exam';
import MultipleSelector from '@/components/ui/multi-select';
import { ExamFormData, examSchema } from '@/lib/schemas';

// Types inferred from your server page and schema
type Subject = { id: string; name: string; code?: string | null };
type Teacher = { id: string; firstName: string; lastName: string };
type SectionWithGrade = {
  id: string;
  name: string;
  grade: { id: string; name: string };
};
type ExamSession = { id: string; title: string };
const evaluationTypeOptions = [
  'TEST',
  'EXAM',
  'ASSIGNMENT',
  'PROJECT',
  'PRACTICAL',
  'QUIZ',
  'ORAL',
  'INTERNAL',
  'FINAL',
  'OTHER',
] as const;

const examModeOptions = [
  'ONLINE',
  'OFFLINE',
  'PRACTICAL',
  'VIVA',
  'TAKE_HOME',
] as const;

const examStatusOptions = [
  'UPCOMING',
  'LIVE',
  'COMPLETED',
  'CANCELLED',
] as const;

export function ExamCreateForm(props: {
  subjects: Subject[];
  teachers: Teacher[];
  sectionsWithGrade: SectionWithGrade[];
  examSession: ExamSession[];
  defaultValues?: Partial<ExamFormData>;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedStartTime, setSelectedStartTime] =
    React.useState<string>('10:00');
  const [selectedEndTime, setSelectedEndTime] = React.useState<string>('12:00');

  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      gradeSectionKey: '',
      maxMarks: 100,
      passingMarks: 33,
      weightage: 0,
      evaluationType: 'EXAM',
      mode: 'OFFLINE',
      status: 'UPCOMING',
      instructions: '',
      durationInMinutes: 0,
      venueMapUrl: '',
      venue: '',
      supervisors: [],
      startDate: new Date().toISOString(), // ISO string
      endDate: new Date().toISOString(),
      examSessionId: '',
      ...(props.defaultValues || {}),
    },
  });

  const { watch, setValue, handleSubmit, formState } = form;
  const mode = watch('mode');
  const maxMarks = watch('maxMarks');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  console.log('Form errors:', form.formState.errors);

  // Initialize time states when form values change
  React.useEffect(() => {
    if (startDate) {
      setSelectedStartTime(extractTimeFromISO(startDate));
    }
  }, [startDate]);

  React.useEffect(() => {
    if (endDate) {
      setSelectedEndTime(extractTimeFromISO(endDate));
    }
  }, [endDate]);

  function setPassingPercent(percent: number) {
    if (!maxMarks || maxMarks <= 0) return;
    const calculated = Math.floor((maxMarks * percent) / 100);
    setValue('passingMarks', calculated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  // Helper function to combine date and time into ISO string
  function combineDateTime(date: Date | undefined, time: string): string {
    if (!date) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined.toISOString();
  }

  // Helper function to extract time from ISO string
  function extractTimeFromISO(isoString: string): string {
    if (!isoString) return '10:00';
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // Helper function to extract date from ISO string
  function extractDateFromISO(isoString: string): Date | undefined {
    if (!isoString) return undefined;
    return new Date(isoString);
  }

  function computeDurationFromRange() {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!(start instanceof Date) || !(end instanceof Date)) return;
    const diffMs = end.getTime() - start.getTime();
    const mins = Math.max(0, Math.round(diffMs / 60000));
    if (mins > 0)
      setValue('durationInMinutes', mins, {
        shouldValidate: true,
        shouldDirty: true,
      });
  }

  async function onSubmit(data: ExamFormData) {
    startTransition(async () => {
      try {
        const result = await createExam(data);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Exam has been created successfully.');
          form.reset();
        }
      } catch (error) {
        toast.error('Failed to create Exam. Please try again.');
      }
    });
  }

  const gradeSectionOptions = React.useMemo(() => {
    // Compose "GradeName — SectionName" with a stable key "GradeName||SectionName"
    return props.sectionsWithGrade.map((s) => {
      const id = `${s.id} || ${s.grade.id}`;
      const label = `${s.grade.name} — ${s.name}`;
      const key = `${s.grade.name}||${s.name}`;
      return { id, key, label };
    });
  }, [props.sectionsWithGrade]);

  const teacherOptions = props.teachers.map((t) => ({
    value: t.id,
    label: `${t.firstName} ${t.lastName}`,
  }));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 my-2">
        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Maths Midterm" {...field} />
                </FormControl>
                <FormDescription>Use a clear, unique title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                        {s.code ? ` (${s.code})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="gradeSectionKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade & Section</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class & section" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeSectionOptions.map((opt) => (
                      <SelectItem key={opt.key} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Example: Grade 10 — A. Backend can map to IDs.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="evaluationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evaluation Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluationTypeOptions.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examModeOptions.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Marks & Weightage */}
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="maxMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Marks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step="1"
                    placeholder="100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passingMarks"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Passing Marks</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button
                      className="py-0 h-6"
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPassingPercent(33)}
                    >
                      33%
                    </Button>
                    <Button
                      className="py-0 h-6"
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPassingPercent(35)}
                    >
                      35%
                    </Button>
                  </div>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="33"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional. Leave blank if not applicable.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weightage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weightage (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="1"
                    placeholder="e.g., 20"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional, contributes to overall score.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Schedule */}
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => {
              const currentDate = extractDateFromISO(field.value);
              const currentTime = extractTimeFromISO(field.value);

              return (
                <FormItem>
                  <FormLabel>Start (Date & Time)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal border-slate-200 focus:border-blue-500 focus:ring-blue-500',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            <>
                              {new Intl.DateTimeFormat('en-IN', {
                                dateStyle: 'long',
                              }).format(new Date(field.value))}
                              {' at '}
                              {currentTime}
                            </>
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto max-w-md p-0 flex flex-col md:flex-row gap-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={(date) => {
                          if (date) {
                            const newDateTime = combineDateTime(
                              date,
                              selectedStartTime
                            );
                            field.onChange(newDateTime);
                          }
                        }}
                        autoFocus
                      />
                      <div className="no-scrollbar w-full md:w-1/3 overflow-y-auto p-4 border-t md:border-t-0 md:border-l max-h-72">
                        <div className="grid gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              type="button"
                              key={time}
                              variant={
                                selectedStartTime === time
                                  ? 'default'
                                  : 'outline'
                              }
                              onClick={() => {
                                setSelectedStartTime(time);
                                if (currentDate) {
                                  const newDateTime = combineDateTime(
                                    currentDate,
                                    time
                                  );
                                  field.onChange(newDateTime);
                                }
                              }}
                              className="w-full shadow-none"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Use local IST where applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => {
              const currentDate = extractDateFromISO(field.value);
              const currentTime = extractTimeFromISO(field.value);

              return (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>End (Date & Time)</FormLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="py-0 h-6"
                      onClick={computeDurationFromRange}
                    >
                      Auto Duration
                    </Button>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal border-slate-200 focus:border-blue-500 focus:ring-blue-500',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            <>
                              {new Intl.DateTimeFormat('en-IN', {
                                dateStyle: 'long',
                              }).format(new Date(field.value))}
                              {' at '}
                              {currentTime}
                            </>
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto max-w-md p-0 flex flex-col md:flex-row gap-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={(date) => {
                          if (date) {
                            const newDateTime = combineDateTime(
                              date,
                              selectedEndTime
                            );
                            field.onChange(newDateTime);
                          }
                        }}
                        autoFocus
                      />
                      <div className="no-scrollbar w-full md:w-1/3 overflow-y-auto p-4 border-t md:border-t-0 md:border-l max-h-72">
                        <div className="grid gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              type="button"
                              key={time}
                              variant={
                                selectedEndTime === time ? 'default' : 'outline'
                              }
                              onClick={() => {
                                setSelectedEndTime(time);
                                if (currentDate) {
                                  const newDateTime = combineDateTime(
                                    currentDate,
                                    time
                                  );
                                  field.onChange(newDateTime);
                                }
                              }}
                              className="w-full shadow-none"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="durationInMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (mins)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="90" {...field} />
                </FormControl>
                <FormDescription>
                  Optional. "Auto Duration" uses start/end.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Venue (for offline/practical/viva) */}
          {['OFFLINE', 'PRACTICAL', 'VIVA'].includes(mode) && (
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Room 201 (Physics Lab)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Required for non-online modes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Supervisors */}
          <FormField
            control={form.control}
            name="supervisors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisors / Invigilators</FormLabel>
                <FormControl>
                  <MultipleSelector
                    options={teacherOptions}
                    value={field.value.map((value) => ({
                      value,
                      label:
                        teacherOptions.find((t) => t.value === value)?.label ||
                        value,
                    }))}
                    onChange={(options) =>
                      field.onChange(options.map((option) => option.value))
                    }
                    placeholder="Select supervisors"
                    emptyIndicator="No supervisors found."
                  />
                </FormControl>
                <FormDescription>
                  Add at least one for offline/practical/viva exams.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location / venueMapUrl (for offline/practical/viva) */}

        <FormField
          control={form.control}
          name="venueMapUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Map Url </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.google.com/maps/search/?api=1&query=Kokane+Chowk+Pune"
                  {...field}
                />
              </FormControl>
              <FormDescription>Add Location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instructions */}
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="e.g., Bring admit card and black/blue pen. Mobile phones are not allowed."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional guidelines for students.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Session (optional linking now) */}
        <FormField
          control={form.control}
          name="examSessionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Session ID </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Session" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.examSession.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                If your flow attaches sessions on the backend, you may leave
                this blank.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Internal note or exam description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Create Exam'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
