import prisma from "@/lib/db"
import { getOrganizationId } from "@/lib/organization"
import AdminSettingsSidebar from "@/components/dashboard/admin/settings/AdminSettingsSidebar"
import GeneralSettings from "@/components/dashboard/admin/settings/GeneralSettings"
import ConfigSettings from "@/components/dashboard/admin/settings/ConfigSettings"
import { GradingSettings } from "@/components/dashboard/admin/settings/GradingSettings"
import { NotificationSettings } from "@/components/dashboard/admin/settings/NotificationSettings"
import RolesAccessSettings from "@/components/dashboard/admin/settings/RolesAccessSettings"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/EmptyState"
import { getBillingSummary } from "@/lib/billing"
import BillingSettings from "./BillingSettings"
import { getOrganizationNotificationSettings } from "@/lib/organization-notification-settings"

export interface ConfigurationsData {
  academic: {
    currentYear: string
    sessionStartMonth: string
  }
  attendance: {
    minimumPercentage: number
    workingDaysPerWeek: number
    trackLateArrivals: boolean
    autoMarkHolidays: boolean
  }
  fee: {
    enableOnlinePayments: boolean
    autoLateFee: boolean
    lateFeePercentage: number
    gracePeriodDays: number
  }
}

export interface GradingData {
  gradingType: "percentage" | "grade" | "cgpa"
  gradeScale: Array<{
    grade: string
    min: number
    max: number
    points: number
  }>
  evaluation: {
    passingPercentage: number
    maxGraceMarks: number
    showGradeOnReport: boolean
    enableRankSystem: boolean
  }
}


export interface RoleData {
  id: string
  name: string
  type: "System" | "Custom"
  description: string
  users: number
  permissions: string[]
}

export interface RolesAccessData {
  roles: RoleData[]
  defaultRole: string
  requireManualApproval: boolean
}
const rolesAccessData: RolesAccessData = {
  defaultRole: "student",
  requireManualApproval: false,
  roles: [
    {
      id: "r1",
      name: "Admin",
      type: "System",
      description: "Full access",
      users: 3,
      permissions: ["Manage Users", "View Reports", "Settings"]
    },
    {
      id: "r2",
      name: "Teacher",
      type: "Custom",
      description: "Can manage classes",
      users: 12,
      permissions: ["Manage Classes", "Upload Marks"]
    },
    {
      id: "r3",
      name: "Student",
      type: "System",
      description: "Basic access",
      users: 520,
      permissions: ["View Profile", "View Results"]
    },
    {
      id: "r4",
      name: "Parent",
      type: "System",
      description: "Can view child's profile and results",
      users: 1270,
      permissions: ["View Profile", "View Results", "View Attendance", "View Fees", "View Exams", "View Notifications", "View Leave"]
    }
  ]
}

async function getOrganization(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      contactEmail: true,
      contactPhone: true,
      website: true,
      organizationType: true,
      plan: true,
      planStartedAt: true,
      planExpiresAt: true,
      maxStudents: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      isPaid: true,
    }
  })
  return organization
}
async function getAcademicYears(organizationId: string) {
  const academicYears = await prisma.academicYear.findMany({
    where: { organizationId },
    orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
  });

  return academicYears;
}
export default async function AdminSettingsPage() {
  const organizationId = await getOrganizationId()
  const [organization, academicYears, billingSummary, notificationSettings] = await Promise.all([
    getOrganization(organizationId),
    getAcademicYears(organizationId),
    getBillingSummary(organizationId),
    getOrganizationNotificationSettings(organizationId)
  ])
  if (!organization) {
    return (
      <EmptyState title="Organization not found" description="Please contact support." />
    )
  }
  return (
    <div className="min-h-screen bg-background px-2">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>
            Manage your application settings, configurations, and access controls.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mt-4">
        <AdminSettingsSidebar>
          <GeneralSettings organization={organization} />
          <ConfigSettings academicYears={academicYears} organizationId={organizationId} />
          <GradingSettings />
          <NotificationSettings notificationSettings={notificationSettings} />
          <BillingSettings billingSummary={billingSummary} organization={organization} />
          <RolesAccessSettings data={rolesAccessData} />
        </AdminSettingsSidebar>
      </div>
    </div>
  )
}


