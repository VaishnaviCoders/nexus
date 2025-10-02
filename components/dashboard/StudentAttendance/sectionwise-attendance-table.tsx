'use client';
import { useState } from 'react';
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
import {
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  LinkIcon,
  Plus,
  TriangleAlert,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SectionWiseAttendanceViewModal } from './sectionWise-attendance-modal';
import Link from 'next/link';

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
  students: Students[];
}

interface SectionAttendanceTableProps {
  sections: SectionAttendanceDetails[];
  date: Date;
}

export function SectionAttendanceTable({
  sections,
  date = new Date(),
}: SectionAttendanceTableProps) {
  const [sortField, setSortField] =
    useState<keyof SectionAttendanceDetails>('section');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  // Get unique grades for filter
  const grades = Array.from(new Set(sections.map((section) => section.grade)));

  // Handle sort
  const handleSort = (field: keyof SectionAttendanceDetails) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort sections
  const filteredSections = sections.filter((section) => {
    if (filterStatus !== 'all' && section.status !== filterStatus) return false;
    if (filterGrade !== 'all' && section.grade !== filterGrade) return false;
    return true;
  });

  const sortedSections = [...filteredSections].sort((a, b) => {
    if (
      sortField === 'percentage' ||
      sortField === 'studentsPresent' ||
      sortField === 'totalStudents'
    ) {
      return sortDirection === 'asc'
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }

    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  // Format date
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
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
            <AlertCircle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  // Sort indicator component
  const SortIndicator = ({
    field,
  }: {
    field: keyof SectionAttendanceDetails;
  }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] =
    useState<SectionAttendanceDetails | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 w-full rounded-lg sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">
          Section Attendance - <br className="sm:hidden" />
          <span className="text-muted-foreground text-sm">{formattedDate}</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-40">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40">
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead
                className="cursor-pointer whitespace-nowrap hover:bg-muted/50"
                onClick={() => handleSort('section')}
              >
                Section <SortIndicator field="section" />
              </TableHead>
              <TableHead
                className="cursor-pointer whitespace-nowrap hover:bg-muted/50"
                onClick={() => handleSort('status')}
              >
                Status <SortIndicator field="status" />
              </TableHead>
              <TableHead
                className="cursor-pointer whitespace-nowrap text-right hover:bg-muted/50"
                onClick={() => handleSort('percentage')}
              >
                Completion <SortIndicator field="percentage" />
              </TableHead>
              <TableHead
                className="cursor-pointer whitespace-nowrap text-right hover:bg-muted/50"
                onClick={() => handleSort('studentsPresent')}
              >
                Present/Total <SortIndicator field="studentsPresent" />
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sections.length > 0 ? (
              <>
                {sortedSections.length > 0 ? (
                  sortedSections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {section.grade} - {section.section}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <StatusBadge status={section.status} />
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <span>{section.percentage}%</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                section.percentage >= 80
                                  ? 'bg-green-500'
                                  : section.percentage >= 50
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${section.percentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {section.studentsPresent}/{section.totalStudents}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            setSelectedSection(section);
                            setModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No sections found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex items-center justify-center gap-2">
                      <TriangleAlert className="text-orange-500 " />
                      No section found
                    </span>
                    <Link
                      href="/dashboard/grades"
                      className="text-blue-500 flex items-center"
                    >
                      Create a new section
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal integration */}
      {selectedSection && (
        <SectionWiseAttendanceViewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          sectionData={selectedSection}
        />
      )}
    </div>
  );
}
