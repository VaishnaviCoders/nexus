'use client';

import { useState, useTransition } from 'react';
import {
  Calendar,
  CircleAlertIcon,
  Edit,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { YearType } from '@/generated/prisma/enums';
import { AcademicYearForm } from './AcademicYearForm';
import { deleteAcademicYear, setDefaultAcademicYear } from '@/app/actions';

interface AcademicYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: YearType;
  isCurrent: boolean;
  description?: string | null;
  createdAt: Date;
}

interface AcademicYearConfigProps {
  academicYears: AcademicYear[];
  organizationId: string;
}

const yearTypeColors = {
  ANNUAL: 'bg-blue-50 text-blue-700 border-blue-200',
  SEMESTER: 'bg-green-50 text-green-700 border-green-200',
  TRIMESTER: 'bg-purple-50 text-purple-700 border-purple-200',
  BATCH: 'bg-orange-50 text-orange-700 border-orange-200',
};

export function AcademicYearConfig({
  academicYears,
  organizationId,
}: AcademicYearConfigProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<AcademicYear | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSetDefault = (year: AcademicYear) => {
    startTransition(async () => {
      const result = await setDefaultAcademicYear(year.id, organizationId);
      if (result.success) {
        toast.success('Default academic year updated');
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (!yearToDelete) return;
    startTransition(async () => {
      const result = await deleteAcademicYear(yearToDelete.id);
      if (result.success) {
        toast.success('Academic year deleted');
        setDeleteDialogOpen(false);
        setYearToDelete(null);
      } else {
        toast.error(result.error);
      }
    });
  };

  const sortedYears = [...academicYears].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Academic Years
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization's academic years and sessions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Year
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Academic Year</DialogTitle>
              <DialogDescription>
                Add a new academic year for your organization
              </DialogDescription>
            </DialogHeader>
            <AcademicYearForm
              organizationId={organizationId}
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {sortedYears.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No academic years</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating your first academic year
          </p>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="mt-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Academic Year
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Academic Year</DialogTitle>
                <DialogDescription>
                  Add a new academic year for your organization
                </DialogDescription>
              </DialogHeader>
              <AcademicYearForm
                organizationId={organizationId}
                onSuccess={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedYears.map((year) => (
            <div
              key={year.id}
              className={`group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                year.isCurrent ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{year.name}</h3>
                    {year.isCurrent && (
                      <Badge variant="outline" className="h-5 text-xs">
                        <Star className="mr-1 h-3 w-3 fill-current text-amber-300" />
                        Default
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={yearTypeColors[year.type]}
                    >
                      {year.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(year.startDate, 'MMM d, yyyy')} -{' '}
                    {format(year.endDate, 'MMM d, yyyy')}
                    {year.description && ` • ${year.description}`}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setEditingYear(year)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {!year.isCurrent && (
                    <DropdownMenuItem
                      onClick={() => handleSetDefault(year)}
                      disabled={isPending}
                      className="cursor-pointer"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Set as Default
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setYearToDelete(year);
                      setDeleteDialogOpen(true);
                    }}
                    disabled={year.isCurrent}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingYear} onOpenChange={() => setEditingYear(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Academic Year</DialogTitle>
            <DialogDescription>
              Update the academic year details
            </DialogDescription>
          </DialogHeader>
          {editingYear && (
            <AcademicYearForm
              organizationId={organizationId}
              academicYear={editingYear}
              onSuccess={() => setEditingYear(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlertIcon className="opacity-80" size={16} />
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">
                Delete Academic Year
              </DialogTitle>
              <DialogDescription className="sm:text-center">
                Are you sure you want to delete "{yearToDelete?.name}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={'destructive'}
              disabled={isPending}
              className="flex-1"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
