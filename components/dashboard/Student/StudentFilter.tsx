'use client';

import type React from 'react';

import { useRouter } from 'next/navigation';
import {
  useEffect,
  useState,
  useCallback,
  useTransition,
  useMemo,
  useRef,
} from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Filter,
  Loader2,
  Search,
  X,
  Users,
  GraduationCap,
  BookOpen,
  CheckIcon,
} from 'lucide-react';
// NOTE: Removed nuqs URL sync to avoid full RSC re-renders on each change
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  initialGradeId?: string;
  initialSectionId?: string;
  initialSearch?: string;
}

export default function StudentFilter({
  organizationId,
  initialStudents,
  initialGradeId = 'all',
  initialSectionId = 'all',
  initialSearch = '',
}: StudentFilterProps) {
  const [grades, setGrades] = useState<GradeAndSection[]>([]);
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  // Local component state instead of URL-synced state to prevent navigation-induced Suspense reloads
  const [selectedGrade, setGrade] = useState<string>(initialGradeId);
  const [selectedSection, setSection] = useState<string>(initialSectionId);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const isFirstLoadRef = useRef(true);

  const router = useRouter();

  // Memoize active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedGrade !== 'all') count++;
    if (selectedSection !== 'all') count++;
    if (searchQuery) count++;
    return count;
  }, [selectedGrade, selectedSection, searchQuery]);

  // Memoize selected grade and section objects
  const selectedGradeObj = useMemo(
    () => grades.find((g) => g.id === selectedGrade),
    [grades, selectedGrade]
  );

  const selectedSectionObj = useMemo(
    () => selectedGradeObj?.sections.find((s) => s.id === selectedSection),
    [selectedGradeObj, selectedSection]
  );

  // Count active filters (memoized via activeFiltersCount)

  const selectedGradeName = selectedGradeObj?.name || 'All Grades';
  const selectedSectionName = selectedSectionObj?.name || 'All Sections';

  // Fetch grades and sections only once
  useEffect(() => {
    let mounted = true;

    async function loadGrades() {
      try {
        const data = await fetchGradesAndSections(organizationId);
        if (mounted) {
          setGrades(data || []);
        }
      } catch (error) {
        console.error('Error loading grades:', error);
      }
    }

    loadGrades();

    return () => {
      mounted = false;
    };
  }, [organizationId]);

  // Reset section when grade changes
  useEffect(() => {
    setSection('all');
  }, [selectedGrade]);

  // Fetch students with debouncing
  const fetchStudents = useCallback(
    debounce(async (search: string, gradeId: string, sectionId: string) => {
      try {
        startTransition(async () => {
          // Avoid capturing stale closure by passing args through
          const data = await fetchFilteredStudents({
            search: search.trim(),
            gradeId,
            sectionId,
          });

          setStudents(data || []);
        });
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }, 250),
    []
  );

  // Cancel debounce on unmount
  useEffect(() => {
    return () => {
      fetchStudents.cancel();
    };
  }, [fetchStudents]);

  // Fetch students on filter changes without updating the URL
  useEffect(() => {
    if (isFirstLoadRef.current) {
      // Skip first run to avoid showing loading state when initialStudents already rendered
      isFirstLoadRef.current = false;
      return;
    }
    fetchStudents(searchQuery, selectedGrade, selectedSection);
  }, [selectedGrade, selectedSection, searchQuery, fetchStudents]);

  const resetFilters = () => {
    setGrade('all');
    setSection('all');
    setSearchQuery('');
  };

  const hasActiveFilters = activeFiltersCount > 0;
  const isFilteringComplete =
    selectedGrade !== 'all' && selectedSection !== 'all';

  return (
    <>
      <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 shadow-sm bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/10 mb-6">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-base md:text-xl">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Student Filters
              </CardTitle>
              <CardDescription className="mt-2 text-sm">
                Search and filter students with advanced parameters and smart
                filtering
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-green-200/50 dark:border-green-700/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {activeFiltersCount} Filter
                    {activeFiltersCount > 1 ? 's' : ''} Active
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
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
                  className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Enhanced Search */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md bg-blue-100 dark:bg-blue-900/50">
                <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Input
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-12 pr-10 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
              {searchQuery && (
                <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded-md">
                  🔍 Searching for {searchQuery}
                </div>
              )}
            </div>

            {/* Enhanced Filter Controls */}
            <div
              className={cn(
                'space-y-6 transition-all duration-300',
                showFilters
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0 overflow-hidden sm:max-h-96 sm:opacity-100 sm:overflow-visible'
              )}
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Enhanced Grade Selection */}
                <div className="space-y-3">
                  <Label
                    htmlFor="grade"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <GraduationCap className="h-4 w-4 text-purple-500" />
                    Grade Level
                  </Label>
                  <Select value={selectedGrade} onValueChange={setGrade}>
                    <SelectTrigger
                      id="grade"
                      className={cn(
                        'h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors',
                        selectedGrade !== 'all' &&
                          'border-purple-300 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-950/20'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            selectedGrade !== 'all'
                              ? 'bg-purple-500'
                              : 'bg-gray-300'
                          )}
                        ></div>
                        <SelectValue placeholder="Choose grade level" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="font-medium">All Grades</span>
                        </div>
                      </SelectItem>
                      {grades.map((grade) => (
                        <SelectItem
                          key={grade.id}
                          value={grade.id}
                          className="py-3"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="font-medium">{grade.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedGrade !== 'all' && (
                    <div className="text-xs text-muted-foreground bg-purple-50 dark:bg-purple-950/20 p-2 rounded-md">
                      🎓 {selectedGradeName} selected
                    </div>
                  )}
                </div>

                {/* Enhanced Section Selection */}
                <div className="space-y-3">
                  <Label
                    htmlFor="section"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4 text-green-500" />
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
                        'h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors',
                        selectedSection !== 'all' &&
                          'border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-950/20',
                        selectedGrade === 'all' &&
                          'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            selectedSection !== 'all'
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          )}
                        ></div>
                        <SelectValue
                          placeholder={
                            selectedGrade === 'all'
                              ? 'Select grade first'
                              : 'Choose section'
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="font-medium">All Sections</span>
                        </div>
                      </SelectItem>
                      {selectedGrade !== 'all' &&
                        grades
                          .find((g) => g.id === selectedGrade)
                          ?.sections.map((sec) => (
                            <SelectItem
                              key={sec.id}
                              value={sec.id}
                              className="py-3"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="font-medium">{sec.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  {selectedSection !== 'all' && (
                    <div className="text-xs text-muted-foreground bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                      📚 {selectedSectionName} ready
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedGrade !== 'all' && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                    >
                      Grade: {selectedGradeName}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0 hover:bg-purple-200 dark:hover:bg-purple-800"
                        onClick={() => setGrade('all')}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove grade filter</span>
                      </Button>
                    </Badge>
                  )}

                  {selectedSection !== 'all' && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                    >
                      Section: {selectedSectionName}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0 hover:bg-green-200 dark:hover:bg-green-800"
                        onClick={() => setSection('all')}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove section filter</span>
                      </Button>
                    </Badge>
                  )}

                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      Search: {searchQuery}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove search filter</span>
                      </Button>
                    </Badge>
                  )}
                </div>

                {/* Filter Status Summary */}
                {isFilteringComplete && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            Filters Applied
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedGradeName} • {selectedSectionName}
                            {searchQuery && ` • "${searchQuery}"`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Filtered
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {isPending && (
              <div className="flex justify-center items-center py-4 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Loading students...
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <StudentsGridList students={students} />
    </>
  );
}
