'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { AlertTriangle, Lock, Search, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TrackFormPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Hydration-safe read of query param
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingId(id);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = trackingId.trim();

    if (!trimmedId) {
      setError('Please enter a valid Tracking ID');
      return;
    }
    setSearchAttempted(false);
    setIsSearching(true);
    setError('');

    router.push(`/dashboard/anonymous-complaints/track/${trimmedId}`);
  };

  return (
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
          Enter your tracking ID to securely check the status and updates of
          your anonymous complaint.
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
            Enter the tracking ID you received when submitting your complaint.
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

      {/* Confidentiality Notice */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600 " />
        <AlertTitle className="text-green-800">
          Your Privacy is Protected
        </AlertTitle>
        <AlertDescription className="text-green-700">
          This tracking system maintains complete anonymity. No personal
          information is stored or displayed. Your complaint is handled with the
          highest level of confidentiality.
        </AlertDescription>
      </Alert>
    </div>
  );
}
