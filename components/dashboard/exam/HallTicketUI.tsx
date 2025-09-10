import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

// Type definitions
interface Student {
  firstName: string;
  lastName: string;
  rollNumber: string;
  profileImage: string;
  grade: { grade: string };
  section: { name: string };
  email: string;
  phoneNumber: string;
}

interface Exam {
  id: string;
  title: string;
  subject: { name: string; code: string };
  startDate: string;
  endDate: string;
  venue: string;
  mode: string;
  durationInMinutes: number;
}

interface Organization {
  name: string;
  organizationLogo: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

interface HallTicketData {
  student: Student;
  examSession: {
    title: string;
    startDate: string;
    endDate: string;
  };
  exams: Exam[];
  organization: Organization;
  hallTicketId: string;
  generatedAt: string;
}

// Mock data - Replace with actual server action call
const mockHallTicketData: HallTicketData = {
  student: {
    firstName: 'John',
    lastName: 'Doe',
    rollNumber: '2024001',
    profileImage:
      'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ycXRnRjRyYzRCS2NTMGNpYlZ5SGxkeDlkcXciLCJyaWQiOiJ1c2VyXzMwWFI0RVRXSDdnNmhFYWw4cDZoZnBCazVBeCIsImluaXRpYWxzIjoiU0sifQ?width=80',
    grade: { grade: '10th' },
    section: { name: 'A' },
    email: 'john.doe@school.com',
    phoneNumber: '+91 9876543210',
  },
  examSession: {
    title: 'Final Examination 2024',
    startDate: '2024-03-15',
    endDate: '2024-03-30',
  },
  exams: [
    {
      id: '1',
      title: 'Mathematics',
      subject: { name: 'Mathematics', code: 'MATH101' },
      startDate: '2024-03-15T09:00:00',
      endDate: '2024-03-15T12:00:00',
      venue: 'Room 101, Block A',
      mode: 'OFFLINE',
      durationInMinutes: 180,
    },
    {
      id: '2',
      title: 'Science',
      subject: { name: 'Science', code: 'SCI101' },
      startDate: '2024-03-17T09:00:00',
      endDate: '2024-03-17T12:00:00',
      venue: 'Room 102, Block A',
      mode: 'OFFLINE',
      durationInMinutes: 180,
    },
    {
      id: '3',
      title: 'English',
      subject: { name: 'English', code: 'ENG101' },
      startDate: '2024-03-19T09:00:00',
      endDate: '2024-03-19T12:00:00',
      venue: 'Room 103, Block B',
      mode: 'OFFLINE',
      durationInMinutes: 180,
    },
  ],
  organization: {
    name: 'Springfield International School',
    organizationLogo:
      'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ycXRnRjRyYzRCS2NTMGNpYlZ5SGxkeDlkcXciLCJyaWQiOiJ1c2VyXzMwWFI0RVRXSDdnNmhFYWw4cDZoZnBCazVBeCIsImluaXRpYWxzIjoiU0sifQ?width=80',
    contactEmail: 'info@springfield.edu',
    contactPhone: '+91 9876543210',
    website: 'www.springfield.edu',
  },
  hallTicketId: 'HT2024001',
  generatedAt: new Date().toISOString(),
};

interface HallTicketProps {
  data: HallTicketData;
}

export default function HallTicketUI({ data }: HallTicketProps) {
  const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hallTicketData, setHallTicketData] =
    useState<HallTicketData>(mockHallTicketData);
  const hallTicketRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateCode();
  }, [codeType]);

  const generateCode = () => {
    const codeData = `${hallTicketData.hallTicketId}-${hallTicketData.student.rollNumber}`;

    if (codeType === 'qr' && qrCodeRef.current) {
      qrCodeRef.current.innerHTML = '';
      // Create QR code using QRCode library
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;

      QRCodeLib.toCanvas(
        canvas,
        codeData,
        {
          width: 128,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
          else qrCodeRef.current?.appendChild(canvas);
        }
      );
    } else if (codeType === 'barcode' && barcodeRef.current) {
      barcodeRef.current.innerHTML = '';
      // Create barcode using canvas
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 60;
      barcodeRef.current.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Simple barcode placeholder (in production, use JsBarcode)
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#000' : '#fff';
        ctx.fillRect(i * 5, 0, 5, 40);
      }
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.fillText(codeData, 50, 55);
    }
  };

  const downloadAsPNG = async () => {
    setIsGenerating(true);
    try {
      const element = hallTicketRef.current;
      if (!element) return;

      // Create canvas from element
      const canvas = document.createElement('canvas');
      const scale = 2; // Higher quality
      canvas.width = element.offsetWidth * scale;
      canvas.height = element.offsetHeight * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(scale, scale);

      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, element.offsetWidth, element.offsetHeight);

      // Note: In production, use html2canvas library
      // For now, we'll trigger a download with a placeholder
      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hallticket_${hallTicketData.student.rollNumber}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error generating PNG:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPDF = () => {
    setIsGenerating(true);
    try {
      // In production, use jsPDF library
      // For now, we'll use the browser's print functionality
      if (!hallTicketRef.current) return;

      const printContent = hallTicketRef.current.innerHTML;
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        alert('Please allow pop-ups to download the PDF');
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Hall Ticket - ${hallTicketData.student.rollNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
                    src={hallTicketData.organization.organizationLogo}
                    alt="School Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-medium tracking-tight">
                    {hallTicketData.organization.name}
                  </h1>
                  <p className="text-zinc-300 text-sm">
                    {hallTicketData.organization.website}
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <Badge className="bg-white/10 text-white hover:bg-white/20 text-sm px-4 py-1.5 font-medium tracking-wider">
                  HALL TICKET
                </Badge>
                <p className="text-xs mt-2 font-mono text-zinc-300">
                  {hallTicketData.hallTicketId}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            {/* Exam Session Info */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-medium text-zinc-900">
                {hallTicketData.examSession.title}
              </h2>
              <p className="text-zinc-500 text-sm mt-2">
                {formatDateIN(hallTicketData.examSession.startDate)} -{' '}
                {formatDateIN(hallTicketData.examSession.endDate)}
              </p>
            </div>

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
                      {hallTicketData.student.firstName}{' '}
                      {hallTicketData.student.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Roll Number
                    </p>
                    <p className="font-medium text-zinc-900">
                      {hallTicketData.student.rollNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Class
                    </p>
                    <p className="font-medium text-zinc-900">
                      {hallTicketData.student.grade.grade} -{' '}
                      {hallTicketData.student.section.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Contact
                    </p>
                    <p className="font-medium text-zinc-900">
                      {hallTicketData.student.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-start gap-6 w-[160px]">
                <div className="w-36 h-44 border border-zinc-200 rounded-lg overflow-hidden shadow-sm bg-white">
                  <img
                    src={hallTicketData.student.profileImage}
                    alt="Student Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  ref={codeType === 'qr' ? qrCodeRef : barcodeRef}
                  className="w-36 h-36 border border-zinc-200 rounded-lg p-3 shadow-sm bg-white flex items-center justify-center"
                />
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
                    {hallTicketData.exams.map((exam, index) => (
                      <tr
                        key={exam.id}
                        className="hover:bg-zinc-50 border-b border-zinc-200 last:border-b-0"
                      >
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="font-medium text-zinc-900">
                              {exam.subject.name}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {exam.subject.code}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-zinc-900">
                          {formatDateIN(exam.startDate)}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-900">
                          {formatDateTimeIN(exam.startDate)} -{' '}
                          {formatDateTimeIN(exam.endDate)}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-900">
                          {exam.venue}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-900">
                          {exam.durationInMinutes} mins
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator className="my-8 bg-zinc-100" />

            {/* Instructions */}
            <div className="space-y-4 bg-gradient-to-r from-zinc-50 to-zinc-100 p-5 rounded-lg border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Info className="h-5 w-5 text-zinc-600" />
                <h3 className="font-medium text-sm text-zinc-900 uppercase tracking-wide">
                  Important Instructions
                </h3>
              </div>
              <ol className="list-decimal list-outside ml-6 space-y-2.5 text-sm text-zinc-700">
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
                {new Date(hallTicketData.generatedAt).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-zinc-500">
                For support, contact: {hallTicketData.organization.contactEmail}{' '}
                | {hallTicketData.organization.contactPhone}
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
