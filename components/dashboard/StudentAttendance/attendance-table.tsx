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
import { formatDateIN } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AttendanceStatus } from '@/generated/prisma/enums';

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  present: boolean;
  note: string | null;
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
    <div className="space-y-4 my-3">
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
            {sortedRecords.map((record) => (
              <TableRow key={record.id} className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(record.id)}
                    onCheckedChange={() => toggleSelection(record.id)}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDateIN(record.date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {record.student.firstName[0]}
                      {record.student.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium capitalize text-foreground">
                        {record.student.firstName} {record.student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">#{record.student.rollNumber}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-sm text-foreground">
                      {record.grade.grade}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {record.section.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={record.status}>
                    {record.status}
                  </Badge>

                </TableCell>
                <TableCell>
                  <div
                    className="max-w-[200px] truncate"
                    title={record.note || ''}
                  >
                    {record.note || '-'}
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
                      {/* View Student */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/students/${record.studentId}`}
                          className="p-0 flex items-center gap-2 cursor-pointer"
                        >
                          <User className="h-4 w-4 mr-2" />
                          View Student
                        </Link>
                      </DropdownMenuItem>
                      {/* Delete */}
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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


