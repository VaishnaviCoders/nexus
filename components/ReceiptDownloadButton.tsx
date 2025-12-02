'use client';

import { useTransition } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FeeRecord } from '@/types';
import { FeeReceiptPDF } from '@/lib/pdf-generator/FeeReceiptPDF';
import { pdf } from '@react-pdf/renderer';


interface ReceiptDownloadButtonProps {
  record: FeeRecord;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function ReceiptDownloadButton({
  record,
  variant = 'outline',
  size = 'default',
}: ReceiptDownloadButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      try {
        const pdfDoc = <FeeReceiptPDF feeRecord={record} copyType="STUDENT COPY" />;
        const blob = await pdf(pdfDoc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fee-receipt-${record.student.firstName}-${record.student.lastName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

      } catch (error) {
        toast.error('Failed to generate receipt');
      }
    });
  };



  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isPending ? 'Generating...' : 'Download Receipt'}
    </Button>
  );
}
