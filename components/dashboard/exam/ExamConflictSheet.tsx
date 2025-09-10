'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { type bulkExamRowFormData } from '@/lib/schemas';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manual: string[];
  ai: string[];
};

export function ConflictCheckSheet({ open, onOpenChange, manual, ai }: Props) {
  const [filter, setFilter] = React.useState<'MANUAL' | 'AI' | 'ALL'>('ALL');

  // Combine all conflicts
  const allConflicts = React.useMemo(() => {
    const manualConflicts = manual.map((msg, idx) => ({
      id: `manual-${idx}`,
      type: 'MANUAL' as const,
      message: msg,
      severity: 'medium' as const,
    }));

    const aiConflicts = ai.map((msg, idx) => ({
      id: `ai-${idx}`,
      type: 'AI' as const,
      message: msg,
      severity: 'high' as const,
    }));

    return [...manualConflicts, ...aiConflicts];
  }, [manual, ai]);

  const filtered = React.useMemo(() => {
    if (filter === 'ALL') return allConflicts;
    return allConflicts.filter((c) => c.type === filter);
  }, [allConflicts, filter]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof allConflicts>();
    for (const c of filtered) {
      const key = c.type;
      const arr = map.get(key) || [];
      arr.push(c);
      map.set(key, arr);
    }
    return map;
  }, [filtered]);

  const total = allConflicts.length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-balance">Conflict Checker</SheetTitle>
          <SheetDescription className="text-pretty">
            Review detected conflicts from manual validation and AI analysis.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Total Conflicts: {total}</Badge>
              {manual.length > 0 && (
                <Badge variant="secondary">Manual: {manual.length}</Badge>
              )}
              {ai.length > 0 && (
                <Badge variant="destructive">AI: {ai.length}</Badge>
              )}
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="MANUAL">Manual</TabsTrigger>
                <TabsTrigger value="AI">AI</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          <ScrollArea className="h-[60vh] rounded-md border p-2">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                {total === 0
                  ? 'No conflicts detected!'
                  : 'No conflicts for the current filter.'}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from(grouped.entries()).map(([type, list]) => (
                  <div key={type} className="rounded-md border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">
                        {type === 'MANUAL'
                          ? 'Manual Validation'
                          : 'AI Analysis'}
                      </div>
                      <Badge
                        variant={
                          type === 'MANUAL' ? 'secondary' : 'destructive'
                        }
                      >
                        {list.length}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      {list.map((c) => (
                        <div
                          key={c.id}
                          className={cn(
                            'rounded-md border p-3',
                            c.type === 'MANUAL'
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : 'bg-red-50 border-red-200 text-red-800'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {c.message}
                            </div>
                            <Badge
                              variant={
                                c.type === 'MANUAL'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                              className="capitalize"
                            >
                              {c.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="rounded-lg border p-3 bg-muted/50">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Conflict Types:</p>
              <ul className="space-y-1 text-xs">
                <li>
                  • <strong>Manual:</strong> Basic validation checks (dates,
                  subjects, etc.)
                </li>
                <li>
                  • <strong>AI:</strong> Advanced conflict detection using AI
                  analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
