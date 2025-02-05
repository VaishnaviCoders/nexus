'use client'; // This makes it a client-side component

import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useState, useTransition } from 'react';
import GradeSelect from './GradeSelect';
import SectionSelect from './SectionSelect';

export default function StudentFilter() {
  const [isPending, startTransition] = useTransition();
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const searchParams = useSearchParams();

  const router = useRouter();

  const handleFilter = () => {
    const queryParams = new URLSearchParams(searchParams.toString());

    // Remove existing parameters to avoid duplicates
    if (selectedGrade) {
      queryParams.set('grade', selectedGrade);
    } else {
      queryParams.delete('grade');
    }

    if (selectedSection) {
      queryParams.set('section', selectedSection);
    } else {
      queryParams.delete('section');
    }

    startTransition(() => {
      const queryString = queryParams.toString();
      router.push(
        `/dashboard/students?${queryString ? `?${queryString}` : ''}`
      );
    });
  };
  return (
    <div className="flex gap-4 w-full">
      {/* Grade Select */}
      <GradeSelect defaultGrade="" selectedGrade={setSelectedGrade} />

      {/* Section Select */}
      <SectionSelect
        selectedGradeId={selectedGrade}
        onSelectSection={setSelectedSection}
      />
      <Button onClick={handleFilter} disabled={!selectedGrade || isPending}>
        <>
          {isPending ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2" />
              Search
            </>
          )}
        </>
      </Button>
    </div>
  );
}
