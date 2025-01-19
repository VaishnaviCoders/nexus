import { auth, currentUser } from '@clerk/nextjs/server';

export async function ClerkUserComponent() {
  const user = await currentUser();
  const { orgRole } = await auth();

  // console.log('ClerkUserComponent', sessionClaims);

  return (
    <h1 className="text-lg font-bold">
      Welcome {user?.firstName ?? 'Guest'} {orgRole}
    </h1>
  );
}
