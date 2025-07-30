'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Complaint } from '@/types';
import { ComplaintStatus } from '@/app/generated/prisma/enums';

interface ComplaintStatusUpdateProps {
  complaint: Complaint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (
    complaintId: string,
    status: ComplaintStatus,
    note?: string
  ) => Promise<void>;
}

const statusOptions = [
  {
    value: 'PENDING',
    label: 'Pending',
    description: 'Complaint is awaiting review',
    emoji: '⏳',
  },
  {
    value: 'UNDER_REVIEW',
    label: 'Under Review',
    description: 'Complaint is being reviewed by the team',
    emoji: '🔍',
  },
  {
    value: 'INVESTIGATING',
    label: 'Investigating',
    description: 'Active investigation is in progress',
    emoji: '🕵️',
  },
  {
    value: 'RESOLVED',
    label: 'Resolved',
    description: 'Complaint has been resolved',
    emoji: '✅',
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    description: 'Complaint could not be processed',
    emoji: '❌',
  },
  {
    value: 'CLOSED',
    label: 'Closed',
    description: 'Complaint has been closed',
    emoji: '🔒',
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
  INVESTIGATING: 'bg-purple-100 text-purple-800 border-purple-200',
  RESOLVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function ComplaintStatusUpdate({
  complaint,
  open,
  onOpenChange,
  onUpdate,
}: ComplaintStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState(complaint.currentStatus);
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!selectedStatus) return;

    setIsUpdating(true);
    try {
      await onUpdate(complaint.id, selectedStatus, note.trim() || undefined);
      setNote('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedStatusOption = statusOptions.find(
    (option) => option.value === selectedStatus
  );
  const hasStatusChanged = selectedStatus !== complaint.currentStatus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Update Complaint Status
          </DialogTitle>
          <DialogDescription>
            Update the status and add notes for complaint {complaint.trackingId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">Current Status</h3>
              <Badge className={statusColors[complaint.currentStatus]}>
                {complaint.currentStatus.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">
              {complaint.subject}
            </p>
            <p className="text-xs text-slate-500">
              Last updated:{' '}
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(complaint.updatedAt))}
            </p>
          </div>

          {/* New Status Selection */}
          <div className="space-y-3">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as ComplaintStatus)
              }
            >
              <SelectTrigger className="flex items-center gap-2">
                {selectedStatusOption ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {selectedStatusOption.emoji}
                    </span>
                    <span className="text-sm font-medium">
                      {selectedStatusOption.label}
                    </span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select new status" />
                )}
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="py-2 px-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{option.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedStatusOption && (
              <div className="flex items-center gap-2">
                <Badge className={statusColors[selectedStatus]}>
                  {selectedStatusOption.label}
                </Badge>
                <span className="text-sm text-slate-600">
                  {selectedStatusOption.description}
                </span>
              </div>
            )}
          </div>

          {/* Status Change Alert */}
          {hasStatusChanged && (
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Status will be changed from{' '}
                <strong>{complaint.currentStatus.replace('_', ' ')}</strong> to{' '}
                <strong>{selectedStatus.replace('_', ' ')}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="note">Update Notes</Label>
            <Textarea
              id="note"
              placeholder="Add notes about this status update (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-slate-500">
              These notes will be visible in the complaint timeline and help
              track the progress.
            </p>
          </div>

          {/* Warning for sensitive statuses */}
          {(selectedStatus === 'REJECTED' || selectedStatus === 'CLOSED') && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                <strong>Important:</strong> Setting status to "
                {selectedStatus.replace('_', ' ')}" will mark this complaint as
                final. Make sure all necessary actions have been taken.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            disabled={!selectedStatus || isUpdating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Update Status
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
