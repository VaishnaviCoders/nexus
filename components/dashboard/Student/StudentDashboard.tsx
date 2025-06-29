import ComingSoon from '@/components/Coming-soon';
import React from 'react';
import { StudentDashboardStatsCards } from './StudentDashboardStatsCards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <StudentDashboardStatsCards />
      <div className="grid gap-6 lg:grid-cols-7 ">
        <Card className="lg:col-span-4 border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
            <CardTitle className="text-lg font-semibold">
              Weekly Attendance Overview
            </CardTitle>
            <CardDescription>
              Your attendance pattern for the current month
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Attendance chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-t-lg border-b border-emerald-200/30 dark:border-emerald-800/30">
            <CardTitle className="text-lg font-semibold">
              Subject Performance
            </CardTitle>
            <CardDescription>Recent test scores and grades</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                {
                  subject: 'Mathematics',
                  score: 92,
                  grade: 'A',
                  color: 'bg-blue-500',
                },
                {
                  subject: 'Science',
                  score: 88,
                  grade: 'A-',
                  color: 'bg-emerald-500',
                },
                {
                  subject: 'English',
                  score: 85,
                  grade: 'B+',
                  color: 'bg-amber-500',
                },
                {
                  subject: 'History',
                  score: 90,
                  grade: 'A',
                  color: 'bg-purple-500',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="font-medium text-sm">{item.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.score}%</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center min-h-full">
        <ComingSoon />
      </div>
    </div>
  );
};

export default StudentDashboard;
