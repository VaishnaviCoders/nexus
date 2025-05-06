import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getFeesSummary } from '@/app/actions';

interface FeeCategory {
  name: string;
  paidAmount: number;
  pendingAmount: number;
}

interface FeeDistributionByCategoryProps {
  data: FeeCategory[];
}

const FeeDistributionByCategory: React.FC<
  FeeDistributionByCategoryProps
> = async ({ data }: FeeDistributionByCategoryProps) => {
  const totalFees = data.reduce(
    (acc, category) => acc + category.paidAmount + category.pendingAmount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Collection by Category</CardTitle>
        <CardDescription>
          Shows paid vs pending fees within each category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  ₹
                  {(
                    category.paidAmount + category.pendingAmount
                  ).toLocaleString('en-IN')}
                </span>
              </div>
              <Progress
                value={(category.paidAmount + category.pendingAmount) / 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeDistributionByCategory;
