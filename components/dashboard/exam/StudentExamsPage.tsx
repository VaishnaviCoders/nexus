'use client';

import { Suspense, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import Link from 'next/link';
import type { ExamMode, ExamStatus } from '@/generated/prisma/enums';

import { ExamCard } from './ExamCard';
import { formatDateRange } from '@/lib/utils';
import { ExamCardSkeleton } from '@/components/exam-skeleton';
import {
  Subject,
  ExamSession,
  ExamResult,
  HallTicket,
} from '@/generated/prisma/client';

export type ExamWithRelations = {
  id: string;
  organizationId: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  sectionId: string;
  examSessionId: string;
  subjectId: string;
  gradeId: string;
  maxMarks: number;
  passingMarks: number | null;
  weightage: number | null;
  evaluationType: string;
  mode: ExamMode;
  status: ExamStatus;
  instructions: string | null;
  durationInMinutes: number | null;
  venue: string | null;
  venueMapUrl: string | null;
  supervisors: string[];
  performance?: unknown;
  subject: Subject;
  examSession: ExamSession;
  hallTickets?: HallTicket[];
  examResult?: ExamResult[];
  isResultsPublished: boolean;
};

type Filters = {
  q: string;
  status: 'ALL' | ExamStatus;
  mode: 'ALL' | ExamMode;
  subject: 'ALL' | string;
  session: 'ALL' | string;
  view: 'cards' | 'table';
};

// Keep mode neutral to stay within palette limits
const modeClass = 'bg-secondary text-secondary-foreground border-border';

function toCSV(rows: ExamWithRelations[]) {
  const headers = [
    'Session',
    'Subject',
    'Title',
    'Status',
    'Mode',
    'Evaluation Type',
    'Start',
    'End',
    'Venue',
    'Max Marks',
    'Passing Marks',
    'Duration (min)',
    'Weightage',
  ];
  const lines = rows.map((r) =>
    [
      r.examSession.title,
      r.subject.name,
      r.title,
      r.status,
      r.mode,
      r.evaluationType,
      new Date(r.startDate).toISOString(),
      new Date(r.endDate).toISOString(),
      r.venue || '',
      r.maxMarks,
      r.passingMarks ?? '',
      r.durationInMinutes ?? '',
      r.weightage ?? '',
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  return [headers.join(','), ...lines].join('\n');
}

function humanize(val?: string | null) {
  if (!val) return '';
  return val
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (m) => m.toUpperCase());
}

export function StudentExamsPage({ exams }: { exams: ExamWithRelations[] }) {
  // Colors used: blue (primary), red (accent), amber (accent), plus neutrals (white/gray/black)
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({
    q: '',
    status: 'ALL',
    mode: 'ALL',
    subject: 'ALL',
    session: 'ALL',
    view: 'cards',
  });

  const subjects = useMemo(
    () => Array.from(new Set(exams.map((e) => e.subject.name))),
    [exams]
  );
  const sessions = useMemo(
    () => Array.from(new Set(exams.map((e) => e.examSession.title))),
    [exams]
  );

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return exams.filter((e) => {
      const matchesQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.subject.name.toLowerCase().includes(q) ||
        e.examSession.title.toLowerCase().includes(q) ||
        (e.venue?.toLowerCase().includes(q) ?? false);
      const matchesStatus =
        filters.status === 'ALL' || e.status === filters.status;
      const matchesMode = filters.mode === 'ALL' || e.mode === filters.mode;
      const matchesSubject =
        filters.subject === 'ALL' || e.subject.name === filters.subject;
      const matchesSession =
        filters.session === 'ALL' || e.examSession.title === filters.session;
      return (
        matchesQ &&
        matchesStatus &&
        matchesMode &&
        matchesSubject &&
        matchesSession
      );
    });
  }, [filters, exams]);

  const stats = useMemo(() => {
    let total = 0,
      upcoming = 0,
      live = 0,
      completed = 0;

    for (const exam of exams) {
      total++;
      switch (exam.status) {
        case 'UPCOMING':
          upcoming++;
          break;
        case 'LIVE':
          live++;
          break;
        case 'COMPLETED':
          completed++;
          break;
      }
    }

    return { total, upcoming, live, completed };
  }, [exams]);

  const handleExport = () => {
    const blob = new Blob([toCSV(filtered)], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-exams.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const ToggleFilters = () => {
    setIsFiltersVisible((prev) => !prev);
  };

  return (
    <section className="px-2 space-y-3">
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">My Exams</CardTitle>
          <CardDescription className="text-sm">
            Browse all your exams by session, subject.
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <Button variant="outline" onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 md:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.upcoming}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Live
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.live}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.completed}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="px-2 pt-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="sr-only" htmlFor="search">
                Search exams
              </label>
              <Input
                id="search"
                placeholder="Search by title, subject, session, or venue"
                value={filters.q}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, q: e.target.value }))
                }
              />
            </div>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={ToggleFilters}
              className="w-32"
            >
              <Filter />
              {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {isFiltersVisible && (
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mt-4">
              <div className="flex flex-1 flex-col gap-3 md:flex-row">
                <Select
                  value={filters.status}
                  onValueChange={(v) =>
                    setFilters((f) => ({
                      ...f,
                      status: v as Filters['status'],
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All status</SelectItem>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    <SelectItem value="LIVE">Live</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.mode}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, mode: v as Filters['mode'] }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All modes</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="PRACTICAL">Practical</SelectItem>
                    <SelectItem value="VIVA">Viva</SelectItem>
                    <SelectItem value="TAKE_HOME">Take Home</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.subject}
                  onValueChange={(v) =>
                    setFilters((f) => ({
                      ...f,
                      subject: v as Filters['subject'],
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All subjects</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.session}
                  onValueChange={(v) =>
                    setFilters((f) => ({
                      ...f,
                      session: v as Filters['session'],
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All sessions</SelectItem>
                    {sessions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs
                value={filters.view}
                onValueChange={(v) =>
                  setFilters((f) => ({ ...f, view: v as Filters['view'] }))
                }
                className="md:ml-4"
              >
                <TabsList>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {filters.view === 'cards' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Link href={`/dashboard/exams/${e.id}`} key={e.id}>
              <Suspense fallback={<ExamCardSkeleton />}>
                <ExamCard key={e.id} exam={e} />
              </Suspense>
            </Link>
          ))}

          {filtered.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No exams match your filters.
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Date & Time
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {e.title}
                    </TableCell>
                    <TableCell>{e.subject.name}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {e.examSession.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateRange(e.startDate, e.endDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={e.status} className={cn('border')}>
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('border', modeClass)}
                      >
                        {e.mode.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{e.venue || '-'}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {e.maxMarks}
                      {typeof e.passingMarks === 'number'
                        ? ` / ${e.passingMarks}`
                        : ''}
                    </TableCell>
                  </TableRow>
                ))}
                {exams.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No exams have been created yet. Please ask your admin to
                      add exams.
                    </TableCell>
                  </TableRow>
                ) : exams.length > 0 && filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No exams match your current filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
