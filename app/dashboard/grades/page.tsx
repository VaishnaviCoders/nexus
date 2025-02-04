import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleAlert } from 'lucide-react';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering

const Page = async () => {
  const { orgId } = await auth();
  if (!orgId) return <div>No Organization found</div>;
  const grades = await prisma.grade.findMany({
    where: {
      organizationId: orgId,
    },
  });
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="max-w-md w-full shadow-sm">
        <CardHeader className="flex flex-col items-center">
          <CircleAlert className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-semibold text-center text-muted-foreground">
            {grades.length === 0 ? 'Create first Grade' : 'Select Grade'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Please select a Grade to view detailed information and Section
            details.
          </p>
          <Button size="lg" className="w-full cursor-help" variant="outline">
            Select Grade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
