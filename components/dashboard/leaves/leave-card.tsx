import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Building, Calendar, Clock, Phone, UserCheck } from 'lucide-react';
import { Leave, Prisma } from '@/generated/prisma/client';
import { formatDateIN } from '@/lib/utils';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
interface LeaveCardProps {
  leave: LeaveWithUser;
}
export default function LeaveCard({ leave }: LeaveCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl border bg-card shadow-sm w-full">
      <CardHeader className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className="size-12 shrink-0">
              <AvatarImage
                sizes="size-12"
                className="object-cover"
                src={leave.appliedBy.profileImage || undefined}
                alt={`${leave.appliedBy.firstName} ${leave.appliedBy.lastName}`}
              />
              <AvatarFallback className="font-medium">
                {leave.appliedBy.firstName[0]}
                {leave.appliedBy.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 min-w-0">
                <h3 className="text-base font-semibold leading-none truncate">
                  Leave Request For
                </h3>
                <Badge variant="HOLIDAY" className="whitespace-nowrap shrink-0">
                  {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'}
                </Badge>
              </div>

              <p
                className="mt-1 line-clamp-1 text-sm text-muted-foreground truncate"
                title={`${leave.appliedBy.firstName} ${leave.appliedBy.lastName}`}
              >
                {leave.appliedBy.firstName} {leave.appliedBy.lastName}
              </p>
            </div>
          </div>

          {/* Right side */}
          <Badge
            variant={leave.currentStatus}
            className="shrink-0 whitespace-nowrap"
          >
            {leave.currentStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0 gap-3">
        <div className="flex-col gap-6 md:flex">
          <div className="grid gap-3 gap-y-5 w-full">
            <div className="flex items-center gap-2 text-sm">
              <Building
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="leading-none"> Grade And Section:</span>
              <span className="truncate text-muted-foreground flex gap-x-3">
                {leave.appliedBy.student?.section.grade.grade}{' '}
                <Separator orientation="vertical" className="h-4" />
                {leave.appliedBy.student?.section.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <UserCheck
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="leading-none"> Applied By:</span>
              <span className="truncate text-muted-foreground">
                {leave.appliedBy.firstName} {leave.appliedBy.lastName}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="leading-none">Type:</span>
              <Badge variant="outline" className="ml-1">
                {leave.type}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock
                className="mt-0.5 size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="flex items-center space-x-2">
                <div className="leading-none">
                  <span className="text-muted-foreground">From</span>{' '}
                  <span className="font-medium">
                    {formatDateIN(leave.startDate)}
                  </span>
                </div>
                <div className="leading-none">
                  <span className="text-muted-foreground">To</span>{' '}
                  <span className="font-medium">
                    {formatDateIN(leave.endDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="leading-none text-muted-foreground">
              Total{' '}
              <Badge variant={'HOLIDAY'}>
                {leave.totalDays} {''}
                {leave.totalDays === 1 ? 'Day' : 'Days'}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="leading-none">Emergency contact:</span>
              <span className="font-medium">
                <Link href={leave.emergencyContact}>
                  {leave.emergencyContact}
                </Link>
              </span>
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base ">
                Leave Details
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="grid gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 mt-2">
                      Reason
                    </p>
                    <div className="rounded-md border p-3 text-sm leading-relaxed text-pretty">
                      {leave.reason}
                    </div>
                  </div>

                  {/* {leave.currentStatus === 'APPROVED' && (
                    <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                      <div className="text-muted-foreground">Approved by</div>
                      <div className="text-right">
                        <div className="font-medium">
                          {leave.approvedBy || '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateIN(leave.approvedAt) || '—'}
                        </div>
                      </div>
                    </div>
                  )} */}

                  {leave.currentStatus === 'REJECTED' && leave.rejectedNote && (
                    <div className="rounded-md border p-3 text-sm border-orange-200 bg-red-50 ">
                      <div className="mb-1 text-muted-foreground">
                        Rejection note
                      </div>
                      <p className="text-pretty leading-relaxed">
                        {leave.rejectedNote}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/30 px-6 py-4">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span>Created: {formatDateIN(leave.createdAt)}</span>
          {leave.currentStatus === 'APPROVED' && (
            <span>Approve At: {formatDateIN(leave.approvedAt)}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
