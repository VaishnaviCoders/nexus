'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Receipt,
  Calendar,
  CreditCard,
  Hash,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  Slash,
} from 'lucide-react';
import { formatCurrencyIN, formatDateIN } from '@/lib/utils';
import { PaymentStatus } from '@/lib/generated/prisma';
import { generateReceiptPDF } from '@/lib/data/generate-receipt';

interface PaymentData {
  id: string;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: string;
  receiptNumber: string;
  note: string;
  transactionId: string | null;
  payerId: string;
  feeId: string;
  platformFee: number | null; // percentage
  status: PaymentStatus;
  recordedBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  payer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface FeeReceiptCardProps {
  receiptData: PaymentData;
}

export function FeeReceiptCard({ receiptData }: FeeReceiptCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const calculatePlatformFee = () => {
    return receiptData.platformFee ?? 0;
  };

  const getNetAmount = () => {
    return receiptData.amountPaid + calculatePlatformFee();
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'UNPAID':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'REFUNDED':
        return <RefreshCcw className="w-4 h-4 text-blue-500" />;
      case 'CANCELLED':
        return <Slash className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'verified'; // Green ✅
      case 'UNPAID':
        return 'rejected'; // Red ❌
      case 'PENDING':
        return 'pending'; // Yellow ⏳
      case 'FAILED':
        return 'rejected'; // Red ❌
      case 'REFUNDED':
        return 'meta'; // Blue 🔁
      case 'CANCELLED':
        return 'outline'; // Grey 🚫
      default:
        return 'outline'; // fallback
    }
  };

  // const handleDownload = async () => {
  //   setIsDownloading(true);
  //   try {
  //     const response = await generateReceiptPDF(receiptData.feeId);

  //     if (response) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.style.display = 'none';
  //       a.href = url;
  //       a.download = `receipt-${receiptData.receiptNumber}.pdf`;
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //     }
  //   } catch (error) {
  //     console.error('Error downloading receipt:', error);
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Payment Receipt
              </h2>
            </div>
            <p className="text-sm text-slate-500">Transaction confirmation</p>
          </div>
          <Badge
            variant={getStatusBadgeVariant(receiptData.status)}
            className="flex items-center gap-1"
          >
            {getStatusIcon(receiptData.status)}
            {receiptData.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Amount Section */}
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {formatCurrencyIN(receiptData.amountPaid)}
          </div>
          <p className="text-sm text-slate-500">Total Amount</p>
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Hash className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Receipt Number
                </p>
                <p className="text-sm font-mono text-slate-900 break-all">
                  {receiptData.receiptNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Payment Date
                </p>
                <p className="text-sm text-slate-900">
                  {formatDateIN(receiptData.paymentDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Payment Method
                </p>
                <p className="text-sm text-slate-900">
                  {receiptData.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Receipt className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Transaction ID
                </p>
                <p className="text-sm font-mono text-slate-900">
                  {receiptData.transactionId || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Payer Name
                </p>
                <p className="text-sm font-mono text-slate-900 break-all">
                  {receiptData?.payer?.firstName ?? 'N/A'}{' '}
                  {receiptData?.payer?.lastName ?? ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Organization Id
                </p>
                <p className="text-sm font-mono text-slate-900 break-all">
                  {receiptData.organizationId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Breakdown */}
        {receiptData.platformFee && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900">
                Amount Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Gross Amount</span>
                  <span className="font-medium">
                    {formatCurrencyIN(receiptData.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Convenience Charge </span>
                  <span className="font-medium">
                    {formatCurrencyIN(calculatePlatformFee())}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Net Amount</span>
                  <span>{formatCurrencyIN(getNetAmount())}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Note */}
        {receiptData.note && (
          <>
            <Separator />
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> {receiptData.note}
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <Separator />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-1">
            <p>Created: {formatDateIN(receiptData.createdAt)}</p>
            <p>Updated: {formatDateIN(receiptData.updatedAt)}</p>
          </div>

          {/* <Button
            onClick={handleDownload}
            disabled={isDownloading}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </Button> */}
        </div>
      </div>
    </div>
  );
}
