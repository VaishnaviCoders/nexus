import { CreateOrganization, OrganizationList } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default function CreateOrganizationPage() {
  const user = currentUser();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <OrganizationList
        afterCreateOrganizationUrl="/dashboard"
        afterSelectPersonalUrl="/user/:id"
        afterSelectOrganizationUrl="/dashboard"
      />
      {/* <CreateOrganization />; */}
    </div>
  );
}
