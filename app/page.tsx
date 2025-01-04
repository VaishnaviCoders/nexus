import { CreateOrganization } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <CreateOrganization afterCreateOrganizationUrl={'/dashboard'} />
    </div>
  );
}
