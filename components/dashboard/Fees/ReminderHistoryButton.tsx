'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface ReminderHistoryButtonProps {
  studentId: string;
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}
export interface FeeReminderHistory {
  id: string;
  studentId: string;
  sentAt: Date;
  channel: 'email' | 'sms' | 'whatsapp';
  subject: string;
  status: 'delivered' | 'failed' | 'pending';
  sentBy: string;
}

export function ReminderHistoryButton({
  studentId,
  variant = 'outline',
  size = 'sm',
  className,
}: ReminderHistoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [reminderHistory, setReminderHistory] = useState<FeeReminderHistory[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reminder history when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen && reminderHistory.length === 0) {
      setIsLoading(true);

      // Mock data - in a real app, you would fetch this from your API
      setTimeout(() => {
        setReminderHistory([
          {
            id: 'rem1',
            studentId,
            sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            channel: 'email',
            subject: 'Friendly Reminder: Fee Payment Due',
            status: 'delivered',
            sentBy: 'System',
          },
          {
            id: 'rem2',
            studentId,
            sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            channel: 'sms',
            subject: 'First Notice: Fee Payment Overdue',
            status: 'delivered',
            sentBy: 'John Doe',
          },
          {
            id: 'rem3',
            studentId,
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            channel: 'whatsapp',
            subject: 'URGENT: Final Notice for Fee Payment',
            status: 'delivered',
            sentBy: 'Jane Smith',
          },
        ]);
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => handleOpenChange(true)}
        className={className}
      >
        <Clock className="mr-2 h-4 w-4" />
        Reminder History
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reminder History</DialogTitle>
            <DialogDescription>
              History of all fee reminders sent to this student/parent
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-muted-foreground">
                  Loading reminder history...
                </p>
              </div>
            ) : reminderHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px]">
                <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No reminders have been sent yet
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Subject/Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminderHistory.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell>{format(reminder.sentAt, 'PPP p')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {reminder.channel === 'email'
                            ? 'Email'
                            : reminder.channel === 'sms'
                            ? 'SMS'
                            : 'WhatsApp'}
                        </Badge>
                      </TableCell>
                      <TableCell>{reminder.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reminder.status === 'delivered'
                              ? 'present'
                              : reminder.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {reminder.status.charAt(0).toUpperCase() +
                            reminder.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{reminder.sentBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
