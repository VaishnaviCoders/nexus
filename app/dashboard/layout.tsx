import BreadCrumbNavigation from '@/components/BreadCrumbNavigation';
import AdminPanelLayout from '@/components/dashboard-layout/dashboard-panel-layout';
import { Navbar } from '@/components/navbar';
import { RedirectToSignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgRole } = await auth();
  if (!userId) return <RedirectToSignIn />;

  const roleMap: Record<string, 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';

  return (
    <AdminPanelLayout role={role}>
      <Navbar />
      <BreadCrumbNavigation />
      <div className="container px-0 sm:px-4">{children}</div>
      {/* {children} */}
    </AdminPanelLayout>
  );
}
