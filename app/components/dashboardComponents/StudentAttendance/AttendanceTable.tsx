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
import { format, parseISO } from 'date-fns';
import { CircleCheck, CircleX, Clock, Search } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  note: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter((record) =>
    format(parseISO(record.date), 'PPP')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
        );
      case 'absent':
        return <CircleX className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'late':
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="present">Present</Badge>;
      case 'absent':
        return <Badge variant="absent">Absent</Badge>;
      case 'late':
        return <Badge variant="late">Late</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by date..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(record.date), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className="hidden sm:inline">
                        {getStatusBadge(record.status)}
                      </span>
                      <span className="sm:hidden capitalize">
                        {record.status}
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
    </div>
  );
}
