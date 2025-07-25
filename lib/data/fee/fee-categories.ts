import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getFeeCategories() {
  const organizationId = await getOrganizationId();
  try {
    const categories = await prisma.feeCategory.findMany({
      where: {
        organizationId: organizationId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        Organization: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      organizationName: category.Organization.name || 'Unknown',
      createdAt: category.createdAt,
    }));
  } catch (error) {
    console.error('Failed to fetch fee categories:', error);
    return [];
  }
}

export async function getFeeCategory(id: string) {
  try {
    const category = await prisma.feeCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        organizationId: true,
        createdAt: true,
      },
    });

    return category;
  } catch (error) {
    console.error('Failed to fetch fee category:', error);
    return null;
  }
}
