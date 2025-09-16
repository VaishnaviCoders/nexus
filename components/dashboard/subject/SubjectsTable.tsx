'use client';

import { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Subject } from '@/generated/prisma/client';
import { deleteSubject } from '@/lib/data/subjects/subject-action';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { formatDateIN } from '@/lib/utils';
// import { EditSubjectModal } from "./edit-subject-modal"
// import { CSVImportModal } from "./csv-import-modal"

interface SubjectsClientProps {
  initialSubjects: Subject[];
}

export function SubjectsTable({ initialSubjects }: SubjectsClientProps) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filter subjects based on search term
  const filteredSubjects = useMemo(() => {
    if (!searchTerm) return subjects;

    const term = searchTerm.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(term) ||
        subject.code.toLowerCase().includes(term)
    );
  }, [subjects, searchTerm]);

  const handleSubjectUpdated = (updatedSubject: Subject) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === updatedSubject.id ? updatedSubject : subject
      )
    );
    setEditingSubject(null);
  };

  const handleSubjectDeleted = async (subjectId: string) => {
    const result = await deleteSubject(subjectId);

    if (result.success) {
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      toast.success(result.message);
    } else {
      setDeleteError(result.message);
      toast.error(result.message);
    }
  };

  const handleSubjectsImported = (newSubjects: Subject[]) => {
    setSubjects((prev) => [...newSubjects, ...prev]);
    setIsCSVImportOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCSVImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Subjects Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden lg:table-cell">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubjects.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                {searchTerm
                  ? 'No subjects found matching your search.'
                  : 'No subjects found. Add your first subject to get started.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredSubjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{subject.code}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate">
                  {subject.description || '-'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatDateIN(subject.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSubject(subject)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button> */}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteError(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the subject "
                            {subject.name}" ({subject.code})? This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        {deleteError && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{deleteError}</AlertDescription>
                          </Alert>
                        )}

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button
                            onClick={() => handleSubjectDeleted(subject.id)}
                          >
                            Delete Subject
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSubjects.length} of {subjects.length} subjects
      </div>

      {/* Modals


      <CSVImportModal
        open={isCSVImportOpen}
        onOpenChange={setIsCSVImportOpen}
        onSubjectsImported={handleSubjectsImported}
      />

      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          open={!!editingSubject}
          onOpenChange={(open) => !open && setEditingSubject(null)}
          onSubjectUpdated={handleSubjectUpdated}
        />
      )}

*/}
    </div>
  );
}
