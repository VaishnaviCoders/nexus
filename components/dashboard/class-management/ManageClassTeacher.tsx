'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Trash2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { manageClassTeacher } from '@/lib/data/class-management/ClassTeacherManagement';
// import { manageClassTeacher } from '@/app/actions/class-teacher-actions';

const classTeacherSchema = z.object({
  teacherId: z.string().optional(),
  action: z.enum(['assign', 'remove']),
});

type classTeacherFormData = z.infer<typeof classTeacherSchema>;

interface Teacher {
  id: string;
  employeeCode: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  section: Array<{
    id: string;
    name: string;
    grade: {
      grade: string;
    };
  }>;
}

interface ManageClassTeacherProps {
  sectionId: string;
  currentTeacherId: string | null;
  teachers: Teacher[];
  sectionName: string;
  gradeName: string;
}

export function ManageClassTeacher({
  sectionId,
  currentTeacherId,
  teachers,
  sectionName,
  gradeName,
}: ManageClassTeacherProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const form = useForm<classTeacherFormData>({
    resolver: zodResolver(classTeacherSchema),
    defaultValues: {
      teacherId: currentTeacherId || undefined,
      action: currentTeacherId ? 'assign' : 'assign',
    },
  });

  const selectedAction = form.watch('action');

  const onSubmit = (values: classTeacherFormData) => {
    startTransition(async () => {
      setResult(null);

      const response = await manageClassTeacher({
        sectionId,
        teacherId: values.action === 'assign' ? values.teacherId : null,
        action: values.action,
      });

      setResult(response);

      if (response.success) {
        setTimeout(() => {
          setOpen(false);
          setResult(null);
          form.reset();
        }, 1500);
      }
    });
  };

  const currentTeacher = teachers.find((t) => t.id === currentTeacherId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={currentTeacherId ? 'outline' : 'default'}
          size="sm"
          className="gap-2"
        >
          {currentTeacherId ? (
            <>
              <UserPlus className="h-4 w-4" />
              Edit Class Teacher
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Assign Class Teacher
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Class Teacher</DialogTitle>
          <DialogDescription>
            {gradeName} - {sectionName}
            {currentTeacher && (
              <span className="block mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Current: {currentTeacher.user.firstName}{' '}
                {currentTeacher.user.lastName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="assign">
                        {currentTeacherId ? 'Change' : 'Assign'} Class Teacher
                      </SelectItem>
                      {currentTeacherId && (
                        <SelectItem value="remove">
                          Remove Class Teacher
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedAction === 'assign' && (
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Teacher</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.length === 0 ? (
                          <div className="p-2 text-sm text-slate-500">
                            No teachers available
                          </div>
                        ) : (
                          teachers.map((teacher) => {
                            const isCurrentClassTeacher = teacher.section.some(
                              (s) => s.id !== sectionId
                            );
                            const assignedTo = teacher.section.find(
                              (s) => s.id !== sectionId
                            );

                            return (
                              <SelectItem
                                key={teacher.id}
                                value={teacher.id}
                                disabled={isCurrentClassTeacher}
                              >
                                <div className="flex flex-col">
                                  <span>
                                    {teacher.user.firstName}{' '}
                                    {teacher.user.lastName}
                                    {teacher.employeeCode &&
                                      ` (${teacher.employeeCode})`}
                                  </span>
                                  {assignedTo && (
                                    <span className="text-xs text-slate-500">
                                      Class Teacher: {assignedTo.grade.grade} -{' '}
                                      {assignedTo.name}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a teacher to assign as class teacher for this
                      section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedAction === 'remove' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  This will remove the class teacher assignment from {gradeName}{' '}
                  - {sectionName}. Are you sure?
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert
                variant={result.success ? 'default' : 'destructive'}
                className={
                  result.success
                    ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200'
                    : ''
                }
              >
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {result.message || result.error}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  (selectedAction === 'assign' && !form.watch('teacherId'))
                }
                variant={
                  selectedAction === 'remove' ? 'destructive' : 'default'
                }
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : selectedAction === 'remove' ? (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {currentTeacherId ? 'Update' : 'Assign'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
