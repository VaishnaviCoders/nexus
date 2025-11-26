import Footer from '@/components/websiteComp/Footer';
import { MegaNavbar } from '@/components/websiteComp/shared/mega-navbar';

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MegaNavbar />
      {children}
      <Footer />
    </div>
  );
}
