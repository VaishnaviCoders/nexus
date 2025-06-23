'use client';

import { useState } from 'react';
import {
  CheckCircle,
  FileText,
  Search,
  UploadCloud,
  UploadIcon,
} from 'lucide-react';
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
// import { DocumentUploadForm } from "@/components/document-upload-form"
// import { DocumentCard } from "@/components/document-card"
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
  //   const [documents, setDocuments] = useState<StudentDocument[]>(mockDocuments);
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
      (filterStatus === 'pending' && !doc.verified);

    return matchesSearch && matchesType && matchesStatus && !doc.isDeleted;
  });

  const verifiedCount = data.filter(
    (doc) => doc.verified && !doc.isDeleted
  ).length;
  const pendingCount = data.filter(
    (doc) => !doc.verified && !doc.isDeleted
  ).length;

  const handleUploadSuccess = () => {
    // Refresh documents list
    // In a real app, you'd refetch from your API
    console.log('Document uploaded successfully');
  };

  const handleDeleteDocument = async (documentId: string) => {
    console.log('Document deleted:', documentId);
    await studentDocumentsDelete(documentId);
  };

  const isCloudinaryUploadActive = true;

  return (
    <div className="space-y-3 px-2">
      <Card className="">
        <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              Documents{' '}
              {isCloudinaryUploadActive ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Upload System Active
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Upload System InActive
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Manage and view all student documents
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>

              <DialogContent className="min-w-7xl ">
                <DialogHeader>
                  <DialogTitle> Upload Document</DialogTitle>
                  <DialogDescription>
                    {' '}
                    Add a new document for verification. We support PDF, JPEG,
                    PNG, and WebP files up to 10MB.
                  </DialogDescription>
                  <DocumentUploadForm
                    studentId={studentId}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
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
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[200px]">
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
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No documents found
                </h3>
                <p className="text-muted-foreground text-center mb-4">
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
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload">
          <DocumentUploadForm
            onUploadSuccess={handleUploadSuccess}
            studentId={studentId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
