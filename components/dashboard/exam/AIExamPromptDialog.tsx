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
import {
  Sparkles,
  Loader2,
  Calendar,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Wand2,
  Edit3,
  Trash2,
  Plus,
  Brain,
  Target,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { EvaluationType, ExamMode } from '@/generated/prisma';
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

// Smart prompt suggestions based on common teacher needs
const smartSuggestions = [
  {
    category: 'Quick Start',
    prompts: [
      'Create final exams for all subjects, 3 hours each, 100 marks',
      'Schedule midterm tests for core subjects with 2-day gaps',
      'Generate unit tests for this week, 1 hour each',
    ],
  },
  {
    category: 'Detailed Planning',
    prompts: [
      'Create comprehensive finals: Math (3h, 100 marks), Science (2.5h, 80 marks), English (2h, 60 marks) with 2-day gaps starting Monday',
      'Schedule practical exams for Science subjects in labs, 2 hours each with viva',
      'Generate weekly assessments for all subjects, morning slots only, avoid Fridays',
    ],
  },
  {
    category: 'Special Requirements',
    prompts: [
      'Create makeup exams for absent students, flexible timing',
      'Schedule oral exams for language subjects, 30 minutes per student',
      'Generate project presentations, 1 hour slots in auditorium',
    ],
  },
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState<'prompt' | 'preview' | 'edit'>(
    'prompt'
  );

  const selectedSession = examSessions.find((s) => s.id === selectedSessionId);
  const selectedGrade = grades.find((g) => g.id === selectedGradeId);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const canGenerate =
    selectedSessionId && selectedGradeId && selectedSectionId && prompt.trim();

  // Enhanced AI generation with better error handling
  const handleGenerate = async () => {
    if (!canGenerate) {
      toast.error('Please complete all selections and enter a prompt');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateExamSchedule({
        prompt,
        examSession: selectedSession!,
        grade: selectedGrade!,
        section: selectedSection!,
        subjects,
        teachers,
      });

      if (!result.success) {
        toast.error(result.error || 'Failed to generate exams');
        return;
      }

      if (!result.data || result.data.length === 0) {
        toast.error(
          'No exams were generated. Try being more specific in your prompt.'
        );
        return;
      }

      setGeneratedExams(result.data);
      setActiveStep('preview');
      toast.success(
        `🎉 Generated ${result.data.length} exams! Review and customize as needed.`
      );
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick edit functionality
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
        `✅ Successfully added ${generatedExams.length} exams to your schedule!`
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant={'ai'}>
          AI Exam Creator
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100">
              <Brain className="w-6 h-6 text-violet-600" />
            </div>
            AI-Powered Exam Creator
          </DialogTitle>
          <DialogDescription className="text-base">
            Describe your exam needs in plain English. Our AI will create a
            complete schedule that you can review and customize.
          </DialogDescription>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-full transition-colors',
                activeStep === 'prompt'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              <Wand2 className="w-4 h-4" />
              Describe
            </div>
            <div className="w-8 h-px bg-gray-200" />
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-full transition-colors',
                activeStep === 'preview'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              <Target className="w-4 h-4" />
              Review
            </div>
            <div className="w-8 h-px bg-gray-200" />
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-full transition-colors',
                generatedExams.length > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              <CheckCircle className="w-4 h-4" />
              Apply
            </div>
          </div>
        </DialogHeader>

        {activeStep === 'prompt' && (
          <div className="flex-1 space-y-6 overflow-y-auto">
            {/* Context Card - Compact */}
            <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-violet-600" />
                      <span className="font-medium">
                        {selectedSession?.title || 'Select Session'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-violet-600" />
                      <span className="font-medium">
                        Grade {selectedGrade?.grade || '?'} -{' '}
                        {selectedSection?.name || 'Select Section'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-white/80">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {subjects.length} Subjects
                    </Badge>
                    <Badge variant="secondary" className="bg-white/80">
                      <Users className="w-3 h-3 mr-1" />
                      {teachers.length} Teachers
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Prompt Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-600" />
                  What exams do you need?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Just tell me what you need! For example:
• Create final exams for Math, Science, and English - 3 hours each with 100 marks
• Schedule midterm tests for all subjects with 2-day gaps between them
• Generate unit tests for this week, 1 hour duration, use regular classrooms
• Create practical exams for Science subjects in their labs with viva components"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="text-base resize-none border-violet-200 focus:border-violet-400"
                />

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    💡 Be as specific or general as you like - I'll figure out
                    the details!
                  </p>
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Exams
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Smart Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  💡 Need inspiration? Try these:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartSuggestions.map((category) => (
                    <div key={category.category}>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {category.category}
                      </h4>
                      <div className="grid gap-2">
                        {category.prompts.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="h-auto p-3 text-left justify-start text-sm bg-gray-50 hover:bg-violet-50 hover:text-violet-700 border border-transparent hover:border-violet-200"
                            onClick={() => setPrompt(suggestion)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                              <span className="text-wrap">{suggestion}</span>
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
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Header with stats */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Generated {generatedExams.length} Exams
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {readyCount} Ready
                  </span>
                  {conflictCount > 0 && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      {conflictCount} Need Review
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep('prompt')}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Prompt
                </Button>
                <Button
                  onClick={confirmAndApply}
                  disabled={isPending || generatedExams.length === 0}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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

            {/* Exams List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {generatedExams.map((exam, index) => (
                  <Card
                    key={index}
                    className={cn(
                      'transition-all duration-200 hover:shadow-md',
                      exam.conflicts && exam.conflicts.length > 0
                        ? 'border-orange-200 bg-orange-50/50'
                        : 'border-green-200 bg-green-50/30'
                    )}
                  >
                    <CardContent className="p-4">
                      {editingExam === index ? (
                        /* Inline Edit Mode */
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={exam.title}
                                onChange={(e) =>
                                  updateExam(index, { title: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Subject</Label>
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

                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <Label>Max Marks</Label>
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
                            <div>
                              <Label>Pass Marks</Label>
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
                            <div>
                              <Label>Duration (min)</Label>
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
                            <div>
                              <Label>Venue</Label>
                              <Input
                                value={exam.venue}
                                onChange={(e) =>
                                  updateExam(index, { venue: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
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
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* Display Mode */
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-lg">
                                  {exam.title}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className="bg-violet-100 text-violet-700"
                                >
                                  {exam.subjectName}
                                </Badge>
                                <Badge variant="outline">{exam.mode}</Badge>
                                {exam.conflicts &&
                                  exam.conflicts.length > 0 && (
                                    <Badge
                                      variant="destructive"
                                      className="animate-pulse"
                                    >
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      {exam.conflicts.length} Conflict
                                      {exam.conflicts.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Date & Time:
                                  </span>
                                  <p className="font-medium">
                                    {new Date(
                                      exam.startDate
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      exam.startDate
                                    ).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}{' '}
                                    -{' '}
                                    {new Date(exam.endDate).toLocaleTimeString(
                                      [],
                                      {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Marks:
                                  </span>
                                  <p className="font-medium">
                                    {exam.maxMarks} total
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Pass: {exam.passingMarks}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Duration:
                                  </span>
                                  <p className="font-medium">
                                    {Math.floor(exam.durationMinutes / 60)}h{' '}
                                    {exam.durationMinutes % 60}m
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Venue:
                                  </span>
                                  <p className="font-medium">{exam.venue}</p>
                                </div>
                              </div>

                              {exam.supervisorNames.length > 0 && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Supervisors:{' '}
                                  </span>
                                  <span className="font-medium">
                                    {exam.supervisorNames.join(', ')}
                                  </span>
                                </div>
                              )}

                              {exam.conflicts && exam.conflicts.length > 0 && (
                                <div className="p-3 bg-orange-100 rounded-lg border border-orange-200">
                                  <div className="flex items-center gap-2 text-orange-800 font-medium text-sm mb-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    Conflicts Detected
                                  </div>
                                  <ul className="text-orange-700 text-sm space-y-1">
                                    {exam.conflicts.map((conflict, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="text-orange-500 mt-1">
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
                                className="hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => duplicateExam(index)}
                                className="hover:bg-green-50 hover:text-green-700"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExam(index)}
                                className="hover:bg-red-50 hover:text-red-700"
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
