import prisma from '@/lib/db'; // Your Prisma client instance
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'; // KindeAuth server session

import { NextResponse } from 'next/server'; // Next.js response

export const dynamic = 'force-dynamic';

export async function GET() {
  const testOrganizationId = '212b7959-4a3a-43dc-8a53-7607e0ee2d17'; // ID of the test organization

  try {
    // Fetch the authenticated user from the Kinde session
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Log the authenticated user details
    console.log('Authenticated User:', user);

    // If the user is not found or not authenticated, return a 401 error
    if (!user || !user.id) {
      return new NextResponse('User not found or session issue', {
        status: 401,
      });
    }

    // Ensure that the test organization exists in the database
    const testOrganization = await prisma.organization.findUnique({
      where: {
        id: testOrganizationId, // Test organization ID
      },
    });

    // If the test organization does not exist, throw an error
    if (!testOrganization) {
      throw new Error('Test organization not found in the database');
    }

    // Create the new user and associate with the test organization
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id, // Use Kinde user ID for user identification
        firstName: user.given_name ?? '', // Use Kinde's `given_name`
        lastName: user.family_name ?? '', // Use Kinde's `family_name`
        profileImage: user.picture ?? '', // Use profile image from Kinde
        email: user.email ?? '', // Use email from Kinde
        organizationId: testOrganizationId, // Associate with the test organization
      },
    });

    console.log('User upsert in the database:', dbUser);

    // Redirect the user to the dashboard
    return NextResponse.redirect(
      new URL(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/dashboard'
          : 'https://nexus.com'
      )
    );
  } catch (error) {
    console.error('Error during GET request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
