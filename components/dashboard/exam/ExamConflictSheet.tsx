'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, Brain } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ai: string[];
};

export function ConflictCheckSheet({ open, onOpenChange, ai }: Props) {
  const hasIssues = ai.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Conflict Analysis
          </SheetTitle>
          <SheetDescription>
            AI-powered analysis of your exam schedule for potential conflicts
            and issues.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            <Badge variant={hasIssues ? 'destructive' : 'default'}>
              {hasIssues ? (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {ai.length} Issue{ai.length > 1 ? 's' : ''}
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  All Clear
                </>
              )}
            </Badge>
          </div>

          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {hasIssues ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  Issues Found
                </div>
                <ul className="space-y-2">
                  {ai.map((issue, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm p-3 bg-destructive/5 rounded-lg border border-destructive/20"
                    >
                      <span className="text-destructive mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-success" />
                <div>
                  <h4 className="font-semibold text-success">
                    No Issues Found!
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your exam schedule looks good. No conflicts or issues
                    detected.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 AI Analysis includes:</p>
            <ul className="space-y-1">
              <li>• Time conflicts and overlaps</li>
              <li>• Venue double-booking</li>
              <li>• Teacher/supervisor conflicts</li>
              <li>• Invalid marks and durations</li>
              <li>• Missing required information</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
