'use client';

import { Mail, Phone, Trash2, User } from 'lucide-react';

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { EmptyState } from '@/components/EmptyState';
import { useState, useTransition } from 'react';
import { deleteAttendance } from '@/app/actions';

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

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

interface AttendanceRecordsProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceRecordsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteAttendance([id]);
      // Optionally, refetch data or update UI
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      await deleteAttendance(selectedIds);
      setSelectedIds([]); // Clear selection after delete
      // Optionally, refetch data or update UI
    });
  };

  return (
    <div className="space-y-4  rounded-md border">
      <div className="rounded-md border">
        {records.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedIds.length === records.length}
                    onCheckedChange={() =>
                      setSelectedIds(
                        selectedIds.length === records.length
                          ? []
                          : records.map((r) => r.id)
                      )
                    }
                  />
                  {records.length}
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => toggleSelection(row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('en-IN').format(row.date)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.student.firstName} {row.student.lastName}
                  </TableCell>
                  <TableCell>{row.student.rollNumber}</TableCell>
                  <TableCell>
                    {row.section.gradeId}
                    {row.section.name}
                  </TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(row.id)}
                      className="flex justify-center items-center"
                      variant={'outline'}
                    >
                      <Trash2 color="red" className="h-4 w-4 " />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center items-center  my-5">
            <EmptyState
              title="No Students Found"
              description="No students attendance found with the given search query."
              icons={[User, Mail, Phone]}
              image="/EmptyState.png"
              action={{
                label: 'Take Attendance',
                href: '/dashboard/attendance/mark',
              }}
            />
          </div>
        )}
      </div>
      {selectedIds.length > 0 && (
        <Button onClick={handleBulkDelete} variant="destructive">
          <Trash2 color="white" className="h-4 w-4 " />
          Delete Selected
        </Button>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

const getStatusBadge = (status: AttendanceStatus) => {
  switch (status) {
    case 'PRESENT':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
          Present
        </span>
      );
    case 'ABSENT':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
          Absent
        </span>
      );
    case 'LATE':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
          Late
        </span>
      );
    default:
      return null;
  }
};
