'use client';
import React, { useState, useTransition } from 'react';
import {
  Calendar,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { formatDateTimeIN } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prisma } from '@/generated/prisma/client';
import {
  approveLeaveAction,
  rejectLeaveAction,
} from '@/lib/data/leave/create-leave';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/EmptyState';
import { toast } from 'sonner';

type LeaveWithUser = Prisma.LeaveGetPayload<{
  include: {
    appliedBy: {
      select: {
        firstName: true;
        lastName: true;
        profileImage: true;
        role: true;
        student: {
          select: {
            grade: {
              select: {
                grade: true;
                section: { select: { name: true } };
              };
            };
          };
        };
      };
    };
  };
}>;

interface ApproveRejectLeaveProps {
  leaves: LeaveWithUser[];
}

const ApproveRejectLeave = ({ leaves }: ApproveRejectLeaveProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [isPending, startTransition] = useTransition();

  const currentLeave = leaves[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : leaves.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < leaves.length - 1 ? prev + 1 : 0));
  };

  const handleApprove = async () => {
    startTransition(async () => {
      try {
        await approveLeaveAction({ leaveId: currentLeave.id });
        // Navigate to next leave or first if this was the last
        toast.success('Leave approved successfully');

        handleNext();
      } catch (error) {
        console.error('Failed to approve leave:', error);
        // Consider showing a toast notification here
        toast.error('Failed to approve leave');
      }
    });
  };
  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    startTransition(async () => {
      await rejectLeaveAction({
        leaveId: currentLeave.id,
        rejectedNote: rejectNote,
      });
      // API call to reject leave with note
      setShowRejectModal(false);
      setRejectNote('');
    });
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="">
      {leaves.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <EmptyState
            title="No Leave Requests Found"
            description="There are currently no leave requests to display.
  Please check back later."
            icons={[Calendar, FileText, AlertCircle]}
            action={{
              label: 'Back to Dashboard',
              href: '/dashboard',
            }}
          />
        </div>
      ) : (
        <>
          <div className="max-w-2xl mx-auto space-y-3 ">
            {/* Main Card */}
            <Card className="rounded-2xl rounded-tr-[62px] overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-b border-red-100/50">
                  <div className="flex items-center justify-between p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl shadow-lg shadow-red-200/50">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                          Leave Requests
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                          Review and manage leave applications
                        </p>
                      </div>
                    </div>


                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Profile Section */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className='flex justify-between'>
                      {/* Profile Image */}
                      <div className="relative group shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                          <Image
                            src={currentLeave.appliedBy.profileImage}
                            alt={currentLeave.appliedBy.firstName}
                            className="w-full h-full rounded-2xl object-cover ring-4 ring-slate-100 group-hover:ring-red-100 transition-all"
                            width={96}
                            height={96}
                          />
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-slate-100">
                            <Badge
                              variant="PENDING_REVIEW"
                              className="text-xs font-semibold px-2 py-0.5"
                            >
                              {currentLeave.totalDays}d
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Pagination - Mobile */}
                      <div className="sm:hidden mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="rounded-full w-9 h-9 p-0 hover:bg-white disabled:opacity-40"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-sm font-semibold text-gray-700 min-w-[4rem] text-center">
                            {currentIndex + 1} of {leaves.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNext}
                            disabled={currentIndex === leaves.length - 1}
                            className="rounded-full w-9 h-9 p-0 hover:bg-white disabled:opacity-40"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>


                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                      {/* Name and Role */}
                      <div className="mb-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                          {currentLeave.appliedBy.firstName} {currentLeave.appliedBy.lastName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Badge variant="outline" className="font-medium capitalize">
                            {currentLeave.appliedBy.role}
                          </Badge>
                          {currentLeave.appliedBy.student && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 font-medium">
                                Grade {currentLeave.appliedBy.student.grade.grade}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">
                                Section {currentLeave.appliedBy.student.grade.section
                                  .map((section) => section.name)
                                  .join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Leave Duration Badge */}
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 rounded-xl px-4 py-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {currentLeave.totalDays} {currentLeave.totalDays === 1 ? 'Day' : 'Days'} Leave
                        </span>
                      </div>
                    </div>
                    {/* Pagination - Desktop */}
                    <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-white/60">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="rounded-full w-8 h-8 p-0 hover:bg-red-100 disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-center px-2">
                        {currentIndex + 1} / {leaves.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNext}
                        disabled={currentIndex === leaves.length - 1}
                        className="rounded-full w-8 h-8 p-0 hover:bg-red-100 disabled:opacity-40"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Details Section */}
            <Card>
              <CardContent className="p-4">
                <div className="bg-red-50 rounded-2xl p-4">
                  <div className="mb-4">
                    <div className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded mb-3">
                      {currentLeave.type.toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentLeave.totalDays} Day
                      {currentLeave.totalDays !== 1 ? 's' : ''} Leave Request
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentLeave.reason}
                    </p>
                  </div>

                  {/* Leave Info Grid */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                      <div className="text-xs text-gray-600 mb-1 font-medium">
                        Start Date
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDateTimeIN(currentLeave.startDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1 font-medium">
                        End Date
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDateTimeIN(currentLeave.endDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1 font-medium">
                        Applied on
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDateTimeIN(currentLeave.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mt-4 pt-4 border-t border-red-100">
                    <div className="text-xs text-gray-600 mb-1 font-medium">
                      Emergency Contact
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {currentLeave.emergencyContact}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-2 flex items-center gap-10">
                  <Button
                    variant={'outline'}
                    onClick={handleSkip}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </Button>
                  <div className='flex items-center justify-between space-x-3 w-full'>
                    <Button
                      variant={'outline'}
                      onClick={handleReject}
                      className="flex-1 px-6 py-3 border-2 hover:text-red-600 border-red-200 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </Button>
                    <Button
                      variant={'outline'}
                      onClick={handleApprove}
                      className="flex-1 px-6 py-3 hover:text-green-600 bg-green-100 rounded-xl text-green-500 font-semibold hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {isPending ? 'Approving' : 'Approve'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* reject Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Reject Leave Request
                </h3>
                <p className="text-gray-600 mb-4">
                  Please provide a reason for declining this leave request:
                </p>
                <Textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Enter reason for declining..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-3">
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectNote('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmReject}
                    disabled={!rejectNote.trim()}
                    className="flex-1 px-4 py-3 bg-red-600 rounded-xl text-white font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isPending ? 'Rejecting' : 'Confirm Reject'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApproveRejectLeave;
