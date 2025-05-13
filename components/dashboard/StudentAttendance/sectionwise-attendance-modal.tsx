'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
} from 'lucide-react';

interface Students {
  id: string;
  name: string;
  rollNumber: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'not-recorded';
  notes?: string;
}

interface SectionAttendanceDetails {
  id: string;
  section: string;
  grade: string;
  date: Date;
  reportedBy: string;
  status: 'completed' | 'in-progress' | 'pending';
  percentage: number;
  studentsPresent: number;
  totalStudents: number;
  students?: Students[];
}

interface SectionWiseAttendanceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionData: SectionAttendanceDetails;
}

export function SectionWiseAttendanceViewModal({
  isOpen,
  onClose,
  sectionData,
}: SectionWiseAttendanceViewModalProps) {
  console.log('Modal sectionData:', sectionData);
  const [activeTab, setActiveTab] = useState<string>('overview');

  if (!sectionData) {
    return null;
  }

  const {
    section,
    grade,
    date,
    reportedBy,
    status,
    percentage,
    studentsPresent,
    totalStudents,
    students = [], // Default to empty array to prevent undefined
  } = sectionData;

  console.log('Section data (modal):', sectionData);
  console.log('Student data (modal):', students);

  // console.log(sectionData, 'section data');

  // Format date
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate statistics
  const studentsAbsent = (students ?? []).filter(
    (student) => student.attendanceStatus === 'absent'
  ).length;
  const studentsLate = (students ?? []).filter(
    (student) => student.attendanceStatus === 'late'
  ).length;
  const studentsNotRecorded = (students ?? []).filter(
    (student) => student.attendanceStatus === 'not-recorded'
  ).length;

  // Status badge component
  const AttendanceStatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Absent
          </Badge>
        );
      case 'late':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Late
          </Badge>
        );
      case 'not-recorded':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Not Recorded
          </Badge>
        );
      default:
        return null;
    }
  };

  // Section status badge
  const SectionStatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{section} Attendance</DialogTitle>
          <DialogDescription>
            {formattedDate} • Recorded by: {reportedBy || 'Not specified'}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Student List</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Attendance Summary</h3>
              <SectionStatusBadge status={status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                    Present
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {studentsPresent}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalStudents > 0
                      ? `${Math.round(
                          (studentsPresent / totalStudents) * 100
                        )}% of total`
                      : '0% of total'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <UserX className="h-4 w-4 mr-2 text-red-600" />
                    Absent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {studentsAbsent}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalStudents > 0
                      ? `${Math.round(
                          (studentsAbsent / totalStudents) * 100
                        )}% of total`
                      : '0% of total'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                    Not Recorded
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {studentsNotRecorded}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalStudents > 0
                      ? `${Math.round(
                          (studentsNotRecorded / totalStudents) * 100
                        )}% of total`
                      : '0% of total'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {totalStudents - studentsNotRecorded} of {totalStudents}{' '}
                    students
                  </span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setActiveTab('students')}
              >
                View Student List
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Student Attendance</h3>
              <div className="text-sm text-muted-foreground">
                Total: {totalStudents} students
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <AttendanceStatusBadge
                            status={student.attendanceStatus}
                          />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {student.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No student data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab('overview')}
              >
                Back to Overview
              </Button>
              <Button variant="default">Update Attendance</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
