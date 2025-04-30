import prisma from '@/lib/db';
import FeeAssignmentFilter from '@/components/dashboard/Fees/FeeAssignmentFilter';
import { getOrganizationId } from '@/lib/organization';
import FeeAssignmentDataTable from '@/components/dashboard/Fees/FeeAssignmentDataTable';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';
import FeeAssignmentPagination from '@/components/dashboard/Fees/FeeAssignmentPagination';

interface FilterAssignFeesProps {
  search: string;
  sectionId?: string;
  gradeId?: string;
}
const FilterAssignFees = async ({
  search,
  sectionId,
  gradeId,
}: FilterAssignFeesProps) => {
  const orgId = await getOrganizationId();

  // Define the type for whereClause
  type WhereClause = {
    organizationId: string;
    OR?: Array<{
      firstName?: { contains: string; mode: 'insensitive' };
      lastName?: { contains: string; mode: 'insensitive' };
      rollNumber?: { contains: string; mode: 'insensitive' };
    }>;
    gradeId?: string;
    sectionId?: string;
  };

  //  Build the where clause
  const whereClause: WhereClause = {
    organizationId: orgId,
  };

  // Add search filter if provided
  if (search) {
    whereClause['OR'] = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { rollNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Add grade filter if provided and not 'all'
  if (gradeId && gradeId !== 'all') {
    whereClause['gradeId'] = gradeId;
  }

  // Add section filter if provided and not 'all'
  if (sectionId && sectionId !== 'all') {
    whereClause['sectionId'] = sectionId;
  }

  const students = await prisma.student.findMany({
    where: whereClause,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      rollNumber: true,
      organizationId: true,
      grade: {
        select: {
          id: true,
          grade: true,
        },
      },
      section: {
        select: {
          id: true,
          gradeId: true,
          organizationId: true,
          name: true,
        },
      },
      Fee: {
        select: {
          id: true,
          totalFee: true,
          paidAmount: true,
          dueDate: true,
          status: true,
          feeCategory: true,
        },
      },
    },
  });

  return students;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AssignFees({ searchParams }: PageProps) {
  const orgId = await getOrganizationId();

  const feeCategories = await prisma.feeCategory.findMany({
    where: {
      organizationId: orgId,
    },
  });

  const parsedParams = await searchParamsCache.parse(searchParams);

  const { search, sectionId, gradeId } = parsedParams;

  const students = await FilterAssignFees({
    search,
    sectionId,
    gradeId,
  });

  // // Better console logging
  // console.log('Students:', students);
  // console.log('Filters:', { search, sectionId, gradeId });

  return (
    <main className="flex flex-1 flex-col gap-4 ">
      <FeeAssignmentFilter organizationId={orgId} />
      <FeeAssignmentDataTable
        students={students || []}
        feeCategories={feeCategories || []}
      />
      <FeeAssignmentPagination currentPage={1} totalPages={10} />
    </main>
  );
}
