'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileType,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
  Loader2,
  Info,
  MessageSquare,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatBytes, formatDateIN } from '@/lib/utils';
import {
  DOCUMENT_TYPE_LABELS,
  DocumentVerificationAction,
  DocumentWithStudent,
} from '@/types/document';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { documentRejectionReasons } from '@/constants';

interface DocumentVerificationDialogProps {
  document: DocumentWithStudent | null;
  verificationNote: string;
  setVerificationNote: (note: string) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  onVerify: (
    documentId: string,
    action: DocumentVerificationAction
  ) => Promise<void>;
  isPending: boolean;
  pendingAction: DocumentVerificationAction | null;
}

export function DocumentVerificationDialog({
  document: doc,
  verificationNote,
  setVerificationNote,
  rejectionReason,
  setRejectionReason,
  onVerify,
  isPending,
  pendingAction,
}: DocumentVerificationDialogProps) {
  const [previewLoading, setPreviewLoading] = useState(true);

  if (!doc) return null;

  const getDocumentStatus = (
    doc: DocumentWithStudent
  ): 'PENDING' | 'APPROVED' | 'REJECTED' => {
    if (doc.verified) return 'APPROVED';
    if (doc.rejected) return 'REJECTED';
    return 'PENDING';
  };

  const status = getDocumentStatus(doc);
  const isPendingStatus = status === 'PENDING';
  const isPDF = doc.fileType === 'application/pdf';
  const isImage = doc.fileType?.startsWith('image/');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = doc.documentUrl;
    link.download =
      doc.fileName ||
      `${DOCUMENT_TYPE_LABELS[doc.type]}.${doc.documentUrl.split('.').pop()}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderVerificationActions = () => {
    if (!isPendingStatus) {
      return (
        <div
          className={`rounded-lg p-4 border-2 ${
            status === 'APPROVED'
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            {status === 'APPROVED' ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg ${
                  status === 'APPROVED'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                Document {status === 'APPROVED' ? 'Approved' : 'Rejected'}
              </h3>
              <div className="space-y-2 mt-2 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-muted-foreground">
                    {status === 'APPROVED' ? 'Verified' : 'Rejected'} by:
                  </span>
                  <span className="font-medium">
                    {doc.verifiedBy || doc.rejectedBy || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {formatDateIN(doc.verifiedAt || doc.rejectedAt || 'N/A')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Show rejection reason if document was rejected */}
          {status === 'REJECTED' && doc.rejectReason && (
            <Alert className="border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium text-sm">Rejection Reason:</p>
                  <p className="text-sm whitespace-pre-wrap">
                    {doc.rejectReason}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Show verification note if available */}
          {doc.note && (
            <Alert className="mt-3 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium text-sm">Verification Notes:</p>
                  <p className="text-sm whitespace-pre-wrap">{doc.note}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    return (
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
            Pending Verification
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="verification-note"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="verification-note"
              placeholder="Add notes about the document verification (e.g., document quality, completeness, etc.)"
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              className="mt-2 min-h-[80px] resize-none"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="rejection-reason"
                className="text-sm font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                Rejection Reason <span className="text-red-500">*</span>
              </Label>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const suggestion = generateRejectReasonSuggestion(doc.type);
                  setRejectionReason(suggestion);
                }}
                className="text-xs gap-1"
              >
                <Lightbulb className="w-4 h-4" />
                Suggest Reason
              </Button>
            </div>

            <Textarea
              id="rejection-reason"
              placeholder="e.g., Document is unclear or does not match student information."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isPending}
            />

            <p className="text-xs text-muted-foreground">
              Required when rejecting a document. This will be shown to the
              student.
            </p>
          </div>

          <Separator />

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onVerify(doc.id, 'APPROVE')}
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
            >
              {isPending && pendingAction === 'APPROVE' ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Approving Document...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Document
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              onClick={() => onVerify(doc.id, 'REJECT')}
              disabled={isPending || !rejectionReason.trim()}
              className="w-full font-medium py-2.5"
            >
              {isPending && pendingAction === 'REJECT' ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rejecting Document...
                </div>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Document
                </>
              )}
            </Button>
          </div>

          {!rejectionReason.trim() && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Please provide a rejection reason to enable the reject button.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    );
  };

  const handleOpenInNewTab = () => {
    window.open(doc.documentUrl, '_blank', 'noopener,noreferrer');
  };

  const renderDocumentPreview = () => {
    if (isPDF) {
      return (
        <div className="w-full h-full">
          <iframe
            src={doc.documentUrl}
            className="w-full h-full border-0 rounded-lg"
            title={`Preview of ${DOCUMENT_TYPE_LABELS[doc.type]}`}
            onLoad={() => setPreviewLoading(false)}
          />
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <img
            src={doc.documentUrl || '/placeholder.svg'}
            alt={DOCUMENT_TYPE_LABELS[doc.type]}
            className="max-w-full max-h-full object-contain rounded-lg"
            onLoad={() => setPreviewLoading(false)}
            onError={() => setPreviewLoading(false)}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Preview Not Available
            </h3>
            <p className="text-muted-foreground mb-4">
              This file type cannot be previewed in the browser
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download to View
              </Button>
              <Button onClick={handleOpenInNewTab} variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateRejectReasonSuggestion = (
    type: keyof typeof documentRejectionReasons
  ): string => {
    const reasons = documentRejectionReasons[type] ?? [];
    if (reasons.length === 0)
      return 'No rejection reasons found for this document type.';
    const randomIndex = Math.floor(Math.random() * reasons.length);
    return reasons[randomIndex];
  };

  return (
    <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-x-scroll flex flex-col max-sm:px-0 gap-0 ">
      <DialogHeader className="">
        <DialogTitle className="text-lg">Document Verification</DialogTitle>
        <DialogDescription>
          Review document details and take verification action
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 min-h-0 p-4 sm:p-6 pt-4">
        <Tabs defaultValue="details" className="h-full flex flex-col p-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0 mb-4">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Document Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Document Preview</span>
              <span className="sm:hidden">Preview</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent
              value="details"
              className="h-full m-0 overflow-hidden p-0"
            >
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  {/* Student Information Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg truncate">
                          {doc.student.firstName} {doc.student.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Roll: {doc.student.rollNumber} • Grade{' '}
                          {doc.student.grade.grade}-{doc.student.section.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Document Information */}
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <Label className="text-sm font-semibold flex items-center gap-2 mb-4">
                          <FileType className="w-4 h-4" />
                          Document Information
                        </Label>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                              Document Type
                            </p>
                            <p className="font-medium text-sm mt-1">
                              {DOCUMENT_TYPE_LABELS[doc.type]}
                            </p>
                          </div>
                          <Separator />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                              File Name
                            </p>
                            <p className="font-medium text-sm break-all mt-1">
                              {doc.fileName || 'N/A'}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                File Size
                              </p>
                              <p className="font-medium text-sm mt-1">
                                {doc.fileSize
                                  ? formatBytes(doc.fileSize)
                                  : 'Unknown'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                File Type
                              </p>
                              <p className="font-medium text-sm mt-1">
                                {doc.fileType || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <Label className="text-sm font-semibold flex items-center gap-2 mb-4">
                          <Calendar className="w-4 h-4" />
                          Timeline
                        </Label>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                              Upload Date
                            </p>
                            <p className="font-medium text-sm mt-1">
                              {formatDateIN(doc.uploadedAt)}
                            </p>
                          </div>
                          {(doc.verifiedAt || doc.rejectedAt) && (
                            <>
                              <Separator />
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                  {status === 'APPROVED'
                                    ? 'Verification Date'
                                    : 'Rejection Date'}
                                </p>
                                <p className="font-medium text-sm mt-1">
                                  {formatDateIN(
                                    doc.verifiedAt || doc.rejectedAt || 'N/A'
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                  {status === 'APPROVED'
                                    ? 'Verified By'
                                    : 'Rejected By'}
                                </p>
                                <p className="font-medium text-sm mt-1">
                                  {doc.verifiedBy || doc.rejectedBy || 'N/A'}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="space-y-4">
                      {renderVerificationActions()}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preview" className="h-full overflow-hidden m-0">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <h3 className="font-semibold truncate">
                      {doc.fileName || DOCUMENT_TYPE_LABELS[doc.type]}
                    </h3>
                    <Badge variant="outline" className="flex-shrink-0">
                      {doc.fileSize
                        ? formatBytes(doc.fileSize)
                        : 'Unknown size'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button
                      onClick={handleOpenInNewTab}
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">New Tab</span>
                    </Button>
                  </div>
                </div>

                <div className="flex-1 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/20 relative overflow-hidden min-h-0">
                  {previewLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading preview...</span>
                      </div>
                    </div>
                  )}
                  {renderDocumentPreview()}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DialogContent>
  );
}
