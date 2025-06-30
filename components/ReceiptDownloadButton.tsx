'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateReceiptPDF } from '@/lib/data/generate-receipt';

interface ReceiptDownloadButtonProps {
  paymentId: string;
  receiptNumber?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function ReceiptDownloadButton({
  paymentId,
  receiptNumber,
  variant = 'outline',
  size = 'default',
}: ReceiptDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      const result = await generateReceiptPDF(paymentId);

      if (result.success && result.pdf) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.pdf;
        link.download = result.filename || `receipt-${receiptNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Receipt downloaded successfully!');
      } else {
        toast.error(result.error || 'Failed to generate receipt');
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? 'Generating...' : 'Download Receipt'}
    </Button>
  );
}
