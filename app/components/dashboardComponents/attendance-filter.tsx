'use client';

import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useEffect, useState, useTransition } from 'react';
import { useQueryState } from 'nuqs';
import { fetchGradesAndSections } from '@/app/actions';
import { useRouter } from 'next/navigation';

type GradeAndSection = {
  id: string;
  name: string;
  sections: Section[];
};

type Section = {
  id: string;
  name: string;
};

interface AttendanceFiltersProps {
  organizationId: string;
}

export default function AttendanceFilters({
  organizationId,
}: AttendanceFiltersProps) {
  const [grades, setGrades] = useState<GradeAndSection[]>([]);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const [selectedGrade, setGrade] = useQueryState('grade', {
    defaultValue: 'all',
  });
  const [selectedSection, setSection] = useQueryState('sectionId', {
    defaultValue: 'all',
  });
  const [status, setStatus] = useQueryState('status', { defaultValue: 'all' });

  const [searchQuery, setSearchQuery] = useQueryState('search', {
    defaultValue: '',
    shallow: false,
    startTransition,
  });
  const [startDate, setStartDate] = useQueryState('startDate', {
    defaultValue: '',
  });
  const [endDate, setEndDate] = useQueryState('endDate', {
    defaultValue: '',
  });
  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    async function loadGrades() {
      const data = await fetchGradesAndSections(organizationId);
      setGrades(data || []);
      // console.log('data', data);
      // console.log('grades', grades);
    }
    loadGrades();
  }, [organizationId]);

  useEffect(() => {
    // console.log('Updated grades:', grades);
  }, [grades]);

  useEffect(() => {
    // Reset section when grade changes
    setSection('all');
  }, [selectedGrade]);
  // Apply filters
  const applyFilters = () => {
    // const queryParams = new URLSearchParams({
    //   search: searchQuery,
    //   grade: selectedGrade,
    //   sectionId: selectedSection,
    //   status,
    // });

    // router.push(`/dashboard/attendance?${queryParams.toString()}`);

    router.refresh();
  };
  // Reset filters

  const resetFilters = () => {
    setGrade('all');
    setSection('all');
    setStatus('all');
    setSearchQuery('');
    setDateRange(undefined);
    setStartDate('');
    setEndDate('');
    router.refresh();
  };

  console.log('Applying Filters:', {
    search: searchQuery,
    sectionId: selectedSection,
    status,
    gradeId: selectedGrade,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium">Student</Label>
          <Input
            placeholder="Search by name or roll number"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Attendance Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PRESENT">Present</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="LATE">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Select value={selectedGrade} onValueChange={setGrade}>
            <SelectTrigger id="grade">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedGrade && selectedGrade !== 'all' && (
          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Select value={selectedSection} onValueChange={setSection}>
              <SelectTrigger id="section">
                <SelectValue placeholder="select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {grades
                  .find((g) => g.id === selectedGrade)
                  ?.sections.map((sec) => (
                    <SelectItem key={sec.id} value={sec.id}>
                      {sec.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label>Custom Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                <span>Pick a date range</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={dateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}
