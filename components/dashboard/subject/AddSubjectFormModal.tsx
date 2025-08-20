'use client';

import {
  useState,
  useEffect,
  useTransition,
  useMemo,
  useCallback,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Loader2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Wand2,
  BookOpen,
  Brain,
  Zap,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { subjectSchema, type SubjectFormData } from '@/lib/schemas';

import {
  type AISubjectSuggestion,
  createDebouncedSuggestions,
  getAISubjectSuggestions,
} from '@/ai/gemini-subject-service';
import { Subject } from '@/generated/prisma';
import { toast } from 'sonner';
import { createSubject } from '@/lib/data/subjects/subject-action';
import { useRouter } from 'next/navigation';

interface AddSubjectModalProps {
  subjects: Subject[];
}

export function AddSubjectFormModal({ subjects }: AddSubjectModalProps) {
  const [aiSuggestion, setAiSuggestion] = useState<AISubjectSuggestion | null>(
    null
  );
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showSimilarWarning, setShowSimilarWarning] = useState(false);
  const router = useRouter();

  const debouncedGetSuggestions = useMemo(
    () => createDebouncedSuggestions(800),
    []
  );

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
    mode: 'onChange',
  });

  const watchedName = form.watch('name');

  // Get AI suggestions when name changes
  const getSuggestions = useCallback(
    async (name: string) => {
      if (!name || name.length < 2) {
        setAiSuggestion(null);
        setShowSimilarWarning(false);
        setIsLoadingAI(false);
        return;
      }

      setIsLoadingAI(true);
      try {
        const suggestions = await debouncedGetSuggestions(name, subjects);
        setAiSuggestion(suggestions);
        setShowSimilarWarning(suggestions.similarSubjects.length > 0);
      } catch (error) {
        console.error('Error getting AI suggestions:', error);
        toast.error('Failed to get AI suggestions');
      } finally {
        setIsLoadingAI(false);
      }
    },
    [subjects, debouncedGetSuggestions]
  );

  useEffect(() => {
    getSuggestions(watchedName);
  }, [watchedName, getSuggestions]);

  const onSubmit = (data: SubjectFormData) => {
    if (aiSuggestion?.similarSubjects.some((s) => s.similarity > 0.9)) {
      toast.error(
        'This subject appears to be very similar to an existing one. Please verify.'
      );
      return;
    }
    startTransition(async () => {
      try {
        const result = await createSubject(data);

        if (result.success) {
          toast.success(result.message);
          router.refresh();
          form.reset({ name: '', code: '', description: '' });
          setAiSuggestion(null);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  const handleApplyCorrectedName = () => {
    if (aiSuggestion?.correctedName) {
      form.setValue('name', aiSuggestion.correctedName, {
        shouldValidate: true,
      });
    }
  };
  const handleApplyDescription = () => {
    if (aiSuggestion?.description) {
      form.setValue('description', aiSuggestion.description, {
        shouldValidate: true,
      });
    }
  };

  const handleApplyCode = (suggestedCode: string) => {
    form.setValue('code', suggestedCode, { shouldValidate: true });
  };

  const generateNewCode = async () => {
    const currentName = form.getValues('name');
    if (!currentName) {
      toast.error('Please enter a subject name first');
      return;
    }

    setIsLoadingAI(true);
    try {
      const suggestions = await getAISubjectSuggestions(currentName, subjects);
      if (suggestions.codeSuggestions.length > 0) {
        setAiSuggestion((prev) =>
          prev
            ? { ...prev, codeSuggestions: suggestions.codeSuggestions }
            : suggestions
        );
      } else {
        toast.error('No code suggestions available');
      }
    } catch (error) {
      toast.error('Failed to generate code suggestions');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    Subject Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Mathematics, English Literature, Computer Science"
                      className="h-11 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />

                  {/* AI Name Correction Suggestion */}
                  {aiSuggestion?.correctedName && (
                    <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 animate-in slide-in-from-top-2 duration-300">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="flex items-center justify-between text-blue-800">
                        <span className="font-medium">
                          AI suggests: "{aiSuggestion.correctedName}"
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleApplyCorrectedName}
                          className="h-7 text-xs border-blue-300 hover:bg-blue-100 bg-transparent"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                  {/* Similar Subjects Warning */}
                  {showSimilarWarning &&
                    aiSuggestion?.similarSubjects &&
                    aiSuggestion.similarSubjects.length > 0 && (
                      <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 animate-in slide-in-from-top-2 duration-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          <div className="space-y-3">
                            <p className="font-medium">
                              Similar subjects found:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {aiSuggestion.similarSubjects.map((similar) => (
                                <Badge
                                  key={similar.id}
                                  variant="outline"
                                  className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors"
                                  title={`${Math.round(similar.similarity * 100)}% similar`}
                                >
                                  {similar.name} ({similar.code})
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Info className="h-3 w-3" />
                              <p className="text-sm">
                                Please verify this isn't a duplicate before
                                proceeding.
                              </p>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                </FormItem>
              )}
            />

            {/* Subject Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-purple-600" />
                      Subject Code *
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateNewCode}
                      disabled={isLoadingAI || !watchedName}
                      className="h-7 text-xs bg-transparent"
                    >
                      {isLoadingAI ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      )}
                      Generate
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="e.g., MATH101, ENG201, CS101"
                      className="font-mono h-11 text-base"
                      {...field}
                      onChange={(e) => {
                        const upperValue = e.target.value.toUpperCase();
                        field.onChange(upperValue);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be uppercase letters and numbers only (e.g., MATH101,
                    PHYS201)
                  </FormDescription>
                  <FormMessage />

                  {/* AI Code Suggestions */}
                  {aiSuggestion?.codeSuggestions &&
                    aiSuggestion.codeSuggestions.length > 0 && (
                      <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-3 w-3 text-yellow-600" />
                          <span className="text-xs font-medium text-muted-foreground">
                            AI Code Suggestions:
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {aiSuggestion.codeSuggestions.map(
                            (suggestedCode, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 border-purple-200"
                                onClick={() => handleApplyCode(suggestedCode)}
                              >
                                {suggestedCode}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      Description
                      <span className="text-muted-foreground font-normal ml-1">
                        (Optional)
                      </span>
                    </FormLabel>
                    {aiSuggestion?.description && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleApplyDescription}
                        className="h-7 text-xs hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50"
                      >
                        <Sparkles className="h-4 w-4 text-blue-600 mr-1" />
                        Apply AI
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of what this subject covers..."
                      rows={4}
                      maxLength={512}
                      className="text-base resize-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormDescription>Maximum 512 characters</FormDescription>
                    <span className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/512
                    </span>
                  </div>
                  <FormMessage />

                  {/* AI Description Suggestion */}
                  {aiSuggestion?.description && !field.value && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          AI Suggestion:
                        </span>
                      </div>
                      <p className="text-sm text-green-700 leading-relaxed">
                        {aiSuggestion.description}
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />
            {/* AI Confidence Indicator */}
            {aiSuggestion && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>
                    AI Confidence:{' '}
                    {Math.round((aiSuggestion.confidence || 0) * 100)}%
                  </span>
                </div>
                {aiSuggestion.hasSpellingError && (
                  <Badge variant="secondary" className="h-4 text-[10px]">
                    Spell-checked
                  </Badge>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  form.reset();
                  setAiSuggestion(null);
                  setShowSimilarWarning(false);
                }}
              >
                Clear
              </Button>
              <Button
                variant={'gradient'}
                type="submit"
                className=""
                disabled={
                  isPending ||
                  !form.formState.isValid ||
                  (showSimilarWarning &&
                    aiSuggestion?.similarSubjects?.some(
                      (s) => s.similarity > 0.95
                    ))
                }
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Create Subject
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
