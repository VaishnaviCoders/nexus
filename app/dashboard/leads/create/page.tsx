import { CreateLeadForm } from '@/components/dashboard/leads/create-lead-form';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { getOrganizationId } from '@/lib/organization';
import React from 'react';

const page = async () => {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();
  return (
    <CreateLeadForm
      organizationId={organizationId}
      academicYearId={academicYearId}
    />
  );
};

export default page;
