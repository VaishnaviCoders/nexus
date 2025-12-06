'use client';

import { AcademicYear } from '@/generated/prisma/client';
import { AcademicYearConfig } from './AcademicYearConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfigSettingsProps {
    academicYears: AcademicYear[];
    organizationId: string;
}

export default function ConfigSettings({ academicYears, organizationId }: ConfigSettingsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium">Configuration Settings</h2>
                <p className="text-sm text-muted-foreground">
                    Configure academic years and other system settings.
                </p>
            </div>

            <Card>
                {/* <CardHeader>
                    <CardTitle>Academic Year Configuration</CardTitle>
                    <CardDescription>
                        Manage academic years for your organization
                    </CardDescription>
                </CardHeader> */}
                <CardContent>
                    <AcademicYearConfig academicYears={academicYears} organizationId={organizationId} />
                </CardContent>
            </Card>
        </div>
    );
}
