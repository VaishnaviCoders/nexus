'use client';

import React, { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertTriangle,
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  Download,
  RefreshCw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ComplaintStatusUpdate } from '@/components/dashboard/anonymousComplaints/manage/complaint-status-update';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateComplaintStatus } from '@/lib/data/complaints/complaint-actions';
import { toast } from 'sonner';
import { ComplaintDetailModal } from './complaint-detail-modal';
import { ComplaintAnalytics } from './complaints-analytics';

interface ComplaintData {
  complaints: any[];
  totalCount: number;
  analytics: {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    criticalComplaints: number;
    averageResolutionTime: number;
    categoryBreakdown: Record<string, number>;
    severityBreakdown: Record<string, number>;
    statusBreakdown: Record<string, number>;
    monthlyTrends: Array<{ month: string; count: number; resolved: number }>;
  };
  pagination: {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface Filters {
  status?: string;
  severity?: string;
  category?: string;
  search?: string;
  page: number;
  sort: string;
  order: 'asc' | 'desc';
}

interface ComplaintManagementDashboardProps {
  initialData: ComplaintData;
  filters: Filters;
}

const statusConfig = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  UNDER_REVIEW: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: FileText,
  },
  INVESTIGATING: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Search,
  },
  RESOLVED: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  REJECTED: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  CLOSED: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: FileText,
  },
};

const severityConfig = {
  LOW: { color: 'bg-green-100 text-green-800 border-green-200', priority: 1 },
  MEDIUM: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    priority: 2,
  },
  HIGH: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    priority: 3,
  },
  CRITICAL: { color: 'bg-red-100 text-red-800 border-red-200', priority: 4 },
};

export function ComplaintManagementDashboard({
  initialData,
  filters,
}: ComplaintManagementDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState(initialData);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [activeTab, setActiveTab] = useState('overview');

  const updateFilters = (newFilters: Partial<Filters>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when changing filters (except pagination)
    if (!newFilters.page) {
      params.delete('page');
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSearch = () => {
    updateFilters({ search: searchQuery, page: 1 });
  };

  const handleStatusUpdate = async (
    complaintId: string,
    status: string,
    note?: string
  ) => {
    try {
      const result = await updateComplaintStatus(complaintId, status, note);

      if (result.success) {
        toast.success('Complaint status updated successfully');

        // Update local data
        setData((prev) => ({
          ...prev,
          complaints: prev.complaints.map((complaint) =>
            complaint.id === complaintId
              ? { ...complaint, currentStatus: status, updatedAt: new Date() }
              : complaint
          ),
        }));

        setShowStatusUpdate(false);
        setSelectedComplaint(null);
      } else {
        toast.error(result.error || 'Failed to update complaint status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getUrgencyScore = (complaint: any) => {
    const severityScore =
      severityConfig[complaint.severity as keyof typeof severityConfig]
        ?.priority || 1;
    const daysSinceSubmitted = Math.floor(
      (new Date().getTime() - new Date(complaint.submittedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return severityScore * (daysSinceSubmitted + 1);
  };

  return (
    <div className="space-y-6">
      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Total Complaints
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {data.analytics.totalComplaints}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Pending Review
                    </p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {data.analytics.pendingComplaints}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
                  <span className="text-yellow-600">Requires attention</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Resolved
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {data.analytics.resolvedComplaints}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-slate-600">
                    {Math.round(
                      (data.analytics.resolvedComplaints /
                        data.analytics.totalComplaints) *
                        100
                    )}
                    % resolution rate
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Critical Issues
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {data.analytics.criticalComplaints}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-red-600">
                    Immediate action required
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Critical Complaints */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Critical Complaints
                </CardTitle>
                <CardDescription>
                  High-priority complaints requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.complaints
                    .filter(
                      (c) => c.severity === 'CRITICAL' || c.severity === 'HIGH'
                    )
                    .slice(0, 5)
                    .map((complaint) => (
                      <div
                        key={complaint.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowDetailModal(true);
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {complaint.subject}
                          </p>
                          <p className="text-sm text-slate-500">
                            {complaint.trackingId} •{' '}
                            {formatDate(complaint.submittedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              severityConfig[
                                complaint.severity as keyof typeof severityConfig
                              ].color
                            }
                          >
                            {complaint.severity}
                          </Badge>
                          <Badge
                            className={
                              statusConfig[
                                complaint.currentStatus as keyof typeof statusConfig
                              ].color
                            }
                          >
                            {complaint.currentStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates and status changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.complaints
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .slice(0, 5)
                    .map((complaint) => (
                      <div
                        key={complaint.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {React.createElement(
                            statusConfig[
                              complaint.currentStatus as keyof typeof statusConfig
                            ].icon,
                            {
                              className: 'h-4 w-4 text-blue-600',
                            }
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {complaint.subject}
                          </p>
                          <p className="text-xs text-slate-500">
                            Status: {complaint.currentStatus.replace('_', ' ')}{' '}
                            • {formatDate(complaint.updatedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          {/* Filters and Search */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search complaints by ID, subject, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={(value) =>
                      updateFilters({
                        status: value === 'all' ? undefined : value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="INVESTIGATING">
                        Investigating
                      </SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.severity || 'all'}
                    onValueChange={(value) =>
                      updateFilters({
                        severity: value === 'all' ? undefined : value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleSearch} disabled={isPending}>
                    {isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complaints List */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Complaints ({data.totalCount})</CardTitle>
                  <CardDescription>
                    Manage and track all anonymous complaints
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          updateFilters({ sort: 'submittedAt', order: 'desc' })
                        }
                      >
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateFilters({ sort: 'submittedAt', order: 'asc' })
                        }
                      >
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateFilters({ sort: 'severity', order: 'desc' })
                        }
                      >
                        High Priority First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateFilters({ sort: 'updatedAt', order: 'desc' })
                        }
                      >
                        Recently Updated
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowDetailModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {complaint.subject}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                severityConfig[
                                  complaint.severity as keyof typeof severityConfig
                                ].color
                              }
                            >
                              {complaint.severity}
                            </Badge>
                            <Badge
                              className={
                                statusConfig[
                                  complaint.currentStatus as keyof typeof statusConfig
                                ].color
                              }
                            >
                              {complaint.currentStatus.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {complaint.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="font-mono">
                            {complaint.trackingId}
                          </span>
                          <span>•</span>
                          <span>
                            {complaint.category
                              .replace('-', ' ')
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                          <span>•</span>
                          <span>{formatDate(complaint.submittedAt)}</span>
                          {complaint.evidenceUrls?.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {complaint.evidenceUrls.length} evidence
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(complaint);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(complaint);
                              setShowStatusUpdate(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!data.pagination.hasPrev}
                      onClick={() =>
                        updateFilters({ page: data.pagination.page - 1 })
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!data.pagination.hasNext}
                      onClick={() =>
                        updateFilters({ page: data.pagination.page + 1 })
                      }
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <ComplaintAnalytics analytics={data.analytics} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedComplaint && (
        <>
          <ComplaintDetailModal
            complaint={selectedComplaint}
            open={showDetailModal}
            onOpenChange={setShowDetailModal}
            onStatusUpdate={() => {
              setShowDetailModal(false);
              setShowStatusUpdate(true);
            }}
          />

          <ComplaintStatusUpdate
            complaint={selectedComplaint}
            open={showStatusUpdate}
            onOpenChange={setShowStatusUpdate}
            onUpdate={handleStatusUpdate}
          />
        </>
      )}
    </div>
  );
}
