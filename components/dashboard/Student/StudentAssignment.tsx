import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentAssignment = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Math Problem Set</h3>
              <p className="text-sm text-muted-foreground">Due: May 20, 2023</p>
            </div>
            <Button variant="outline">Submit</Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Science Lab Report</h3>
              <p className="text-sm text-muted-foreground">Due: May 25, 2023</p>
            </div>
            <Button variant="outline">Submit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAssignment;
