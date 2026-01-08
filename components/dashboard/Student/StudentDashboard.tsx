import { Suspense } from 'react';
import { StudentDashboardStatsCards } from './StudentDashboardStatsCards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';
import StudentSubjectsRadar from './student-subjects-radar';
import { RecentNoticesCards } from '../notice/recent-notices-cards';
import { FeesQuickCard } from './FeesQuickCard';
import { FeeStatus, PaymentMethod } from '@/generated/prisma/enums';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Download,
  MessageSquare,
  Zap,

  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { getStudentNotices } from '@/lib/data/notice/get-student-notices';
import { getCurrentAcademicYear } from '@/lib/academicYear';
import { getCurrentUserByRole } from '@/lib/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Enhanced fees status with better error handling and caching
export async function getFeesStatus(studentId: string) {
  try {
    const fees = await prisma.fee.findMany({
      where: { studentId },
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 5,
        },
      },
    });

    let totalAnnualFee = 0;
    let paidAmount = 0;
    let pendingAmount = 0;
    let recentPayments: {
      id: string;
      amount: number;
      paymentDate: Date;
      method: PaymentMethod;
      status: 'COMPLETED';
      receiptNumber: string;
    }[] = [];

    let nextDueDate: Date | null = null;
    let overdueFees = 0;

    for (const fee of fees) {
      totalAnnualFee += fee.totalFee;
      paidAmount += fee.paidAmount;
      pendingAmount += fee.pendingAmount || 0;

      if (fee.status === 'OVERDUE') {
        overdueFees++;
      }

      // Set nextDueDate to earliest due among unpaid or overdue
      if (
        (fee.status === 'UNPAID' || fee.status === 'OVERDUE') &&
        (!nextDueDate || fee.dueDate < nextDueDate)
      ) {
        nextDueDate = fee.dueDate;
      }

      for (const payment of fee.payments) {
        if (payment.status === 'COMPLETED') {
          recentPayments.push({
            id: payment.id,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            method: payment.paymentMethod,
            status: 'COMPLETED',
            receiptNumber: payment.receiptNumber,
          });
        }
      }
    }

    // Sort recent payments by date descending and limit to latest 3
    recentPayments = recentPayments
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())
      .slice(0, 3);

    const status: FeeStatus =
      pendingAmount === 0
        ? FeeStatus.PAID
        : paidAmount === 0
          ? FeeStatus.UNPAID
          : FeeStatus.OVERDUE;

    const paymentProgress = totalAnnualFee > 0 ? (paidAmount / totalAnnualFee) * 100 : 0;

    return {
      totalAnnualFee,
      paidAmount,
      pendingAmount,
      nextDueDate,
      status,
      recentPayments,
      overdueFees,
      paymentProgress,
    };
  } catch (error) {
    console.error('Error fetching fees status:', error);
    throw new Error('Failed to fetch fees data');
  }
}

// Get upcoming events for the student
// async function getUpcomingEvents(studentId: string) {
//   try {
//     // const events = await prisma.event.findMany({
//     //   where: {
//     //     OR: [
//     //       { targetAudience: 'ALL' },
//     //       { targetAudience: 'STUDENTS' },
//     //     ],
//     //     eventDate: {
//     //       gte: new Date(),
//     //     },
//     //   },
//     //   orderBy: { eventDate: 'asc' },
//     //   take: 3,
//     //   cacheStrategy: { ttl: 600 }, // 10 minutes cache
//     // });
//     let events = [
//       {
//         id: 'event1',
//         title: 'Event 1',
//         eventDate: new Date('2023-10-15'),
//         eventType: 'Online',
//       },
//       {
//         id: 'event2',
//         title: 'Event 2',
//         eventDate: new Date('2023-10-17'),
//         eventType: 'Offline',
//       },
//       {
//         id: 'event3',
//         title: 'Event 3',
//         eventDate: new Date('2023-10-19'),
//         eventType: 'Online',
//       }
//     ];

//     return events.map(event => ({
//       id: event.id,
//       title: event.title,
//       date: event.eventDate,
//       type: event.eventType,
//     }));
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     return [];
//   }
// }

// Quick Actions with enhanced data
const quickActions = [
  {
    title: 'Pay Fees',
    description: 'Online payments',
    icon: CreditCard,
    color: 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400',
    action: 'payment',
    link: '/dashboard/fees/student',
  },
  {
    title: 'Download Receipt',
    description: 'Payment receipts',
    icon: Download,
    color: 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
    action: 'download',
    link: '/dashboard/fees/student',
  },
  // {
  //   title: 'Study Materials',
  //   description: 'Access resources',
  //   icon: BookOpen,
  //   color: 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
  //   action: 'materials',
  //   link: '/dashboard/materials',
  // },
  {
    title: 'Submit Complaint',
    description: 'Report issues',
    icon: MessageSquare,
    color: 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400',
    action: 'complaint',
    link: '/dashboard/anonymous-complaints',
  },
  // {
  //   title: 'Class Schedule',
  //   description: 'View timetable',
  //   icon: Calendar,
  //   color: 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
  //   action: 'schedule',
  //   link: '/dashboard/schedule',
  // },
  // {
  //   title: 'Notifications',
  //   description: 'Latest updates',
  //   icon: Bell,
  //   color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400',
  //   action: 'notifications',
  //   link: '/dashboard/notifications',
  //   badge: 'new',
  // },
];

// Enhanced Quick Action Card Component
function QuickActionCard({ action }: { action: typeof quickActions[0] }) {
  return (
    <Link href={action.link} aria-label={action.title}>
      <Card className="group transition-all duration-200 hover:shadow-lg hover:scale-105 focus-visible:shadow-lg focus-visible:outline-none border-slate-200/60 dark:border-slate-700/60">
        <CardHeader className="flex flex-row items-center gap-3 p-4">
          <div
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
              action.color
            )}
            aria-hidden="true"
          >
            <action.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold truncate">
                {action.title}
              </CardTitle>
              {/* {pendingAmount === 'urgent' && (
                <Badge variant="absent" className="text-xs">
                  Urgent
                </Badge>
              )}
              {action.badge === 'new' && (
                <Badge variant="present" className="text-xs">
                  New
                </Badge>
              )} */}
            </div>
            <CardDescription className="text-sm truncate">
              {action.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

// Upcoming Events Component
// async function UpcomingEvents({ studentId }: { studentId: string }) {
//   const events = await getUpcomingEvents(studentId);

//   if (events.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Calendar className="h-5 w-5" />
//             Upcoming Events
//           </CardTitle>
//           <CardDescription>No upcoming events</CardDescription>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg flex items-center gap-2">
//           <Calendar className="h-5 w-5" />
//           Upcoming Events
//         </CardTitle>
//         <CardDescription>Your scheduled activities</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {events.map((event) => (
//           <div
//             key={event.id}
//             className="flex items-center gap-3 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
//           >
//             <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex flex-col items-center justify-center">
//               <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
//                 {format(event.date, 'MMM')}
//               </span>
//               <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                 {format(event.date, 'dd')}
//               </span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium truncate">{event.title}</p>
//               <div className="flex items-center gap-2 mt-1">
//                 <Badge variant="outline" className="text-xs">
//                   {event.type}
//                 </Badge>
//                 <span className="text-xs text-muted-foreground">
//                   {isToday(event.date)
//                     ? 'Today'
//                     : isTomorrow(event.date)
//                       ? 'Tomorrow'
//                       : format(event.date, 'MMM d, yyyy')}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }

// Enhanced Student Dashboard Component
const StudentDashboard = async () => {
  const [recentNotices, currentUser, academicYear] = await Promise.all([
    getStudentNotices(),
    getCurrentUserByRole(),
    getCurrentAcademicYear(),
  ]);

  // ✅ Only allow students here
  if (currentUser.role !== 'STUDENT') {
    return (
      <div className="p-8 text-center text-red-600 font-semibold text-lg">
        Only students can access this page.
      </div>
    );
  }

  if (!academicYear) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-yellow-500" />
        <h2 className="text-2xl font-semibold">Academic Year Not Set</h2>
        <p className="text-muted-foreground max-w-md">
          Please set the current academic year before using the dashboard features.
          contact your administrator or 8459324821 Shiksha.cloud Support
        </p>
        <Button asChild>
          <a href="/dashboard/settings">Go to Settings</a>
        </Button>
      </div>
    );
  }

  const feesData = await getFeesStatus(currentUser.studentId);



  return (
    <div className="grid gap-4 md:gap-6 px-2">
      {/* Stats Cards */}
      <StudentDashboardStatsCards studentId={currentUser.studentId} />


      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-12">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-8 space-y-4 sm:space-y-6">
          {/* Subject Performance */}
          <Card className="border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Subject Performance
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Comprehensive academic performance tracking and analysis
                  </CardDescription>
                </div>
                <Badge variant="outline" className="self-start sm:self-auto shrink-0">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <StudentSubjectsRadar />
              </Suspense>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20 rounded-t-lg border-b border-purple-200/30 dark:border-purple-800/30">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Frequently used features and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} action={action} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:col-span-4">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <RecentNoticesCards recentNotices={recentNotices} />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <FeesQuickCard feesData={feesData} />
          </Suspense>

          {/* <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <UpcomingEvents studentId={currentUser.studentId} />
    </Suspense> */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;