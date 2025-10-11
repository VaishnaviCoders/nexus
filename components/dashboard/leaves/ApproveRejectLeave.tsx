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
    <div className=" bg-gray-50 p-8">
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
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Main Card */}

            <Card className=" rounded-[16px] rounded-tr-[62px] bg-white ">
              <CardContent className="p-2">
                <div className="flex items-center gap-3 p-4  ">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Calendar className="w-5 h-5 " />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Leave Requests
                  </h1>
                </div>
                <div className="p-4 pb-0 ">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={currentLeave.appliedBy.profileImage}
                        alt={currentLeave.appliedBy.firstName}
                        className="w-24 h-24 rounded-xl object-cover"
                        width={100}
                        height={100}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={'PENDING_REVIEW'}>
                            {currentLeave.totalDays}{' '}
                            {currentLeave.totalDays === 1 ? 'Day' : 'Days'}
                          </Badge>
                          <span>
                            {currentLeave.appliedBy.student?.grade.grade}{' '}
                            {currentLeave.appliedBy.student?.grade.section
                              .map((section) => section.name)
                              .join(', ')}
                          </span>
                          <h2 className="text-xl font-medium text-gray-900">
                            {currentLeave.appliedBy.firstName}{' '}
                            {currentLeave.appliedBy.lastName}
                          </h2>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{currentLeave.appliedBy.role}</span>
                            <span>
                              {currentLeave.appliedBy.student?.grade.grade}{' '}
                              {currentLeave.appliedBy.student?.grade.section.map(
                                (section) => section.name
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2 rounded-lg ">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          className="!rounded-full w-10 h-10 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                          {currentIndex + 1}/{leaves.length}
                        </span>
                        <Button
                          variant="outline"
                          onClick={handleNext}
                          className="!rounded-full w-10 h-10 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
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
                <div className="p-2 flex items-center gap-3 ">
                  <Button
                    variant={'outline'}
                    onClick={handleSkip}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </Button>
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
