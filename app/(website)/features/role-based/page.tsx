'use client';

import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  GraduationCap,
  Shield,
  CheckCircle,
  Clock,
  Calendar,
  Star,
  User,
  Settings,
  BookOpen,
  CreditCard,
  Bell,
  FileText,
  BarChart3,
  MessageSquare,
  Upload,
  Eye,
  Phone,
  Brain,
  UserPlus,
  Building,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const featuresData = {
  Student: {
    icon: GraduationCap,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    lightGradient: 'from-blue-50 to-blue-100',
    accentColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    completed: [
      {
        feature: 'View & Download Fee Receipts',
        description: 'Students can see all past payments and download receipts',
        icon: FileText,
      },
      {
        feature: 'Online Fee Payment',
        description: 'UPI/Card/Bank options for paying fees directly',
        icon: CreditCard,
      },
      {
        feature: 'Receive Notices',
        description: 'Get school announcements via SMS, Email, WhatsApp',
        icon: Bell,
      },
      {
        feature: 'Student Profile Page',
        description: 'Students can update their own basic information',
        icon: User,
      },
      {
        feature: 'Attendance History',
        description: 'View personal daily/monthly attendance with status',
        icon: Calendar,
      },
      {
        feature: 'View Holiday Calendar',
        description: 'See declared and upcoming holidays (planned/emergency)',
        icon: Calendar,
      },
      {
        feature: 'Upload Documents',
        description: 'Upload Aadhaar, TC, Birth Certificate, etc.',
        icon: Upload,
      },
      {
        feature: 'Track Document Status',
        description: 'See verification status of uploaded documents',
        icon: Eye,
      },
      {
        feature: 'Anonymous Complaint',
        description: 'Submit issues privately to school admin/teachers',
        icon: MessageSquare,
      },
      {
        feature: 'View Section & Teachers',
        description: 'View assigned grade, section, and teachers',
        icon: Users,
      },
    ],
    pending: [
      {
        feature: 'Student Dashboard Overview',
        description:
          'Visual dashboard with cards for fees, attendance, documents, notices',
        icon: BarChart3,
      },
      {
        feature: 'Attendance Alerts',
        description: 'Get auto alerts on being absent or late via SMS/WhatsApp',
        icon: Bell,
      },
      {
        feature: 'Academic Profile',
        description: 'View academic performance, subjects, assignments',
        icon: BookOpen,
      },
      {
        feature: 'Student Bulk Upload + Invite',
        description: 'CSV/Sheet based import with Clerk account mapping',
        icon: UserPlus,
      },
    ],
    planned: [
      {
        feature: 'Monthly Attendance Summary',
        description: 'Comprehensive monthly attendance reports and analytics',
      },
      {
        feature: 'Assignments & Submissions',
        description: 'Submit assignments and track submission status',
      },
      {
        feature: 'Performance & Marks',
        description: 'View exam results and academic performance metrics',
      },

      {
        feature: 'Certificates',
        description: 'Download and manage academic certificates',
      },
      {
        feature: 'Leave Requests (Apply Leave)',
        description: 'Apply for leave and track approval status',
      },
      {
        feature: 'Course / Batch Enrollments',
        description: 'Enroll in courses and manage batch assignments',
      },
      {
        feature: 'Voice Assistant (Alexa)',
        description: 'Voice-powered interactions and queries',
      },
    ],
  },
  Parent: {
    icon: UserCheck,
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    lightGradient: 'from-green-50 to-green-100',
    accentColor: 'text-green-600',
    bgColor: 'bg-green-50',
    completed: [
      {
        feature: 'Pay Fees Online',
        description: 'Easily pay school fees using UPI, card, etc.',
        icon: CreditCard,
      },
      {
        feature: 'View & Download Receipts',
        description:
          'Get receipts via WhatsApp, SMS, Email, or direct download',
        icon: FileText,
      },
      {
        feature: 'Get Notifications',
        description:
          'Alerts via WhatsApp, SMS, and Email (fees, notices, attendance)',
        icon: Bell,
      },
      {
        feature: 'Track Fee History',
        description: 'Full view of past payments, dues, and reminders',
        icon: BarChart3,
      },
      {
        feature: 'Link with Child Profiles',
        description: "Monitor children's data and progress",
        icon: Users,
      },
      {
        feature: 'Multiple Parents per Child',
        description: 'Both parents get alerts, primary parent can be set',
        icon: UserCheck,
      },
      {
        feature: 'Anonymous Complaint Box',
        description: 'Raise issues privately to the school',
        icon: MessageSquare,
      },
      {
        feature: 'Notices & Announcements',
        description: 'View and receive school-wide notices',
        icon: Bell,
      },
      {
        feature: "View Child's Attendance",
        description: 'Track attendance records of children',
        icon: Calendar,
      },
      {
        feature: 'Parent Profile',
        description: 'Edit your profile info and view children connected',
        icon: User,
      },
    ],
    pending: [],
    planned: [],
  },
  Teacher: {
    icon: BookOpen,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    lightGradient: 'from-purple-50 to-purple-100',
    accentColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    completed: [
      {
        feature: 'Personal Profile Page',
        description: 'Add bio, resume, certificates, and teaching philosophy',
        icon: User,
      },
      {
        feature: 'Manage Classes',
        description: 'View students and subjects in assigned sections',
        icon: Users,
      },
      {
        feature: 'Take Attendance',
        description: 'Mark student attendance with 1 click, AI suggestions',
        icon: CheckCircle,
      },
      {
        feature: 'View Section Summary',
        description: 'See attendance overview and late/absent stats',
        icon: BarChart3,
      },
      {
        feature: 'Assign Subjects',
        description: 'Assigned to subjects per section and grade',
        icon: BookOpen,
      },
      {
        feature: 'Receive Notices',
        description:
          'Notices from admin delivered to dashboard and via messages',
        icon: Bell,
      },
      {
        feature: 'Complaint Resolution',
        description: 'Investigate and update complaint status',
        icon: MessageSquare,
      },
      {
        feature: 'Upload Documents',
        description: 'Upload ID, resume, and certificates',
        icon: Upload,
      },
      {
        feature: 'Holiday Calendar Access',
        description: 'Know upcoming breaks or declared holidays',
        icon: Calendar,
      },
    ],
    pending: [],
    planned: [
      {
        feature: 'Write Feedback',
        description: 'Provide detailed feedback on student performance',
      },
      {
        feature: 'Exam Marks Entry',
        description: 'Enter and manage student examination marks',
      },
      {
        feature: 'Assignments to Students',
        description: 'Create and assign homework and projects',
      },
      {
        feature: 'Leave Management',
        description: 'Apply for leave and manage approval workflow',
      },
      {
        feature: 'Teacher Salary & Payout',
        description: 'View salary details and payment history',
      },
      {
        feature: 'Lead Followup (CRM)',
        description: 'Follow up with prospective students and parents',
      },
    ],
  },
  Admin: {
    icon: Shield,
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    lightGradient: 'from-orange-50 to-orange-100',
    accentColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    completed: [
      {
        feature: 'Organization Setup',
        description: 'Configure logo, type, limits, and plans',
        icon: Building,
      },
      {
        feature: 'Add & Assign Teachers',
        description: 'Add teachers and assign them to sections and subjects',
        icon: UserPlus,
      },
      {
        feature: 'Grade & Section Management',
        description: 'Create/edit class names and sections like 10-A, 12-B',
        icon: Settings,
      },
      {
        feature: 'Fee Setup & Tracking',
        description:
          'Create fee categories, assign to students, monitor collections',
        icon: CreditCard,
      },
      {
        feature: 'Online Payments Tracking',
        description: 'Monitor payments including platform fee and status',
        icon: BarChart3,
      },
      {
        feature: 'Bulk Student Import',
        description: 'Import student records via Google Sheet or CSV template',
        icon: Upload,
      },
      {
        feature: 'Holiday Management',
        description: 'Create/declare planned or sudden holidays',
        icon: Calendar,
      },
      {
        feature: 'Notice Publishing System',
        description:
          'Approve, reject, or schedule notices for students and staff',
        icon: Bell,
      },
      {
        feature: 'Dashboard Reporting',
        description: 'View overall fee, attendance, complaint stats',
        icon: BarChart3,
      },
      {
        feature: 'Notification Logs',
        description: 'Track who received which messages, on which channel',
        icon: Eye,
      },
      {
        feature: 'Document Verification',
        description: 'Review and verify submitted student/teacher documents',
        icon: CheckCircle,
      },
      {
        feature: 'Manage Complaints',
        description: 'Investigate anonymous issues from students or parents',
        icon: MessageSquare,
      },
      {
        feature: 'Admin Profile & Settings',
        description:
          'Update admin contact details, password, and notification preferences',
        icon: User,
      },
      {
        feature: 'Organization Plans',
        description:
          'Control features based on Free, Premium, Enterprise plans',
        icon: Star,
      },
    ],
    pending: [
      {
        feature: 'PhonePe Payment Dashboard',
        description: 'Summarize transactions from PhonePe gateway',
        icon: Phone,
      },
      {
        feature: 'AI Report Generator',
        description: 'Monthly fee and attendance summary via AI model',
        icon: Brain,
      },
      {
        feature: 'Exam Management',
        description: 'Manage Exams and manage enrolled student',
        icon: CheckCircle,
      },
    ],
    planned: [
      {
        feature: 'Lead Management',
        description: 'Comprehensive CRM for managing prospective students',
      },
      {
        feature: 'Course & Batch Management',
        description: 'Create and manage academic courses and batches',
      },
      {
        feature: 'Certificate Generator',
        description: 'Generate and manage student certificates',
      },
      {
        feature: 'Alexa Integration',
        description: 'Voice-powered school management capabilities',
      },
    ],
  },
};

const StatusBadge = ({ status, count }: { status: string; count: number }) => {
  const statusConfig = {
    completed: {
      color: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-200',
      icon: CheckCircle,
      label: 'Completed',
    },
    pending: {
      color:
        'bg-yellow-100  hover:bg-yellow-200 text-yellow-700 border-yellow-200',
      icon: Clock,
      label: 'In Progress',
    },
    planned: {
      color: 'bg-blue-100  hover:bg-blue-200 text-blue-700 border-blue-200',
      icon: Calendar,
      label: 'Planned',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} border font-medium px-3 py-1`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label} ({count})
    </Badge>
  );
};

const FeatureCard = ({
  feature,
  status,
  roleColor,
}: {
  feature: any;
  status: string;
  roleColor: string;
}) => {
  const statusStyles = {
    completed: 'border-green-200 bg-green-50/50 hover:bg-green-50',
    pending: 'border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50',
    planned: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50',
  };

  const iconStyles = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    planned: 'text-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="group cursor-pointer"
    >
      <Card
        className={`h-full border transition-all duration-300 ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {feature.icon && (
              <div
                className={`w-8 h-8 rounded-lg bg-white border flex items-center justify-center flex-shrink-0 ${iconStyles[status as keyof typeof iconStyles]}`}
              >
                <feature.icon className="w-4 h-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">
                {feature.feature}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function FeaturesOverview() {
  const totalFeatures = Object.values(featuresData).reduce(
    (total, role) =>
      total + role.completed.length + role.pending.length + role.planned.length,
    0
  );

  const completedFeatures = Object.values(featuresData).reduce(
    (total, role) => total + role.completed.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium"
            >
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              {totalFeatures} Total Features
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Complete Feature
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                Overview
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Comprehensive breakdown of all features across different user
              roles. Track what's completed, in progress, and planned for the
              future.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 border px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                {completedFeatures} Completed
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200 border px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                {Object.values(featuresData).reduce(
                  (total, role) => total + role.pending.length,
                  0
                )}{' '}
                In Progress
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 border px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                {Object.values(featuresData).reduce(
                  (total, role) => total + role.planned.length,
                  0
                )}{' '}
                Planned
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features by Role */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {Object.entries(featuresData).map(
            ([roleName, roleData], roleIndex) => (
              <motion.div
                key={roleName}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: roleIndex * 0.1 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Role Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleData.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <roleData.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {roleName} Features
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {roleData.completed.length +
                      roleData.pending.length +
                      roleData.planned.length}{' '}
                    total features
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {roleData.completed.length > 0 && (
                      <StatusBadge
                        status="completed"
                        count={roleData.completed.length}
                      />
                    )}
                    {roleData.pending.length > 0 && (
                      <StatusBadge
                        status="pending"
                        count={roleData.pending.length}
                      />
                    )}
                    {roleData.planned.length > 0 && (
                      <StatusBadge
                        status="planned"
                        count={roleData.planned.length}
                      />
                    )}
                  </div>
                </div>

                {/* Completed Features */}
                {roleData.completed.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Completed Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {roleData.completed.map((feature, index) => (
                        <FeatureCard
                          key={index}
                          feature={feature}
                          status="completed"
                          roleColor={roleData.color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Features */}
                {roleData.pending.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                      In Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {roleData.pending.map((feature, index) => (
                        <FeatureCard
                          key={index}
                          feature={feature}
                          status="pending"
                          roleColor={roleData.color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Planned Features */}
                {roleData.planned.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      Planned Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {roleData.planned.map((feature, index) => (
                        <FeatureCard
                          key={index}
                          feature={feature}
                          status="planned"
                          roleColor={roleData.color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Summary Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Development Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    {completedFeatures}
                  </div>
                  <div className="text-sm text-gray-600">
                    Features Completed
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-600">
                    {Object.values(featuresData).reduce(
                      (total, role) => total + role.pending.length,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">In Development</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {Object.values(featuresData).reduce(
                      (total, role) => total + role.planned.length,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Planned Features</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(completedFeatures / totalFeatures) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((completedFeatures / totalFeatures) * 100)}%
                  Complete
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
