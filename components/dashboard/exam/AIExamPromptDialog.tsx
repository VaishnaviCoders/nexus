'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProgressSteps } from '@/components/ui/progress-steps';
import {
  Sparkles,
  Loader2,
  Calendar,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  Plus,
  Brain,
  Clock,
  MapPin,
  Award,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn, formatDateIN, formatTimeIN } from '@/lib/utils';
import type { EvaluationType, ExamMode } from '@/generated/prisma/enums';
import { generateExamSchedule } from '@/lib/data/exam/create-bulk-exams';

// Types
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

export type GeneratedExam = {
  subjectId: string;
  subjectName: string;
  title: string;
  startDate: string;
  endDate: string;
  maxMarks: number;
  passingMarks: number;
  mode: ExamMode;
  evaluationType: EvaluationType;
  venue: string;
  supervisors: string[];
  supervisorNames: string[];
  description: string;
  instructions: string;
  durationMinutes: number;
  conflicts?: string[];
};

type Props = {
  examSessions: ExamSession[];
  grades: Grade[];
  sections: Section[];
  subjects: Subject[];
  teachers: Teacher[];
  selectedSessionId?: string;
  selectedGradeId?: string;
  selectedSectionId?: string;
  onExamsGenerated: (exams: GeneratedExam[]) => void;
};

const examSuggestions = [
  {
    category: '🚀 Quick Templates',
    description: 'Ready-to-use exam schedules',
    prompts: [
      {
        text: 'Create final exams for all subjects, 3 hours each, 100 marks',
        description: 'Standard final exam setup',
      },
      {
        text: 'Schedule midterm tests for core subjects with 2-day gaps',
        description: 'Balanced midterm schedule',
      },
      {
        text: 'Generate unit tests for this week, 1 hour each',
        description: 'Quick weekly assessments',
      },
    ],
  },
  {
    category: '⚙️ Detailed Planning',
    description: 'Comprehensive exam configurations',
    prompts: [
      {
        text: 'Create comprehensive finals: Math (3h, 100 marks), Science (2.5h, 80 marks), English (2h, 60 marks) with 2-day gaps starting Monday',
        description: 'Subject-specific requirements',
      },
      {
        text: 'Schedule practical exams for Science subjects in labs, 2 hours each with viva',
        description: 'Lab-based practical exams',
      },
      {
        text: 'Generate weekly assessments for all subjects, morning slots only, avoid Fridays',
        description: 'Time-specific scheduling',
      },
    ],
  },
  {
    category: '🎯 Special Requirements',
    description: 'Custom exam scenarios',
    prompts: [
      {
        text: 'Create makeup exams for absent students, flexible timing',
        description: 'Makeup exam arrangements',
      },
      {
        text: 'Schedule oral exams for language subjects, 30 minutes per student',
        description: 'Individual oral assessments',
      },
      {
        text: 'Generate project presentations, 1 hour slots in auditorium',
        description: 'Presentation-based evaluations',
      },
    ],
  },
];

const progressSteps = [
  { id: 'prompt', title: 'Describe', description: 'Your requirements' },
  { id: 'preview', title: 'Review', description: 'Generated exams' },
  { id: 'apply', title: 'Apply', description: 'Add to schedule' },
];

export default function AIExamPromptDialog({
  examSessions,
  grades,
  sections,
  subjects,
  teachers,
  selectedSessionId,
  selectedGradeId,
  selectedSectionId,
  onExamsGenerated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedExams, setGeneratedExams] = useState<GeneratedExam[]>([]);
  const [editingExam, setEditingExam] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState<'prompt' | 'preview' | 'apply'>(
    'prompt'
  );

  const selectedSession = examSessions.find((s) => s.id === selectedSessionId);
  const selectedGrade = grades.find((g) => g.id === selectedGradeId);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const canGenerate =
    selectedSessionId && selectedGradeId && selectedSectionId && prompt.trim();

  const handleGenerate = async () => {
    if (!canGenerate) {
      toast.error('Please complete all selections and enter a prompt');
      return;
    }

    startTransition(async () => {
      const { success, data, error } = await generateExamSchedule({
        prompt,
        examSession: selectedSession!,
        grade: selectedGrade!,
        section: selectedSection!,
        subjects,
        teachers,
      });

      if (success && data) {
        setGeneratedExams(data);
        setActiveStep('preview');
        toast.success(`Generated ${data.length} exams successfully`);
      } else {
        toast.error(error || 'Failed to generate exams');
      }
    });
  };

  const updateExam = (index: number, updates: Partial<GeneratedExam>) => {
    setGeneratedExams((prev) =>
      prev.map((exam, i) => (i === index ? { ...exam, ...updates } : exam))
    );
  };

  const removeExam = (index: number) => {
    setGeneratedExams((prev) => prev.filter((_, i) => i !== index));
    toast.success('Exam removed');
  };

  const duplicateExam = (index: number) => {
    const exam = generatedExams[index];
    const duplicate = {
      ...exam,
      title: `${exam.title} (Copy)`,
      startDate: new Date(
        new Date(exam.startDate).getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        new Date(exam.endDate).getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    setGeneratedExams((prev) => [...prev, duplicate]);
    toast.success('Exam duplicated');
  };

  const confirmAndApply = () => {
    startTransition(() => {
      onExamsGenerated(generatedExams);
      setOpen(false);
      resetDialog();
      toast.success(
        `Successfully added ${generatedExams.length} exams to your schedule`
      );
    });
  };

  const resetDialog = () => {
    setActiveStep('prompt');
    setGeneratedExams([]);
    setEditingExam(null);
    setPrompt('');
  };

  const conflictCount = generatedExams.filter(
    (e) => e.conflicts && e.conflicts.length > 0
  ).length;
  const readyCount = generatedExams.length - conflictCount;

  const completedSteps = activeStep === 'preview' ? ['prompt'] : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 border border-border shadow-sm"
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Exam Creator
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col bg-card border border-border">
        <DialogHeader className="space-y-4 pb-6 border-b border-border">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 rounded-lg bg-muted">
              <Brain className="w-5 h-5" />
            </div>
            AI Exam Creator
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Describe your exam requirements and let AI create a complete
            schedule for you to review and customize.
          </DialogDescription>

          <ProgressSteps
            steps={progressSteps}
            currentStep={activeStep}
            completedSteps={completedSteps}
            className="py-4"
          />
        </DialogHeader>

        {activeStep === 'prompt' && (
          <div className="flex-1 space-y-6 overflow-y-auto p-1">
            {/* Context Card */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Session</span>
                        <p className="font-medium">
                          {selectedSession?.title || 'Select Session'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Class</span>
                        <p className="font-medium">
                          Grade {selectedGrade?.grade || '?'} -{' '}
                          {selectedSection?.name || 'Select Section'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {subjects.length} Subjects
                    </Badge>
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      {teachers.length} Teachers
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Input Card */}
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                  What exams do you need?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your exam requirements in plain English. For example:
• Create final exams for Math, Science, and English - 3 hours each with 100 marks
• Schedule midterm tests for all subjects with 2-day gaps between them  
• Generate unit tests for this week, 1 hour duration, use regular classrooms
• Create practical exams for Science subjects in their labs with viva components"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="text-sm resize-none"
                />

                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Be as specific or general as you like - AI will handle the
                    details
                  </p>
                  <Button
                    onClick={handleGenerate}
                    disabled={isPending || !canGenerate}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Exams
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base">
                  💡 Smart Suggestions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click any suggestion to use it as your prompt, then customize
                  as needed
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {examSuggestions.map((category) => (
                    <div key={category.category}>
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          {category.category}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                      <div className="grid gap-3">
                        {category.prompts.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="h-auto p-4 text-left justify-start border border-border hover:bg-muted/50 hover:border-primary/20 transition-all"
                            onClick={() => setPrompt(suggestion.text)}
                          >
                            <div className="text-wrap">
                              <p className="font-medium text-sm leading-relaxed mb-1">
                                {suggestion.text}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {suggestion.description}
                              </p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeStep === 'preview' && (
          <div className="flex-1 space-y-4 overflow-y-auto p-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Generated {generatedExams.length} Exams
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    {readyCount} Ready
                  </span>
                  {conflictCount > 0 && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      {conflictCount} Need Review
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep('prompt')}
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={confirmAndApply}
                  disabled={isPending || generatedExams.length === 0}
                  className="bg-success text-success-foreground hover:bg-success/90"
                  size="sm"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Add All Exams
                    </>
                  )}
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {generatedExams.map((exam, index) => (
                  <Card
                    key={index}
                    className={cn(
                      'border transition-colors',
                      exam.conflicts && exam.conflicts.length > 0
                        ? 'border-warning/50 bg-warning/5'
                        : 'border-border'
                    )}
                  >
                    <CardContent className="p-4">
                      {editingExam === index ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Title
                              </Label>
                              <Input
                                value={exam.title}
                                onChange={(e) =>
                                  updateExam(index, { title: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Subject
                              </Label>
                              <Select
                                value={exam.subjectId}
                                onValueChange={(value) => {
                                  const subject = subjects.find(
                                    (s) => s.id === value
                                  );
                                  updateExam(index, {
                                    subjectId: value,
                                    subjectName: subject?.name || '',
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem
                                      key={subject.id}
                                      value={subject.id}
                                    >
                                      {subject.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-3">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Max Marks
                              </Label>
                              <Input
                                type="number"
                                value={exam.maxMarks}
                                onChange={(e) =>
                                  updateExam(index, {
                                    maxMarks:
                                      Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Pass Marks
                              </Label>
                              <Input
                                type="number"
                                value={exam.passingMarks}
                                onChange={(e) =>
                                  updateExam(index, {
                                    passingMarks:
                                      Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Duration (min)
                              </Label>
                              <Input
                                type="number"
                                value={exam.durationMinutes}
                                onChange={(e) =>
                                  updateExam(index, {
                                    durationMinutes:
                                      Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Venue
                              </Label>
                              <Input
                                value={exam.venue}
                                onChange={(e) =>
                                  updateExam(index, { venue: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t border-border">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingExam(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setEditingExam(null)}
                              className="bg-success text-success-foreground hover:bg-success/90"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="font-semibold text-lg">
                                  {exam.title}
                                </h4>
                                <Badge variant="secondary">
                                  {exam.subjectName}
                                </Badge>
                                <Badge variant="outline">{exam.mode}</Badge>
                                {exam.conflicts &&
                                  exam.conflicts.length > 0 && (
                                    <Badge className="bg-warning text-warning-foreground">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      {exam.conflicts.length} Conflict
                                      {exam.conflicts.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>Date & Time</span>
                                  </div>
                                  <p className="font-medium">
                                    {formatDateIN(exam.startDate)}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {formatTimeIN(exam.startDate)} -{' '}
                                    {formatTimeIN(exam.endDate)}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Award className="w-4 h-4" />
                                    <span>Marks</span>
                                  </div>
                                  <p className="font-medium">
                                    {exam.maxMarks} total
                                  </p>
                                  <p className="text-muted-foreground">
                                    Pass: {exam.passingMarks}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Duration</span>
                                  </div>
                                  <p className="font-medium">
                                    {Math.floor(exam.durationMinutes / 60)}h{' '}
                                    {exam.durationMinutes % 60}m
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>Venue</span>
                                  </div>
                                  <p className="font-medium">{exam.venue}</p>
                                </div>
                              </div>

                              {exam.supervisorNames.length > 0 && (
                                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                    <Users className="w-4 h-4" />
                                    Supervisors
                                  </div>
                                  <span className="font-medium">
                                    {exam.supervisorNames.join(', ')}
                                  </span>
                                </div>
                              )}

                              {exam.conflicts && exam.conflicts.length > 0 && (
                                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                                  <div className="flex items-center gap-2 text-warning-foreground font-medium text-sm mb-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Conflicts Detected
                                  </div>
                                  <ul className="text-sm space-y-1">
                                    {exam.conflicts.map((conflict, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="text-warning mt-1">
                                          •
                                        </span>
                                        {conflict}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingExam(index)}
                                className="p-2"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => duplicateExam(index)}
                                className="p-2"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExam(index)}
                                className="p-2 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
