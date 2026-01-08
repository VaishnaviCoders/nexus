import SupportPage from '@/components/websiteComp/SupportPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Center | Shiksha Cloud',
  description:
    'Get help and support for Shiksha Cloud school management system. Contact our team or browse resources.',
  alternates: {
    canonical: 'https://www.shiksha.cloud/support',
  },
};

import { getOrganizationId } from '@/lib/organization';
import { getCurrentUserId } from '@/lib/user';
import Footer from '@/components/websiteComp/Footer';

const Page = async () => {
  const userId = await getCurrentUserId().catch(() => null);
  const organizationId = await getOrganizationId().catch(() => null);

  return (
    <div>
      <SupportPage userId={userId} organizationId={organizationId} />
      <Footer />
    </div>
  );
};

export default Page;
