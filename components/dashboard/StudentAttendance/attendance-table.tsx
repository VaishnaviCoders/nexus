'use client';

import { useState, useTransition, useMemo } from 'react';
import {
  CheckCircle,
  Clock,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/EmptyState';
import { deleteAttendance } from '@/app/actions';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  present: boolean;
  notes: string | null;
  recordedBy: string;
  sectionId: string;
  createdAt: Date;
  updatedAt: Date;
  grade: {
    id: string;
    grade: string;
  };
  section: {
    id: string;
    name: string;
    gradeId: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    section: { name: string } | null;
  };
}

interface AttendanceRecordsProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceRecordsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AttendanceRecord | 'studentName' | 'date';
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });

  // Memoize the sorted records to improve performance
  const sortedRecords = useMemo(() => {
    const recordsCopy = [...records];

    return recordsCopy.sort((a, b) => {
      if (sortConfig.key === 'studentName') {
        const nameA =
          `${a.student.firstName} ${a.student.lastName}`.toLowerCase();
        const nameB =
          `${b.student.firstName} ${b.student.lastName}`.toLowerCase();
        return sortConfig.direction === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Handle other sortable fields
      return 0;
    });
  }, [records, sortConfig]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (key: keyof AttendanceRecord | 'studentName' | 'date') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteAttendance([id]);
        toast.success('Attendance record deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete attendance record');
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      try {
        await deleteAttendance(selectedIds);
        toast.success(
          `${selectedIds.length} attendance records deleted successfully!`
        );
        setSelectedIds([]); // Clear selection after delete
      } catch (error) {
        toast.error('Failed to delete attendance records');
      }
    });
  };

  const getSortIcon = (
    key: keyof AttendanceRecord | 'studentName' | 'date'
  ) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (records.length === 0) {
    return (
      <div className="flex justify-center items-center my-5 rounded-md border p-8">
        <EmptyState
          title="No Attendance Records Found"
          description="No attendance records match your current filters."
          icons={[User, Mail, Phone]}
          image="/EmptyState.png"
          action={{
            label: 'Take Attendance',
            href: '/dashboard/attendance/mark',
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === records.length && records.length > 0
                  }
                  onCheckedChange={(checked) => {
                    setSelectedIds(checked ? records.map((r) => r.id) : []);
                  }}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('date')}
              >
                Date {getSortIcon('date')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('studentName')}
              >
                Student {getSortIcon('studentName')}
              </TableHead>
              <TableHead>Grade/Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => toggleSelection(row.id)}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Intl.DateTimeFormat('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }).format(new Date(row.date))}
                </TableCell>
                <TableCell>
                  <div className="font-medium capitalize whitespace-nowrap">
                    {row.student.firstName} {row.student.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    #{row.student.rollNumber}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-sm text-foreground">
                      {row.grade.grade}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {row.section.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadgeWithIcon(row.status)}</TableCell>
                <TableCell>
                  <div
                    className="max-w-[200px] truncate"
                    title={row.notes || ''}
                  >
                    {row.notes || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className=""
                        onClick={() => handleDelete(row.id)}
                      >
                        <Link
                          href={`/dashboard/students/${row.studentId}`}
                          className="p-0 flex items-center gap-2"
                        >
                          <User className="h-4 w-4 mr-2" />
                          View Student
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <span className="text-sm font-medium">
            {selectedIds.length} items selected
          </span>
          <Button
            onClick={handleBulkDelete}
            variant="destructive"
            size="sm"
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
}

const getStatusBadgeWithIcon = (status: AttendanceStatus) => {
  switch (status) {
    case 'PRESENT':
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Present
        </div>
      );
    case 'ABSENT':
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Absent
        </div>
      );
    case 'LATE':
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
          <Clock className="h-3 w-3 mr-1" />
          Late
        </div>
      );
    default:
      return null;
  }
};
