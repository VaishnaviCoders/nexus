'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Calendar, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteFeeCategory } from '@/lib/data/fee/fee-category-actions';
import { toast } from 'sonner';
import { EditFeeCategoryForm } from './EditFeeCategoryForm';
import { formatDateIN } from '@/lib/utils';

interface FeeCategoryItemProps {
  category: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
  };
}

export function FeeCategoryItem({ category }: FeeCategoryItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteFeeCategory(category.id);
        toast.success('Fee category deleted successfully');
        router.refresh();
      } catch (error) {
        toast.warning('Failed to delete fee category', {
          description:
            'You can not delete Fee Category Please try again or contact support.',
        });
      }
    });
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold capitalize text-foreground group-hover:text-primary transition-colors duration-200 truncate">
              {category.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4 relative">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">
                Description
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.description || (
                  <span className="italic text-muted-foreground/70">
                    No description provided
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/20">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Created</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {formatDateIN(category.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 pb-4 relative border-t border-border/30 bg-muted/10">
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      Edit Fee Category
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Update the category information below. Changes will be
                      saved automatically.
                    </DialogDescription>
                  </DialogHeader>
                  <EditFeeCategoryForm category={category} />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    className="transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-destructive">
                      Delete Fee Category
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                      Are you sure you want to delete{' '}
                      <strong>"{category.name}"</strong>? This action cannot be
                      undone and will permanently remove the fee category from
                      your system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="hover:bg-muted">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isPending}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Category
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
