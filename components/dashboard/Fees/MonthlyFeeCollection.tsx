'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DownloadIcon, IndianRupeeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';

// Type definitions based on your Prisma schema
type MonthlyFeeData = {
  month: number; // 0-11 for Jan-Dec
  year: number;
  amount: number;
  count: number; // Number of payments
};

interface MonthlyFeeCollectionProps {
  data: MonthlyFeeData[];
  className?: string;
  onYearChange?: (year: number) => void;
  currentYear?: number;
}

export function MonthlyFeeCollection({
  data,
  className,
  onYearChange,
  currentYear = new Date().getFullYear(),
}: MonthlyFeeCollectionProps) {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Filter data for the selected year

  // Create an array for all months, filling in zeros for months with no data
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const yearData = data.filter((item) => item.year === selectedYear);
  const monthlyData = monthNames.map((month, index) => {
    const monthData = yearData.find((item) => item.month === index + 1);
    return {
      month,
      amount: monthData?.amount || 0,
      count: monthData?.count || 0,
    };
  });

  const maxMonthlyCollection = Math.max(
    ...monthlyData.map((item) => item.amount),
    1
  );

  // Calculate totals
  const totalCollection = monthlyData.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalPayments = monthlyData.reduce((sum, item) => sum + item.count, 0);

  // Available years for selection (current year and 4 previous years)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Handle year change
  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    if (onYearChange) {
      onYearChange(newYear);
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Monthly Fee Collection</CardTitle>
          <CardDescription>
            Fee collection trend over {selectedYear}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={selectedYear.toString()} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" title="Export Data">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-0 min-h-[250px]">
        <div className="h-[230px] pt-6 ">
          <div className="flex items-end justify-between gap-1 md:gap-2 border-b pb-2">
            {monthlyData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center group relative"
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-5 md:w-8 rounded-t-md transition-all duration-300',
                          item.amount > 0
                            ? 'bg-gradient-to-t from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 cursor-pointer'
                            : 'bg-muted'
                        )}
                        style={{
                          height: `${Math.max(
                            (item.amount / maxMonthlyCollection) * 180,
                            4
                          )}px`,
                        }}
                      ></div>
                    </div>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="top"
                    align="center"
                    className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm p-3 shadow-lg w-auto transition-all duration-200 ease-in-out transform hover:scale-105"
                  >
                    <div className="space-y-1 text-center">
                      {item.amount > 0 ? (
                        <>
                          <div className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                            <IndianRupeeIcon className="h-4 w-4 text-foreground/80" />
                            {item.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            {item.count} payment{item.count !== 1 ? 's' : ''}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground font-medium">
                          No data
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <span className="text-xs mt-4 text-muted-foreground">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-8">
        <div>
          <p className="text-sm font-medium">Total Collection</p>
          <p className="text-2xl font-bold flex items-center">
            <IndianRupeeIcon className="h-4 w-4 mr-1" />
            {totalCollection.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Total Payments</p>
          <p className="text-2xl font-bold">{totalPayments}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
