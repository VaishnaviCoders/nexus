import StudentSettings from '@/components/dashboard/Student/StudentSettings';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SettingPage() {
  const { orgRole } = await auth();

  switch (orgRole) {
    // case 'org:admin':
    //   return <AdminDashboard />;
    // case 'org:teacher':
    //   return <TeacherDashboard />;
    // case 'org:parent':
    //   return <ParentDashboard />;
    case 'org:student':
      return (
        <>
          <StudentSettings />
          <Link href={'/dashboard/settings/profile'} passHref>
            <Button variant="outline">Student Profile</Button>
          </Link>
        </>
      );
    default:
      redirect('/'); // Or show a fallback/unauthorized page
  }
}
