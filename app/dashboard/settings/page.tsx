import AdminSettings from '@/components/dashboard/admin/settings/AdminSettings';
import ParentSettings from '@/components/dashboard/parent/ParentSettings';
import StudentSettings from '@/components/dashboard/Student/StudentSettings';
import TeacherSettings from '@/components/dashboard/teacher/TeacherSettings';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SettingPage() {
  const { orgRole } = await auth();

  switch (orgRole) {
    case 'org:admin':
      return <AdminSettings />;
    case 'org:teacher':
      return <TeacherSettings />;
    case 'org:parent':
      return <ParentSettings />;
    case 'org:student':
      return <StudentSettings />;
    default:
      redirect('/'); // Or show a fallback/unauthorized page
  }
}
