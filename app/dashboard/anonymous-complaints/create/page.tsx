import CreateAnonymousComplaintForm from '@/components/dashboard/anonymousComplaints/create-complaint-form';
import { getMentionUsers } from '@/lib/data/complaints/getMentionUsers';
import { getOrganizationId } from '@/lib/organization';
import React from 'react';

const page = async () => {
  const organizationId = await getOrganizationId();
  const allUsers = await getMentionUsers(organizationId);
  return (
    <div>
      <CreateAnonymousComplaintForm
        initialUsers={allUsers}
        organizationId={organizationId}
      />
    </div>
  );
};

export default page;
