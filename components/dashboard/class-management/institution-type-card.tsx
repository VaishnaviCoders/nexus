'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { QuickSetupModal } from './quick-setup-modal';

import { Lightbulb, School, GraduationCap, BookOpenText } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  school: School,
  'graduation-cap': GraduationCap,
  'book-open-text': BookOpenText,
};

interface InstitutionTemplate {
  name: string;
  iconKey: string;
  color: string;
  description: string;
  grades: Array<{
    grade: string;
    sections: string[];
  }>;
}

interface InstitutionTypeCardProps {
  template: InstitutionTemplate;
  templateKey: string;
}

export function InstitutionTypeCard({
  template,
  templateKey,
}: InstitutionTypeCardProps) {
  const [showModal, setShowModal] = useState(false);
  const Icon = iconMap[tmpl.iconKey];

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
        <CardContent className="p-6">
          <div className="text-center">
            <div
              className={`w-16 h-16 ${template.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              {template.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge variant="secondary">{template.grades.length} grades</Badge>
              <Badge variant="secondary">
                {template.grades.reduce((acc, g) => acc + g.sections.length, 0)}{' '}
                sections
              </Badge>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="w-full group-hover:bg-blue-600 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <QuickSetupModal
        institutionTemplates={{ [templateKey]: template }}
        selectedTemplate={templateKey}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  );
}
