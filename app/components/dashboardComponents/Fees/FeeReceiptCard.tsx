'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  Code,
  Copy,
  Download,
  Facebook,
  Instagram,
  Link,
  Mail,
  Share2,
  Twitter,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
// import {
//   RiCodeFill,
//   RiFacebookFill,
//   RiMailLine,
//   RiTwitterXFill,
// } from '@remixicon/react';
import { useId, useRef } from 'react';

interface ReceiptData {
  receiptNumber: string;
  studentName: string;
  rollNumber: string;
  feeCategory: string;
  totalAmount: string;
  paidAmount: string;
  pendingAmount: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  payerName: string;
  organizationName: string;
}

export default function FeeReceiptCard() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const receiptData = {
    receiptNumber: 'REC-12345',
    studentName: 'John Doe',
    rollNumber: 'STU123',
    feeCategory: 'Yearly Fee',
    totalAmount: '₹10,000',
    paidAmount: '₹8,000',
    pendingAmount: '₹2,000',
    paymentDate: 'April 20, 2025',
    paymentMethod: 'UPI',
    transactionId: 'TXN789123',
    payerName: 'Jane Doe',
    organizationName: 'Springfield School',
  };

  // const handleCopy = () => {
  //   if (copied) return;
  //   navigator.clipboard.writeText(receiptData.receiptNumber);
  //   setCopied(true);
  // };

  const handleDownload = async () => {
    setIsGeneratingPdf(true);

    // Mock PDF generation delay
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsGeneratingPdf(false);
    // toast({
    //   title: 'Receipt Downloaded',
    //   description: 'Your receipt has been downloaded successfully.',
    // });

    toast.success('Receipt Downloaded');
  };

  const handleShare = (method: 'email' | 'whatsapp') => {
    // Mock share functionality
    // toast({
    //   title: `Receipt Shared via ${method === 'email' ? 'Email' : 'WhatsApp'}`,
    //   description: `Your receipt has been shared via ${
    //     method === 'email' ? 'Email' : 'WhatsApp'
    //   }.`,
    // });
    // setIsShareDialogOpen(false);
  };

  const id = useId();
  // const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="flex items-center justify-center pb-2">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-center">
          {receiptData.organizationName}
        </h2>
        <p className="text-gray-500 text-center">Official Fee Receipt</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">
              Receipt #{receiptData.receiptNumber}
            </h3>
            <span className="text-sm text-gray-500">
              {receiptData.paymentDate}
            </span>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="font-medium">{receiptData.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Roll Number</p>
              <p className="font-medium">{receiptData.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fee Category</p>
              <p className="font-medium">{receiptData.feeCategory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">{receiptData.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-medium">{receiptData.transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payer Name</p>
              <p className="font-medium">{receiptData.payerName}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium">{receiptData.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paid Amount</span>
              <span className="font-medium text-green-600">
                {receiptData.paidAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Amount</span>
              <span className="font-medium text-amber-600">
                {receiptData.pendingAmount}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Status</span>
              <span className="font-semibold text-amber-600">
                Partially Paid
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="w-full sm:w-auto"
          onClick={handleDownload}
          disabled={isGeneratingPdf}
        >
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingPdf ? 'Generating PDF...' : 'Download Receipt'}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Share2 className="mr-2 h-4 w-4" />
              Share Receipt
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="flex flex-col gap-3 text-center">
              <div className="text-sm font-medium mt-3"></div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="icon" variant="outline" aria-label="Embed">
                  <Code size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Share via email"
                >
                  <Mail size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    id={id}
                    className="pe-9"
                    type="text"
                    defaultValue={`/dashboard/fees/receipt/${receiptData.receiptNumber}`}
                    aria-label="Share link"
                    readOnly
                  />
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleCopy}
                          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                          disabled={copied}
                        >
                          <div
                            className={cn(
                              'transition-all',
                              copied
                                ? 'scale-100 opacity-100'
                                : 'scale-0 opacity-0'
                            )}
                          >
                            <Check
                              className="stroke-emerald-500"
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </div>
                          <div
                            className={cn(
                              'absolute transition-all',
                              copied
                                ? 'scale-0 opacity-0'
                                : 'scale-100 opacity-100'
                            )}
                          >
                            <Copy
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs">
                        Copy to clipboard
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}
