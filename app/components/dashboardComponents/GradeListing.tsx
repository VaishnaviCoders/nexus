'use client';

import React from 'react';
import { GraduationCap, Settings2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddGrade } from './AddGrade';
import { useRouter } from 'next/navigation';
import { Student } from '@prisma/client';

interface Grade {
  id: string;
  grade: string;
  section: { students: Student[] }[]; // Adjust the type of students as needed
}

const GradeListing = ({ grades }: { grades: Grade[] }) => {
  const router = useRouter();

  return (
    <aside className="col-span-3 border-r p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <GraduationCap className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Classes</h1>
        </div>
        <AddGrade />
      </div>

      <Input placeholder="Search classes..." className="mb-4" />

      <div className="space-y-4">
        {grades.map((grade) => (
          <div key={grade.id} className=" ">
            {/* <Link href={`/dashboard/grades/${grade.id}`} className="block"> */}
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-100">
              <div>
                <h2 className="font-semibold">{grade.grade}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <p>{grade.section.length} Sections</p>
                  <p>
                    {grade.section.reduce(
                      (acc, section) => acc + section.students.length,
                      0
                    )}{' '}
                    students
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => router.push(`/dashboard/grades/${grade.id}`)}
                  variant="outline"
                  size="icon"
                >
                  <Settings2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="destructive"
                  onClick={() =>
                    router.push(`/dashboard/grades/${grade.id}/delete`)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* </Link> */}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default GradeListing;
