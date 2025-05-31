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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CircleCheck, CircleX, Clock, Search } from 'lucide-react';
import type { AttendanceRecord } from '@/types';

interface AttendanceTableProps {
  childId: string;
  records: AttendanceRecord[];
}

export function ChildAttendanceTable({ records }: AttendanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter((record) =>
    format(new Date(record.date), 'PPP')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return (
          <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
        );
      case 'ABSENT':
        return <CircleX className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'LATE':
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <Badge variant="present">Present</Badge>;
      case 'ABSENT':
        return <Badge variant="absent">Absent</Badge>;
      case 'LATE':
        return <Badge variant="late">Late</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by date..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!records ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Date</TableHead>
                <TableHead className="w-1/3">Status</TableHead>
                <TableHead className="hidden sm:table-cell w-1/3">
                  Note
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {format(new Date(record.date), 'PPP')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="hidden sm:inline">
                          {getStatusBadge(record.status)}
                        </span>
                        <span className="sm:hidden capitalize">
                          {record.status.toLowerCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {record.note || '—'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
