'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  CheckIcon,
  XIcon,
  Clock,
  Copy,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { format, subDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { markAttendance } from '@/app/actions';

// Define types based on the Prisma schema
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | null;

type StudentAttendance = {
  id: string;
  present: boolean;
  date: Date;
  status: AttendanceStatus;
  notes?: string | null;
  recordedBy: string;
  sectionId: string;
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  section: { id: string; name: string } | null;
  profileImage: string | null;
  StudentAttendance: StudentAttendance[];
  gradeId: string;
  grade?: { grade: string } | null;
};

type Props = {
  students: Student[];
};

export default function AttendanceMark({ students }: Props) {
  const router = useRouter();
  const { orgRole } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [sections, setSections] = useState<
    { id: string; name: string; gradeId: string; grade: string }[]
  >([]);
  const [attendanceData, setAttendanceData] = useState<
    {
      id: string;
      firstName: string;
      lastName: string;
      rollNumber: string;
      profileImage: string | null;
      sectionId: string | null;
      status: AttendanceStatus;
      notes: string;
      marked: boolean;
      lastAttendance?: {
        status: AttendanceStatus;
        date: Date;
      };
    }[]
  >([]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
    unmarked: 0,
  });

  const groupedSections = sections.reduce(
    (acc, section) => {
      if (!acc[section.grade]) acc[section.grade] = [];
      acc[section.grade].push(section);
      return acc;
    },
    {} as Record<string, { id: string; name: string; gradeId: string }[]>
  );

  console.log('groupedSections', groupedSections);

  const handleValueChange = (value: string) => {
    setSelectedSection(value);
  };

  // Extract unique sections from students
  useEffect(() => {
    const uniqueSections = students.reduce(
      (acc, student) => {
        if (
          student.section &&
          !acc.some(
            (s) => s.id === student.section?.id && s.gradeId === student.gradeId
          )
        ) {
          acc.push({
            id: student.section.id,
            name: student.section.name,
            gradeId: student.gradeId,
            grade: student.grade?.grade || '',
          });
        }
        return acc;
      },
      [] as { id: string; name: string; gradeId: string; grade: string }[]
    );
    console.log(uniqueSections);

    setSections(uniqueSections);

    // Set default section only if selectedSection is not already set
    if (uniqueSections.length > 0 && !selectedSection) {
      setSelectedSection(uniqueSections[0].id);
    }
  }, [students, selectedSection]);

  // Initialize attendance data when students, section, or date changes
  useEffect(() => {
    if (!selectedSection) return;

    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    const initialData = students
      .filter((student) => student.section?.id === selectedSection)
      .map((student) => {
        // Check if there's already an attendance record for this date
        const existingAttendance = student.StudentAttendance.find((a) => {
          const attendanceDate = new Date(a.date);
          attendanceDate.setHours(0, 0, 0, 0);
          return attendanceDate.getTime() === formattedDate.getTime();
        });

        // Find the most recent attendance record before today
        const lastAttendance = student.StudentAttendance.filter(
          (a) => new Date(a.date) < formattedDate
        ).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        return {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          rollNumber: student.rollNumber,
          profileImage: student.profileImage,
          sectionId: student.section?.id || null,
          status: existingAttendance?.status || null,
          notes: existingAttendance?.notes || '',
          marked: !!existingAttendance,
          lastAttendance: lastAttendance
            ? {
                status: lastAttendance.status,
                date: new Date(lastAttendance.date),
              }
            : undefined,
        };
      });

    setAttendanceData(initialData);
  }, [students, selectedSection, date]);

  // Calculate attendance statistics whenever attendance data changes
  useEffect(() => {
    const present = attendanceData.filter(
      (student) => student.status === 'PRESENT'
    ).length;
    const absent = attendanceData.filter(
      (student) => student.status === 'ABSENT'
    ).length;
    const late = attendanceData.filter(
      (student) => student.status === 'LATE'
    ).length;
    const unmarked = attendanceData.filter(
      (student) => student.status === null
    ).length;

    const total = attendanceData.length;

    setAttendanceStats({
      present,
      absent,
      late,
      unmarked,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    });
  }, [attendanceData]);

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setAttendanceData(
      attendanceData.map((student) =>
        student.id === id ? { ...student, status, marked: true } : student
      )
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    setAttendanceData(
      attendanceData.map((student) =>
        student.id === id ? { ...student, notes, marked: true } : student
      )
    );
  };
  const markAllWithStatus = (status: AttendanceStatus) => {
    setAttendanceData(
      attendanceData.map((student) => ({ ...student, status, marked: true }))
    );
  };

  const copyPreviousDayAttendance = async () => {
    try {
      const previousDay = subDays(date, 1);
      const formattedPreviousDay = format(previousDay, 'yyyy-MM-dd');

      // Fetch previous day's attendance from API
      const response = await fetch(
        `/api/attendance?date=${formattedPreviousDay}&sectionId=${selectedSection}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch previous day attendance');
      }

      const previousAttendance = await response.json();

      // Update attendance data with previous day's records
      setAttendanceData(
        attendanceData.map((student) => {
          const prevRecord = previousAttendance.find(
            (record: any) => record.studentId === student.id
          );
          if (prevRecord) {
            return {
              ...student,
              status: prevRecord.status,
              notes: prevRecord.notes || '',
              marked: true,
            };
          }
          return student;
        })
      );

      toast("Previous day's attendance copied", {
        description: `Attendance data from ${format(previousDay, 'PPP')} has been applied.`,
      });
    } catch (error) {
      console.error('Error copying previous day attendance:', error);
      toast.error("Failed to copy previous day's attendance");
    }
  };

  const handleSubmit = () => {
    // const unmarkedStudents = attendanceData.filter(
    //   (student) => student.status === null
    // );
    // if (unmarkedStudents.length > 0) {
    //   toast.warning(`${unmarkedStudents.length} students still unmarked`, {
    //     description:
    //       'Please mark attendance for all students before submitting.',
    //   });
    //   return;
    // }

    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    try {
      const sectionId = selectedSection;

      const records = attendanceData
        .filter((student) => student.status !== null) // Filter out null statuses
        .map((student) => ({
          studentId: student.id,
          status: student.status as 'PRESENT' | 'ABSENT' | 'LATE', // Type assertion
        }));

      await markAttendance(sectionId, records);

      toast.success('Attendance saved', {
        description: `Attendance for ${format(date, 'PPP')} has been recorded successfully.`,
      });

      // Close dialog and redirect
      setShowConfirmation(false);
      router.push('/dashboard/attendance/attendance-dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Error', {
        description: 'Failed to save attendance records',
      });
      setShowConfirmation(false);
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            Present
          </span>
        );
      case 'ABSENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
            Absent
          </span>
        );
      case 'LATE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
            Late
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate attendance percentage for a student
  const calculateAttendancePercentage = (studentId: string) => {
    const studentAttendance =
      students.find((s) => s.id === studentId)?.StudentAttendance || [];
    const totalRecords = studentAttendance.length;

    if (totalRecords === 0) return 100; // No records yet

    const presentCount = studentAttendance.filter(
      (a) => a.status === 'PRESENT'
    ).length;
    return Math.round((presentCount / totalRecords) * 100);
  };

  return (
    <main className="flex-1 p-2 md:p-6 space-y-3">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Select the date and section to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {orgRole === 'ADMIN' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div className="space-y-2">
              <Select onValueChange={handleValueChange} value={selectedSection}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedSections).map(([grade, sections]) => (
                    <SelectGroup key={grade}>
                      <SelectLabel className="font-bold ">{grade}</SelectLabel>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSection && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Student List</CardTitle>
              <CardDescription>
                Mark attendance for{' '}
                {sections.find((s) => s.id === selectedSection)?.name}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copyPreviousDayAttendance}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Previous Day
              </Button>
              <Button
                variant="outline"
                onClick={() => markAllWithStatus('PRESENT')}
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                All Present
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Real-time attendance statistics */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Attendance Summary</span>
                </div>
                <div className="text-2xl font-bold">
                  {attendanceStats.percentage}%
                </div>
              </div>
              <Progress
                value={attendanceStats.percentage}
                className="h-2 mb-2 rounded-full"
              />
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Present: {attendanceStats.present}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Absent: {attendanceStats.absent}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Late: {attendanceStats.late}</span>
                </div>
              </div>
            </div>

            {attendanceData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found in this section
              </div>
            ) : (
              <div className="space-y-4">
                {attendanceData.map((student) => {
                  const attendancePercentage = calculateAttendancePercentage(
                    student.id
                  );

                  return (
                    <div
                      key={student.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="flex items-center gap-3 cursor-pointer">
                              <Avatar>
                                <AvatarImage
                                  src={student.profileImage || undefined}
                                  alt={`${student.firstName} ${student.lastName}`}
                                />
                                <AvatarFallback>
                                  {student.firstName[0]}
                                  {student.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Roll: {student.rollNumber}
                                </p>
                              </div>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex justify-between space-y-1">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={student.profileImage || undefined}
                                  alt={`${student.firstName} ${student.lastName}`}
                                />
                                <AvatarFallback>
                                  {student.firstName[0]}
                                  {student.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">
                                  {student.firstName} {student.lastName}
                                </h4>
                                <p className="text-sm">
                                  Roll Number: {student.rollNumber}
                                </p>
                                {student.lastAttendance && (
                                  <div className="flex items-center pt-2">
                                    <span className="text-xs text-muted-foreground mr-2">
                                      Last Status:
                                    </span>
                                    {getStatusBadge(
                                      student.lastAttendance.status
                                    )}
                                    <span className="text-xs ml-2">
                                      (
                                      {format(
                                        new Date(student.lastAttendance.date),
                                        'PP'
                                      )}
                                      )
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center pt-4">
                              <span className="text-xs text-muted-foreground mr-2">
                                Overall Attendance:
                              </span>
                              <span
                                className={cn(
                                  'text-xs font-medium',
                                  attendancePercentage >= 95
                                    ? 'text-green-600 dark:text-green-400'
                                    : attendancePercentage >= 90
                                      ? 'text-yellow-600 dark:text-yellow-400'
                                      : 'text-red-600 dark:text-red-400'
                                )}
                              >
                                {attendancePercentage}%
                              </span>
                            </div>
                          </HoverCardContent>
                        </HoverCard>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant={
                              student.status === 'PRESENT'
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() =>
                              handleStatusChange(student.id, 'PRESENT')
                            }
                            className={cn(
                              student.status === 'PRESENT' &&
                                'bg-green-600 hover:bg-green-700'
                            )}
                          >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              student.status === 'ABSENT'
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() =>
                              handleStatusChange(student.id, 'ABSENT')
                            }
                            className={cn(
                              student.status === 'ABSENT' &&
                                'bg-red-600 hover:bg-red-700'
                            )}
                          >
                            <XIcon className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              student.status === 'LATE' ? 'default' : 'outline'
                            }
                            onClick={() =>
                              handleStatusChange(student.id, 'LATE')
                            }
                            className={cn(
                              student.status === 'LATE' &&
                                'bg-yellow-600 hover:bg-yellow-700'
                            )}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Late
                          </Button>
                        </div>
                      </div>

                      {/* Notes section */}
                      {/* <div className="px-4 pb-4">
                        <Textarea
                          placeholder="Add notes (optional)"
                          value={student.notes}
                          onChange={(e) =>
                            handleNotesChange(student.id, e.target.value)
                          }
                          className="h-20 resize-none"
                        />
                      </div> */}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/attendance')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={attendanceData.length === 0}
            >
              Save Attendance
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Attendance Submission</DialogTitle>
            <DialogDescription>
              Please review the attendance summary before final submission.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Date:</p>
                <p className="text-sm text-muted-foreground">
                  {format(date, 'PPP')}
                </p>
              </div>
              <div>
                <p className="font-medium">Section:</p>
                <p className="text-sm text-muted-foreground">
                  {sections.find((s) => s.id === selectedSection)?.name}
                </p>
              </div>
              <div>
                <p className="font-medium">Total Students:</p>
                <p className="text-sm text-muted-foreground">
                  {attendanceData.length}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="font-medium">
                  Present: {attendanceStats.present} students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="font-medium">
                  Absent: {attendanceStats.absent} students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="font-medium">
                  Late: {attendanceStats.late} students
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm flex flex-col gap-2">
                This action will record attendance for all students in
                <span className="text-center text-blue-500">
                  {' '}
                  {sections.find((s) => s.id === selectedSection)?.name}
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Go Back
            </Button>
            <Button onClick={confirmSubmit}>Confirm Submission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
