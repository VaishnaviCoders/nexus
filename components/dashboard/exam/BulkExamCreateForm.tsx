'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Download, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import MultipleSelector from '@/components/ui/multi-select';
import Papa from 'papaparse';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  aiConflictCheck,
  createBulkExams,
  detectConflicts,
} from '@/lib/data/exam/create-bulk-exams';
import { bulkExamFormData, bulkExamSchema } from '@/lib/schemas';
import { EvaluationType, ExamMode } from '@/generated/prisma/enums';
import { ConflictCheckSheet } from './ExamConflictSheet';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AIExamPromptDialog, { GeneratedExam } from './AIExamPromptDialog';

type Subject = { id: string; name: string; code?: string | null };
type Teacher = { id: string; firstName: string; lastName: string };
type Section = { id: string; name: string; gradeId: string };
type Grade = { id: string; grade: string; section: Section[] };
type ExamSession = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
};

type Props = {
  examSessions: ExamSession[];
  grades: Grade[];
  sections: Section[];
  subjects: Subject[];
  teachers: Teacher[];
  defaultSessionId?: string;
  defaultGradeId?: string;
  defaultSectionId?: string;
};

type FormData = z.infer<typeof bulkExamSchema>;

export function BulkExamCreateForm({
  examSessions,
  grades,
  sections,
  subjects,
  teachers,
  defaultSessionId,
  defaultGradeId,
  defaultSectionId,
}: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(bulkExamSchema),
    defaultValues: {
      sessionId: defaultSessionId || '',
      gradeId: defaultGradeId || '',
      sectionId: defaultSectionId || '',
      rows: [
        {
          subjectId: '',
          title: '',
          startDate: '',
          endDate: '',
          max: 100,
          pass: 33,
          mode: 'OFFLINE',
          evaluationType: 'EXAM',
          weightage: 0,
          venueMapUrl: '',
          venue: '',
          supervisors: [],
          description: '',
          instructions: '',
        },
      ],
    },
    mode: 'onSubmit',
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'rows',
  });

  const selectedSessionId = form.watch('sessionId');
  const selectedGradeId = form.watch('gradeId');
  const selectedSectionId = form.watch('sectionId');

  const timeSlots = React.useMemo(
    () =>
      Array.from({ length: 37 }, (_, i) => {
        const totalMinutes = i * 15;
        const hour = Math.floor(totalMinutes / 60) + 6;
        const minute = totalMinutes % 60;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      }),
    []
  );

  function combineDateTime(date: Date | undefined, time: string): string {
    if (!date) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined.toISOString();
  }
  function extractTimeFromISO(isoString: string): string {
    if (!isoString) return '10:00';
    const d = new Date(isoString);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  function extractDateFromISO(isoString: string): Date | undefined {
    if (!isoString) return undefined;
    const d = new Date(isoString);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }

  // CSV helpers (use startDate/endDate columns)
  function rowsToCsv(rows: FormData['rows']): string {
    const flat = rows.map((r) => ({
      subjectId: r.subjectId,
      title: r.title,
      startDate: r.startDate,
      endDate: r.endDate,
      max: r.max,
      pass: r.pass,
      mode: r.mode,
      venue: r.venue ?? '',
      venueMapUrl: r.venueMapUrl ?? '',

      'supervisorIds(; separated)': (r.supervisors || []).join(';'),
      description: r.description ?? '',
      instructions: r.instructions ?? '',
    }));
    return Papa.unparse(flat);
  }
  function downloadCsv(filename: string, rows: (string | number)[][] | string) {
    const csv = Array.isArray(rows) ? Papa.unparse(rows) : rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  async function parseCsv(
    file: File
  ): Promise<{ rows: FormData['rows']; error?: string }> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rows = (results.data as any[]).map((r) => ({
              subjectId: String(r.subjectId || ''),
              title: String(r.title || ''),
              startDate: String(r.startDate || ''),
              endDate: String(r.endDate || ''),
              max: Number(r.max ?? 100),
              pass: Number(r.pass ?? 33),
              mode: String(r.mode || 'OFFLINE').toUpperCase() as ExamMode,
              evaluationType: String(
                r.evaluationType || 'EXAM'
              ).toUpperCase() as EvaluationType,
              venue: String(r.venue || ''),
              supervisors: String(
                r['supervisorIds(; separated)'] || r.supervisorIds || ''
              )
                .split(';')
                .map((s: string) => s.trim())
                .filter(Boolean),
              weightage: Number(r.weightage || 0),

              description: String(r.description || ''),
              instructions: String(r.instructions || ''),
            }));
            resolve({ rows });
          } catch (e: any) {
            resolve({ rows: [], error: e?.message ?? 'Failed to parse CSV' });
          }
        },
        error: (err) => resolve({ rows: [], error: err.message }),
      });
    });
  }

  const onDownloadTemplate = () =>
    downloadCsv('exam-template.csv', [
      [
        'subjectId',
        'title',
        'startDate(ISO)',
        'endDate(ISO)',
        'max',
        'pass',
        'mode',
        'venue',
        'supervisorIds(; separated)',
        'description',
        'instructions',
      ],
    ]);

  const onExportCsv = () => {
    const data = form.getValues();
    downloadCsv('exams.csv', rowsToCsv(data.rows));
  };

  const onUploadCsv = async (file: File) => {
    const parsed = await parseCsv(file);
    if (parsed.error) {
      alert('CSV error: ' + parsed.error);
      return;
    }
    replace(parsed.rows);
    alert(`CSV imported ${parsed.rows.length} rows`);
  };

  const [conflictOpen, setConflictOpen] = React.useState(false);
  const [manualConflicts, setManualConflicts] = React.useState<string[]>([]);
  const [aiConflicts, setAiConflicts] = React.useState<string[]>([]);
  const [isPending, startTransition] = React.useTransition();

  const runChecks = async () => {
    try {
      const v = form.getValues();
      toast.info('Running conflict checks...');

      // Run manual conflict detection
      const manual = await detectConflicts(v.rows);
      setManualConflicts(manual);

      // Run AI conflict detection
      let ai: string[] = [];
      try {
        const { issues } = await aiConflictCheck({ rows: v.rows });
        ai = issues;
      } catch (aiError) {
        console.warn('AI conflict check failed:', aiError);
        ai = ['AI conflict check is currently unavailable.'];
      }
      setAiConflicts(ai);

      setConflictOpen(true);

      const totalConflicts = manual.length + ai.length;
      if (totalConflicts === 0) {
        toast.success('No conflicts found!');
      } else {
        toast.warning(`Found ${totalConflicts} potential conflicts`);
      }
    } catch (error) {
      console.error('Conflict check failed:', error);
      toast.error('Failed to run conflict checks');
    }
  };

  const onSubmit = async (data: bulkExamFormData) => {
    startTransition(async () => {
      try {
        console.log('Frontend ExamS Data', data);
        const v = form.getValues();
        await createBulkExams(v);
        toast.success('Exams has been created successfully.');
      } catch (error) {
        toast.error('Failed to Exams. Please try again.');
      }
    });
  };

  const addEmptyRow = () =>
    append({
      subjectId: '',
      title: '',
      startDate: '',
      endDate: '',
      max: 100,
      pass: 33,
      mode: 'OFFLINE',
      evaluationType: 'EXAM',
      weightage: 0,
      venueMapUrl: '',
      venue: '',
      supervisors: [],
      description: '',
      instructions: '',
    });

  const clearAll = () =>
    replace([
      {
        subjectId: '',
        title: '',
        startDate: '',
        endDate: '',
        max: 100,
        pass: 33,
        mode: 'OFFLINE',
        evaluationType: 'EXAM',
        weightage: 0,
        venueMapUrl: '',
        venue: '',
        supervisors: [],
        description: '',
        instructions: '',
      },
    ]);

  console.log('Form errors:', form.formState.errors);

  const handleExamsGenerated = (generatedExams: GeneratedExam[]) => {
    // Convert GeneratedExam[] to FormData['rows'] format
    const newRows: FormData['rows'] = generatedExams.map((exam) => ({
      subjectId: exam.subjectId,
      title: exam.title,
      startDate: exam.startDate,
      endDate: exam.endDate,
      max: exam.maxMarks,
      pass: exam.passingMarks,
      mode: exam.mode,
      evaluationType: exam.evaluationType,
      venue: exam.venue,
      supervisors: exam.supervisors,
      weightage: 0, // Default weightage
      venueMapUrl: '', // Default empty
      description: exam.description || '',
      instructions: exam.instructions || '',
    }));

    // Replace existing rows with AI generated ones
    replace(newRows);
    toast.success(`Added ${generatedExams.length} AI-generated exams!`);
  };
  // UI
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-pretty">
                Step 1: Choose Basics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="sessionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Session</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select session" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {examSessions.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.title}
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
                  name="gradeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class (Grade)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades.map((g) => (
                            <SelectItem key={g.id} value={g.id}>
                              {g.grade}
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
                  name="sectionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sections.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Make sure dates fall within your exam session window.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pretty">Step 2: Add Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center gap-2">
                <div className="flex space-x-3 items-center">
                  <Button variant="default" onClick={addEmptyRow}>
                    Add Row
                  </Button>
                  <Button variant="secondary" onClick={clearAll}>
                    Clear All
                  </Button>
                  <CSVUploadButton onUpload={onUploadCsv} />
                </div>
                <div className="flex space-x-3 items-center">
                  <AIExamPromptDialog
                    examSessions={examSessions}
                    grades={grades}
                    sections={sections}
                    subjects={subjects}
                    teachers={teachers}
                    selectedSessionId={selectedSessionId}
                    selectedGradeId={selectedGradeId}
                    selectedSectionId={selectedSectionId}
                    onExamsGenerated={handleExamsGenerated}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={onExportCsv}>
                        Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onDownloadTemplate}>
                        Download CSV Template
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="text-sm">
                      <TableHead className="min-w-40">Subject</TableHead>
                      <TableHead className="min-w-48">Title</TableHead>
                      <TableHead className="min-w-28">Start Date</TableHead>
                      <TableHead className="min-w-28">End Date</TableHead>
                      <TableHead className="min-w-20">Max</TableHead>
                      <TableHead className="min-w-20">Pass</TableHead>
                      <TableHead className="min-w-36">Mode</TableHead>
                      <TableHead className="min-w-36">EvaluationType</TableHead>
                      <TableHead className="min-w-40">Venue</TableHead>
                      <TableHead className="w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((f, idx) => (
                      <TableRow key={f.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.subjectId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue placeholder="Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {subjects.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                          {s.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g., Mathematics Paper 1"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.startDate`}
                            render={({ field }) => {
                              const currentDate = extractDateFromISO(
                                field.value
                              );
                              const currentTime = extractTimeFromISO(
                                field.value
                              );
                              return (
                                <FormItem className="md:col-span-3">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value &&
                                              'text-muted-foreground'
                                          )}
                                        >
                                          {field.value ? (
                                            <>
                                              {new Intl.DateTimeFormat(
                                                'en-IN',
                                                {
                                                  dateStyle: 'long',
                                                }
                                              ).format(new Date(field.value))}
                                              {' at '}
                                              {currentTime}
                                            </>
                                          ) : (
                                            <span>Pick start date & time</span>
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
                                              currentTime
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
                                                currentTime === time
                                                  ? 'default'
                                                  : 'outline'
                                              }
                                              onClick={() => {
                                                if (currentDate) {
                                                  const newDateTime =
                                                    combineDateTime(
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
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.endDate`}
                            render={({ field }) => {
                              const currentDate = extractDateFromISO(
                                field.value
                              );
                              const currentTime = extractTimeFromISO(
                                field.value
                              );
                              return (
                                <FormItem className="md:col-span-3">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value &&
                                              'text-muted-foreground'
                                          )}
                                        >
                                          {field.value ? (
                                            <>
                                              {new Intl.DateTimeFormat(
                                                'en-IN',
                                                {
                                                  dateStyle: 'long',
                                                }
                                              ).format(new Date(field.value))}
                                              {' at '}
                                              {currentTime}
                                            </>
                                          ) : (
                                            <span>Pick end date & time</span>
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
                                              currentTime
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
                                                currentTime === time
                                                  ? 'default'
                                                  : 'outline'
                                              }
                                              onClick={() => {
                                                if (currentDate) {
                                                  const newDateTime =
                                                    combineDateTime(
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
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.max`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" min={1} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.pass`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" min={0} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.mode`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Mode" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.values(ExamMode).map((m) => (
                                      <SelectItem key={m} value={m}>
                                        {m}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.evaluationType`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="EvaluationType" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.values(EvaluationType).map((m) => (
                                      <SelectItem key={m} value={m}>
                                        {m}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`rows.${idx}.venue`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Room / Hall / URL"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="space-x-2 flex items-center">
                          <RowOptionalFieldsSheet
                            index={idx}
                            teachers={teachers}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(idx)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {fields.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className="text-center text-sm text-muted-foreground"
                        >
                          No exams added yet. Click "Add Row" or import a CSV.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" type="button" onClick={runChecks}>
                  Check Conflicts
                </Button>

                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Creating Exams...' : 'Create Exams'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConflictCheckSheet
            open={conflictOpen}
            onOpenChange={setConflictOpen}
            manual={manualConflicts}
            ai={aiConflicts}
          />
        </div>
      </form>
    </Form>
  );
}

function RowOptionalFieldsSheet({
  index,
  teachers,
}: {
  index: number;
  teachers: Teacher[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          More
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Optional Fields</SheetTitle>
          <SheetDescription>
            Configure the remaining optional fields for this exam row.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          <FormField
            name={`rows.${index}.supervisors`}
            render={({ field }) => {
              const teacherOptions = teachers.map((t) => ({
                value: t.id,
                label: `${t.firstName} ${t.lastName}`,
              }));
              return (
                <FormItem className="md:col-span-7">
                  <FormControl>
                    <MultipleSelector
                      options={teacherOptions}
                      value={(field.value || []).map((value: string) => ({
                        value,
                        label:
                          teacherOptions.find((t) => t.value === value)
                            ?.label || value,
                      }))}
                      onChange={(options) =>
                        field.onChange(options.map((o) => o.value))
                      }
                      placeholder="Select supervisors"
                      emptyIndicator="No supervisors found."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name={`rows.${index}.weightage`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weightage</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name={`rows.${index}.venueMapUrl`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Map URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/map"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name={`rows.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Short description..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name={`rows.${index}.instructions`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Any exam-day instructions..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button type="button">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function CSVUploadButton({ onUpload }: { onUpload: (file: File) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.currentTarget.value = '';
        }}
      />
      <Button
        variant="outline"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        Upload CSV
      </Button>
    </>
  );
}
