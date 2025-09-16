import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gradeId: string }> }
) {
  const { gradeId } = await params;

  try {
    if (!gradeId) {
      return NextResponse.json(
        { error: 'Grade ID is required' },
        { status: 400 }
      );
    }

    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const sections = await prisma.section.findMany({
      where: {
        organizationId: orgId,
        gradeId: gradeId,
      },
      include: {
        students: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
