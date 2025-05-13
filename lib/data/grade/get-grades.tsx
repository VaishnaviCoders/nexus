import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

import { unstable_noStore as noStore } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { getOrganizationId } from '@/lib/organization';

export async function GetGrades() {
  noStore();
  try {
    const orgId = await getOrganizationId();

    // Fetch all grades for the organization
    const grades = await prisma.grade.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        section: true,
        students: true,
      },
    });

    // Return the grades as a JSON response
    // console.log('Grades', grades);
    return grades;
  } catch (error) {
    console.error('Error fetching grades:', error);
  }
}
