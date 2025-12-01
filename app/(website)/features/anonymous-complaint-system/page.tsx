import AnonymousComplaintSystemClientPage from '@/components/websiteComp/complaint/complaintFeatures';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Anonymous Complaint System for Schools | Student Safety | Shiksha.cloud',
  description:
    'Protect students with secure anonymous reporting system. Reduce harassment by 85%. POCSO Act compliant. Trusted by 500+ schools in India. Free demo available.',
  keywords: [
    'anonymous complaint system schools',
    'school safety reporting system',
    'women safety school management',
    'student safety reporting platform',
  ],
};



export default function Page() {
  return <AnonymousComplaintSystemClientPage />;
}
