import { currentUser } from '@clerk/nextjs/server';

export async function ClerkUserComponent() {
  const user = await currentUser();

  return (
    <h1 className="text-lg font-bold">Welcome {user?.firstName ?? 'Guest'}</h1>
  );
}
