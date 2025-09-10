'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExternalLink, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamWithRelations } from './StudentExamsPage';

export default function ExamTabs({ exam }: { exam: ExamWithRelations }) {
  const mapQuery = useMemo(() => {
    const q = encodeURIComponent(exam.venue ?? 'Exam Venue');
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }, [exam.venue]);

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="instructions">Instructions</TabsTrigger>
        <TabsTrigger value="venue">Venue</TabsTrigger>
        <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="grid list-disc gap-2 pl-5 text-sm text-muted-foreground">
              <li>
                Session:{' '}
                <span className="text-foreground font-medium">
                  {exam.examSession.title}
                </span>
              </li>
              <li>
                Subject:{' '}
                <span className="text-foreground font-medium">
                  {exam.subject.name} ({exam.subject.code})
                </span>
              </li>
              <li>Status: {exam.status}</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="instructions">
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="rules">
                <AccordionTrigger className="text-left">
                  General Rules
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal space-y-2 pl-5 text-sm">
                    <li>Report 15 minutes before the start time.</li>
                    <li>Carry hall ticket and a valid photo ID.</li>
                    <li>No electronic devices are allowed inside.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials">
                <AccordionTrigger className="text-left">
                  Allowed Materials
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    <li>Blue/black pens, pencils, eraser.</li>
                    <li>Non-programmable calculator (if applicable).</li>
                    <li>Water bottle with no labels.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="provided">
                <AccordionTrigger className="text-left">
                  Provided by Invigilator
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Answer sheets and rough sheets will be provided. Raise your
                    hand to request additional sheets.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {exam.instructions && (
              <div className="mt-4 rounded-md border bg-muted/30 p-3 text-sm">
                <div className="mb-1 font-medium">Additional Notes</div>
                <p className="text-muted-foreground">{exam.instructions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="venue">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4" />
              Venue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-card p-3">
              <div className="text-sm">
                <span className="font-medium">{exam.venue ?? 'TBA'}</span>
              </div>
            </div>

            <Button asChild variant="secondary" className="gap-2">
              <a href={mapQuery} target="_blank" rel="noopener noreferrer">
                Open in Maps
                <ExternalLink className="size-4" />
              </a>
            </Button>

            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              Tip: Arrive at least 15 minutes early to locate your room.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="supervisors">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-4" />
              Supervisors
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {exam.supervisors.map((name, i) => (
              <div key={i} className="rounded-md border bg-card p-3">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-muted-foreground">
                  Invigilation duty
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
