'use client';

import { useState } from 'react';
import { Edit, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

// Mock attendance data
const attendanceData = [
  {
    id: 1,
    date: '2025-03-10',
    student: 'Alex Johnson',
    rollNumber: 'S001',
    section: 'A',
    status: 'present',
  },
  {
    id: 2,
    date: '2025-03-10',
    student: 'Maria Garcia',
    rollNumber: 'S002',
    section: 'A',
    status: 'absent',
  },
  {
    id: 3,
    date: '2025-03-10',
    student: 'James Wilson',
    rollNumber: 'S003',
    section: 'A',
    status: 'late',
  },
  {
    id: 4,
    date: '2025-03-10',
    student: 'Sarah Brown',
    rollNumber: 'S004',
    section: 'A',
    status: 'present',
  },
  {
    id: 5,
    date: '2025-03-10',
    student: 'David Lee',
    rollNumber: 'S005',
    section: 'A',
    status: 'present',
  },
  {
    id: 6,
    date: '2025-03-09',
    student: 'Alex Johnson',
    rollNumber: 'S001',
    section: 'A',
    status: 'present',
  },
  {
    id: 7,
    date: '2025-03-09',
    student: 'Maria Garcia',
    rollNumber: 'S002',
    section: 'A',
    status: 'present',
  },
  {
    id: 8,
    date: '2025-03-09',
    student: 'James Wilson',
    rollNumber: 'S003',
    section: 'A',
    status: 'present',
  },
  {
    id: 9,
    date: '2025-03-09',
    student: 'Sarah Brown',
    rollNumber: 'S004',
    section: 'A',
    status: 'absent',
  },
  {
    id: 10,
    date: '2025-03-09',
    student: 'David Lee',
    rollNumber: 'S005',
    section: 'A',
    status: 'late',
  },
];

export function StudentAttendanceClient() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === attendanceData.length
        ? []
        : attendanceData.map((row) => row.id)
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
            Absent
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
            Late
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === attendanceData.length}
                  onCheckedChange={toggleAll}
                />
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
            {attendanceData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={() => toggleRow(row.id)}
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell className="font-medium">{row.student}</TableCell>
                <TableCell>{row.rollNumber}</TableCell>
                <TableCell>Section {row.section}</TableCell>
                <TableCell>{getStatusBadge(row.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
