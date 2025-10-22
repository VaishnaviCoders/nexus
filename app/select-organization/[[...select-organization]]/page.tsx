import { clerkSignupAppearance } from '@/lib/clerkSignupAppearance';
import { OrganizationList, RedirectToSignIn } from '@clerk/nextjs';
import onboardingSvg from '../../../public/images/select-organization.svg';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth, clerkClient } from '@clerk/nextjs/server';

export default async function SelectOrganizationPage() {
  const { userId } = await auth();

  if (!userId) return <RedirectToSignIn />;

  const client = await clerkClient();

  const organizationMemberships =
    await client.users.getOrganizationMembershipList({
      userId,
    });

  console.log(organizationMemberships.data);
  const hasOrganizations = organizationMemberships.data.length > 0;

  const title = hasOrganizations
    ? 'Select an organization'
    : 'Create an organization';
  const description = hasOrganizations
    ? 'Select an organization to continue'
    : 'Create an organization to get started';
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl">
        <CardHeader className="">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full flex items-center justify-center">
              <OrganizationList
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
                appearance={clerkSignupAppearance}
              />
            </div>
            <div className="w-full max-w-[564px] hidden lg:flex justify-center">
              <Image alt="Onboarding Page" src={onboardingSvg} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
