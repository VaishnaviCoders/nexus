'use client';

import React, { useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  Calendar,
  IndianRupee,
  Activity,
  BarChart3,
  Users,
  Sparkles,
  AlertCircle,
  TrendingDown,
  Award,
  Target,
  PieChart,
} from 'lucide-react';
// import { generateAISummaryOpenRouter } from '@/ai/ai-monthly-fee-report';
// import { mockMonthlyFeeCollectionData } from '@/constants';
import { generateAiMonthlyFeesReportAction } from '@/ai/gemini-monthly-fee-report';
import AIStateLoading from '@/components/websiteComp/AILoadingState';

interface MonthlyData {
  month: string;
  amount: number;
  count: number;
  formattedAmount: string;
  percentage: number;
}

interface ParsedSummary {
  monthlyData: MonthlyData[];
  totalAmount: number;
  totalPayments: number;
  averagePerMonth: number;
  averagePerPayment: number;
  bestMonth: MonthlyData | null;
  worstMonth: MonthlyData | null;
  rawText: string;
  parsingSuccess: boolean;
}

interface Data {
  year: number;
  month: number;
  amount: number;
  count: number;
}

interface AiMonthlyReportProps {
  data: Data[];
}

const AiMonthlyReport: React.FC<AiMonthlyReportProps> = ({ data }) => {
  const [summary, setSummary] = React.useState<string>('');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const mockSummary = `In the provided school fee data for 12 months:

  1. January collected ₹1005,000 from 51 payments
  2. February collected ₹85,000 from 38 payments
  3. March collected ₹110,000 from 55 payments
  4. April collected ₹75,000 from 32 payments
  5. May collected ₹65,000 from 28 payments
  6. June collected ₹90,000 from 41 payments
  7. July collected ₹100,000 from 47 payments
  8. August collected ₹115,000 from 53 payments
  9. September collected ₹95,000 from 44 payments
  10. October collected ₹8,000 from 36 payments
  11. November collected ₹120,000 from 58 payments
  12. December collected ₹95,000 from 42 payments
  
  The total amount collected for the year was ₹1,150,000. The total number of payments made during the year was 600. There was an average of approximately 50 payments per month.`;

  // Enhanced parsing function with multiple strategies
  const parseSummary = (summaryText: string): ParsedSummary => {
    const monthlyData: MonthlyData[] = [];
    let totalAmount = 0;
    let totalPayments = 0;
    let parsingSuccess = false;
    let bestMonth: MonthlyData | null = null;
    let worstMonth: MonthlyData | null = null;

    try {
      // Strategy 1: Parse numbered list format
      const numberedPattern =
        /(\d+)\.\s*([A-Za-z]+)\s+collected\s+₹([\d,]+)\s+from\s+(\d+)\s+payments?/gi;
      let match;

      while ((match = numberedPattern.exec(summaryText)) !== null) {
        const month = match[2];
        const amount = Number.parseInt(match[3].replace(/,/g, ''));
        const count = Number.parseInt(match[4]);

        monthlyData.push({
          month,
          amount,
          count,
          formattedAmount: `₹${amount.toLocaleString('en-IN')}`,
          percentage: 0, // Will be calculated later
        });
        parsingSuccess = true;
      }

      // Strategy 2: Parse colon-separated format
      if (monthlyData.length === 0) {
        const colonPattern =
          /([A-Za-z]+):\s*₹([\d,]+)\s+collected\s+from\s+(\d+)\s+payments?/gi;

        while ((match = colonPattern.exec(summaryText)) !== null) {
          const month = match[1];
          const amount = Number.parseInt(match[2].replace(/,/g, ''));
          const count = Number.parseInt(match[3]);

          monthlyData.push({
            month,
            amount,
            count,
            formattedAmount: `₹${amount.toLocaleString('en-IN')}`,
            percentage: 0,
          });
          parsingSuccess = true;
        }
      }

      // Strategy 3: Parse alternative formats
      if (monthlyData.length === 0) {
        const altPattern =
          /([A-Za-z]+)[:\-\s]+₹?([\d,]+)[^\d]*(\d+)\s*payments?/gi;

        while ((match = altPattern.exec(summaryText)) !== null) {
          const month = match[1];
          const amount = Number.parseInt(match[2].replace(/,/g, ''));
          const count = Number.parseInt(match[3]);

          if (amount > 1000 && count > 0) {
            // Basic validation
            monthlyData.push({
              month,
              amount,
              count,
              formattedAmount: `₹${amount.toLocaleString('en-IN')}`,
              percentage: 0,
            });
            parsingSuccess = true;
          }
        }
      }

      // Extract totals
      const totalAmountMatch = summaryText.match(/total amount.*?₹?([\d,]+)/i);
      const totalPaymentsMatch =
        summaryText.match(/total.*?payments.*?(\d+)/i) ||
        summaryText.match(/(\d+).*?total.*?payments/i);

      if (totalAmountMatch) {
        totalAmount = Number.parseInt(totalAmountMatch[1].replace(/,/g, ''));
      } else {
        totalAmount = monthlyData.reduce((sum, month) => sum + month.amount, 0);
      }

      if (totalPaymentsMatch) {
        totalPayments = Number.parseInt(totalPaymentsMatch[1]);
      } else {
        totalPayments = monthlyData.reduce(
          (sum, month) => sum + month.count,
          0
        );
      }

      // Calculate percentages
      if (totalAmount > 0) {
        monthlyData.forEach((month) => {
          month.percentage = (month.amount / totalAmount) * 100;
        });
      }

      // Find best and worst months
      bestMonth =
        monthlyData.length > 0
          ? monthlyData.reduce((prev, current) =>
            prev.amount > current.amount ? prev : current
          )
          : null;

      worstMonth =
        monthlyData.length > 0
          ? monthlyData.reduce((prev, current) =>
            prev.amount < current.amount ? prev : current
          )
          : null;
    } catch (error) {
      console.error('Error parsing summary:', error);
    }

    return {
      monthlyData,
      totalAmount,
      totalPayments,
      averagePerMonth:
        monthlyData.length > 0
          ? Math.round(totalPayments / monthlyData.length)
          : 0,
      averagePerPayment:
        totalPayments > 0 ? Math.round(totalAmount / totalPayments) : 0,
      bestMonth,
      worstMonth,
      rawText: summaryText,
      parsingSuccess: parsingSuccess && monthlyData.length > 0,
    };
  };

  function formatFeeData(
    data: { year: number; month: number; amount: number; count: number }[]
  ) {
    return data
      .map((item) => {
        const monthName = new Date(item.year, item.month - 1).toLocaleString(
          'default',
          {
            month: 'long',
          }
        );
        return `${monthName} ${item.year}: ₹${item.amount.toLocaleString('en-IN')} collected from ${item.count} payments`;
      })
      .join('\n');
  }

  const handleGenerate = async () => {
    startTransition(async () => {
      try {
        const formattedText = formatFeeData(data);

        console.log('FormattedText', formattedText);

        const generatedSummary =
          await generateAiMonthlyFeesReportAction(formattedText);
        setSummary(generatedSummary);
      } catch (error) {
        console.error('Error generating summary:', error);
        setSummary('Failed to generate summary. Please try again.');
      }
    });
  };

  const parsedData: ParsedSummary = summary
    ? parseSummary(summary)
    : {
      monthlyData: [],
      totalAmount: 0,
      totalPayments: 0,
      averagePerMonth: 0,
      averagePerPayment: 0,
      bestMonth: null,
      worstMonth: null,
      rawText: '',
      parsingSuccess: false,
    };

  const getMonthColor = (index: number): string => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-cyan-500 to-cyan-600',
      'from-violet-500 to-violet-600',
      'from-emerald-500 to-emerald-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ai">
          <Sparkles className="w-4 h-4 text-blue-400 " />
          AI
          {/* Generate AI Summary */}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            AI Fee Collection Analysis
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Comprehensive AI-powered analysis of monthly fee collections with
            insights and trends
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {!summary && (
            <Card className="border-dashed border-2 border-muted hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-6 shadow-inner">
                  <Activity className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ready to Analyze</h3>
                <p className="text-muted-foreground text-center max-w-md leading-relaxed">
                  Generate an intelligent summary of your fee collections with
                  detailed insights, trends, and key performance metrics
                </p>
              </CardContent>
            </Card>
          )}

          {isPending && (
            <>
              <AIStateLoading />
            </>
          )}

          {summary && (
            <div className="space-y-8">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Generated
                  </Badge>
                  {parsedData.parsingSuccess ? (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      ✓ Data Parsed Successfully
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200"
                    >
                      ⚠ Partial Data Parsing
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {parsedData.monthlyData.length} months analyzed
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Collections
                      </CardTitle>
                      <div className="text-3xl font-bold text-green-600 mt-2">
                        ₹{parsedData.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                      <IndianRupee className="h-6 w-6 text-green-600" />
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Payments
                      </CardTitle>
                      <div className="text-3xl font-bold text-blue-600 mt-2">
                        {parsedData.totalPayments.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg per Month
                      </CardTitle>
                      <div className="text-3xl font-bold text-purple-600 mt-2">
                        {parsedData.averagePerMonth}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg per Payment
                      </CardTitle>
                      <div className="text-3xl font-bold text-orange-600 mt-2">
                        ₹{parsedData.averagePerPayment.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Performance Insights */}
              {parsedData.bestMonth && parsedData.worstMonth && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className=" text-xl flex items-center gap-2 text-green-700">
                        <Award className="w-5 h-5" />
                        Best Performing Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xl font-bold text-green-800">
                          {parsedData.bestMonth.month}
                        </div>
                        <div className="text-lg font-semibold text-green-700">
                          {parsedData.bestMonth.formattedAmount}
                        </div>
                        <div className="text-sm text-green-600">
                          {parsedData.bestMonth.count} payments •{' '}
                          {parsedData.bestMonth.percentage.toFixed(1)}% of total
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className=" text-xl flex items-center gap-2 text-orange-700">
                        <TrendingDown className="w-5 h-5" />
                        Lowest Collection Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-orange-800">
                          {parsedData.worstMonth.month}
                        </div>
                        <div className="text-lg font-semibold text-orange-700">
                          {parsedData.worstMonth.formattedAmount}
                        </div>
                        <div className="text-sm text-orange-600">
                          {parsedData.worstMonth.count} payments •{' '}
                          {parsedData.worstMonth.percentage.toFixed(1)}% of
                          total
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Monthly Breakdown */}
              {parsedData.parsingSuccess &&
                parsedData.monthlyData.length > 0 ? (
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <PieChart className="w-6 h-6 text-blue-600" />
                      <CardTitle className="text-xl">
                        Monthly Performance Breakdown
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Detailed analysis of fee collections across all months
                      with visual indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {parsedData.monthlyData.map((data, index) => (
                        <Card
                          key={index}
                          className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50"
                        >
                          <div
                            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getMonthColor(index)}`}
                          />
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-lg text-gray-800">
                                  {data.month}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs font-medium"
                                >
                                  {data.count} payments
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="text-2xl font-bold text-gray-900">
                                  {data.formattedAmount}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {data.percentage.toFixed(1)}% of total
                                  collection
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Performance</span>
                                  <span>{data.percentage.toFixed(1)}%</span>
                                </div>
                                <Progress
                                  value={data.percentage}
                                  className="h-2"
                                />
                              </div>

                              <div className="text-xs text-gray-500 pt-2 border-t">
                                Avg per payment: ₹
                                {Math.round(
                                  data.amount / data.count
                                ).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                  <CardContent className="flex items-start gap-4 p-6">
                    <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-800">
                        Monthly Data Parsing Issue
                      </h4>
                      <p className="text-orange-700 text-sm leading-relaxed">
                        The AI summary format couldn't be automatically parsed
                        for monthly breakdown. The complete analysis is
                        available in the raw summary below.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Raw AI Summary */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    Complete AI Analysis
                  </CardTitle>
                  <CardDescription>
                    Full detailed analysis generated by AI with all insights and
                    observations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-l-purple-500">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                      {parsedData.rawText}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Separator className="my-8" />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-50 transition-colors"
            >
              Close Analysis
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending
                ? 'Analyzing Data...'
                : summary
                  ? 'Regenerate Analysis'
                  : 'Generate AI Analysis'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiMonthlyReport;
