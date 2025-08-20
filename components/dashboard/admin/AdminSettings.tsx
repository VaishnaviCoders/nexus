import OrganizationConfig from '@/components/OrganizationConfig';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { AcademicYearConfig } from './adminConfig/AcademicYearConfig';
import APIVoiceCallQuota from './billing/APIVoiceCallQuota';

async function getOrganization(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      name: true,
      organizationSlug: true,
      organizationLogo: true,
      contactEmail: true,
      contactPhone: true,
      website: true,
      organizationType: true,
      plan: true,
      planStartedAt: true,
      planExpiresAt: true,
      maxStudents: true,
      isActive: true,
    },
  });
  return organization;
}

async function getAcademicYears(organizationId: string) {
  const academicYears = await prisma.academicYear.findMany({
    where: { organizationId },
    orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
  });

  return academicYears;
}
const AdminSettings = async () => {
  const organizationId = await getOrganizationId();

  const organization = await getOrganization(organizationId);

  const academicYears = await getAcademicYears(organizationId);
  return (
    <div className="px-4 space-y-4">
      <Card className="px-4 py-3">
        <CardTitle className="text-lg">Admin Settings</CardTitle>
        <CardDescription>
          Manage your organization and system settings
        </CardDescription>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 border rounded-lg">
          <div>
            <h2 className="text-lg font-semibold">Organization</h2>
            <p className="text-sm text-muted-foreground">
              Configure your organization's profile and contact information
            </p>
          </div>
          <OrganizationConfig organization={organization} />
        </div>

        {/* Add more settings sections here */}
        <AcademicYearConfig
          academicYears={academicYears}
          organizationId={organizationId}
        />
        <APIVoiceCallQuota />
      </div>
    </div>
  );
};

export default AdminSettings;
