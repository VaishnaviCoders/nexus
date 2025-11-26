import { PrincipalBenefits } from '@/components/websiteComp/principal-benefits';
import PrincipalConvincer from '@/components/websiteComp/principal-convincer';
import { SecurityTrust } from '@/components/websiteComp/security-trust';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Why Choose Shiksha.cloud | Smart School Management for Principals',
  description:
    'Discover why principals trust Shiksha.cloud. Cut costs by 60%, automate fee collection, and ensure bank-grade security. Setup in 24 hours. Join 50+ schools today.',
  keywords: [
    'School Management Software',
    'Principal Benefits',
    'Fee Collection Automation',
    'School Security',
    'Education Technology',
    'Shiksha.cloud',
  ],
  openGraph: {
    title: 'Why Choose Shiksha.cloud | Smart School Management for Principals',
    description:
      'Discover why principals trust Shiksha.cloud. Cut costs by 60%, automate fee collection, and ensure bank-grade security. Setup in 24 hours. Join 50+ schools today.',
  },
};

const page = () => {
  return (
    <div>
      <PrincipalConvincer />

      <SecurityTrust />
      <PrincipalBenefits />

    </div>
  );
};

export default page;
