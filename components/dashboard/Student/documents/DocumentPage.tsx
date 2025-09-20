'use client';

import { useState } from 'react';
import { CheckCircle, FileText, Search, UploadCloud } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { type StudentDocument, DOCUMENT_TYPE_LABELS } from '@/types/document';
import { DocumentCard } from '@/components/dashboard/Student/documents/DocumentCard';
import { Badge } from '@/components/ui/badge';
import { DocumentUploadForm } from '@/components/dashboard/Student/documents/DocumentUploader';
import { studentDocumentsDelete } from '@/app/actions';
import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function DocumentsPage({
  studentId,
  data,
}: {
  studentId: string;
  data: StudentDocument[];
}) {
  console.log('data', data);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredDocuments = data.filter((doc) => {
    const matchesSearch =
      DOCUMENT_TYPE_LABELS[doc.type]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'verified' && doc.verified) ||
      (filterStatus === 'pending' && !doc.verified && !doc.rejected) ||
      (filterStatus === 'rejected' && doc.rejected);

    return matchesSearch && matchesType && matchesStatus && !doc.isDeleted;
  });

  const verifiedCount = data.filter(
    (doc) => doc.verified && !doc.isDeleted
  ).length;

  const pendingCount = data.filter(
    (doc) => !doc.verified && !doc.rejected && !doc.isDeleted
  ).length;

  // const rejectedCount = data.filter(
  //   (doc) => doc.rejected && !doc.isDeleted
  // ).length;

  const handleDeleteDocument = async (documentId: string) => {
    await studentDocumentsDelete(documentId);
  };

  const isCloudinaryUploadActive = true;

  return (
    <div className="space-y-4 px-2 sm:px-4">
      <Card className="">
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Documents</span>
              {isCloudinaryUploadActive ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Upload System Active
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800 text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Upload System InActive
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Manage and view all student documents
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <UploadCloud className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Upload Document</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-2">
                <DialogHeader className="px-6 pt-6 pb-4">
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Add a new document for verification. We support PDF, JPEG,
                    PNG, and WebP files up to 2MB.
                  </DialogDescription>
                </DialogHeader>
                <DocumentUploadForm studentId={studentId} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter((doc) => !doc.isDeleted).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {verifiedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">All Documents</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Upload New</span>
            <span className="sm:hidden">Upload</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 sm:space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">
                Filter Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(DOCUMENT_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  studentDocument={document}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                  No documents found
                </h3>
                <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Upload your first document to get started'}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterStatus('all');
                  }}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Upload New Document
              </CardTitle>
              <CardDescription>
                Upload documents for verification. Maximum file size: 2MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploadForm studentId={studentId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
