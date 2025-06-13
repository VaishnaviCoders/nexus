'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  CheckIcon,
  XIcon,
  Clock,
  Copy,
  Users,
  AlertTriangle,
  Loader2,
  BookOpen,
  GraduationCap,
  Sparkles,
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
  SelectItem,
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { getPreviousDayAttendance, markAttendance } from '@/app/actions';

// Define types
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | null;

type StudentAttendance = {
  id: string;
  present: boolean;
  date: Date;
  status: AttendanceStatus;
  note?: string | null;
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

type AttendanceRecord = {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  profileImage: string | null;
  sectionId: string | null;
  status: AttendanceStatus;
  note: string;
  marked: boolean;
  lastAttendance?: {
    status: AttendanceStatus;
    date: Date;
  };
};

type AttendanceStats = {
  present: number;
  absent: number;
  late: number;
  percentage: number;
  unmarked: number;
};

type Section = {
  id: string;
  name: string;
  gradeId: string;
  grade: string;
};

type Props = {
  students: Student[];
};

// Mock AI suggestion function - replace with actual AI SDK integration
const generateNoteSuggestion = async (
  studentName: string,
  status: AttendanceStatus
): Promise<string> => {
  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const suggestions = {
    ABSENT: [
      `${studentName} was absent today. Consider following up with parents.`,
      `${studentName} missed class. May need to catch up on today's lesson.`,
      `${studentName} was not present. Check if there are any ongoing issues.`,
    ],
    LATE: [
      `${studentName} arrived late to class. Discuss punctuality importance.`,
      `${studentName} was tardy. Consider discussing time management strategies.`,
      `${studentName} came in late. May have missed important announcements.`,
    ],
    PRESENT: [
      `${studentName} was present and engaged in class.`,
      `${studentName} attended class regularly.`,
      `${studentName} was present for today's session.`,
    ],
  };

  const statusSuggestions =
    suggestions[status as keyof typeof suggestions] || [];
  return (
    statusSuggestions[Math.floor(Math.random() * statusSuggestions.length)] ||
    ''
  );
};

export default function AttendanceMark({ students }: Props) {
  const router = useRouter();
  const { orgRole } = useAuth();

  const [date, setDate] = useState<Date>(new Date());
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [sections, setSections] = useState<Section[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopyingPrevious, setIsCopyingPrevious] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
    unmarked: 0,
  });
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState<string | null>(
    null
  );

  // Memoized values for better performance
  const grades = useMemo(() => {
    const uniqueGrades = Array.from(
      new Set(sections.map((section) => section.grade))
    ).sort((a, b) => {
      // Natural sort for grades (1, 2, 3... 10, 11, 12)
      const aNum = Number.parseInt(a.match(/\d+/)?.[0] || '0');
      const bNum = Number.parseInt(b.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });
    return uniqueGrades;
  }, [sections]);

  const availableSections = useMemo(() => {
    return sections
      .filter((section) => section.grade === selectedGrade)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sections, selectedGrade]);

  // Extract unique sections from students
  useEffect(() => {
    const uniqueSections = students.reduce((acc, student) => {
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
    }, [] as Section[]);

    setSections(uniqueSections);

    // Set default grade and section if available
    if (uniqueSections.length > 0 && !selectedGrade) {
      const firstGrade = uniqueSections[0].grade;
      setSelectedGrade(firstGrade);
      const firstSection = uniqueSections.find(
        (s) => s.grade === firstGrade
      )?.id;
      if (firstSection) setSelectedSection(firstSection);
    }
  }, [students, selectedGrade]);

  // Initialize attendance data when students, section, or date changes
  useEffect(() => {
    if (!selectedSection) return;

    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    const initialData = students
      .filter((student) => student.section?.id === selectedSection)
      .map((student) => {
        const existingAttendance = student.StudentAttendance.find((a) => {
          const attendanceDate = new Date(a.date);
          attendanceDate.setHours(0, 0, 0, 0);
          return attendanceDate.getTime() === formattedDate.getTime();
        });

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
          note: existingAttendance?.note || '',
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

  // Calculate attendance statistics
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

  const handleNoteChange = (id: string, note: string) => {
    setAttendanceData(
      attendanceData.map((student) =>
        student.id === id ? { ...student, note, marked: true } : student
      )
    );
  };

  const generateAISuggestion = async (studentId: string) => {
    const student = attendanceData.find((s) => s.id === studentId);
    if (!student || !student.status) return;

    setAiSuggestionLoading(studentId);
    try {
      const suggestion = await generateNoteSuggestion(
        `${student.firstName} ${student.lastName}`,
        student.status
      );
      handleNoteChange(studentId, suggestion);
      toast.success('AI suggestion generated!', {
        description: 'Note has been updated with AI suggestion.',
      });
    } catch (error) {
      toast.error('Failed to generate suggestion', {
        description: 'Please try again or write the note manually.',
      });
    } finally {
      setAiSuggestionLoading(null);
    }
  };

  const markAllWithStatus = (status: AttendanceStatus) => {
    setAttendanceData(
      attendanceData.map((student) => ({ ...student, status, marked: true }))
    );
    toast.success(`All students marked as ${status?.toLowerCase()}`, {
      description: `${attendanceData.length} students updated.`,
    });
  };

  const copyPreviousDayAttendance = async () => {
    setIsCopyingPrevious(true);
    try {
      const previousDay = subDays(date, 1);

      // Fetch attendance for each student from previous day
      const previousAttendances = await Promise.all(
        students.map((student) => getPreviousDayAttendance(student.id, date))
      );

      const updatedData = attendanceData.map((student) => {
        const prevRecord = previousAttendances.find(
          (record) => record?.studentId === student.id
        );

        if (prevRecord) {
          return {
            ...student,
            status: prevRecord.status,
            note: prevRecord.note || '',
            marked: true,
          };
        }

        return student;
      });

      setAttendanceData(updatedData);

      toast.success("Previous day's attendance copied!", {
        description: `Attendance data from ${format(
          previousDay,
          'PPP'
        )} has been applied.`,
      });
    } catch (error) {
      console.error('Error copying previous day attendance:', error);
      toast.error("Failed to copy previous day's attendance");
    } finally {
      setIsCopyingPrevious(false);
    }
  };

  const handleSubmit = () => {
    const unmarkedStudents = attendanceData.filter(
      (student) => student.status === null
    );

    if (unmarkedStudents.length > 0) {
      toast.warning(`${unmarkedStudents.length} students still unmarked`, {
        description:
          'Please mark attendance for all students before submitting.',
        action: {
          label: 'Mark All Present',
          onClick: () => markAllWithStatus('PRESENT'),
        },
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const sectionId = selectedSection;
      const records = attendanceData
        .filter((student) => student.status !== null)
        .map((student) => ({
          studentId: student.id,
          status: student.status as 'PRESENT' | 'ABSENT' | 'LATE',
          note: student.note || '',
        }));

      console.log('Recording attendance:', records);
      await markAttendance(sectionId, records);

      toast.success('Attendance saved successfully!', {
        description: `Attendance for ${format(
          date,
          'PPP'
        )} has been recorded for ${records.length} students.`,
      });

      setShowConfirmation(false);
      router.push('/dashboard/attendance/analytics');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
          >
            <CheckIcon className="w-3 h-3 mr-1" />
            Present
          </Badge>
        );
      case 'ABSENT':
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
          >
            <XIcon className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case 'LATE':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
          >
            <Clock className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Not Marked
          </Badge>
        );
    }
  };

  const calculateAttendancePercentage = (studentId: string) => {
    const studentAttendance =
      students.find((s) => s.id === studentId)?.StudentAttendance || [];
    const totalRecords = studentAttendance.length;

    if (totalRecords === 0) return 100;

    const presentCount = studentAttendance.filter(
      (a) => a.status === 'PRESENT'
    ).length;
    return Math.round((presentCount / totalRecords) * 100);
  };

  return (
    <main className="flex-1 p-4 md:p-4 space-y-6 ">
      {/* Header Section */}
      {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-base  font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Attendance Management
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Record and track student attendance with intelligent
                    insights
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20">
                  <CalendarIcon className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    Today: {format(new Date(), 'EEEE, MMMM do')}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Session Active</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Quick Guide
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Enhanced Session Configuration */}
      <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/10">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-base md:text-xl ">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Session Configuration
              </CardTitle>
              <CardDescription className="mt-2 text-sm">
                Set up your attendance session with precise parameters and smart
                defaults
              </CardDescription>
            </div>

            {selectedSection && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Ready to Record
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Enhanced Date Selection */}
            <div className="space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <CalendarIcon className="mr-3 h-4 w-4 text-blue-500" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {date ? format(date, 'PPP') : 'Select date'}
                      </span>
                      {date && (
                        <span className="text-xs text-muted-foreground">
                          {format(date, 'EEEE')}
                        </span>
                      )}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="rounded-md border shadow-lg"
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded-md">
                  📅 {format(date, 'EEEE, MMMM do, yyyy')}
                </div>
              )}
            </div>

            {/* Enhanced Grade Selection */}
            <div className="space-y-3">
              <Select
                onValueChange={(value) => {
                  setSelectedGrade(value);
                  setSelectedSection('');
                }}
                value={selectedGrade}
                disabled={grades.length === 0}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-purple-500" />
                    <SelectValue
                      placeholder={
                        grades.length === 0
                          ? 'No grades available'
                          : 'Choose grade level'
                      }
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade} className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="font-medium">{grade}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedGrade && (
                <div className="text-xs text-muted-foreground bg-purple-50 dark:bg-purple-950/20 p-2 rounded-md">
                  🎓 {selectedGrade} selected
                </div>
              )}
            </div>

            {/* Enhanced Section Selection */}
            <div className="space-y-3">
              <Select
                onValueChange={setSelectedSection}
                value={selectedSection}
                disabled={availableSections.length === 0 || !selectedGrade}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <SelectValue
                      placeholder={
                        !selectedGrade
                          ? 'Select grade first'
                          : availableSections.length === 0
                          ? 'No sections available'
                          : 'Choose section'
                      }
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((section) => (
                    <SelectItem
                      key={section.id}
                      value={section.id}
                      className="py-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-medium">{section.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSection && (
                <div className="text-xs text-muted-foreground bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                  📚
                  {
                    availableSections.find((s) => s.id === selectedSection)
                      ?.name
                  }{' '}
                  ready
                </div>
              )}
            </div>
          </div>

          {/* Configuration Summary */}
          {selectedGrade && selectedSection && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Session Ready
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedGrade} •{' '}
                      {
                        availableSections.find((s) => s.id === selectedSection)
                          ?.name
                      }{' '}
                      • {format(date, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  All Set
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedSection && (
        <>
          {/* Attendance Statistics */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">Attendance Overview</span>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {attendanceStats.percentage}%
                  </div>
                </div>

                <Progress
                  value={attendanceStats.percentage}
                  className="h-2 rounded-full"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {/* Present Card */}
                  <div className="relative flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-200 dark:border-green-800">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0 animate-pulse"></div>
                    <div>
                      <p className="text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wide">
                        Present
                      </p>
                      <p className="text-xl font-bold text-green-700 dark:text-green-400">
                        {attendanceStats.present}
                      </p>
                    </div>
                  </div>

                  {/* Absent Card */}
                  <div className="relative flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-red-200 dark:border-red-800">
                    <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></div>
                    <div>
                      <p className="text-xs font-semibold text-red-800 dark:text-red-300 uppercase tracking-wide">
                        Absent
                      </p>
                      <p className="text-xl font-bold text-red-700 dark:text-red-400">
                        {attendanceStats.absent}
                      </p>
                    </div>
                  </div>

                  {/* Late Card */}
                  <div className="relative flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-yellow-200 dark:border-yellow-800">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0 animate-pulse"></div>
                    <div>
                      <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 uppercase tracking-wide">
                        Late
                      </p>
                      <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                        {attendanceStats.late}
                      </p>
                    </div>
                  </div>

                  {/* Unmarked Card */}
                  <div className="relative flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-800">
                    <div className="w-4 h-4 rounded-full bg-gray-500 flex-shrink-0 animate-pulse"></div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-300 uppercase tracking-wide">
                        Unmarked
                      </p>
                      <p className="text-xl font-bold text-gray-700 dark:text-gray-400">
                        {attendanceStats.unmarked}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-4 w-4" />
                  {selectedGrade} -{' '}
                  {sections.find((s) => s.id === selectedSection)?.name}
                </CardTitle>
                <CardDescription>
                  {attendanceData.length} students •{' '}
                  {format(date, 'MMM dd, yyyy')}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={copyPreviousDayAttendance}
                  disabled={isCopyingPrevious}
                  className="h-9"
                >
                  {isCopyingPrevious ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  Copy Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => markAllWithStatus('PRESENT')}
                  className="h-9"
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  All Present
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {attendanceData.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No students found
                  </h3>
                  <p className="text-muted-foreground">
                    No students are enrolled in this section
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attendanceData.map((student, index) => {
                    const attendancePercentage = calculateAttendancePercentage(
                      student.id
                    );

                    return (
                      <Card
                        key={student.id}
                        className="transition-all hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Student Info */}
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer">
                                  <div className="relative">
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage
                                        src={student.profileImage || undefined}
                                        alt={`${student.firstName} ${student.lastName}`}
                                      />
                                      <AvatarFallback className="bg-primary/10">
                                        {student.firstName[0]}
                                        {student.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-lg">
                                        {student.firstName} {student.lastName}
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        #{student.rollNumber}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Overall Attendance: {attendancePercentage}
                                      %
                                    </p>
                                  </div>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
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
                                    <div>
                                      <h4 className="font-semibold">
                                        {student.firstName} {student.lastName}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Roll Number: {student.rollNumber}
                                      </p>
                                    </div>
                                  </div>

                                  <Separator />

                                  {student.lastAttendance && (
                                    <div>
                                      <p className="text-sm font-medium mb-1">
                                        Last Attendance:
                                      </p>
                                      <div className="flex items-center justify-between">
                                        {getStatusBadge(
                                          student.lastAttendance.status
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                          {format(
                                            new Date(
                                              student.lastAttendance.date
                                            ),
                                            'PP'
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  <div>
                                    <p className="text-sm font-medium mb-1">
                                      Overall Performance:
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <Progress
                                        value={attendancePercentage}
                                        className="flex-1 h-2"
                                      />
                                      <span
                                        className={cn(
                                          'text-sm font-medium',
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
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>

                            {/* Status Buttons */}
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
                                  'h-9',
                                  student.status === 'PRESENT' &&
                                    'bg-green-600 hover:bg-green-700 text-white'
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
                                  'h-9',
                                  student.status === 'ABSENT' &&
                                    'bg-red-600 hover:bg-red-700 text-white'
                                )}
                              >
                                <XIcon className="h-4 w-4 mr-1" />
                                Absent
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  student.status === 'LATE'
                                    ? 'default'
                                    : 'outline'
                                }
                                onClick={() =>
                                  handleStatusChange(student.id, 'LATE')
                                }
                                className={cn(
                                  'h-9',
                                  student.status === 'LATE' &&
                                    'bg-yellow-600 hover:bg-yellow-700 text-white'
                                )}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Late
                              </Button>
                            </div>
                          </div>

                          {/* Note Section */}

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">
                                Note (Optional)
                              </label>
                              {student.status &&
                                student.status !== 'PRESENT' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      generateAISuggestion(student.id)
                                    }
                                    disabled={
                                      aiSuggestionLoading === student.id
                                    }
                                    className="h-7 text-xs p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border-dashed border-blue-500 shadow-lg"
                                  >
                                    {aiSuggestionLoading === student.id ? (
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
                                    )}
                                    AI Suggest
                                  </Button>
                                )}
                            </div>
                            <Textarea
                              placeholder={
                                student.status === 'PRESENT'
                                  ? 'Add any additional notes...'
                                  : student.status === 'ABSENT'
                                  ? 'Reason for absence, follow-up actions...'
                                  : student.status === 'LATE'
                                  ? 'Reason for lateness, time arrived...'
                                  : 'Select attendance status first...'
                              }
                              value={student.note}
                              onChange={(e) =>
                                handleNoteChange(student.id, e.target.value)
                              }
                              className="h-20 resize-none placeholder:text-muted-foreground text-muted-foreground"
                              disabled={!student.status}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between bg-muted/50">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/attendance')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={attendanceData.length === 0 || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Attendance'
                )}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Submission
            </DialogTitle>
            <DialogDescription>
              Please review the attendance summary before final submission.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(date, 'PPP')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{selectedGrade}</p>
                <p className="text-sm text-muted-foreground">
                  {sections.find((s) => s.id === selectedSection)?.name}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                <span className="text-sm font-medium">Present Students</span>
                <Badge
                  variant="secondary"
                  className="bg-green-200 text-green-500"
                >
                  {attendanceStats.present}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded">
                <span className="text-sm font-medium">Absent Students</span>
                <Badge variant="secondary" className="bg-red-200 text-red-500">
                  {attendanceStats.absent}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                <span className="text-sm font-medium">Late Students</span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-200 text-yellow-500"
                >
                  {attendanceStats.late}
                </Badge>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Total:</strong> {attendanceData.length} students •
                <strong> Attendance Rate:</strong> {attendanceStats.percentage}%
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
            >
              Go Back
            </Button>
            <Button
              onClick={confirmSubmit}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Confirm & Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
