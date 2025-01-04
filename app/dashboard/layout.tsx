import AdminPanelLayout from '@/components/dashboard-layout/dashboard-panel-layout';
import { getUserRole } from '@/lib/role';

export default async function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();
  console.log('role', role);
  return <AdminPanelLayout role={role}>{children}</AdminPanelLayout>;
}
