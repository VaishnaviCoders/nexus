'use client';

import { useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  Eye,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileType,
  X,
  Filter,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatBytes, formatDateIN } from '@/lib/utils';
import {
  DOCUMENT_TYPE_LABELS,
  type DocumentVerificationAction,
  type DocumentWithStudent,
} from '@/types/document';
import { DocumentVerificationDialog } from './DocumentVerificationDialog';
import { verifyStudentDocument } from '@/app/actions';

interface Props {
  documents: DocumentWithStudent[];
}

export default function DocumentVerificationPage({ documents }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentWithStudent | null>(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<DocumentVerificationAction | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helper functions
  const getDocumentStatus = (
    doc: DocumentWithStudent
  ): 'PENDING' | 'APPROVED' | 'REJECTED' => {
    if (doc.verified) return 'APPROVED';
    if (doc.rejected) return 'REJECTED';
    return 'PENDING';
  };

  const getStatusBadge = (doc: DocumentWithStudent) => {
    const status = getDocumentStatus(doc);
    const badgeConfig = {
      PENDING: {
        variant: 'secondary' as const,
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300',
        icon: Clock,
        label: 'Pending',
      },
      APPROVED: {
        variant: 'default' as const,
        className:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300',
        icon: CheckCircle,
        label: 'Approved',
      },
      REJECTED: {
        variant: 'destructive' as const,
        className:
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300',
        icon: XCircle,
        label: 'Rejected',
      },
    };
    const config = badgeConfig[status];
    const Icon = config.icon;
    return (
      <Badge
        variant={config.variant}
        className={`${config.className} px-2 py-1`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      DOCUMENT_TYPE_LABELS[doc.type]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'ALL' ||
      selectedType === undefined ||
      doc.type === selectedType;

    const docStatus = getDocumentStatus(doc);
    const matchesStatus =
      selectedStatus === 'ALL' ||
      selectedStatus === undefined ||
      docStatus === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: documents.length,
    pending: documents.filter((doc) => !doc.verified && !doc.rejected).length,
    approved: documents.filter((doc) => doc.verified).length,
    rejected: documents.filter((doc) => doc.rejected).length,
  };

  // Calculate approval rate
  const approvalRate =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  // Handle verification
  const handleVerifyDocument = async (
    documentId: string,
    action: DocumentVerificationAction
  ) => {
    setPendingAction(action);
    startTransition(async () => {
      try {
        const result = await verifyStudentDocument(documentId, {
          action,
          note: action === 'APPROVE' ? verificationNote : undefined,
          rejectionReason: action === 'REJECT' ? rejectionReason : undefined,
        });
        if (result.success) {
          toast.success(result.message);
          setVerificationNote('');
          setRejectionReason('');
          setIsDialogOpen(false);
          setSelectedDocument(null);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setPendingAction(null);
      }
    });
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType(undefined);
    setSelectedStatus(undefined);
  };

  const hasActiveFilters =
    searchTerm || selectedType !== undefined || selectedStatus !== undefined;

  return (
    <div className="space-y-6 px-2">
      {/* Header */}

      <Card>
        <CardHeader className="px-2">
          <CardTitle className="text-lg">Document Verification</CardTitle>
          <CardDescription className="text-sm">
            Review and verify student documents efficiently
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Documents
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rejected
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
          </CardContent>
        </Card>
      </div>

      {/* Approval Rate Card */}
      {stats.total > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 max-sm:hidden">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Overall Approval Rate
                </p>
                <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                  {approvalRate}%
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {stats.approved} of {stats.total} documents approved
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Documents
            </CardTitle>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="w-fit bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, roll number, or document type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value === 'ALL' ? undefined : value)
                }
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value === 'ALL' ? undefined : value)
                }
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table - Desktop */}
      <Card className="hidden lg:block">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
              <CardDescription>
                Click on any document to view details and verify
              </CardDescription>
            </div>
            {stats.pending > 0 && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                {stats.pending} pending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>File Info</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {doc.student.firstName} {doc.student.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {doc.student.rollNumber} •{' '}
                              {doc.student.grade.grade}-
                              {doc.student.section.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileType className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {DOCUMENT_TYPE_LABELS[doc.type]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px]">
                            {doc.fileName || 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(doc.fileSize)} •{' '}
                            {doc.fileType || 'Unknown'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDateIN(doc.uploadedAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doc)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setVerificationNote('');
                                setRejectionReason('');
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DocumentVerificationDialog
                            document={selectedDocument}
                            verificationNote={verificationNote}
                            setVerificationNote={setVerificationNote}
                            rejectionReason={rejectionReason}
                            setRejectionReason={setRejectionReason}
                            onVerify={handleVerifyDocument}
                            isPending={isPending}
                            pendingAction={pendingAction}
                          />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters'
                  : 'No documents available for verification'}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Documents ({filteredDocuments.length})
          </h2>
          {stats.pending > 0 && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {stats.pending} pending
            </Badge>
          )}
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {doc.student.firstName} {doc.student.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.student.rollNumber} • Grade{' '}
                            {doc.student.grade.grade}-{doc.student.section.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(doc)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Document Type
                        </p>
                        <p className="font-medium text-xs">
                          {DOCUMENT_TYPE_LABELS[doc.type]}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Upload Date
                        </p>
                        <p className="font-medium text-xs">
                          {formatDateIN(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs">File Info</p>
                      <p className="font-medium truncate text-xs">
                        {doc.fileName || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(doc.fileSize)} •{' '}
                        {doc.fileType || 'Unknown'}
                      </p>
                    </div>

                    {/* Show rejection reason if document was rejected */}
                    {getDocumentStatus(doc) === 'REJECTED' &&
                      doc.rejectReason && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <p className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
                            Rejection Reason:
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-300">
                            {doc.rejectReason}
                          </p>
                        </div>
                      )}

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setVerificationNote('');
                            setRejectionReason('');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View & Verify
                        </Button>
                      </DialogTrigger>
                      <DocumentVerificationDialog
                        document={selectedDocument}
                        verificationNote={verificationNote}
                        setVerificationNote={setVerificationNote}
                        rejectionReason={rejectionReason}
                        setRejectionReason={setRejectionReason}
                        onVerify={handleVerifyDocument}
                        isPending={isPending}
                        pendingAction={pendingAction}
                      />
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters'
                  : 'No documents available for verification'}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
