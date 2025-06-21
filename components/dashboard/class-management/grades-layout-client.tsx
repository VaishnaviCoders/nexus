'use client';

import { useEffect, useState } from 'react';
import {
  GraduationCap,
  Search,
  Settings2,
  Trash2,
  Users,
  BookOpen,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AddGrade } from './AddGrade';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Section {
  id: string;
  name: string;
  students: Student[];
}

interface Grade {
  id: string;
  grade: string;
  section: Section[];
}

interface GradeWithCounts {
  id: string;
  grade: string;
  sectionCount: number;
  studentCount: number;
}

interface GradesLayoutClientProps {
  initialGrades: GradeWithCounts[];
}

export function GradesLayoutClient({ initialGrades }: GradesLayoutClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Filter grades based on search term
  const filteredGrades = initialGrades.filter((grade) =>
    grade.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total students from precomputed counts
  const totalStudents = initialGrades.reduce(
    (acc, grade) => acc + grade.studentCount,
    0
  );

  return (
    <Card className="h-full  dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      <CardHeader className="pb-4 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 overflow-hidden rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Classes
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage grades and sections
              </p>
            </div>
          </div>
          <AddGrade />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/20">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Grades
              </span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {initialGrades.length}
            </p>
          </div>
          <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/20">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Students
              </span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {totalStudents}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 overflow-hidden">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search grades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Grades List */}
        <div className="space-y-3 ">
          {filteredGrades.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {searchTerm ? 'No grades found' : 'No grades created yet'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                {searchTerm
                  ? 'Try a different search term'
                  : 'Create your first grade to get started'}
              </p>
            </div>
          ) : (
            filteredGrades.map((grade) => {
              const isActive = pathname.includes(grade.id);

              return (
                <Card
                  key={grade.id}
                  className={cn(
                    'transition-all duration-200 cursor-pointer group hover:shadow-md',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-700 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:border-blue-700   '
                  )}
                  onClick={() => router.push(`/dashboard/grades/${grade.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {grade.grade}
                          </h3>
                          {isActive && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                            >
                              Active
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{grade.sectionCount} sections</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{grade.studentCount} students</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/grades/${grade.id}`);
                          }}
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/grades/${grade.id}/delete`);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function GradeListingSkeleton() {
  return (
    <Card className="h-full bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div>
                <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <div className="w-12 h-4 bg-slate-200 dark:bg-slate-600 rounded mb-1" />
              <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded" />
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <div className="w-12 h-4 bg-slate-200 dark:bg-slate-600 rounded mb-1" />
              <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
