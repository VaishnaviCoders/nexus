// import { auth } from '@clerk/nextjs/server';

import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import ParentDashboard from '@/components/dashboard/parent/ParentDashboard';
import StudentDashboard from '@/components/dashboard/Student/StudentDashboard';
import TeacherDashboard from '@/components/dashboard/teacher/TeacherDashboard';
import { getOrganization } from '@/lib/organization';

export default async function DashboardPage() {
  const { orgRole } = await getOrganization();

  switch (orgRole) {
    case 'org:admin':
      return <AdminDashboard />;
    case 'org:teacher':
      return <TeacherDashboard />;
    case 'org:parent':
      return <ParentDashboard />;
    case 'org:student':
      return <StudentDashboard />; // Or show a fallback/unauthorized page
  }
}
