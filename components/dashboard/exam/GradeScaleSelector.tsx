'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getGradeColorBadge,
  GRADING_SCALES,
  type GradeScale,
} from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface GradeScaleSelectorProps {
  selectedScale: GradeScale;
  onScaleChange: (scale: GradeScale) => void;
}

export default function GradeScaleSelector({
  selectedScale,
  onScaleChange,
}: GradeScaleSelectorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Grading Scale
            </CardTitle>
            <CardDescription>
              Choose the grading system for this exam
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showPreview ? 'Hide' : 'Preview'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedScale.id}
          onValueChange={(value) => {
            const scale = GRADING_SCALES.find((s) => s.id === value);
            if (scale) onScaleChange(scale);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grading scale" />
          </SelectTrigger>
          <SelectContent>
            {GRADING_SCALES.map((scale) => (
              <SelectItem key={scale.id} value={scale.id}>
                {scale.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showPreview && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Grade Scale Preview:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {selectedScale.grades.map((grade, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-2 border rounded-md"
                >
                  <Badge
                    variant={getGradeColorBadge(grade, true, 33)}
                    className="mb-1"
                  >
                    {grade.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {grade.minPercentage}%-{grade.maxPercentage}%
                  </span>
                  {grade.description && (
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      {grade.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
