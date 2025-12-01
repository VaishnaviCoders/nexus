// types/exam-management.ts

// Base Student Type (minimal info for lists)
export type StudentInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  profileImage?: string | null;
};

// Enrollment Type
export type ExamEnrollmentInfo = {
  id: string;
  studentId: string;
  status: string;
  enrolledAt: Date;
  hallTicketIssued: boolean;
};

// Result Type
export type ExamResultInfo = {
  id: string;
  studentId: string;
  obtainedMarks: number | null;
  percentage: number | null;
  gradeLabel: string | null;
  remarks: string | null;
  isPassed: boolean | null;
  isAbsent: boolean;
};

// Hall Ticket Type
export type HallTicketInfo = {
  id: string;
  studentId: string;
  pdfUrl: string;
  generatedAt: Date;
};

// Subject Type
export type SubjectInfo = {
  id: string;
  name: string;
  code: string;
};

// Exam Session Type
export type ExamSessionInfo = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
};

// Grade Type
export type GradeInfo = {
  id: string;
  grade: string;
};

// Section Type
export type SectionInfo = {
  id: string;
  name: string;
  classTeacher?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  } | null;
};

// Main Exam Type for Admin/Teacher Management
export type ExamManagementInfo = {
  id: string;
  title: string;
  maxMarks: number;
  passingMarks: number | null;
  startDate: Date;
  endDate: Date;
  status: string;
  mode: string;
  isResultsPublished: boolean;
  durationInMinutes: number | null;
  gradeId: string;
  sectionId: string;
  subject: SubjectInfo;
  examSession: ExamSessionInfo;
  grade?: GradeInfo | null;
  section?: SectionInfo | null;
};

// Combined Student Data (for UI)
export type StudentDataWithStatus = StudentInfo & {
  isEnrolled: boolean;
  enrollmentStatus?: string;
  enrollmentId?: string;
  result?: ExamResultInfo;
  hallTicket?: HallTicketInfo;
};

// Props for AdminExamManagementPage
export type AdminExamManagementPageProps = {
  exam: ExamManagementInfo;
  students: StudentInfo[];
  enrollments: ExamEnrollmentInfo[];
  results: ExamResultInfo[];
  hallTickets: HallTicketInfo[];
};

// Statistics Type
export type ExamStatistics = {
  totalStudents: number;
  enrolled: number;
  notEnrolled: number;
  appeared: number;
  passed: number;
  failed: number;
  absent: number;
  ticketsIssued: number;
  avgMarks: number;
  avgPercent: number;
  topScore: number;
  topScorePercent: number;
  passingMarks: number;
  enrollmentRate: number;
  attendanceRate: number;
  successRate: number;
};

// Filter Types
export type EnrollmentFilterType = 'all' | 'enrolled' | 'not-enrolled';
export type TabType = 'enrollment' | 'results' | 'reports';

// ========================================
// STUDENT VIEW TYPES
// ========================================

// Student Exam Info (extended with more details)
export type StudentExamInfo = {
  id: string;
  title: string;
  description: string | null;
  maxMarks: number;
  passingMarks: number | null;
  startDate: Date;
  endDate: Date;
  status: string;
  mode: string;
  venue: string | null;
  venueMapUrl: string | null;
  instructions: string | null;
  isResultsPublished: boolean;
  durationInMinutes: number | null;
  subject: SubjectInfo;
  examSession: ExamSessionInfo;
  grade?: GradeInfo | null;
  section?: SectionInfo | null;
};

// Student's Enrollment Info
export type StudentEnrollmentInfo = {
  id: string;
  studentId: string;
  examId: string;
  status: string;
  enrolledAt: Date;
  hallTicketIssued: boolean;
  exemptionReason: string | null;
} | null;

// Student's Result Info
export type StudentResultInfo = {
  id: string;
  studentId: string;
  examId: string;
  obtainedMarks: number | null;
  percentage: number | null;
  gradeLabel: string | null;
  remarks: string | null;
  isPassed: boolean | null;
  isAbsent: boolean;
} | null;

// Student's Hall Ticket Info (with full details)
export type StudentHallTicketInfo = {
  id: string;
  studentId: string;
  examId: string;
  pdfUrl: string;
  qrCode: string | null;
  generatedAt: Date;
  organization: {
    name: string;
    logo: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    website: string | null;
  };
  student: {
    firstName: string;
    lastName: string;
    rollNumber: string;
    profileImage: string | null;
    email: string;
    phoneNumber: string | null;
    grade: { grade: string } | null;
    section: { name: string } | null;
  };
  examSession: ExamSessionInfo;
  exam: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    venue: string | null;
    mode: string;
    durationInMinutes: number | null;
    subject: SubjectInfo;
  };
} | null;

// Exam Results Summary (for statistics)
export type ExamResultsSummary = {
  obtainedMarks: number | null;
  percentage: number | null;
  isPassed: boolean | null;
  isAbsent: boolean;
}[];

// Props for StudentExamDetailsPage
export type StudentExamDetailsPageProps = {
  exam: StudentExamInfo;
  studentId: string;
  enrollment: StudentEnrollmentInfo;
  result: StudentResultInfo;
  hallTicket: StudentHallTicketInfo;
  examResults: ExamResultsSummary;
};

// Student Exam Statistics
export type StudentExamStatistics = {
  totalStudents: number;
  appeared: number;
  passed: number;
  failed: number;
  absent: number;
  passRate: number;
  attendanceRate: number;
  avgMarks: number;
  avgPercentage: number;
  highestMarks: number;
  lowestMarks: number;
  studentRank: number | null;
  studentPercentile: number | null;
};
