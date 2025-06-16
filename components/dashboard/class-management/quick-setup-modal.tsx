'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle } from 'lucide-react';

import { Lightbulb, School, GraduationCap, BookOpenText } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  school: School,
  'graduation-cap': GraduationCap,
  'book-open-text': BookOpenText,
};

interface QuickSetupModalProps {
  institutionTemplates: any;
  selectedTemplate?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function QuickSetupModal({
  institutionTemplates,
  selectedTemplate,
  trigger,
  open,
  onOpenChange,
}: QuickSetupModalProps) {
  const [currentTemplate, setCurrentTemplate] = useState(
    selectedTemplate || Object.keys(institutionTemplates)[0]
  );
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const template = institutionTemplates[currentTemplate];

  const handleGradeToggle = (gradeName: string) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeName)
        ? prev.filter((g) => g !== gradeName)
        : [...prev, gradeName]
    );
  };

  const handleCreateGrades = async () => {
    setIsCreating(true);
    // TODO: Implement grade creation logic
    console.log('Creating grades:', selectedGrades);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsCreating(false);
    if (onOpenChange) onOpenChange(false);
  };

  const content = (
    <DialogContent className="max-w-4xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="text-2xl">
          Quick Setup - {template?.name}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        {!selectedTemplate && (
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Institution Type</h3>
            <div className="space-y-2">
              {Object.entries(institutionTemplates).map(
                ([key, tmpl]: [string, any]) => {
                  const Icon = tmpl.icon;
                  return (
                    <Button
                      key={key}
                      variant={currentTemplate === key ? 'default' : 'outline'}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setCurrentTemplate(key)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{tmpl.name}</div>
                        <div className="text-xs opacity-70">
                          {tmpl.grades.length} grades
                        </div>
                      </div>
                    </Button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Grade Selection */}
        <div className={selectedTemplate ? 'lg:col-span-3' : 'lg:col-span-2'}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Select Grades to Create</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedGrades(template.grades.map((g: any) => g.grade))
                }
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedGrades([])}
              >
                Clear All
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template?.grades.map((gradeInfo: any, index: number) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedGrades.includes(gradeInfo.grade)
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleGradeToggle(gradeInfo.grade)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedGrades.includes(gradeInfo.grade)}
                        onChange={() => handleGradeToggle(gradeInfo.grade)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{gradeInfo.grade}</h4>
                        <div className="flex flex-wrap gap-1">
                          {gradeInfo.sections.map((section: string) => (
                            <Badge
                              key={section}
                              variant="secondary"
                              className="text-xs"
                            >
                              Section {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedGrades.length} grades selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateGrades}
                disabled={selectedGrades.length === 0 || isCreating}
              >
                {isCreating ? (
                  <>Creating...</>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create {selectedGrades.length} Grades
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {content}
    </Dialog>
  );
}
