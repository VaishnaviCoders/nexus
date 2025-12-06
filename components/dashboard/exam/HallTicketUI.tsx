'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  FileText,
  Image,
  QrCode,
  Barcode,
  Printer,
  Info,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateIN, formatDateTimeIN } from '@/lib/utils';
import QRCodeLib from 'qrcode';
import { Prisma } from '@/generated/prisma/client';

type StudentHallTicketData = Prisma.HallTicketGetPayload<{
  select: {
    generatedAt: true;
    pdfUrl: true;
    qrCode: true;
    expiryDate: true;
    organization: {
      select: {
        name: true;
        logo: true;
        contactEmail: true;
        contactPhone: true;
        website: true;
      };
    };
    student: {
      select: {
        firstName: true;
        lastName: true;
        rollNumber: true;
        profileImage: true;
        grade: { select: { grade: true } };
        section: { select: { name: true } };
        email: true;
        phoneNumber: true;
      };
    };
    examSession: {
      select: {
        title: true;
        startDate: true;
        endDate: true;
      };
    };
    exam: {
      select: {
        id: true;
        title: true;
        subject: { select: { name: true; code: true } };
        startDate: true;
        endDate: true;
        venue: true;
        mode: true;
        durationInMinutes: true;
      };
    };
  };
}>;

interface HallTicketUIProps {
  data: StudentHallTicketData;
}

export default function HallTicketUI({ data }: HallTicketUIProps) {
  const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const hallTicketRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

  const generateCode = () => { };

  const downloadAsPNG = async () => { };

  const downloadAsPDF = () => { };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Controls */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-medium text-zinc-900">
                Hall Ticket Generator
              </h2>
              <div className="flex flex-wrap gap-3">
                <Select
                  value={codeType}
                  onValueChange={(value: 'qr' | 'barcode') =>
                    setCodeType(value)
                  }
                >
                  <SelectTrigger className="w-40 bg-white border-zinc-200 text-sm">
                    <SelectValue placeholder="Code Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        QR Code
                      </div>
                    </SelectItem>
                    <SelectItem value="barcode">
                      <div className="flex items-center gap-2">
                        <Barcode className="w-4 h-4" />
                        Barcode
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={downloadAsPNG}
                  disabled={isGenerating}
                  variant="outline"
                  className="text-sm bg-white border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <Button
                  onClick={downloadAsPDF}
                  disabled={isGenerating}
                  className="text-sm bg-black hover:bg-zinc-800 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Hall Ticket */}
        <Card
          ref={hallTicketRef}
          className="bg-white shadow-md border-none overflow-hidden print:shadow-none"
        >
          <div className="bg-gradient-to-r from-black to-zinc-800 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-full p-1 flex items-center justify-center shadow-md">
                  <img
                    src={
                      data.organization.logo ||
                      '/image/organization.png'
                    }
                    alt="School Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-medium tracking-tight">
                    {data.organization.name}
                  </h1>
                  <p className="text-zinc-300 text-sm">
                    {data.organization.website}
                  </p>
                </div>
              </div>
              <div
                ref={codeType === 'qr' ? qrCodeRef : barcodeRef}
                className="w-36 h-36 border border-zinc-200 rounded-lg p-3 shadow-sm bg-white flex items-center justify-center"
              />
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            {/* Exam Session Info */}
            {data.examSession && (
              <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-zinc-900">
                  {data.examSession.title}
                </h2>
                <p className="text-zinc-500 text-sm mt-2">
                  {formatDateIN(data.examSession.startDate)} -{' '}
                  {formatDateIN(data.examSession.endDate)}
                </p>
              </div>
            )}

            <Separator className="mb-8 bg-zinc-100" />

            {/* Student Details */}
            <div className="grid md:grid-cols-[1fr,auto] gap-8 mb-8">
              <div className="space-y-6">
                <h3 className="font-medium text-sm text-zinc-900 uppercase tracking-wide">
                  Student Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Name
                    </p>
                    <p className="font-medium text-zinc-900">
                      {data.student.firstName} {data.student.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Roll Number
                    </p>
                    <p className="font-medium text-zinc-900">
                      {data.student.rollNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Class
                    </p>
                    <p className="font-medium text-zinc-900">
                      {data.student.grade.grade} - {data.student.section.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Contact
                    </p>
                    <p className="font-medium text-zinc-900">
                      {data.student.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-start gap-6 w-[160px]">
                <div className="w-36 h-44 border border-zinc-200 rounded-lg overflow-hidden shadow-sm bg-white">
                  <img
                    src={data.student.profileImage || '/images/avatar.png'}
                    alt="Student Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <Separator className="mb-8 bg-zinc-100" />

            {/* Exam Schedule */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-zinc-900 uppercase tracking-wide mb-4">
                Examination Schedule
              </h3>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 shadow-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
                      <th className="px-4 py-3.5 text-left font-medium border-b border-zinc-200">
                        Subject
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium border-b border-zinc-200">
                        Date
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium border-b border-zinc-200">
                        Time
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium border-b border-zinc-200">
                        Venue
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium border-b border-zinc-200">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.exam && (
                      <tr
                        key={data.exam.id}
                        className="hover:bg-zinc-50 border-b border-zinc-200 last:border-b-0"
                      >
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="font-medium text-zinc-900">
                              {data.exam.subject?.name}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {data.exam.subject?.code}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-zinc-900 truncate">
                          {formatDateTimeIN(data.exam.startDate)} -{' '}
                          {formatDateTimeIN(data.exam.endDate)}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-900">
                          {data.exam.venue}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-900">
                          {data.exam.durationInMinutes} mins
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator className="my-8 bg-zinc-100" />

            {/* Instructions */}

            {/* For Print use text color zinc */}
            <div className="space-y-4 bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-sm text-blue-900 uppercase tracking-wide">
                  Important Instructions
                </h3>
              </div>
              <ol className="list-decimal list-outside ml-6 space-y-2.5 text-sm text-blue-700">
                <li>
                  Candidates must carry this hall ticket to the examination
                  hall.
                </li>
                <li>
                  Candidates should report 30 minutes before the exam time.
                </li>
                <li>
                  Electronic devices are strictly prohibited in the examination
                  hall.
                </li>
                <li>
                  Candidates must carry a valid photo ID proof along with this
                  hall ticket.
                </li>
                <li>Any form of malpractice will lead to disqualification.</li>
              </ol>
            </div>

            <Separator className="my-8 bg-zinc-100" />

            {/* Signature Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="h-16 border-b border-zinc-300 mb-3"></div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Student Signature
                </p>
              </div>
              <div className="text-center">
                <div className="h-16 border-b border-zinc-300 mb-3"></div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Invigilator Signature
                </p>
              </div>
              <div className="text-center">
                <div className="h-16 border-b border-zinc-300 mb-3"></div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Controller of Examination
                </p>
              </div>
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="bg-zinc-50 px-6 md:px-8 py-5 text-center border-t border-zinc-200">
            <div className="w-full space-y-2">
              <p className="text-xs text-zinc-500">
                Generated on:{' '}
                {new Date(data.generatedAt).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-zinc-500">
                For support, contact: {data.organization.contactEmail} |{' '}
                {data.organization.contactPhone}
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Info Alert */}
        <Alert className="bg-zinc-50 border border-zinc-200 text-zinc-700 shadow-sm">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-zinc-500 mt-0.5" />
            <AlertDescription className="text-xs">
              This is a preview of the hall ticket. In production, data will be
              fetched using server actions from your Prisma database. The QR
              code is generated using the qrcode.js library. For barcode
              generation, consider installing JsBarcode.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
}
