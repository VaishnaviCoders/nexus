// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import AdminDashboard from '@/components/dashboard/RoleBasedDashboard/AdminDashboard';
import ParentDashboard from '@/components/dashboard/parent/ParentDashboard';
import StudentDashboard from '@/components/dashboard/Student/StudentDashboard';
// import TeacherDashboard from '@/components/dashboard/teacher/TeacherDashboard';

export default async function DashboardPage() {
  const { orgRole } = await auth();

  switch (orgRole) {
    case 'org:admin':
      return <AdminDashboard />;
    // case 'org:teacher':
    //   return <TeacherDashboard />;
    case 'org:parent':
      return <ParentDashboard />;
    case 'org:student':
      return <StudentDashboard />;
    default:
      redirect('/'); // Or show a fallback/unauthorized page
  }
}
