import BreadCrumbNavigation from '@/components/dashboard-layout/BreadCrumbNavigation';
import AdminPanelLayout from '@/components/dashboard-layout/dashboard-panel-layout';
import { Navbar } from '@/components/dashboard-layout/navbar';
import { RedirectToSignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgRole, orgId } = await auth();
  if (!userId) return <RedirectToSignIn />;

  if (!orgId || !orgRole) {
    redirect('/select-organization?returnUrl=/dashboard');
  }

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
      <div className="px-0 sm:px-4">{children}</div>
    </AdminPanelLayout>
  );
}
