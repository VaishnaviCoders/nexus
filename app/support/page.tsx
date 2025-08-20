import SupportPage from '@/components/websiteComp/SupportPage';
import React from 'react';

import { getOrganizationId } from '@/lib/organization';
import { getCurrentUserId } from '@/lib/user';

const page = async () => {
  const userId = await getCurrentUserId();
  const organizationId = await getOrganizationId();
  return (
    <div>
      <SupportPage userId={userId} organizationId={organizationId} />
    </div>
  );
};

export default page;
