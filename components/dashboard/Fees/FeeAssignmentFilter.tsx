'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useQueryState } from 'nuqs';
import { fetchGradesAndSections } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
const FeeAssignmentFilter = ({ organizationId }: AttendanceFiltersProps) => {
  const [grades, setGrades] = useState<GradeAndSection[]>([]);

  const [selectedGrade, setSelectedGrade] = useQueryState('gradeId', {
    defaultValue: 'all',
    shallow: false,
  });
  const [selectedSection, setSelectedSection] = useQueryState('sectionId', {
    defaultValue: 'all',
    shallow: false,
  });

  const [searchQuery, setSearchQuery] = useQueryState('search', {
    defaultValue: '',
    shallow: false,
  });

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
    console.log('Updated grades:', grades);
  }, [grades]);

  useEffect(() => {
    // Reset section when grade changes
    setSelectedSection('all');
  }, [selectedGrade]);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>filter students to assign fees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Search by name or roll no..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
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

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeAssignmentFilter;
