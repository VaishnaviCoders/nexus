'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  MapPin,
  Clock,
  Calendar,
  User,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { formatDateIN } from '../utils';
// import { QRCodeSVG } from "qrcode.react"

// Types based on Prisma schema
interface HallTicketStudent {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  rollNumber: string;
  profileImage?: string | null;
  dateOfBirth: Date;
  grade: {
    id: string;
    grade: string;
  };
  section: {
    id: string;
    name: string;
  };
  user: {
    email: string;
    phoneNumber?: string | null;
  };
}

interface HallTicketOrganization {
  id: string;
  name?: string | null;
  organizationLogo?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  website?: string | null;
}

interface HallTicketExamSession {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
}

interface HallTicketExam {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  durationInMinutes?: number | null;
  venue?: string | null;
  maxMarks: number;
  subject: {
    id: string;
    name: string;
    code: string;
  };
}

interface HallTicketData {
  id: string;
  studentId: string;
  examId?: string | null;
  examSessionId?: string | null;
  pdfUrl: string;
  qrCode?: string | null;
  generatedAt: Date;
  downloadedAt?: Date | null;
  expiryDate?: Date | null;
  organizationId: string;
  student: HallTicketStudent;
  exam?: HallTicketExam | null;
  examSession?: HallTicketExamSession | null;
  organization: HallTicketOrganization;
}

interface HallTicketPDFProps {
  hallTicketData: HallTicketData;
  onDownloadPDF?: () => void;
  className?: string;
}

export function HallTicketPDF({
  hallTicketData,
  onDownloadPDF,
  className = '',
}: HallTicketPDFProps) {
  // Validation and error handling
  if (!hallTicketData) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Error Loading Hall Ticket
            </h2>
            <p className="text-sm text-muted-foreground">
              No hall ticket data available. Please contact the administration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validate required fields
  if (!hallTicketData.student || !hallTicketData.organization) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Invalid Hall Ticket Data
            </h2>
            <p className="text-sm text-muted-foreground">
              Hall ticket data is incomplete. Please contact the administration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to format duration
  const formatDuration = (minutes: number | null | undefined): string => {
    if (!minutes) return 'As per schedule';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const handleDownloadPDF = async () => {
    if (onDownloadPDF) {
      onDownloadPDF();
    } else {
      // Fallback: This would typically call a server action to generate PDF
      console.log('Downloading PDF...');
      alert('PDF download would be triggered here via server action');
    }
  };

  const handlePrint = () => {};

  return (
    <div className={`min-h-screen bg-muted/30 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons - Hidden in print */}
        <div className="no-print mb-6 flex gap-4 justify-center">
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="gap-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            Print
          </Button>
        </div>

        {/* Hall Ticket Card */}
        <Card className="print-page bg-background shadow-lg">
          <CardContent className="p-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={
                    hallTicketData.organization.organizationLogo ||
                    '/placeholder.svg'
                  }
                  alt="Organization Logo"
                  className="h-16 w-16 object-contain"
                />
                <div>
                  <h1 className="text-2xl font-bold text-primary">
                    {hallTicketData.organization.name || 'Organization Name'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {hallTicketData.organization.website ||
                      'Organization Website'}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-background p-3 rounded-lg border border-border">
                  {/* <QRCodeSVG
                    value={hallTicketData.qrCode || ''}
                    size={80}
                    level="M"
                    includeMargin={false}
                  /> */}
                </div>
                <p className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded mt-2">
                  Scan for Verification
                </p>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Exam Session Title */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-primary mb-2">
                {hallTicketData.examSession?.title ||
                  hallTicketData.exam?.title ||
                  'Examination'}
              </h2>
              <p className="text-muted-foreground">
                {hallTicketData.examSession?.startDate &&
                hallTicketData.examSession?.endDate
                  ? `${formatDateIN(hallTicketData.examSession.startDate.toISOString())} - ${formatDateIN(hallTicketData.examSession.endDate.toISOString())}`
                  : hallTicketData.exam?.startDate &&
                      hallTicketData.exam?.endDate
                    ? `${formatDateIN(hallTicketData.exam.startDate.toISOString())} - ${formatDateIN(hallTicketData.exam.endDate.toISOString())}`
                    : 'Examination Dates'}
              </p>
            </div>

            {/* Student Information Section */}
            <div className="grid  gap-8 mb-8 ">
              <div className="md:col-span-2">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 flex flex-row justify-between">
                    <div className="">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Student Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Student Name
                          </p>
                          <p className="font-semibold text-card-foreground">
                            {hallTicketData.student.firstName}{' '}
                            {hallTicketData.student.lastName}
                            {hallTicketData.student.middleName &&
                              ` ${hallTicketData.student.middleName}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Roll Number
                          </p>
                          <p className="font-semibold text-card-foreground">
                            {hallTicketData.student.rollNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Grade & Section
                          </p>
                          <p className="font-semibold text-card-foreground">
                            {hallTicketData.student.grade.grade} -{' '}
                            {hallTicketData.student.section.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-semibold text-card-foreground">
                            {hallTicketData.student.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={
                          hallTicketData.student.profileImage ||
                          '/placeholder.svg'
                        }
                        alt="Student Photo"
                        className="h-32 w-28 object-cover rounded"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student Photo */}
            </div>

            {/* Exam Schedule Table */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Examination Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-semibold text-card-foreground">
                          Subject
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-card-foreground">
                          Date
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-card-foreground">
                          Time
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-card-foreground">
                          Duration
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-card-foreground">
                          Venue
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hallTicketData.exam ? (
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-2 text-foreground text-sm whitespace-nowrap">
                            {hallTicketData.exam.subject.name}
                          </td>
                          <td className="py-3 px-2 flex items-center gap-1 text-foreground text-sm whitespace-nowrap">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDateIN(
                              hallTicketData.exam.startDate.toISOString()
                            )}
                          </td>
                          <td className="py-3 px-2 text-foreground text-sm whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {new Date(
                                hallTicketData.exam.startDate
                              ).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}{' '}
                              -{' '}
                              {new Date(
                                hallTicketData.exam.endDate
                              ).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground text-sm">
                            {formatDuration(
                              hallTicketData.exam.durationInMinutes
                            )}
                          </td>
                          <td className="py-3 px-2 text-muted-foreground text-sm">
                            {hallTicketData.exam.venue || 'To be announced'}
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-4 px-2 text-center text-muted-foreground"
                          >
                            No specific exam details available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mb-8 bg-yellow-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Students must carry this hall ticket and a valid photo ID
                    to the examination hall
                  </li>
                  <li>
                    • Report to the examination venue 30 minutes before the
                    scheduled time
                  </li>
                  <li>
                    • Mobile phones and electronic devices are strictly
                    prohibited
                  </li>
                  <li>• Use of unfair means will result in disqualification</li>
                  <li>• Follow all COVID-19 safety protocols as applicable</li>
                </ul>
              </CardContent>
            </Card>

            {/* Footer Section */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Generated on:{' '}
                  {formatDateIN(hallTicketData.generatedAt.toISOString())}
                </p>
                <p className="text-sm text-muted-foreground">
                  Hall Ticket ID: {hallTicketData.id}
                </p>
                {hallTicketData.expiryDate && (
                  <p className="text-sm text-muted-foreground">
                    Valid until:{' '}
                    {formatDateIN(hallTicketData.expiryDate.toISOString())}
                  </p>
                )}
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">
                    Contact Information:
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hallTicketData.organization.contactPhone || 'N/A'} |{' '}
                    {hallTicketData.organization.contactEmail || 'N/A'}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <div className="bg-background p-3 rounded-lg border border-border">
                  {/* <QRCodeSVG
                    value={hallTicketData.qrCode || ''}
                    size={80}
                    level="M"
                    includeMargin={false}
                  /> */}
                </div>
                <p className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded mt-2">
                  Principal Signature
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Default export for convenience
export default HallTicketPDF;
