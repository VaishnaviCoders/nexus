import prisma from '@/lib/db';

export interface HallTicketDataWithRelations {
  id: string;
  studentId: string;
  examId?: string | null;
  examSessionId?: string | null;
  pdfUrl: string;
  qrCode?: string | null;
  generatedAt: Date;
  downloadedAt?: Date | null;
  expiryDate?: Date | null;
  organizationId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    rollNumber: string;
    profileImage?: string | null;
    dateOfBirth: Date;
    grade: {
      id: string;
      grade: string;
    };
    section: {
      id: string;
      name: string;
    };
    user: {
      email: string;
      phoneNumber?: string | null;
    };
  };
  exam?: {
    id: string;
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
    durationInMinutes?: number | null;
    venue?: string | null;
    maxMarks: number;
    subject: {
      id: string;
      name: string;
      code: string;
    };
  } | null;
  examSession?: {
    id: string;
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
  } | null;
  organization: {
    id: string;
    name?: string | null;
    logo?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    website?: string | null;
  };
}

/**
 * Fetch hall ticket data with all required relations for the PDF component
 */
export async function getHallTicketData(
  hallTicketId: string
): Promise<HallTicketDataWithRelations | null> {
  try {
    const hallTicket = await prisma.hallTicket.findUnique({
      where: {
        id: hallTicketId,
      },
      include: {
        student: {
          include: {
            grade: {
              select: {
                id: true,
                grade: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        exam: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        examSession: {
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
            contactEmail: true,
            contactPhone: true,
            website: true,
          },
        },
      },
    });

    return hallTicket;
  } catch (error) {
    console.error('Error fetching hall ticket data:', error);
    return null;
  }
}

/**
 * Fetch hall ticket data for a specific student and exam
 */
export async function getHallTicketForStudentExam(
  studentId: string,
  examId: string
): Promise<HallTicketDataWithRelations | null> {
  try {
    const hallTicket = await prisma.hallTicket.findFirst({
      where: {
        studentId,
        examId,
      },
      include: {
        student: {
          include: {
            grade: {
              select: {
                id: true,
                grade: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        exam: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        examSession: {
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
            contactEmail: true,
            contactPhone: true,
            website: true,
          },
        },
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });

    return hallTicket;
  } catch (error) {
    console.error('Error fetching hall ticket for student exam:', error);
    return null;
  }
}
