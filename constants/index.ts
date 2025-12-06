import { Institute } from '@/components/websiteComp/shared/Institute-avatar-popover';
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


 export const features = [
    {
      id: "FEE_RECEIPT_VIEW",
      name: "View & Download Fee Receipts",
      description: "Students and parents can view all past fee payments and download official receipts anytime",
      roles: ["STUDENT", "PARENT"],
      status: "LIVE",
      problem_solved: "Eliminates need to visit school office for receipt copies. Parents often lose paper receipts and need reprints for reimbursements or records."
    },
    {
      id: "ONLINE_FEE_PAYMENT",
      name: "Online Fee Payment",
      description: "Pay school fees online using UPI, credit/debit cards, net banking, and digital wallets",
      roles: ["STUDENT", "PARENT"],
      status: "LIVE",
      problem_solved: "Removes need to stand in school office queues during limited hours. Parents can pay at midnight on Sunday from home. Eliminates cash handling risks."
    },
    {
      id: "SCHOOL_NOTICES",
      name: "Receive School Notices",
      description: "Get school announcements and notices via SMS, Email, and WhatsApp with delivery confirmation",
      roles: ["STUDENT", "PARENT", "TEACHER"],
      status: "LIVE",
      problem_solved: "Students lose printed circulars. Parents miss important announcements. Schools waste 2+ hours calling parents individually for urgent updates."
    },
    {
      id: "STUDENT_PROFILE",
      name: "Student Profile Management",
      description: "Students can view and update their personal information, contact details, and profile picture",
      roles: ["STUDENT"],
      status: "LIVE",
      problem_solved: "Schools maintain outdated contact info because updating requires physical forms. Students can't verify what information school has on file."
    },
    {
      id: "ATTENDANCE_HISTORY",
      name: "Attendance History Tracking",
      description: "View complete attendance records with daily, weekly, and monthly breakdowns showing present/absent/late status",
      roles: ["STUDENT", "PARENT"],
      status: "LIVE",
      problem_solved: "Parents have zero visibility into child's attendance. Students don't know their attendance percentage until report cards. Schools get repeated queries."
    },
    {
      id: "HOLIDAY_CALENDAR",
      name: "Holiday Calendar View",
      description: "View declared holidays, upcoming breaks, and emergency closures in a calendar format",
      roles: ["STUDENT", "PARENT", "TEACHER"],
      status: "LIVE",
      problem_solved: "Parents and students miss holiday announcements. Confusion about whether school is open on specific dates leads to unnecessary trips."
    },
    {
      id: "DOCUMENT_UPLOAD",
      name: "Document Upload System",
      description: "Upload required documents like Aadhaar card, Transfer Certificate, Birth Certificate, and ID proofs",
      roles: ["STUDENT", "TEACHER"],
      status: "LIVE",
      problem_solved: "Physical document submission requires school visits. Documents get lost or damaged. Searching through physical files wastes admin time during audits."
    },
    {
      id: "DOCUMENT_STATUS",
      name: "Document Verification Status",
      description: "Track real-time verification status of uploaded documents (pending, verified, rejected with reason)",
      roles: ["STUDENT"],
      status: "LIVE",
      problem_solved: "Students don't know if their documents were accepted. Repeated visits to ask 'Did you verify my documents?' waste everyone's time."
    },
    {
      id: "ANONYMOUS_COMPLAINT",
      name: "Anonymous Complaint System",
      description: "Submit issues, feedback, or complaints privately without revealing identity to school admin and teachers",
      roles: ["STUDENT", "PARENT"],
      status: "LIVE",
      problem_solved: "Students fear retaliation for reporting problems. Parents hesitate to complain about teachers. Important issues go unreported and unresolved."
    },
    {
      id: "VIEW_SECTION_TEACHERS",
      name: "View Section & Teachers",
      description: "See assigned grade, section, and complete list of subject teachers with contact information",
      roles: ["STUDENT"],
      status: "LIVE",
      problem_solved: "Students don't know which teacher teaches which subject. Contact information for teachers not easily accessible when students need help."
    },
    {
      id: "FEE_TRACKING",
      name: "Fee History & Tracking",
      description: "Complete view of all past payments, pending dues, upcoming deadlines, and payment reminders",
      roles: ["PARENT"],
      status: "LIVE",
      problem_solved: "Parents forget payment deadlines. Confusion about how much was paid vs what's pending. Schools spend hours answering 'What's my fee balance?'"
    },
    {
      id: "MULTI_CHILD_LINK",
      name: "Link Multiple Children",
      description: "Parents can link and monitor multiple children's profiles from single account with aggregated view",
      roles: ["PARENT"],
      status: "LIVE",
      problem_solved: "Parents with multiple children need separate logins. Tracking each child's fees and attendance separately is cumbersome."
    },
    {
      id: "MULTI_PARENT_SUPPORT",
      name: "Multiple Parents per Child",
      description: "Both mother and father (or guardians) can independently access child's information with separate accounts",
      roles: ["PARENT"],
      status: "LIVE",
      problem_solved: "Only one parent gets updates. Father doesn't know if mother paid fees. Both parents want visibility without sharing login credentials."
    },
    {
      id: "PARENT_PROFILE",
      name: "Parent Profile Management",
      description: "Edit parent contact information, notification preferences, and view all linked children",
      roles: ["PARENT"],
      status: "LIVE",
      problem_solved: "Schools have outdated parent phone numbers. Parents can't control which channel they receive notifications on."
    },
    {
      id: "TEACHER_PROFILE",
      name: "Teacher Profile & Credentials",
      description: "Add bio, resume, educational certificates, teaching philosophy, and contact information",
      roles: ["TEACHER"],
      status: "LIVE",
      problem_solved: "Parents don't know teacher qualifications. Schools lack centralized teacher credential records for audits. Teacher information not accessible to parents."
    },
    {
      id: "MANAGE_CLASSES",
      name: "Class & Student Management",
      description: "View all assigned sections, enrolled students, and subject assignments in one dashboard",
      roles: ["TEACHER"],
      status: "LIVE",
      problem_solved: "Teachers maintain manual lists of students per class. No quick way to see which students are in which section. Confusion during mid-year section changes."
    },
    {
      id: "TAKE_ATTENDANCE",
      name: "Digital Attendance Marking",
      description: "Mark student attendance with 2 taps using AI suggestions based on patterns, saves automatically",
      roles: ["TEACHER"],
      status: "LIVE",
      problem_solved: "Manual attendance registers take 20 minutes per class. Paper registers get lost or damaged. Teachers waste teaching time on roll calls."
    },
    {
      id: "SECTION_SUMMARY",
      name: "Section Attendance Summary",
      description: "View attendance overview showing class-wide patterns, frequently absent students, and late arrival stats",
      roles: ["TEACHER"],
      status: "LIVE",
      problem_solved: "Teachers don't identify attendance patterns until it's too late. No easy way to spot students with deteriorating attendance needing intervention."
    },
    {
      id: "SUBJECT_ASSIGNMENT",
      name: "Subject Assignment Management",
      description: "Teachers are assigned specific subjects per grade and section by administrators",
      roles: ["TEACHER", "ADMIN"],
      status: "LIVE",
      problem_solved: "Manual tracking of who teaches what subject in which class leads to scheduling conflicts. Teachers don't have clarity on their teaching load."
    },
    {
      id: "COMPLAINT_RESOLUTION",
      name: "Complaint Investigation & Resolution",
      description: "Teachers can investigate complaints, add responses, and update resolution status",
      roles: ["TEACHER", "ADMIN"],
      status: "LIVE",
      problem_solved: "Complaints go unaddressed. No tracking system for who's handling what issue. Students don't know if their complaint was even seen."
    },
    {
      id: "TEACHER_DOCUMENTS",
      name: "Teacher Document Upload",
      description: "Upload ID proofs, educational certificates, resume, and experience letters",
      roles: ["TEACHER"],
      status: "LIVE",
      problem_solved: "Teacher credential verification during audits is chaotic. Physical certificate copies get lost. No centralized credential database."
    },
    {
      id: "ORG_SETUP",
      name: "Organization Configuration",
      description: "Configure school name, logo, type (school/college/coaching), student limits, and subscription plans",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "No centralized place to manage institutional branding and configuration. Plan limitations not enforced systematically."
    },
    {
      id: "TEACHER_MANAGEMENT",
      name: "Add & Assign Teachers",
      description: "Add new teachers, assign them to specific sections and subjects, manage teaching load distribution",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Manual tracking of teacher assignments leads to conflicts. Teachers assigned to too many/few classes. No visibility into workload balance."
    },
    {
      id: "GRADE_SECTION_MGMT",
      name: "Grade & Section Management",
      description: "Create and edit class names, sections (10-A, 12-B), and define academic structure",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Academic structure changes yearly but no system tracks it. Adding new sections mid-year is painful with manual systems."
    },
    {
      id: "FEE_SETUP",
      name: "Fee Configuration & Tracking",
      description: "Create fee categories (tuition, transport, exam), assign to students/grades, monitor real-time collections",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Complex fee structures hard to track manually. No real-time visibility into who paid what. Chasing defaulters takes hours daily."
    },
    {
      id: "PAYMENT_TRACKING",
      name: "Online Payment Monitoring",
      description: "Monitor all online transactions including payment status, platform fees, gateway charges, and reconciliation",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Manual reconciliation of online payments with bank statements is error-prone. No visibility into failed transactions or refund status."
    },
    {
      id: "BULK_IMPORT",
      name: "Bulk Student Import",
      description: "Import hundreds of student records via CSV or Google Sheets with automatic validation and error detection",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Manual data entry for 500+ students takes weeks. High error rate in manual entry. New academic year setup is painful and time-consuming."
    },
    {
      id: "HOLIDAY_MANAGEMENT",
      name: "Holiday Declaration System",
      description: "Create and declare planned holidays and emergency closures, automatically notify all stakeholders",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Holiday announcements require individual calls to all parents. Confusion about whether school is open during uncertain weather/situations."
    },
    {
      id: "NOTICE_PUBLISHING",
      name: "Notice Publishing & Scheduling",
      description: "Create, approve, schedule, and publish notices to specific user groups with delivery tracking",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Printing and distributing circulars to 500+ students takes 2+ hours. Students lose papers. Parents miss critical announcements."
    },
    {
      id: "ADMIN_DASHBOARD",
      name: "Analytics Dashboard",
      description: "View real-time stats on fee collection, attendance rates, complaint resolution, and overall school health",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "No data-driven insights into school operations. Can't identify problems until they become crises. Manual report generation takes days."
    },
    {
      id: "NOTIFICATION_LOGS",
      name: "Notification Delivery Tracking",
      description: "Track which notifications were delivered via SMS/WhatsApp/Email, delivery status, and read receipts",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Parents claim 'I never got that message'. No proof of communication delivery. Can't verify if critical alerts reached everyone."
    },
    {
      id: "DOCUMENT_VERIFICATION",
      name: "Document Verification Workflow",
      description: "Review, approve, or reject submitted student and teacher documents with feedback notes",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Physical document verification is time-consuming. No systematic tracking of pending vs verified documents. Audit preparation is chaotic."
    },
    {
      id: "ADMIN_PROFILE",
      name: "Admin Profile & Settings",
      description: "Update admin contact details, password, notification preferences, and security settings",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Admin accounts shared among multiple staff. No audit trail of who made what changes. Security settings not customizable."
    },
    {
      id: "ORG_PLANS",
      name: "Subscription Plan Management",
      description: "Control feature access based on Free, Premium, or Enterprise subscription tier",
      roles: ["ADMIN"],
      status: "LIVE",
      problem_solved: "Schools want to try before buying. Need tiered pricing for different institution sizes. Feature access not programmatically controlled."
    },
    {
      id: "STUDENT_DASHBOARD",
      name: "Student Dashboard Overview",
      description: "Visual dashboard with widgets showing fees summary, attendance percentage, pending documents, and recent notices",
      roles: ["STUDENT"],
      status: "UPCOMING",
      problem_solved: "Students have to navigate multiple pages to get basic information. No at-a-glance view of their school status."
    },
    {
      id: "ATTENDANCE_ALERTS",
      name: "Automated Attendance Alerts",
      description: "Students and parents receive automatic SMS/WhatsApp alerts when marked absent or late",
      roles: ["STUDENT", "PARENT"],
      status: "UPCOMING",
      problem_solved: "Parents learn about absences days later. Students skip school without parents knowing. Early intervention not possible."
    },
    {
      id: "ACADEMIC_PROFILE",
      name: "Academic Performance Profile",
      description: "Comprehensive view of academic performance, enrolled subjects, grades, and assignment status",
      roles: ["STUDENT"],
      status: "UPCOMING",
      problem_solved: "Students have no centralized view of their academic standing. Performance tracking scattered across multiple systems."
    },
    {
      id: "BULK_STUDENT_INVITE",
      name: "Bulk Student Onboarding with Invites",
      description: "CSV-based import that automatically sends login credentials and invitation links to student emails",
      roles: ["ADMIN"],
      status: "UPCOMING",
      problem_solved: "Manually sending login credentials to hundreds of students is tedious. Students forget to register, delaying full system adoption."
    },
    {
      id: "PHONEPE_DASHBOARD",
      name: "PhonePe Payment Analytics",
      description: "Dedicated dashboard summarizing PhonePe gateway transactions, success rates, and settlement status",
      roles: ["ADMIN"],
      status: "UPCOMING",
      problem_solved: "Payment gateway data scattered. No consolidated view of transaction success/failure rates. Reconciliation with PhonePe is manual."
    },
    {
      id: "AI_REPORTS",
      name: "AI-Powered Report Generation",
      description: "Automatically generate monthly fee collection and attendance trend reports using AI analysis",
      roles: ["ADMIN"],
      status: "UPCOMING",
      problem_solved: "Manual report creation takes hours. Insights buried in data. Management needs executive summaries, not raw spreadsheets."
    },
    {
      id: "EXAM_MANAGEMENT",
      name: "Examination Lifecycle Management",
      description: "Manage complete exam process: scheduling, student enrollment, hall tickets, seating arrangements",
      roles: ["ADMIN", "TEACHER"],
      status: "UPCOMING",
      problem_solved: "Exam scheduling has conflicts. Hall ticket generation is manual. No systematic student enrollment for exams. Seating chaos before exams."
    },
    {
      id: "LEAD_MANAGEMENT",
      name: "Admission Lead Management (CRM)",
      description: "Track prospective students from inquiry to enrollment with follow-up workflows and conversion tracking",
      roles: ["ADMIN", "TEACHER"],
      status: "UPCOMING",
      problem_solved: "Potential students slip through cracks. No systematic follow-up. Conversion rates unknown. Admissions process unstructured."
    },
    {
      id: "MONTHLY_ATTENDANCE_SUMMARY",
      name: "Monthly Attendance Reports",
      description: "Comprehensive monthly attendance reports with analytics, trends, and comparison with previous months",
      roles: ["STUDENT", "PARENT"],
      status: "PLANNED",
      problem_solved: "Students can't track monthly attendance patterns. Parents want consolidated monthly reports, not daily notifications."
    },
    {
      id: "ASSIGNMENT_SYSTEM",
      name: "Assignment Submission & Tracking",
      description: "Teachers assign homework, students submit online, automatic tracking of pending/completed assignments",
      roles: ["STUDENT", "TEACHER"],
      status: "PLANNED",
      problem_solved: "Students forget assignments. Teachers track submissions manually. No systematic way to know who submitted what and when."
    },
    {
      id: "MARKS_PERFORMANCE",
      name: "Exam Marks & Performance Analytics",
      description: "View exam results, subject-wise marks, performance trends, class rankings, and improvement areas",
      roles: ["STUDENT", "PARENT"],
      status: "PLANNED",
      problem_solved: "Students get paper mark sheets that get lost. No historical performance tracking. Parents can't see performance trends over time."
    },
    {
      id: "CERTIFICATE_DOWNLOAD",
      name: "Digital Certificate Management",
      description: "Download academic certificates, participation certificates, and achievement awards anytime",
      roles: ["STUDENT", "PARENT"],
      status: "PLANNED",
      problem_solved: "Physical certificates get lost or damaged. Requesting duplicates requires school visits. No digital archive of certificates."
    },
    {
      id: "LEAVE_REQUEST",
      name: "Leave Application System",
      description: "Students apply for leave online, track approval status, and view leave balance",
      roles: ["STUDENT"],
      status: "PLANNED",
      problem_solved: "Leave applications require physical forms. Parents don't know if leave was approved. Teachers manually track leave balances."
    },
    {
      id: "COURSE_ENROLLMENT",
      name: "Course & Batch Enrollment",
      description: "Enroll in elective courses, manage batch assignments, and track course completion status",
      roles: ["STUDENT", "ADMIN"],
      status: "PLANNED",
      problem_solved: "Elective course enrollment is chaotic. No systematic batch assignment. Students don't know which courses they're enrolled in."
    },
    {
      id: "VOICE_ASSISTANT",
      name: "Voice Assistant (Alexa Integration)",
      description: "Voice-powered queries for attendance, fees, notices via Alexa or Google Assistant",
      roles: ["STUDENT", "PARENT"],
      status: "PLANNED",
      problem_solved: "Parents want hands-free access while cooking/driving. Students prefer voice over typing. Accessibility for visually impaired users."
    },
    {
      id: "TEACHER_FEEDBACK",
      name: "Student Feedback & Comments",
      description: "Teachers write detailed feedback on student behavior, progress, and areas needing improvement",
      roles: ["TEACHER"],
      status: "PLANNED",
      problem_solved: "Feedback limited to report card comments. No continuous feedback system. Parents want regular updates, not just quarterly."
    },
    {
      id: "MARKS_ENTRY",
      name: "Exam Marks Entry System",
      description: "Teachers enter exam marks, automatic grade calculation, and integration with report card generation",
      roles: ["TEACHER", "ADMIN"],
      status: "PLANNED",
      problem_solved: "Manual mark sheets are error-prone. Calculating grades manually is time-consuming. No systematic marks database."
    },
    {
      id: "TEACHER_ASSIGNMENT",
      name: "Assignment Creation & Distribution",
      description: "Create assignments, attach files, set deadlines, and track student submissions",
      roles: ["TEACHER"],
      status: "PLANNED",
      problem_solved: "Distributing assignments to 100+ students manually. Students miss deadlines. No central repository of assignments."
    },
    {
      id: "TEACHER_LEAVE",
      name: "Teacher Leave Management",
      description: "Apply for leave, track approval status, view leave balance, and arrange substitute teachers",
      roles: ["TEACHER", "ADMIN"],
      status: "PLANNED",
      problem_solved: "Teacher leave applications are manual. No visibility into who's on leave. Finding substitute teachers is chaotic. Leave balances tracked in Excel."
    },
    {
      id: "SALARY_MANAGEMENT",
      name: "Teacher Salary & Payout Tracking",
      description: "View salary details, payment history, salary slips, tax deductions, and payout schedules",
      roles: ["TEACHER", "ADMIN"],
      status: "PLANNED",
      problem_solved: "Teachers have no self-service access to salary info. HR spends time answering salary queries. Salary slip distribution is manual."
    },
    {
      id: "COURSE_BATCH_MGMT",
      name: "Course & Batch Administration",
      description: "Create academic courses, define batches, assign students, and manage course schedules",
      roles: ["ADMIN"],
      status: "PLANNED",
      problem_solved: "Complex course structures hard to manage. Batch assignments messy. Elective course scheduling conflicts not detected systematically."
    },
    {
      id: "CERTIFICATE_GENERATOR",
      name: "Automated Certificate Generation",
      description: "Bulk generate certificates with customizable templates, automatic student data merge, and digital signatures",
      roles: ["ADMIN"],
      status: "PLANNED",
      problem_solved: "Manual certificate creation for 500+ students takes days. Typos in certificates. No template consistency. Digital signatures not possible."
    }
  ]
  // "metadata": {
  //   "total_features": 66,
  //   "live_features": 38,
  //   "upcoming_features": 8,
  //   "planned_features": 20,
  //   "last_updated": "2024-11-28"
  // }


export const indianEducationProblems = [
  {
    id: 1,
    title: 'Student Document Verification Chaos',
    subtitle: 'छात्रों के डॉक्यूमेंट वेरिफिकेशन में उलझन',
    description:
      'Aadhaar cards, birth certificates, transfer certificates - everything scattered. Manual verification takes weeks, documents get lost.',
    features: [
      'Digital document upload system',
      'Real-time verification status tracking',
      'Admin approval/rejection workflow',
      'Secure document storage & access',
    ],
  },
  {
    id: 2,
    title: 'Anonymous Complaints Management',
    subtitle: 'शिकायतों और फीडबैक का सही चैनल नहीं',
    description:
      'Students/parents fear speaking up. Serious issues like bullying, harassment go unreported. No proper resolution mechanism.',
    features: [
      'Secure anonymous complaint box',
      'Confidential issue reporting',
      'Admin investigation workflow',
      'Resolution tracking without revealing identity',
    ],
  },
  {
    id: 3,
    title: 'Manual Attendance Headache',
    subtitle: 'हाथ से अटेंडेंस लिखने की मुसीबत',
    description:
      "Paper registers, manual calculations, no real-time data. Parents don't know when their child is absent.",
    features: [
      'One-click digital attendance',
      'AI-powered attendance suggestions',
      'Real-time parent alerts via SMS/WhatsApp',
      'Automated attendance reports & analytics',
    ],
  },
  {
    id: 4,
    title: 'Fee Collection Nightmare',
    subtitle: 'फीस कलेक्शन का सबसे बड़ा तनाव',
    description:
      'Chasing parents for payments, manual receipt writing, payment tracking chaos, no transparency.',
    features: [
      'Online payments via UPI/Cards/Net Banking',
      'Automated fee reminders & receipts',
      'Real-time collection dashboard',
      'Complete payment history & audit trail',
    ],
  },
  {
    id: 5,
    title: 'Admission & Lead Management Stress',
    subtitle: 'एडमिशन सीजन में लीड मैनेजमेंट की टेंशन',
    description:
      'Leads from Google/FB/WhatsApp get lost. No proper follow-up system. Manual admission process takes hours.',
    features: [
      'Centralized lead management dashboard',
      'Automated follow-up reminders',
      'Digital admission forms & document upload',
      'Bulk student onboarding system',
    ],
  },
  {
    id: 6,
    title: 'Exam Management Complexity',
    subtitle: 'एग्जाम मैनेजमेंट में लगता है पूरा समय',
    description:
      'Creating exams, hall tickets, result entry, report cards - everything manual and time-consuming.',
    features: [
      'Bulk exam creation & management',
      'QR code hall tickets with PWA scanning',
      'Digital result entry system',
      'Auto-generated report cards with notifications',
    ],
  },
];
const link = [
  'https://images.pexels.com/photos/34556410/pexels-photo-34556410.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34583569/pexels-photo-34583569.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34583479/pexels-photo-34583479.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34571564/pexels-photo-34571564.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34571562/pexels-photo-34571562.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34573326/pexels-photo-34573326.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34549632/pexels-photo-34549632.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5885963/pexels-photo-5885963.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2825034/pexels-photo-2825034.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/19133587/pexels-photo-19133587.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7450281/pexels-photo-7450281.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/4761388/pexels-photo-4761388.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6603118/pexels-photo-6603118.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/12471831/pexels-photo-12471831.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/4718513/pexels-photo-4718513.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/31305922/pexels-photo-31305922.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/12244374/pexels-photo-12244374.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/19913299/pexels-photo-19913299.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5885799/pexels-photo-5885799.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6530923/pexels-photo-6530923.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34556410/pexels-photo-34556410.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34583569/pexels-photo-34583569.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34583479/pexels-photo-34583479.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34571564/pexels-photo-34571564.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34571562/pexels-photo-34571562.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34573326/pexels-photo-34573326.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/34549632/pexels-photo-34549632.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5885963/pexels-photo-5885963.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2825034/pexels-photo-2825034.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/19133587/pexels-photo-19133587.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7450281/pexels-photo-7450281.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/4761388/pexels-photo-4761388.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6603118/pexels-photo-6603118.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/12471831/pexels-photo-12471831.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/4718513/pexels-photo-4718513.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/31305922/pexels-photo-31305922.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/12244374/pexels-photo-12244374.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/19913299/pexels-photo-19913299.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5885799/pexels-photo-5885799.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6530923/pexels-photo-6530923.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/9775672/pexels-photo-9775672.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/33323042/pexels-photo-33323042.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7702449/pexels-photo-7702449.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2476040/pexels-photo-2476040.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/4974418/pexels-photo-4974418.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/26852338/pexels-photo-26852338.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/10683343/pexels-photo-10683343.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/13802951/pexels-photo-13802951.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7859331/pexels-photo-7859331.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6626747/pexels-photo-6626747.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5911872/pexels-photo-5911872.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/9489454/pexels-photo-9489454.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/8727486/pexels-photo-8727486.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/10398050/pexels-photo-10398050.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6256848/pexels-photo-6256848.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/9363723/pexels-photo-9363723.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/11432781/pexels-photo-11432781.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/10414226/pexels-photo-10414226.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7658949/pexels-photo-7658949.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7496163/pexels-photo-7496163.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7253666/pexels-photo-7253666.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/10210033/pexels-photo-10210033.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2700073/pexels-photo-2700073.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/4550836/pexels-photo-4550836.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6973811/pexels-photo-6973811.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6594254/pexels-photo-6594254.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5645923/pexels-photo-5645923.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7578688/pexels-photo-7578688.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/9167940/pexels-photo-9167940.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/19303044/pexels-photo-19303044.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/10317460/pexels-photo-10317460.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2836541/pexels-photo-2836541.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5095882/pexels-photo-5095882.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6964122/pexels-photo-6964122.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/5491892/pexels-photo-5491892.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6508565/pexels-photo-6508565.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7193537/pexels-photo-7193537.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/8273622/pexels-photo-8273622.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/8499278/pexels-photo-8499278.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7690880/pexels-photo-7690880.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/9366572/pexels-photo-9366572.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/19426671/pexels-photo-19426671.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/29848304/pexels-photo-29848304.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/33323054/pexels-photo-33323054.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2541981/pexels-photo-2541981.png?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/3095442/pexels-photo-3095442.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6802957/pexels-photo-6802957.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7515728/pexels-photo-7515728.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7295722/pexels-photo-7295722.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/13188826/pexels-photo-13188826.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/6809860/pexels-photo-6809860.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/7657851/pexels-photo-7657851.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/8250215/pexels-photo-8250215.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/9363386/pexels-photo-9363386.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/9363611/pexels-photo-9363611.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/8346224/pexels-photo-8346224.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/3640571/pexels-photo-3640571.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/3289131/pexels-photo-3289131.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/30116476/pexels-photo-30116476.jpeg?auto=compress&cs=tinysrgb&h=350',
];
export const institutes: Institute[] = [
  {
    id: 1,
    name: "St. Xavier's High School",
    image:
      'https://images.pexels.com/photos/34556412/pexels-photo-34556412.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Managing attendance and fee tracking is now a breeze with Shiksha Cloud.',
  },
  {
    id: 2,
    name: 'Bright Future Public School',
    image:
      'https://images.pexels.com/photos/34583569/pexels-photo-34583569.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      "We've replaced paper registers with digital dashboards—parents love the updates.",
  },
  {
    id: 3,
    name: 'City Pride Junior College',
    image:
      'https://images.pexels.com/photos/34583479/pexels-photo-34583479.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Shiksha Cloud helped us centralize student data and simplify parent communication.',
  },
  {
    id: 4,
    name: 'Little Scholars Academy',
    image:
      'https://images.pexels.com/photos/34571564/pexels-photo-34571564.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Our teachers spend more time teaching and less time on admin work now.',
  },
  {
    id: 5,
    name: 'EduBridge Coaching Center',
    image:
      'https://images.pexels.com/photos/34571562/pexels-photo-34571562.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Admissions, leads, and follow-ups—all managed in one place effortlessly.',
  },
  {
    id: 6,
    name: 'Sunrise International School',
    image:
      'https://images.pexels.com/photos/34573326/pexels-photo-34573326.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Parents get real-time alerts about attendance and performance.',
  },
  {
    id: 7,
    name: 'Wisdom Valley High',
    image:
      'https://images.pexels.com/photos/34549632/pexels-photo-34549632.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'We run all our branches on Shiksha Cloud—smooth, fast, and reliable.',
  },
  {
    id: 8,
    name: 'Bloomfield Montessori',
    image:
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Our staff onboarding is faster than ever with digital document tracking.',
  },
  {
    id: 9,
    name: 'National Convent School',
    image:
      'https://images.pexels.com/photos/5885963/pexels-photo-5885963.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'From fee reminders to report cards, everything is automated now.',
  },
  {
    id: 10,
    name: 'Elite Coaching Classes',
    image:
      'https://images.pexels.com/photos/2825034/pexels-photo-2825034.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'CRM integration helped us increase enrollments by 30% this season.',
  },
  {
    id: 11,
    name: 'Greenwood Academy',
    image:
      'https://images.pexels.com/photos/19133587/pexels-photo-19133587.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Shiksha Cloud simplified our attendance and fee reconciliation process.',
  },
  {
    id: 12,
    name: 'Blue Horizon Public School',
    image:
      'https://images.pexels.com/photos/7450281/pexels-photo-7450281.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The parent dashboard keeps families updated without extra effort.',
  },
  {
    id: 13,
    name: 'Achievers Science Hub',
    image:
      'https://images.pexels.com/photos/4761388/pexels-photo-4761388.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We manage leads from Google Ads seamlessly through the CRM.',
  },
  {
    id: 14,
    name: 'Silver Oak High School',
    image:
      'https://images.pexels.com/photos/6603118/pexels-photo-6603118.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Switching from Excel to Shiksha Cloud was the best decision for us.',
  },
  {
    id: 15,
    name: 'Future Minds Academy',
    image:
      'https://images.pexels.com/photos/12471831/pexels-photo-12471831.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Our teachers now mark attendance digitally in seconds.',
  },
  {
    id: 16,
    name: 'Harmony Public School',
    image:
      'https://images.pexels.com/photos/4718513/pexels-photo-4718513.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Shiksha Cloud made data management transparent and organized.',
  },
  {
    id: 17,
    name: 'Apex Junior College',
    image:
      'https://images.pexels.com/photos/31305922/pexels-photo-31305922.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The online payment system is smooth and reliable for all parents.',
  },
  {
    id: 18,
    name: 'Galaxy English Medium School',
    image:
      'https://images.pexels.com/photos/12244374/pexels-photo-12244374.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Managing grades and sections has never been this easy.',
  },
  {
    id: 19,
    name: 'Scholars Den Coaching',
    image:
      'https://images.pexels.com/photos/19913299/pexels-photo-19913299.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'We track every inquiry to admission using built-in lead management.',
  },
  {
    id: 20,
    name: 'Smart Vision School',
    image:
      'https://images.pexels.com/photos/5885799/pexels-photo-5885799.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      "Our admins love the analytics dashboard—it's clear and powerful.",
  },
  {
    id: 21,
    name: 'Nirmal Jyoti High School',
    image:
      'https://images.pexels.com/photos/6530923/pexels-photo-6530923.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'All student documents are now digital and securely stored.',
  },
  {
    id: 22,
    name: 'Kumar Science Academy',
    image:
      'https://images.pexels.com/photos/34556410/pexels-photo-34556410.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Shiksha Cloud gave us complete visibility across all batches.',
  },
  {
    id: 23,
    name: 'Oxford International School',
    image:
      'https://images.pexels.com/photos/34583569/pexels-photo-34583569.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Parents appreciate getting instant alerts on attendance and grades.',
  },
  {
    id: 24,
    name: 'EduPoint Tutorials',
    image:
      'https://images.pexels.com/photos/34583479/pexels-photo-34583479.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Fee reminders go automatically—no more manual follow-ups.',
  },
  {
    id: 25,
    name: 'Heritage Convent',
    image:
      'https://images.pexels.com/photos/34571564/pexels-photo-34571564.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Our teachers collaborate better now with centralized access.',
  },
  {
    id: 26,
    name: 'Bright Scholars Academy',
    image:
      'https://images.pexels.com/photos/34571562/pexels-photo-34571562.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Digital notices save us hours of manual communication each week.',
  },
  {
    id: 27,
    name: 'Zenith Commerce Classes',
    image:
      'https://images.pexels.com/photos/34573326/pexels-photo-34573326.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'CRM tracking helped us convert more leads into admissions.',
  },
  {
    id: 28,
    name: 'Pragati Coaching Institute',
    image:
      'https://images.pexels.com/photos/34549632/pexels-photo-34549632.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Automated reports helped us stay audit-ready throughout the year.',
  },
  {
    id: 29,
    name: 'Shree Vidya Mandir',
    image:
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We now run a paperless office—thanks to Shiksha Cloud.',
  },
  {
    id: 30,
    name: "Newton's Edge Learning",
    image:
      'https://images.pexels.com/photos/5885963/pexels-photo-5885963.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Smart tools helped us scale from 300 to 1200 students easily.',
  },
  {
    id: 31,
    name: 'Alpha Public School',
    image:
      'https://images.pexels.com/photos/2825034/pexels-photo-2825034.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: "Role-based dashboards make everyone's work smoother.",
  },
  {
    id: 32,
    name: 'Mentor Academy',
    image:
      'https://images.pexels.com/photos/19133587/pexels-photo-19133587.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Our teachers track student performance with ease now.',
  },
  {
    id: 33,
    name: 'Excel Tutorials',
    image:
      'https://images.pexels.com/photos/7450281/pexels-photo-7450281.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Automated notifications improved our communication instantly.',
  },
  {
    id: 34,
    name: 'Sharda Vidyalaya',
    image:
      'https://images.pexels.com/photos/4761388/pexels-photo-4761388.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Parents can check results and attendance on their phones.',
  },
  {
    id: 35,
    name: 'TopRank Coaching',
    image:
      'https://images.pexels.com/photos/6603118/pexels-photo-6603118.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Leads from Facebook Ads directly flow into our CRM dashboard.',
  },
  {
    id: 36,
    name: 'Mount Carmel School',
    image:
      'https://images.pexels.com/photos/12471831/pexels-photo-12471831.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Everything—from attendance to documents—is cloud managed.',
  },
  {
    id: 37,
    name: 'Inspire Academy',
    image:
      'https://images.pexels.com/photos/4718513/pexels-photo-4718513.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We use analytics to monitor attendance and engagement daily.',
  },
  {
    id: 38,
    name: 'Vision Coaching Center',
    image:
      'https://images.pexels.com/photos/31305922/pexels-photo-31305922.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Our counselors track and convert inquiries faster than before.',
  },
  {
    id: 39,
    name: 'Sai International School',
    image:
      'https://images.pexels.com/photos/12244374/pexels-photo-12244374.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Shiksha Cloud reduced our admin workload by over 60%.',
  },
  {
    id: 40,
    name: 'Bright Path Junior College',
    image:
      'https://images.pexels.com/photos/19913299/pexels-photo-19913299.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Students and parents both love the new digital experience.',
  },
  {
    id: 41,
    name: 'MindSpace Coaching',
    image:
      'https://images.pexels.com/photos/5885799/pexels-photo-5885799.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Tracking leads and follow-ups has become effortless for us.',
  },
  {
    id: 42,
    name: 'Sunbeam Public School',
    image:
      'https://images.pexels.com/photos/6530923/pexels-photo-6530923.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'No more lost records—every detail is securely stored online.',
  },
  {
    id: 43,
    name: 'Trinity Convent School',
    image:
      'https://images.pexels.com/photos/9775672/pexels-photo-9775672.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Online payments made collections easy for all parents.',
  },
  {
    id: 44,
    name: 'StepUp Coaching Institute',
    image:
      'https://images.pexels.com/photos/33323042/pexels-photo-33323042.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We now manage multiple batches without any confusion.',
  },
  {
    id: 45,
    name: 'Cambridge Junior College',
    image:
      'https://images.pexels.com/photos/7702449/pexels-photo-7702449.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We get accurate reports on attendance and fees instantly.',
  },
  {
    id: 46,
    name: 'Daffodil High School',
    image:
      'https://images.pexels.com/photos/2476040/pexels-photo-2476040.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Digital circulars replaced manual notice boards completely.',
  },
  {
    id: 47,
    name: 'Rising Star Academy',
    image:
      'https://images.pexels.com/photos/4974418/pexels-photo-4974418.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Parents appreciate getting notifications instantly on WhatsApp.',
  },
  {
    id: 48,
    name: 'Alpha Tutorials',
    image:
      'https://images.pexels.com/photos/26852338/pexels-photo-26852338.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Everything runs smoothly—attendance, fees, communication.',
  },
  {
    id: 49,
    name: 'Kidz Orbit Pre-School',
    image:
      'https://images.pexels.com/photos/10683343/pexels-photo-10683343.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: "Managing tiny tots' attendance is finally easy and fun.",
  },
  {
    id: 50,
    name: 'Bright Minds Learning Center',
    image:
      'https://images.pexels.com/photos/13802951/pexels-photo-13802951.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We use the mobile app daily—parents love its simplicity.',
  },
  {
    id: 51,
    name: 'City Scholars College',
    image:
      'https://images.pexels.com/photos/7859331/pexels-photo-7859331.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Fee receipts are auto-generated and error-free now.',
  },
  {
    id: 52,
    name: 'EduWave Coaching',
    image:
      'https://images.pexels.com/photos/6626747/pexels-photo-6626747.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'CRM integration simplified our admission process entirely.',
  },
  {
    id: 53,
    name: 'Pioneer Convent',
    image:
      'https://images.pexels.com/photos/5911872/pexels-photo-5911872.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'The dashboard is intuitive—no training required.',
  },
  {
    id: 54,
    name: 'Visionary Public School',
    image:
      'https://images.pexels.com/photos/9489454/pexels-photo-9489454.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Transparency between parents and teachers improved a lot.',
  },
  {
    id: 55,
    name: 'National Academy',
    image:
      'https://images.pexels.com/photos/8727486/pexels-photo-8727486.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Document verification takes minutes instead of days.',
  },
  {
    id: 56,
    name: 'Modern Edge Institute',
    image:
      'https://images.pexels.com/photos/10398050/pexels-photo-10398050.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We handle 5 branches from one admin dashboard now.',
  },
  {
    id: 57,
    name: 'Smart Steps Academy',
    image:
      'https://images.pexels.com/photos/6256848/pexels-photo-6256848.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'All communication logs are stored neatly for future reference.',
  },
  {
    id: 58,
    name: 'Global Convent School',
    image:
      'https://images.pexels.com/photos/9363723/pexels-photo-9363723.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Our multi-branch data is synchronized automatically.',
  },
  {
    id: 59,
    name: 'Excel Academy',
    image:
      'https://images.pexels.com/photos/11432781/pexels-photo-11432781.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We save hours every week thanks to automation tools.',
  },
  {
    id: 60,
    name: 'Shanti Vidyalaya',
    image:
      'https://images.pexels.com/photos/10414226/pexels-photo-10414226.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Parents can now download fee receipts anytime they want.',
  },
  {
    id: 61,
    name: 'EduNext Coaching',
    image:
      'https://images.pexels.com/photos/7658949/pexels-photo-7658949.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Leads from WhatsApp ads are captured automatically.',
  },
  {
    id: 62,
    name: 'Springdale High School',
    image:
      'https://images.pexels.com/photos/7496163/pexels-photo-7496163.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Attendance analytics help us monitor trends quickly.',
  },
  {
    id: 63,
    name: 'MindBloom Academy',
    image:
      'https://images.pexels.com/photos/7253666/pexels-photo-7253666.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Our teachers no longer rely on paper registers.',
  },
  {
    id: 64,
    name: 'Innova Public School',
    image:
      'https://images.pexels.com/photos/10210033/pexels-photo-10210033.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'The admin dashboard is our go-to for daily operations.',
  },
  {
    id: 65,
    name: 'Peak Performance Coaching',
    image:
      'https://images.pexels.com/photos/2700073/pexels-photo-2700073.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Lead management improved our admission rate significantly.',
  },
  {
    id: 66,
    name: 'Alpha Beta International School',
    image:
      'https://images.pexels.com/photos/4550836/pexels-photo-4550836.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Everything is digital, organized, and parent-friendly.',
  },
  {
    id: 67,
    name: 'Elite Edge Tutorials',
    image:
      'https://images.pexels.com/photos/6973811/pexels-photo-6973811.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'With Shiksha Cloud, our teachers feel empowered and efficient.',
  },
  {
    id: 68,
    name: 'New Era Junior College',
    image:
      'https://images.pexels.com/photos/6594254/pexels-photo-6594254.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Instant notifications make communication much faster.',
  },
  {
    id: 69,
    name: 'SmartStart Academy',
    image:
      'https://images.pexels.com/photos/5645923/pexels-photo-5645923.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'Fee collection tracking is now fully automated.',
  },
  {
    id: 70,
    name: 'Evergreen Public School',
    image:
      'https://images.pexels.com/photos/7578688/pexels-photo-7578688.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph: 'We trust Shiksha Cloud to run our entire school digitally.',
  },
  {
    id: 71,
    name: 'Bright Future High School',
    image:
      'https://images.pexels.com/photos/9167940/pexels-photo-9167940.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Managing fees and attendance has never been easier. Shiksha Cloud saves us hours every week.',
  },
  {
    id: 72,
    name: 'Sunrise International School',
    image:
      'https://images.pexels.com/photos/19303044/pexels-photo-19303044.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Parents love getting instant updates — no more WhatsApp chaos. Everything is on one dashboard.',
  },
  {
    id: 73,
    name: 'Bluebell Public School',
    image:
      'https://images.pexels.com/photos/10317460/pexels-photo-10317460.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      "Our teachers find the attendance module fast and reliable. We've completely stopped using paper registers.",
  },
  {
    id: 74,
    name: 'Mount View Academy',
    image:
      'https://images.pexels.com/photos/2836541/pexels-photo-2836541.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The dashboard gives us total control — from fee tracking to staff reports. Super helpful for admins.',
  },
  {
    id: 75,
    name: 'Harmony Convent School',
    image:
      'https://images.pexels.com/photos/5095882/pexels-photo-5095882.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Setup took less than a day. Everything just works out of the box — perfect for schools like ours.',
  },
  {
    id: 76,
    name: 'Oxford Junior College',
    image:
      'https://images.pexels.com/photos/6964122/pexels-photo-6964122.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'We switched from spreadsheets to Shiksha Cloud — now everything is automated and beautifully organized.',
  },
  {
    id: 77,
    name: 'Little Champs Pre-School',
    image:
      'https://images.pexels.com/photos/5491892/pexels-photo-5491892.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Our parents are happier than ever. Fee payments and communication are seamless now.',
  },
  {
    id: 78,
    name: 'Hillcrest Senior Secondary',
    image:
      'https://images.pexels.com/photos/6508565/pexels-photo-6508565.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The admin dashboard gives a clear picture of daily operations. Reports are detailed and easy to export.',
  },
  {
    id: 79,
    name: 'Elite Scholars Academy',
    image:
      'https://images.pexels.com/photos/7193537/pexels-photo-7193537.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'We finally have one place for attendance, communication, and reports — all in real time.',
  },
  {
    id: 80,
    name: 'Greenfield Convent School',
    image:
      'https://images.pexels.com/photos/8273622/pexels-photo-8273622.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Everything feels so organized now. The automation has reduced our manual work by half.',
  },
  {
    id: 81,
    name: 'Riverdale Public School',
    image:
      'https://images.pexels.com/photos/8499278/pexels-photo-8499278.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'As a principal, I love how transparent the system is. Parents and teachers are finally on the same page.',
  },
  {
    id: 82,
    name: 'Galaxy Coaching Center',
    image:
      'https://images.pexels.com/photos/7690880/pexels-photo-7690880.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Lead management and student tracking are top-notch. We no longer lose inquiries.',
  },
  {
    id: 83,
    name: 'Knowledge Tree Academy',
    image:
      'https://images.pexels.com/photos/9366572/pexels-photo-9366572.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Smooth interface and fast performance. Even our less tech-savvy staff adapted quickly.',
  },
  {
    id: 84,
    name: 'Inspire Learning Hub',
    image:
      'https://images.pexels.com/photos/19426671/pexels-photo-19426671.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      "I've tried three school CRMs — Shiksha Cloud is the only one that delivers everything it promises.",
  },
  {
    id: 85,
    name: 'NextGen Tutorials',
    image:
      'https://images.pexels.com/photos/29848304/pexels-photo-29848304.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Attendance, fees, and results — all in one place. Makes managing coaching batches effortless.',
  },
  {
    id: 86,
    name: 'Vision Valley School',
    image:
      'https://images.pexels.com/photos/33323054/pexels-photo-33323054.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Real-time notifications to parents have completely changed how we communicate.',
  },
  {
    id: 87,
    name: 'StepUp Coaching Institute',
    image:
      'https://images.pexels.com/photos/2541981/pexels-photo-2541981.png?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The lead follow-up feature helps us convert inquiries much faster than before.',
  },
  {
    id: 88,
    name: 'Starlight High School',
    image:
      'https://images.pexels.com/photos/3095442/pexels-photo-3095442.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'No more missed payments or lost documents. Shiksha Cloud keeps everything organized for us.',
  },
  {
    id: 89,
    name: 'City Edge Academy',
    image:
      'https://images.pexels.com/photos/6802957/pexels-photo-6802957.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Our teachers love the clean interface. Attendance and reports are just a few clicks away.',
  },
  {
    id: 90,
    name: 'DreamPath International',
    image:
      'https://images.pexels.com/photos/7515728/pexels-photo-7515728.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The parent portal is a game-changer. Parents get every update instantly.',
  },
  {
    id: 91,
    name: 'Wisdom Public School',
    image:
      'https://images.pexels.com/photos/7295722/pexels-photo-7295722.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      "We've gone completely paperless. Shiksha Cloud made digital transformation simple.",
  },
  {
    id: 92,
    name: 'Global Heights Academy',
    image:
      'https://images.pexels.com/photos/13188826/pexels-photo-13188826.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Support is amazing — they listen to feedback and actually roll out updates based on it.',
  },
  {
    id: 93,
    name: 'Mentor Academy',
    image:
      'https://images.pexels.com/photos/6809860/pexels-photo-6809860.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Document verification workflow has saved us countless hours during admissions.',
  },
  {
    id: 94,
    name: 'Silver Oak Public School',
    image:
      'https://images.pexels.com/photos/7657851/pexels-photo-7657851.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The analytics dashboard gives deep insights into attendance and fee trends. Very useful for planning.',
  },
  {
    id: 95,
    name: 'Smart Minds Junior School',
    image:
      'https://images.pexels.com/photos/8250215/pexels-photo-8250215.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Parents appreciate the transparency. They can see everything without having to ask.',
  },
  {
    id: 96,
    name: 'Alpha Convent Academy',
    image:
      'https://images.pexels.com/photos/9363386/pexels-photo-9363386.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      "We've reduced communication gaps between staff and parents to almost zero.",
  },
  {
    id: 97,
    name: 'Harmony Tutorial Center',
    image:
      'https://images.pexels.com/photos/9363611/pexels-photo-9363611.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Integrating PhonePe payments has made fee collection completely stress-free.',
  },
  {
    id: 98,
    name: 'Oakridge Public School',
    image:
      'https://images.pexels.com/photos/8346224/pexels-photo-8346224.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'The anonymous complaint box was a thoughtful addition — students feel safer speaking up.',
  },
  {
    id: 99,
    name: 'Bright Scholars Institute',
    image:
      'https://images.pexels.com/photos/3640571/pexels-photo-3640571.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'Reports are accurate, quick, and easy to share with our management team.',
  },
  {
    id: 100,
    name: 'Evergreen Learning Center',
    image:
      'https://images.pexels.com/photos/3289131/pexels-photo-3289131.jpeg?auto=compress&cs=tinysrgb&h=350',
    paragraph:
      'From setup to daily use, everything about Shiksha Cloud feels simple and reliable.',
  },
];

// Teacher Management:
export const subjects = [
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Biology', label: 'Biology' },
  { value: 'English', label: 'English' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Science', label: 'Science' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'History', label: 'History' },
  { value: 'Geography', label: 'Geography' },
  { value: 'Economics', label: 'Economics' },
  { value: 'Political Science', label: 'Political Science' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Physical Education', label: 'Physical Education' },
  { value: 'Art', label: 'Art' },
  { value: 'Music', label: 'Music' },
];

export const grades = [
  { value: 'Grade 1', label: 'Grade 1' },
  { value: 'Grade 2', label: 'Grade 2' },
  { value: 'Grade 3', label: 'Grade 3' },
  { value: 'Grade 4', label: 'Grade 4' },
  { value: 'Grade 5', label: 'Grade 5' },
  { value: 'Grade 6', label: 'Grade 6' },
  { value: 'Grade 7', label: 'Grade 7' },
  { value: 'Grade 8', label: 'Grade 8' },
  { value: 'Grade 9', label: 'Grade 9' },
  { value: 'Grade 10', label: 'Grade 10' },
  { value: 'Grade 11', label: 'Grade 11' },
  { value: 'Grade 12', label: 'Grade 12' },
];

export const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Gujarati', label: 'Gujarati' },
];

export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const maharashtraDistricts = [
  'Ahmednagar',
  'Akola',
  'Amravati',
  'Aurangabad (Chhatrapati Sambhajinagar)',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Osmanabad (Dharashiv)',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal',
];

// Document Verification

export const documentRejectionReasons = {
  AADHAAR: [
    'The Aadhaar card image is too blurry to read the full name or DOB. Please upload a clearer version.',
    'We couldn’t verify the Aadhaar number as the last 4 digits are partially hidden. Full visibility is required.',
    'This Aadhaar card appears to be cropped or cut. Please upload the full document including barcode.',
    'The uploaded Aadhaar card seems to belong to someone else. Please ensure it matches the registered name.',
  ],
  PAN: [
    'The PAN card photo is unclear, especially the text area. Kindly upload a higher quality scan.',
    "We couldn't verify the PAN number due to partial visibility. Please make sure the full card is visible.",
    'The document appears to be a photocopy with low contrast. Please upload a scanned original.',
    'PAN name does not match the registered user’s name. Please double-check before uploading.',
  ],
  PASSPORT: [
    'The passport page with your photo and details is either missing or unreadable. Please check and re-upload.',
    'The MRZ (barcode at bottom) is not visible. Please upload the full passport page without cropping.',
    'Your passport image is too dark or poorly lit. Kindly upload a well-scanned version.',
    'The passport appears to be expired. Please upload a valid version.',
  ],
  BIRTH_CERTIFICATE: [
    'The issuing authority’s seal or stamp is not visible. Please upload a certified document.',
    'Important fields like DOB or name are unclear or cut off. Kindly upload a complete certificate.',
    'Handwritten entries on the certificate are difficult to read. Please upload a clearer copy.',
    'The birth certificate seems to be in regional language only. Please attach an English-translated copy if available.',
  ],
  TRANSFER_CERTIFICATE: [
    'The official school/college stamp is missing or unclear. Please upload a certified document.',
    'We couldn’t find the name of the issuing institution. Make sure the full certificate is uploaded.',
    'Your Transfer Certificate appears to be tampered with or edited. Please upload a fresh one.',
    'The document format doesn’t match typical TC layout. Kindly verify and re-upload.',
  ],
  BANK_PASSBOOK: [
    'The account holder name is unclear or mismatched. Please ensure it matches the registered person.',
    'The uploaded image does not include IFSC, branch name, or account number. Please include all key details.',
    'This appears to be a cropped or partial page from the bank passbook. Kindly upload the full page.',
    'The scan is poorly lit or blurred, making key information unreadable.',
  ],
  PARENT_ID: [
    'The parent ID does not contain sufficient information (Name/DOB/Photo). Please upload a complete ID.',
    'The ID seems to belong to a minor or an unrelated person. Please double-check before re-uploading.',
    'Photo or signature is missing/unclear. A valid ID is required for parent verification.',
    'We could not verify the authenticity of the ID due to low image quality. Please upload a better scan.',
  ],
  AGREEMENT: [
    'The document appears unsigned or lacks official seal/stamp. Please upload a complete agreement.',
    'Some pages seem to be missing from the agreement. Ensure all pages are uploaded.',
    'Text is too faded or faint to read clearly. Kindly upload a scanned version, not a photo.',
    'The agreement format appears invalid or incomplete. Please verify and re-upload.',
  ],
};

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





