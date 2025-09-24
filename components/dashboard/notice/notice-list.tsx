'use client';

import { useState, useTransition } from 'react';
import { Eye, Trash2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { formatDateIN } from '@/lib/utils';
import { Role } from '@/generated/prisma/enums';
import { Notice } from '@/generated/prisma/client';
import { deleteNotice } from '@/lib/data/notice/delete-notice';

interface NoticeListProps {
  notices: Notice[];
  userRole: Role;
}

export default function NoticeList({ notices, userRole }: NoticeListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const handleView = (id: string) => {
    router.push(`/dashboard/notices/${id}`);
  };

  const handleDelete = (notice: Notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!noticeToDelete) return;

    startTransition(async () => {
      try {
        await deleteNotice(noticeToDelete.id);
        toast.success('Notice deleted successfully');
        setDeleteDialogOpen(false);
        setNoticeToDelete(null);
      } catch (error) {
        toast.error('Failed to delete notice');
      }
    });
  };

  const renderAdminActions = (notice: Notice) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleView(notice.id)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete(notice)}
          className="text-red-600 cursor-pointer hover:text-red-800"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderViewButton = (notice: Notice) => (
    <Button
      onClick={() => handleView(notice.id)}
      variant="outline"
      size="sm"
      className="cursor-pointer"
    >
      <Eye className="mr-2 h-4 w-4" />
      View
    </Button>
  );

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No notices found
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {notice.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={notice.noticeType} className="capitalize">
                      {notice.noticeType.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateIN(notice.startDate)}</TableCell>
                  <TableCell>{formatDateIN(notice.endDate)}</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant={notice.status}>
                      {notice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {userRole === 'ADMIN' || userRole === 'TEACHER'
                      ? renderAdminActions(notice)
                      : renderViewButton(notice)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{noticeToDelete?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
