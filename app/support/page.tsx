import React from 'react';
import SupportPage from '@/components/websiteComp/SupportPage';

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
