'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  ArrowLeft,
  Search,
  Shield,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
  Clock,
  FileText,
  ImageIcon,
  Download,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Complaint } from '@/types';
import { severityConfig, statusConfig } from '@/constants';

interface AnonymousComplaintTrackerProps {
  complaint: Complaint | null;
}

export default function AnonymousComplaintTracker({
  complaint,
}: AnonymousComplaintTrackerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');

  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Set hasSearched to true if we have a tracking ID from URL params on mount
  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId) {
      setTrackingId(urlId);
      setHasSearched(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = trackingId.trim();

    if (!trimmedId) {
      setError('Please enter a valid Tracking ID');
      return;
    }

    setIsSearching(true);
    setError('');
    setHasSearched(true);

    // Navigate to the tracking URL
    router.push(`/dashboard/anonymous-complaints/track/${trimmedId}`);
  };

  const handleTryAgain = () => {
    setTrackingId('');
    setHasSearched(false);
    setError('');
    setShowEvidence(false);
    // Navigate back to base tracking page
    router.push('/dashboard/anonymous-complaints/track');
  };

  if (hasSearched && !complaint) {
    return (
      <>
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-10 w-10 text-red-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">
                  Complaint Not Found
                </h3>
                <div className="space-y-2">
                  <p className="text-slate-600">
                    We couldn't find a complaint with the tracking ID:
                  </p>
                  <div className="inline-flex items-center bg-slate-100 rounded-lg px-4 py-2">
                    <span className="font-mono font-medium text-slate-800">
                      {trackingId}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-500 space-y-1 max-w-md mx-auto">
                  <p>Please verify that:</p>
                  <ul className="text-left space-y-1">
                    <li>• The tracking ID is entered correctly</li>
                    <li>• All characters including dashes are included</li>
                    <li>• The complaint was submitted successfully</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/anonymous-complaints')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Complaints
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return ImageIcon;
    }
    return FileText;
  };

  const isImage = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };

  return (
    <div className="h-full ">
      <main className="flex-1 py-8 sm:py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
            {/* Title Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                <Lock className="mr-2 h-4 w-4" />
                100% Confidential & Anonymous
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Track Your Complaint
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Enter your tracking ID to securely check the status and updates
                of your anonymous complaint.
              </p>
            </div>

            {/* Search Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Complaint Tracker
                </CardTitle>
                <CardDescription>
                  Enter the tracking ID you received when submitting your
                  complaint.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1">
                    <Input
                      placeholder="e.g. AC-1234567890-123"
                      value={trackingId}
                      onChange={(e) => {
                        setTrackingId(e.target.value);
                        setError('');
                      }}
                      className="border-slate-300 focus:border-blue-500 text-center sm:text-left"
                      disabled={isSearching}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!trackingId.trim() || isSearching}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-w-[120px]"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Track
                      </>
                    )}
                  </Button>
                </form>

                {error && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Error</AlertTitle>
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Complaint Details */}

            {complaint ? (
              <>
                <div className="space-y-6">
                  {/* Main Complaint Card */}
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <CardTitle className="text-xl sm:text-2xl text-slate-900 leading-tight">
                            {complaint.subject}
                          </CardTitle>
                          <CardDescription className="text-base">
                            <span className="font-mono font-medium">
                              {complaint.trackingId}
                            </span>
                            <span className="mx-2">•</span>
                            Submitted on{' '}
                            {new Intl.DateTimeFormat('en-IN').format(
                              new Date(complaint.submittedAt)
                            )}
                          </CardDescription>
                          <div className="flex flex-wrap items-center gap-2">
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
                              className={
                                severityConfig[complaint.severity].color
                              }
                            >
                              {severityConfig[complaint.severity].label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-100 text-slate-700"
                            >
                              {complaint.category
                                .replace('-', ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          </div>
                        </div>

                        {/* Status Description */}
                        <div className="lg:max-w-sm">
                          <Alert className="border-blue-200 bg-blue-50">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800">
                              Current Status
                            </AlertTitle>
                            <AlertDescription className="text-blue-700">
                              {
                                statusConfig[complaint.currentStatus]
                                  .description
                              }
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="font-semibold mb-3 text-slate-900 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Description
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {complaint.description}
                          </p>
                        </div>
                      </div>

                      {/* Evidence Section */}
                      {complaint.evidenceUrls &&
                        complaint.evidenceUrls.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
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
                                  Evidence files are hidden by default to
                                  protect sensitive content. Click "View
                                  Evidence" to display them.
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {complaint.evidenceUrls.map((url, index) => {
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
                                        <p className="text-sm text-slate-600 truncate">
                                          Evidence {index + 1}
                                        </p>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          asChild
                                          className="mt-1 h-auto p-0 text-blue-600 hover:text-blue-700"
                                        >
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Download className="h-3 w-3 mr-1" />
                                            View File
                                          </a>
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                    </CardContent>
                  </Card>

                  {/* Timeline Card */}
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Status Timeline
                      </CardTitle>
                      <CardDescription>
                        Track the progress of your complaint through each stage.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />

                        <div className="space-y-6">
                          {complaint.ComplaintStatusTimeline.sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          ).map((update, index) => {
                            const StatusIcon = statusConfig[update.status].icon;
                            const isLatest = index === 0;

                            return (
                              <div
                                key={update.id}
                                className="relative flex items-start gap-4"
                              >
                                {/* Timeline Dot */}
                                <div
                                  className={cn(
                                    'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-lg',
                                    isLatest
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                      : 'bg-slate-400'
                                  )}
                                >
                                  <StatusIcon
                                    className={cn(
                                      'h-5 w-5',
                                      isLatest ? 'text-white' : 'text-white'
                                    )}
                                  />
                                </div>

                                {/* Timeline Content */}
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
                                          statusConfig[update.status].color,
                                          isLatest && 'ring-2 ring-blue-200'
                                        )}
                                      >
                                        {update.status.replace('_', ' ')}
                                      </Badge>
                                      <span className="text-sm text-slate-500 font-medium">
                                        {new Intl.DateTimeFormat(
                                          'en-IN'
                                        ).format(new Date(update.createdAt))}
                                      </span>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">
                                      {update.note ||
                                        'Status updated with no additional notes.'}
                                    </p>
                                    {update.changedBy && (
                                      <p className="text-xs text-slate-500 mt-2">
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
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <>
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="py-12">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <Search className="h-10 w-10 text-red-400" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-900">
                          Complaint Not Found
                        </h3>
                        <div className="space-y-2">
                          <p className="text-slate-600">
                            We couldn't find a complaint with the tracking ID:
                          </p>
                          <div className="inline-flex items-center bg-slate-100 rounded-lg px-4 py-2">
                            <span className="font-mono font-medium text-slate-800">
                              {trackingId}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500 space-y-1 max-w-md mx-auto">
                          <p>Please verify that:</p>
                          <ul className="text-left space-y-1">
                            <li>• The tracking ID is entered correctly</li>
                            <li>
                              • All characters including dashes are included
                            </li>
                            <li>• The complaint was submitted successfully</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={handleTryAgain}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          Try Another ID
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push('/dashboard/anonymous-complaints')
                          }
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Complaints
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Confidentiality Notice */}
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Your Privacy is Protected
              </AlertTitle>
              <AlertDescription className="text-green-700">
                This tracking system maintains complete anonymity. No personal
                information is stored or displayed. Your complaint is handled
                with the highest level of confidentiality.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  );
}
