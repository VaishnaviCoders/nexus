'use client';

import React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  FileText,
  Eye,
  EyeOff,
  Download,
  MessageSquare,
  AlertTriangle,
  Shield,
  ImageIcon,
  Calendar,
  User,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Complaint } from '@/types';
import { severityConfig, statusConfig } from '@/constants';

interface ComplaintDetailModalProps {
  complaint: Complaint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: () => void;
}

export function ComplaintDetailModal({
  complaint,
  open,
  onOpenChange,
  onStatusUpdate,
}: ComplaintDetailModalProps) {
  const [showEvidence, setShowEvidence] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  const isImage = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };

  const getFileIcon = (url: string) => {
    return isImage(url) ? ImageIcon : FileText;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Complaint Details
          </DialogTitle>
          <DialogDescription>
            Complete information and timeline for complaint{' '}
            {complaint.trackingId}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Header Information */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 border border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                    {complaint.subject}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'flex items-center gap-1',
                        statusConfig[complaint.currentStatus].color
                      )}
                    >
                      {React.createElement(
                        statusConfig[complaint.currentStatus].icon,
                        { className: 'h-3 w-3' }
                      )}
                      {complaint.currentStatus.replace('_', ' ')}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={severityConfig[complaint.severity].color}
                    >
                      {complaint.severity} Priority
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-slate-100 text-slate-700"
                    >
                      {complaint.category
                        .replace('-', ' ')
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>

                <div className="lg:text-right space-y-2">
                  <div className="text-sm text-slate-600">
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Submitted: {formatDate(complaint.submittedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end mt-1">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {formatDate(complaint.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="font-mono text-sm bg-white px-3 py-1 rounded border text-center">
                    {complaint.trackingId}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </h3>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Evidence Section */}
            {complaint.evidenceUrls && complaint.evidenceUrls.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Evidence ({complaint.evidenceUrls.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEvidence(!showEvidence)}
                    className="flex items-center gap-2"
                  >
                    {showEvidence ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide Evidence
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        View Evidence
                      </>
                    )}
                  </Button>
                </div>

                {!showEvidence ? (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      Evidence Hidden
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Evidence files are hidden by default to protect sensitive
                      content. Click "View Evidence" to display them.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {complaint.evidenceUrls.map(
                      (url: string, index: number) => {
                        const FileIcon = getFileIcon(url);
                        return (
                          <div
                            key={index}
                            className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                          >
                            {isImage(url) ? (
                              <div className="aspect-video relative bg-slate-100">
                                <img
                                  src={url || '/placeholder.svg'}
                                  alt={`Evidence ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="aspect-video flex items-center justify-center bg-slate-100">
                                <FileIcon className="h-12 w-12 text-slate-400" />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="text-sm text-slate-600 mb-2">
                                Evidence {index + 1}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-auto p-0 text-blue-600 hover:text-blue-700"
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status Timeline
              </h3>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />

                <div className="space-y-6">
                  {complaint.ComplaintStatusTimeline?.sort(
                    (a: any, b: any) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  ).map((update: any, index: number) => {
                    const StatusIcon =
                      statusConfig[update.status as keyof typeof statusConfig]
                        .icon;

                    const isLatest = index === 0;

                    return (
                      <div
                        key={update.id}
                        className="relative flex items-start gap-4"
                      >
                        <div
                          className={cn(
                            'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-lg',
                            isLatest
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-slate-400'
                          )}
                        >
                          <StatusIcon className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0 pb-6">
                          <div
                            className={cn(
                              'rounded-lg border p-4 transition-all',
                              isLatest
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                                : 'bg-slate-50 border-slate-200'
                            )}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'w-fit',
                                  statusConfig[
                                    update.status as keyof typeof statusConfig
                                  ].color,
                                  isLatest && 'ring-2 ring-blue-200'
                                )}
                              >
                                {update.status.replace('_', ' ')}
                              </Badge>
                              <span className="text-sm text-slate-500 font-medium">
                                {formatDate(update.createdAt)}
                              </span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {update.note ||
                                'Status updated with no additional notes.'}
                            </p>
                            {update.changedBy && (
                              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Updated by: {update.changedBy}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex items-center justify-between pt-4 max-sm:flex-col max-sm:items-start gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Shield className="h-5 w-5 text-green-600" />
            <span>This complaint is handled with complete confidentiality</span>
          </div>

          <div className="flex items-center gap-2 ml-auto max-sm:mt-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={onStatusUpdate}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
