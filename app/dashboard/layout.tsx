import AdminPanelLayout from '@/components/dashboard-layout/dashboard-panel-layout';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
