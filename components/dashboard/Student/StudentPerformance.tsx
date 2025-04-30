import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProgressCircle } from '@/components/Charts/ProgressCircle';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const performanceData = [
  { subject: 'Math', score: 85 },
  { subject: 'Science', score: 92 },
  { subject: 'English', score: 78 },
  { subject: 'History', score: 88 },
  { subject: 'Art', score: 95 },
];

const StudentPerformance = () => {
  return (
    <div>
      <div className="flex items-start md:space-x-5 max-md:space-y-5 justify-center w-full max-md:flex-col">
        {' '}
        <Card className="w-full min-h-[280px]">
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
            <CardDescription>
              Subject-wise grades and overall rank
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <ProgressCircle
              value={45}
              width={100}
              height={100}
              className="flex justify-center items-center"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                45%
              </span>
            </ProgressCircle>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                45/100
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Participation Rate Analysis
              </p>
            </div>
            <ProgressCircle
              value={75}
              width={100}
              height={100}
              className="flex justify-center items-center"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                75%
              </span>
            </ProgressCircle>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                75/100
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Performance
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full min-h-[280px]">
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
            <CardDescription>
              Subject-wise grades and overall rank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {performanceData.map((subject) => (
                <div key={subject.subject} className="flex items-center">
                  <div className="w-32">{subject.subject}</div>
                  <div className="flex-1">
                    <Progress value={subject.score} className="h-2" />
                  </div>
                  <div className="w-20 text-right">{subject.score}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Button>
        <Download className="mr-2 h-4 w-4" /> Download Performance Report
      </Button>
    </div>
  );
};

export default StudentPerformance;
