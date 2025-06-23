'use client';

import { Button } from '@/components/ui/button';
import {
  Activity,
  UserPlus,
  FileText,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Users,
  BookOpen,
  Settings,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminQuickActions() {
  const actions = [
    {
      title: 'Add Student',
      description: 'Enroll new student',
      icon: UserPlus,
      href: '/dashboard/students/create',
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      category: 'primary',
    },
    {
      title: 'Create Notice',
      description: 'Publish announcement',
      icon: FileText,
      href: '/dashboard/notices/create',
      color: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
      category: 'primary',
    },
    {
      title: 'Mark Attendance',
      description: 'Record daily attendance',
      icon: Users,
      href: '/dashboard/attendance/mark',
      color:
        'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      category: 'primary',
    },
    {
      title: 'Manage Fees',
      description: 'Fee collection & tracking',
      icon: IndianRupee,
      href: '/dashboard/fees/admin',
      color:
        'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
      category: 'primary',
    },
    {
      title: 'Add Holiday',
      description: 'Update academic calendar',
      icon: Calendar,
      href: '/dashboard/holidays',
      color: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
      category: 'secondary',
    },
    {
      title: 'View Complaints',
      description: 'Handle pending issues',
      icon: AlertTriangle,
      href: '/dashboard/anonymous-complaints/manage',
      color: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
      category: 'secondary',
    },
    {
      title: 'Manage Grades',
      description: 'Configure classes & sections',
      icon: BookOpen,
      href: '/dashboard/grades',
      color:
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
      category: 'secondary',
    },
    {
      title: 'View Analytics',
      description: 'Performance insights',
      icon: BarChart3,
      href: '/dashboard/attendance/analytics',
      color: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
      category: 'secondary',
    },
    {
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300',
      category: 'secondary',
    },
  ];

  const primaryActions = actions.filter(
    (action) => action.category === 'primary'
  );
  const secondaryActions = actions.filter(
    (action) => action.category === 'secondary'
  );

  return (
    <div className="space-y-6">
      {/* Primary Actions */}

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Most Used
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {primaryActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start hover:shadow-md transition-all duration-300 group border-0 bg-gradient-to-br from-background to-muted/20"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Secondary Actions */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Other Actions
        </h3>
        <div className="grid gap-2 md:grid-cols-3">
          {secondaryActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Button
                  variant="ghost"
                  className="w-full h-auto p-3 justify-start hover:bg-muted/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`p-1.5 rounded-lg ${action.color} group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-xs">{action.title}</div>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
