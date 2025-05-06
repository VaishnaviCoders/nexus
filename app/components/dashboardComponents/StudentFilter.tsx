'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useEffect, useState, useTransition } from 'react';

import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { fetchGradesAndSections } from '@/app/actions';
import { Input } from '@/components/ui/input';

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

export default function StudentFilter({
  organizationId,
}: AttendanceFiltersProps) {
  const [grades, setGrades] = useState<GradeAndSection[]>([]);
  const [isLoading, startTransition] = useTransition();

  const [selectedGrade, setGrade] = useQueryState('grade', {
    defaultValue: 'all',
  });

  const [selectedSection, setSection] = useQueryState('sectionId', {
    defaultValue: 'all',
  });

  const [searchQuery, setSearchQuery] = useQueryState('search', {
    defaultValue: '',
    shallow: false,
  });

  const router = useRouter();

  // Fetch grades and sections
  useEffect(() => {
    async function loadGrades() {
      const data = await fetchGradesAndSections(organizationId);
      setGrades(data || []);
    }
    loadGrades();
  }, [organizationId]);

  // Reset section when grade changes
  useEffect(() => {
    if (selectedGrade !== 'all') {
      setSection('all');
    }
  }, [selectedGrade, setSection]);

  useEffect(() => {
    // console.log('Updated grades:', grades);
  }, [grades]);

  useEffect(() => {
    // Reset section when grade changes
    setSection('all');
  }, [selectedGrade]);

  useEffect(() => {
    router.refresh();
  }, [selectedGrade, selectedSection, searchQuery, router]);

  const resetFilters = () => {
    setGrade('all');
    setSection('all');
    setSearchQuery('');
  };

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
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
}
