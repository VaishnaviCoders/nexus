'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/db';
import { SubjectFormData, subjectSchema } from '@/lib/schemas';
import { getOrganizationId } from '@/lib/organization';

const updateSubjectSchema = subjectSchema.extend({
  id: z.string(),
});

// Types for CSV import functionality
export type CSVSubjectRow = {
  name: string;
  code: string;
  description: string;
  rowIndex: number;
  isDuplicate: boolean;
  duplicateReason?: string;
  hasError: boolean;
  errors: string[];
};

export type CSVImportResult = {
  success: boolean;
  message: string;
  validRows: CSVSubjectRow[];
  invalidRows: CSVSubjectRow[];
  duplicateRows: CSVSubjectRow[];
};

// Create a new subject
export async function createSubject(data: SubjectFormData) {
  try {
    const organizationId = await getOrganizationId();

    const validation = subjectSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const { name, code, description } = validation.data;

    // Check for duplicates
    const existingSubject = await prisma.subject.findFirst({
      where: {
        organizationId,
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { code: { equals: code, mode: 'insensitive' } },
        ],
      },
    });

    if (existingSubject) {
      return {
        success: false,
        message:
          existingSubject.name.toLowerCase() === name.toLowerCase()
            ? 'A subject with this name already exists'
            : 'A subject with this code already exists',
      };
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code: code,
        description: description ?? '',
        organizationId,
      },
    });

    revalidatePath('/dashboard/subjects');

    return {
      success: true,
      message: 'Subject created successfully',
      data: subject,
    };
  } catch (error) {
    console.error('Error creating subject:', error);
    return {
      success: false,
      message: 'Failed to create subject',
    };
  }
}

// Update an existing subject
export async function updateSubject(data: SubjectFormData) {
  try {
    const organizationId = await getOrganizationId();

    const validation = updateSubjectSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const { id, name, code, description } = validation.data;

    // Check for duplicates (excluding current subject)
    const existingSubject = await prisma.subject.findFirst({
      where: {
        organizationId,
        id: { not: id },
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { code: { equals: code, mode: 'insensitive' } },
        ],
      },
    });

    if (existingSubject) {
      return {
        success: false,
        message:
          existingSubject.name.toLowerCase() === name.toLowerCase()
            ? 'A subject with this name already exists'
            : 'A subject with this code already exists',
      };
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        code: code.toUpperCase(),
        description: description ?? '',
      },
    });

    revalidatePath('/dashboard/subjects');

    return {
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    };
  } catch (error) {
    console.error('Error updating subject:', error);
    return {
      success: false,
      message: 'Failed to update subject',
    };
  }
}

// Delete a subject
export async function deleteSubject(id: string) {
  try {
    // Check if subject is assigned to any teaching assignments
    const assignmentCount = await prisma.teachingAssignment.count({
      where: { subjectId: id },
    });

    if (assignmentCount > 0) {
      return {
        success: false,
        message: `Cannot delete subject. It is assigned to ${assignmentCount} teaching assignment(s).`,
      };
    }

    await prisma.subject.delete({
      where: { id },
    });

    revalidatePath('/dashboard/subjects');

    return {
      success: true,
      message: 'Subject deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting subject:', error);
    return {
      success: false,
      message: 'Failed to delete subject',
    };
  }
}

// Check for similar subjects (for warnings)
export async function checkSimilarSubjects(
  name: string
): Promise<Array<{ id: string; name: string; code: string }>> {
  try {
    const organizationId = await getOrganizationId();

    const subjects = await prisma.subject.findMany({
      where: {
        organizationId,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: { id: true, name: true, code: true },
    });

    return subjects;
  } catch (error) {
    console.error('Error checking similar subjects:', error);
    return [];
  }
}
// Parse and validate CSV data
// export async function parseCSVSubjects(
//   csvContent: string
// ): Promise<CSVImportResult> {
//   try {
//     const organizationId = await getOrganizationId();

//     // Get existing subjects for duplicate checking
//     const existingSubjects = await prisma.subject.findMany({
//       where: { organizationId },
//       select: { name: true, code: true },
//     });

//     const lines = csvContent.trim().split('\n');
//     if (lines.length < 2) {
//       return {
//         success: false,
//         message: 'CSV must contain at least a header row and one data row',
//         validRows: [],
//         invalidRows: [],
//         duplicateRows: [],
//       };
//     }

//     // Parse header
//     const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
//     const nameIndex = header.findIndex((h) => h.includes('name'));
//     const codeIndex = header.findIndex((h) => h.includes('code'));
//     const descriptionIndex = header.findIndex(
//       (h) => h.includes('description') || h.includes('desc')
//     );

//     if (nameIndex === -1) {
//       return {
//         success: false,
//         message: "CSV must contain a 'name' column",
//         validRows: [],
//         invalidRows: [],
//         duplicateRows: [],
//       };
//     }

//     const validRows: CSVSubjectRow[] = [];
//     const invalidRows: CSVSubjectRow[] = [];
//     const duplicateRows: CSVSubjectRow[] = [];
//     const seenInCSV = new Set<string>();

//     // Process data rows
//     for (let i = 1; i < lines.length; i++) {
//       const row = lines[i]
//         .split(',')
//         .map((cell) => cell.trim().replace(/^"|"$/g, ''));

//       if (row.length === 0 || row.every((cell) => !cell)) continue; // Skip empty rows

//       const name = row[nameIndex] || '';
//       const code = row[codeIndex] || generateSubjectCode(name);
//       const description = row[descriptionIndex] || '';

//       const csvRow: CSVSubjectRow = {
//         name,
//         code: code.toUpperCase(),
//         description,
//         rowIndex: i + 1,
//         isDuplicate: false,
//         hasError: false,
//         errors: [],
//       };

//       // Validate required fields
//       if (!name || name.length < 2) {
//         csvRow.hasError = true;
//         csvRow.errors.push(
//           'Name is required and must be at least 2 characters'
//         );
//       }

//       if (!code) {
//         csvRow.hasError = true;
//         csvRow.errors.push('Code is required');
//       }

//       if (description && description.length > 512) {
//         csvRow.hasError = true;
//         csvRow.errors.push('Description must be less than 512 characters');
//       }

//       // Check for duplicates with existing subjects
//       const existingByName = existingSubjects.find(
//         (s) => s.name.toLowerCase() === name.toLowerCase()
//       );
//       const existingByCode = existingSubjects.find(
//         (s) => s.code.toLowerCase() === code.toLowerCase()
//       );

//       if (existingByName) {
//         csvRow.isDuplicate = true;
//         csvRow.duplicateReason = `Subject with name "${existingByName.name}" already exists`;
//       } else if (existingByCode) {
//         csvRow.isDuplicate = true;
//         csvRow.duplicateReason = `Subject with code "${existingByCode.code}" already exists`;
//       }

//       // Check for duplicates within CSV
//       const csvKey = `${name.toLowerCase()}-${code.toLowerCase()}`;
//       if (seenInCSV.has(csvKey)) {
//         csvRow.isDuplicate = true;
//         csvRow.duplicateReason = 'Duplicate entry within CSV file';
//       } else {
//         seenInCSV.add(csvKey);
//       }

//       // Categorize the row
//       if (csvRow.hasError) {
//         invalidRows.push(csvRow);
//       } else if (csvRow.isDuplicate) {
//         duplicateRows.push(csvRow);
//       } else {
//         validRows.push(csvRow);
//       }
//     }

//     return {
//       success: true,
//       message: `Parsed ${validRows.length + invalidRows.length + duplicateRows.length} rows`,
//       validRows,
//       invalidRows,
//       duplicateRows,
//     };
//   } catch (error) {
//     console.error('Error parsing CSV:', error);
//     return {
//       success: false,
//       message: 'Failed to parse CSV file',
//       validRows: [],
//       invalidRows: [],
//       duplicateRows: [],
//     };
//   }
// }

// Import valid CSV subjects
export async function importCSVSubjects(subjects: CSVSubjectRow[]) {
  try {
    const organizationId = await getOrganizationId();

    const createdSubjects = await prisma.subject.createMany({
      data: subjects.map((subject) => ({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        organizationId,
      })),
    });

    revalidatePath('/dashboard/subjects');

    return {
      success: true,
      message: `Successfully imported ${createdSubjects.count} subjects`,
      data: createdSubjects,
    };
  } catch (error) {
    console.error('Error importing CSV subjects:', error);
    return {
      success: false,
      message: 'Failed to import subjects',
    };
  }
}

export async function checkDuplicateSubject(input: {
  name: string;
  code: string;
  excludeId?: string;
}): Promise<{ isDuplicate: boolean; reason?: 'name' | 'code' }> {
  try {
    const organizationId = await getOrganizationId();

    const where: any = {
      organizationId,
      OR: [
        { name: { equals: input.name, mode: 'insensitive' } },
        { code: { equals: input.code, mode: 'insensitive' } },
      ],
    };

    if (input.excludeId) {
      where.id = { not: input.excludeId };
    }

    const existing = await prisma.subject.findFirst({ where });
    if (!existing) return { isDuplicate: false };

    if (existing.name.toLowerCase() === input.name.toLowerCase()) {
      return { isDuplicate: true, reason: 'name' };
    }
    return { isDuplicate: true, reason: 'code' };
  } catch (error) {
    console.error('Error checking duplicate subject:', error);
    return { isDuplicate: false };
  }
}
