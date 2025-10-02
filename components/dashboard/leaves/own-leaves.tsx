'use client';

import type * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Info, UserIcon } from 'lucide-react';
import { cn, formatDateIN } from '@/lib/utils';
import { Prisma } from '@/generated/prisma/client';

type LeaveWithUser = Prisma.LeaveGetPayload<{
  include: {
    appliedBy: {
      select: {
        firstName: true;
        lastName: true;
        profileImage: true;
        role: true;
        student: {
          select: {
            section: {
              select: {
                name: true;
                grade: {
                  select: {
                    grade: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export function OwnLeaves({
  leaves = [],
  title = 'My Leaves',
  description = 'Your recent leave applications',
}: {
  leaves?: LeaveWithUser[];
  title?: string;
  description?: string;
}) {
  const isEmpty = !leaves || leaves.length === 0;

  return (
    <section aria-labelledby="own-leaves-heading" className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle id="own-leaves-heading" className="text-balance">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {leaves?.length ? (
            <Badge variant="secondary" aria-label={`${leaves.length} leaves`}>
              {leaves.length} {leaves.length === 1 ? 'entry' : 'entries'}
            </Badge>
          ) : null}
        </CardHeader>
      </Card>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {leaves.map((lv) => {
            const applicantName =
              `${lv.appliedBy?.firstName ?? ''} ${lv.appliedBy?.lastName ?? ''}`.trim();

            const initials = getInitials(applicantName);
            const dateRange = `${formatDateIN(lv.startDate)} → ${formatDateIN(lv.endDate)}`;
            // ✅ Correct way to fetch grade & section
            const grade = lv.appliedBy?.student?.section?.grade?.grade ?? '';
            const section = lv.appliedBy?.student?.section?.name ?? '';
            const gradeLabel =
              grade && section
                ? `${grade}-${section}`
                : grade || section || 'N/A';
            const approvedDate = lv.approvedAt
              ? formatDateIN(lv.approvedAt)
              : null;

            return (
              <Card key={lv.id} className="overflow-hidden">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={lv.appliedBy?.profileImage || undefined}
                          alt={
                            applicantName
                              ? `${applicantName} profile image`
                              : 'Applicant profile image'
                          }
                        />
                        <AvatarFallback aria-hidden="true">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-base leading-tight">
                          {applicantName || 'Applicant'}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <span>{dateRange}</span>
                          </span>
                          <Badge variant="outline">
                            {lv.totalDays} {lv.totalDays === 1 ? 'day' : 'days'}
                          </Badge>
                          {lv.type ? (
                            <Badge variant="secondary">{lv.type}</Badge>
                          ) : null}
                          {grade || section ? (
                            <span className="text-muted-foreground">
                              ({[grade, section].filter(Boolean).join('-')})
                            </span>
                          ) : null}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={lv.currentStatus}>{lv.currentStatus}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 sm:px-6 sm:pt-0">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <MetaItem
                      label="Reason"
                      value={<span className="text-pretty">{lv.reason}</span>}
                    />
                    <MetaItem
                      label="Emergency contact"
                      value={lv.emergencyContact || '—'}
                    />
                    <MetaItem
                      label="Academic year"
                      value={lv.academicYearId || '—'}
                    />

                    {lv.approvedBy ? (
                      <MetaItem
                        label="Approved"
                        value={
                          <span className="text-pretty">
                            {lv.approvedBy}{' '}
                            {approvedDate ? `on ${approvedDate}` : ''}
                          </span>
                        }
                      />
                    ) : null}

                    {lv.rejectedNote ? (
                      <MetaItem
                        label="Rejection note"
                        value={
                          <span className="text-pretty">{lv.rejectedNote}</span>
                        }
                      />
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Applied on {formatDateIN(lv.createdAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0]?.[0];
  const second = parts[1]?.[0];
  return (first || 'U') + (second || '');
}

function EmptyState() {
  return (
    <Card className="min-h-[280px]">
      <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border">
          <Info className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">No leaves yet</div>
          <div className="text-sm text-muted-foreground">
            When you apply for leave, it will appear here in a clean timeline of
            cards.
          </div>
        </div>
        <div className="mt-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <UserIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{'Your own applications are listed here.'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
