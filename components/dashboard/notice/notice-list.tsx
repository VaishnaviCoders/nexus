'use client';

import { useEffect, useState } from 'react';

import { Eye, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

import { cn } from '@/lib/utils';
import { deleteNotice } from '@/app/actions';
import { DeleteNoticeButton } from '@/lib/SubmitButton';
import { Role } from '@/generated/prisma';

interface Notice {
  id: string;
  noticeType: string;
  title: string;
  startDate: Date;
  endDate: Date;
  content: string;
  isNoticeApproved: boolean;
  isDraft: boolean;
  isPublished: boolean;
  emailNotification: boolean;
  pushNotification: boolean;
  WhatsAppNotification: boolean;
  targetAudience: string[];
  attachments: any;
  publishedBy: string;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface NoticeListProps {
  notices: Notice[];
  orgRole: Role;
}

export default function NoticeList({
  notices: initialNotices,
  orgRole,
}: NoticeListProps) {
  const userRole = orgRole;
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    // Convert dates from string to Date objects
    const processedNotices = initialNotices.map((notice) => ({
      ...notice,
      startDate: new Date(notice.startDate),
      endDate: new Date(notice.endDate),
      createdAt: new Date(notice.createdAt),
      updatedAt: new Date(notice.updatedAt),
    }));
    setNotices(processedNotices);
  }, [initialNotices]);

  // const today = new Date();
  // const upcomingNotices = notices.filter((notice) => notice.endDate >= today);
  // const pastNotices = notices.filter((notice) => notice.endDate < today);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Notice;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const sortedNotices = [...notices].sort((a, b) => {
    if (!sortConfig?.key) return 0; // If sortConfig or key is undefined, don't sort
    const { key, direction } = sortConfig;

    const valueA = a[key] ?? ''; // Fallback to an empty string if undefined
    const valueB = b[key] ?? ''; // Fallback to an empty string if undefined

    if (valueA < valueB) return direction === 'ascending' ? -1 : 1;
    if (valueA > valueB) return direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Notice) => {
    setSortConfig((prevConfig) => {
      if (!prevConfig || prevConfig.key !== key) {
        return { key, direction: 'ascending' };
      }
      if (prevConfig.direction === 'ascending') {
        return { key, direction: 'descending' };
      }
      return null;
    });
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/notices/${id}`);
  };

  // const handleEdit = (id: string) => {
  //   router.push(`/dashboard/notices/${id}`);
  // };

  const handleDelete = (notice: Notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (noticeToDelete) {
      setNotices(notices.filter((notice) => notice.id !== noticeToDelete.id));
      await deleteNotice(noticeToDelete.id);
      setDeleteDialogOpen(false);
      setNoticeToDelete(null);
    }
  };

  const noticeTypes = [
    { value: 'holiday', label: 'Holiday' },
    { value: 'event', label: 'Event' },
    { value: 'ptm', label: 'Parent-Teacher Meeting' },
    { value: 'trip', label: 'School Trip' },
    { value: 'exam', label: 'Examination' },
    { value: 'announcement', label: 'General Announcement' },
  ];

  const renderAdminActions = (notice: Notice) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
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
        {/* <DropdownMenuItem onClick={() => handleEdit(notice.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem> */}
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
      className="cursor-pointer"
    >
      <Eye className="mr-2 h-4 w-4" />
      View
    </Button>
  );

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table className="">
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort('id')}>
                  Notice ID
                  {sortConfig?.key === 'id' &&
                    (sortConfig.direction === 'ascending' ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead> */}
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('title')}>
                  Title
                  {sortConfig?.key === 'title' &&
                    (sortConfig.direction === 'ascending' ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('startDate')}>
                  Start Date
                  {sortConfig?.key === 'startDate' &&
                    (sortConfig.direction === 'ascending' ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              {orgRole === 'ADMIN' && <TableHead>Approved</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedNotices.map((notice) => (
              <TableRow key={notice.id}>
                {/* <TableCell className="font-medium">{notice.id}</TableCell> */}
                <TableCell className="truncate text-clip">
                  {notice.title}
                </TableCell>
                <TableCell>
                  {noticeTypes.find((type) => type.value === notice.noticeType)
                    ?.label || notice.noticeType}
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat('en-US').format(notice.startDate)}
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat('en-US').format(notice.endDate)}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <Badge
                    className={cn(
                      notice.isPublished
                        ? 'text-blue-500 bg-blue-50 hover:bg-blue-100'
                        : notice.isDraft
                          ? 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                          : 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                    )}
                    variant={
                      notice.isPublished
                        ? 'default'
                        : notice.isDraft
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {notice.isPublished
                      ? 'Published'
                      : notice.isDraft
                        ? 'Draft'
                        : 'Pending Approval'}
                  </Badge>
                </TableCell>
                {userRole === 'ADMIN' || userRole === 'TEACHER' ? (
                  <TableCell>
                    <Badge
                      className={cn(
                        notice.isNoticeApproved
                          ? 'text-green-500 bg-green-50 hover:bg-green-100'
                          : 'text-red-500 bg-red-50 hover:bg-red-100'
                      )}
                      variant={
                        notice.isNoticeApproved
                          ? 'default'
                          : notice.isNoticeApproved
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {notice.isNoticeApproved
                        ? 'Approved'
                        : notice.isDraft
                          ? 'Draft'
                          : 'Pending'}
                    </Badge>
                  </TableCell>
                ) : null}

                <TableCell>
                  {userRole === 'ADMIN' || userRole === 'TEACHER'
                    ? renderAdminActions(notice)
                    : renderViewButton(notice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this notice?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              notice &quot;{noticeToDelete?.title}&quot; and remove it from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <DeleteNoticeButton onClick={confirmDelete} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
