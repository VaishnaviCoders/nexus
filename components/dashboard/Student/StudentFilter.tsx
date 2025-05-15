'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Filter, Loader2, Search, X } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { fetchGradesAndSections } from '@/app/actions';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchFilteredStudents } from '@/app/actions';
import StudentsGridList from '@/components/dashboard/Student/StudentsGridList';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import debounce from 'lodash.debounce';

type GradeAndSection = {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
};

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  rollNumber: string;
  phoneNumber: string;
  email: string;
  profileImage?: string | null;
  dateOfBirth: Date;
  grade: {
    id: string;
    grade: string;
  };
  section: {
    id: string;
    name: string;
  };
}

interface StudentFilterProps {
  organizationId: string;
  initialStudents: Student[];
}

export default function StudentFilter({
  organizationId,
  initialStudents,
}: StudentFilterProps) {
  const [grades, setGrades] = useState<GradeAndSection[]>([]);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isLoading, setIsLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const [selectedGrade, setGrade] = useQueryState('gradeId', {
    defaultValue: 'all',
  });
  const [selectedSection, setSection] = useQueryState('sectionId', {
    defaultValue: 'all',
  });
  const [searchQuery, setSearchQuery] = useQueryState('search', {
    defaultValue: '',
    shallow: true,
    throttleMs: 80,
  });

  const router = useRouter();

  // Fetch grades and sections
  useEffect(() => {
    async function loadGrades() {
      setIsLoading(true);
      const data = await fetchGradesAndSections(organizationId);
      setGrades(data || []);
      setIsLoading(false);
    }
    loadGrades();
  }, [organizationId]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (selectedGrade !== 'all') count++;
    if (selectedSection !== 'all') count++;
    if (searchQuery) count++;
    setActiveFiltersCount(count);
  }, [selectedGrade, selectedSection, searchQuery]);

  // Reset section when grade changes

  useEffect(() => {
    setSection('all');
  }, [selectedGrade]);

  // Use this if above not working
  // useEffect(() => {
  //   if (selectedGrade !== 'all') {
  //     setSection('all');
  //   }
  // }, [selectedGrade, setSection]);

  // Fetch students with debouncing
  const fetchStudents = useCallback(
    debounce(async (search: string, gradeId: string, sectionId: string) => {
      setIsLoading(true);
      try {
        const data = await fetchFilteredStudents({
          search,
          gradeId,
          sectionId,
        });
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Cancel debounce on unmount
  useEffect(() => {
    return () => {
      fetchStudents.cancel();
    };
  }, [fetchStudents]);

  // Update URL and fetch students
  useEffect(() => {
    const query = new URLSearchParams();
    if (searchQuery) query.set('search', searchQuery);
    if (selectedGrade !== 'all') query.set('gradeId', selectedGrade);
    if (selectedSection !== 'all') query.set('sectionId', selectedSection);

    // router.push(`/dashboard/students?${query.toString()}`, { scroll: false });

    router.replace(`/dashboard/students?${query.toString()}`, {
      scroll: false,
    });

    fetchStudents(searchQuery, selectedGrade, selectedSection);
  }, [selectedGrade, selectedSection, searchQuery, router, fetchStudents]);

  const resetFilters = () => {
    setGrade('all');
    setSection('all');
    setSearchQuery('');
  };

  const selectedGradeObj = grades.find((g) => g.id === selectedGrade);
  const selectedSectionObj = selectedGradeObj?.sections.find(
    (s) => s.id === selectedSection
  );

  const selectedGradeName = selectedGradeObj?.name || 'All Grades';
  const selectedSectionName = selectedSectionObj?.name || 'All Sections';

  // const selectedGradeName =
  //   grades.find((g) => g.id === selectedGrade)?.name || 'All Grades';
  // const selectedSectionName =
  //   selectedGrade !== 'all'
  //     ? grades
  //         .find((g) => g.id === selectedGrade)
  //         ?.sections.find((s) => s.id === selectedSection)?.name ||
  //       'All Sections'
  //     : 'All Sections';

  return (
    <>
      <div className="space-y-4 mb-5 bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm border">
        <div className="flex w-full gap-3 items-center justify-between">
          <h3 className="text-lg font-medium w-full">Student Filters</h3>

          <div className="flex ">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5"
            >
              <Filter className="h-4 w-4" />
              <span className="">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or roll number"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div
          className={cn(
            'space-y-4 transition-all',
            showFilters
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 hidden sm:block sm:opacity-100 sm:max-h-96'
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-sm">
                Grade
              </Label>
              <Select value={selectedGrade} onValueChange={setGrade}>
                <SelectTrigger
                  id="grade"
                  className={cn(
                    selectedGrade !== 'all' && 'border-primary/50 bg-primary/5'
                  )}
                >
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

            <div className="space-y-2">
              <Label htmlFor="section" className="text-sm">
                Section
              </Label>
              <Select
                value={selectedSection}
                onValueChange={setSection}
                disabled={selectedGrade === 'all'}
              >
                <SelectTrigger
                  id="section"
                  className={cn(
                    selectedSection !== 'all' &&
                      'border-primary/50 bg-primary/5',
                    selectedGrade === 'all' && 'opacity-50'
                  )}
                >
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {selectedGrade !== 'all' &&
                    grades
                      .find((g) => g.id === selectedGrade)
                      ?.sections.map((sec) => (
                        <SelectItem key={sec.id} value={sec.id}>
                          {sec.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedGrade !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Grade: {selectedGradeName}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setGrade('all')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove grade filter</span>
                </Button>
              </Badge>
            )}

            {selectedSection !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Section: {selectedSectionName}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSection('all')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove section filter</span>
                </Button>
              </Badge>
            )}

            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove search filter</span>
                </Button>
              </Badge>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <StudentsGridList students={students} />
    </>
  );
}
