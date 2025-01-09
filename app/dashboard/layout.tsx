import AdminPanelLayout from '@/components/dashboard-layout/dashboard-panel-layout';
// import { getUserRole } from '@/lib/role';
import { auth } from '@clerk/nextjs/server';

export default async function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgRole } = await auth();
  if (!userId) return null;

  const roleMap: Record<string, 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';
  console.log('Detected Clerk Role:', role);
  console.log('role', role);

  return <AdminPanelLayout role={role}>{children}</AdminPanelLayout>;
}
