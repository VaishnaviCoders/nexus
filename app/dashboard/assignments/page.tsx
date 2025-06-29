import { EmptyState } from '@/components/EmptyState';
import { Paperclip, School, Book } from 'lucide-react';
import StudentAssignment from '@/components/dashboard/Student/StudentAssignment';

export default function Assignments() {
  return (
    <div className="flex items-center justify-center min-h-full">
      <EmptyState
        description="No assignments found"
        title="Assignments"
        icons={[Book, School, Paperclip]}
      />
      {/* <StudentAssignment /> */}
    </div>
  );
}
