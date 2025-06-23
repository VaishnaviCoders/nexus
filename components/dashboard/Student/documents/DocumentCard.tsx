'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Eye,
  Download,
  FileText,
  Shield,
  ShieldCheck,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type StudentDocument, DOCUMENT_TYPE_LABELS } from '@/types/document';
import { formatFileSize, getFileTypeFromUrl } from '@/lib/cloudinary';

interface DocumentCardProps {
  document: StudentDocument;
  onDelete?: (documentId: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const fileType = getFileTypeFromUrl(document.documentUrl);
  const isPDF = fileType === 'application/pdf';
  const isImage = fileType.startsWith('image/');

  const handleDownload = () => {
    // const link = document.createElement("a")
    // link.href = document.documentUrl
    // link.download =
    //   document.fileName || `${DOCUMENT_TYPE_LABELS[document.type]}.${document.documentUrl.split(".").pop()}`
    // link.target = "_blank"
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">
                  {DOCUMENT_TYPE_LABELS[document.type]}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {document.fileName || 'No filename'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={document.verified ? 'default' : 'secondary'}
                className="text-xs"
              >
                {document.verified ? (
                  <>
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(document.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Size:{' '}
                {document.fileSize
                  ? formatFileSize(document.fileSize)
                  : 'Unknown'}
              </span>
              <span>
                Uploaded:{' '}
                {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}
              </span>
            </div>
            {/* {document.note && (
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                {document.note}
              </p>
            )} */}
            {document.verified && document.verifiedAt && (
              <p className="text-xs text-green-600">
                Verified on{' '}
                {format(new Date(document.verifiedAt), 'MMM dd, yyyy')}
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{DOCUMENT_TYPE_LABELS[document.type]}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {isPDF ? (
              <iframe
                src={document.documentUrl}
                className="w-full h-[70vh] border rounded-lg"
                title={`Preview of ${DOCUMENT_TYPE_LABELS[document.type]}`}
              />
            ) : isImage ? (
              <div className="flex justify-center">
                <img
                  src={document.documentUrl || '/placeholder.svg'}
                  alt={DOCUMENT_TYPE_LABELS[document.type]}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[70vh] bg-muted rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Preview not available for this file type
                  </p>
                  <Button onClick={handleDownload} className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download to view
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
