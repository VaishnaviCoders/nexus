import { DocumentType } from '@/lib/generated/prisma';
import { StudentDocument } from '@/types/document';
import {
  ChartColumnBigIcon,
  CheckCircle2,
  Clock,
  DatabaseIcon,
  FileText,
  Lock,
  Search,
  TrendingUpIcon,
  WandSparklesIcon,
  XCircle,
  ZapIcon,
} from 'lucide-react';

// Anonymous Complaints

export const statusConfig = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'Your complaint has been received and is awaiting review',
  },
  UNDER_REVIEW: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: FileText,
    description: 'Your complaint is being reviewed by our team',
  },
  INVESTIGATING: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Search,
    description: 'An investigation is currently in progress',
  },
  RESOLVED: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
    description: 'Your complaint has been resolved',
  },
  REJECTED: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    description: 'Your complaint could not be processed',
  },
  CLOSED: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Lock,
    description: 'This complaint has been closed',
  },
};

export type ComplaintStatus = keyof typeof statusConfig;

export const severityConfig = {
  LOW: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Low Priority',
  },
  MEDIUM: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Medium Priority',
  },
  HIGH: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    label: 'High Priority',
  },
  CRITICAL: {
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'Critical Priority',
  },
};

export const FEATURES = [
  {
    title: 'Enhance User Experience',
    description:
      'Efficiently manage user data and interactions with advanced AI tools',
    icon: WandSparklesIcon,
    image: '/images/feature-two.svg',
  },
  {
    title: 'Comprehensive Insights',
    description:
      'Gain deep insights into your audience and campaign performance',
    icon: ChartColumnBigIcon,
    image: '/images/feature-one.svg',
  },
  {
    title: 'Data Management',
    description: 'Manage your data with ease and efficiency',
    icon: DatabaseIcon,
    image: '/images/feature-three.svg',
  },
  {
    title: 'Real-Time Analytics',
    description: 'Track and analyze your marketing performance in real-time',
    icon: TrendingUpIcon,
    image: '/images/feature-four.svg',
  },
  {
    title: 'Dynamic Optimization',
    description: 'AI-powered optimization for smarter marketing',
    icon: ZapIcon,
    image: '/images/feature-five.svg',
  },
];
const attendanceChartData = [
  { month: 'June', attendance: 22 },
  { month: 'July', attendance: 24 },
  { month: 'August', attendance: 23 },
  { month: 'September', attendance: 26 },
  { month: 'October', attendance: 20 },
  { month: 'November', attendance: 25 },
  { month: 'December', attendance: 18 },
  { month: 'January', attendance: 23 },
  { month: 'February', attendance: 22 },
  { month: 'March', attendance: 19 },
];

// Mock attendance data
const attendanceData = [
  {
    id: 1,
    date: '2025-03-10',
    student: 'Alex Johnson',
    rollNumber: 'S001',
    section: 'A',
    status: 'present',
  },
  {
    id: 2,
    date: '2025-03-10',
    student: 'Maria Garcia',
    rollNumber: 'S002',
    section: 'A',
    status: 'absent',
  },
  {
    id: 3,
    date: '2025-03-10',
    student: 'James Wilson',
    rollNumber: 'S003',
    section: 'A',
    status: 'late',
  },
  {
    id: 4,
    date: '2025-03-10',
    student: 'Sarah Brown',
    rollNumber: 'S004',
    section: 'A',
    status: 'present',
  },
  {
    id: 5,
    date: '2025-03-10',
    student: 'David Lee',
    rollNumber: 'S005',
    section: 'A',
    status: 'present',
  },
  {
    id: 6,
    date: '2025-03-09',
    student: 'Alex Johnson',
    rollNumber: 'S001',
    section: 'A',
    status: 'present',
  },
  {
    id: 7,
    date: '2025-03-09',
    student: 'Maria Garcia',
    rollNumber: 'S002',
    section: 'A',
    status: 'present',
  },
  {
    id: 8,
    date: '2025-03-09',
    student: 'James Wilson',
    rollNumber: 'S003',
    section: 'A',
    status: 'present',
  },
  {
    id: 9,
    date: '2025-03-09',
    student: 'Sarah Brown',
    rollNumber: 'S004',
    section: 'A',
    status: 'absent',
  },
  {
    id: 10,
    date: '2025-03-09',
    student: 'David Lee',
    rollNumber: 'S005',
    section: 'A',
    status: 'late',
  },
];

const mockSectionAttendance = [
  {
    id: '1',
    section: 'Grade 1 - Section A',
    grade: 'Grade 1',
    date: '2025-03-20',
    reportedBy: 'John Smith',
    status: 'completed',
    percentage: 100,
    studentsPresent: 25,
    totalStudents: 25,
  },
  {
    id: '2',
    section: 'Grade 1 - Section B',
    grade: 'Grade 1',
    date: '2025-03-20',
    reportedBy: 'Jane Doe',
    status: 'completed',
    percentage: 96,
    studentsPresent: 24,
    totalStudents: 25,
  },
  {
    id: '3',
    section: 'Grade 2 - Section A',
    grade: 'Grade 2',
    date: '2025-03-20',
    reportedBy: 'Michael Johnson',
    status: 'pending',
    percentage: 0,
    studentsPresent: 0,
    totalStudents: 28,
  },
  {
    id: '4',
    section: 'Grade 2 - Section B',
    grade: 'Grade 2',
    date: '2025-03-20',
    reportedBy: 'Sarah Williams',
    status: 'in-progress',
    percentage: 68,
    studentsPresent: 17,
    totalStudents: 25,
  },
  {
    id: '5',
    section: 'Grade 3 - Section A',
    grade: 'Grade 3',
    date: '2025-03-20',
    reportedBy: 'Robert Brown',
    status: 'completed',
    percentage: 92,
    studentsPresent: 23,
    totalStudents: 25,
  },
];

export const mockMonthlyFeeCollectionData = [
  { month: 1, year: 2025, amount: 105000, count: 51 },
  { month: 2, year: 2025, amount: 85000, count: 38 },
  { month: 3, year: 2025, amount: 110000, count: 55 },
  { month: 4, year: 2025, amount: 75000, count: 32 },
  { month: 5, year: 2025, amount: 65000, count: 28 },
  { month: 6, year: 2025, amount: 90000, count: 41 },
  { month: 7, year: 2025, amount: 100000, count: 47 },
  { month: 8, year: 2025, amount: 115000, count: 53 },
  { month: 9, year: 2025, amount: 95000, count: 44 },
  { month: 10, year: 2025, amount: 80000, count: 36 },
  { month: 11, year: 2025, amount: 120000, count: 58 },
  { month: 12, year: 2025, amount: 95000, count: 42 },

  // Previous year data
  { month: 0, year: 2024, amount: 85000, count: 38 },
  { month: 1, year: 2024, amount: 90000, count: 42 },
  { month: 2, year: 2024, amount: 75000, count: 35 },
  { month: 3, year: 2024, amount: 0, count: 0 },
  { month: 4, year: 2024, amount: 65000, count: 30 },
  { month: 5, year: 2024, amount: 60000, count: 25 },
  { month: 6, year: 2024, amount: 80000, count: 37 },
  { month: 7, year: 2024, amount: 85000, count: 40 },
  { month: 8, year: 2024, amount: 100000, count: 48 },
  { month: 9, year: 2024, amount: 85000, count: 39 },
  { month: 10, year: 2024, amount: 70000, count: 32 },
  { month: 11, year: 2024, amount: 105000, count: 50 },
];

const mockFeeCategories = [
  { name: 'Tuition Fee', amount: 650000 },
  { name: 'Exam Fee', amount: 75000 },
  { name: 'Library Fee', amount: 50000 },
  { name: 'Lab Fee', amount: 60000 },
  { name: 'Sports Fee', amount: 40000 },
];

// Mock data - replace with actual API calls
const mockDocuments: StudentDocument[] = [
  {
    id: '1',
    type: DocumentType.AADHAAR,
    fileName: 'aadhaar_card.pdf',
    fileSize: 2048576,
    fileType: 'application/pdf',
    documentUrl: '/placeholder.svg?height=400&width=600',
    studentId: 'student1',
    verified: true,
    verifiedBy: 'admin1',
    verifiedAt: new Date('2024-01-15'),
    uploadedBy: 'student1',
    uploadedAt: new Date('2024-01-10'),
    note: 'Clear copy of Aadhaar card',
    isDeleted: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: DocumentType.BIRTH_CERTIFICATE,
    fileName: 'birth_certificate.jpg',
    fileSize: 1536000,
    fileType: 'image/jpeg',
    documentUrl: '/placeholder.svg?height=400&width=600',
    studentId: 'student1',
    verified: false,
    uploadedBy: 'parent1',
    uploadedAt: new Date('2024-01-20'),
    note: 'Original birth certificate scan',
    isDeleted: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    type: DocumentType.TRANSFER_CERTIFICATE,
    fileName: 'tc.pdf',
    fileSize: 3072000,
    fileType: 'application/pdf',
    documentUrl: '/placeholder.svg?height=400&width=600',
    studentId: 'student1',
    verified: true,
    verifiedBy: 'admin2',
    verifiedAt: new Date('2024-01-25'),
    uploadedBy: 'student1',
    uploadedAt: new Date('2024-01-22'),
    isDeleted: false,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-25'),
  },
];
