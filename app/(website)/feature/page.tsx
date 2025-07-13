'use client';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  CreditCard,
  Megaphone,
  UserCheck,
  Calendar,
  Shield,
  BarChart3,
  GraduationCap,
  CheckCircle,
  Star,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CTA from '@/components/websiteComp/ctc';
import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Features – Shiksha.cloud | School Management CRM',
//   description:
//     'Discover all-in-one school management features including student database, attendance tracking, fee management, parent portal, analytics, academic planning, and more.',
//   keywords: [
//     'school management software',
//     'student information system',
//     'online attendance tracking',
//     'fee management system',
//     'parent teacher communication',
//     'school CRM features',
//     'academic calendar app',
//     'digital school platform',
//     'school data analytics',
//     'coaching class software',
//     'school ERP india',
//   ],
//   openGraph: {
//     title: 'Shiksha.cloud Features – All-in-One School CRM',
//     description:
//       'Explore powerful features of Shiksha.cloud: Manage students, fees, attendance, communication, academic planning, and analytics from a single dashboard.',
//     url: 'https://shiksha.cloud/features',
//     siteName: 'Shiksha.cloud',
//     images: [
//       {
//         url: 'https://shiksha.cloud/og/features.png',
//         width: 1200,
//         height: 630,
//         alt: 'Shiksha.cloud Features Preview',
//       },
//     ],
//     type: 'website',
//     locale: 'en_IN',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Shiksha.cloud Features',
//     description:
//       'Manage your entire school digitally — attendance, fees, parent access, analytics, and more.',
//     images: ['https://shiksha.cloud/og/features.png'],
//   },
// };

const features = [
  {
    icon: Users,
    title: 'Student Management',
    subtitle: 'Complete Student Database',
    description:
      'Comprehensive student profiles with enrollment tracking, academic records, and personal information. Never lose track of student data again.',
    benefits: [
      'Digital student profiles',
      'Enrollment tracking',
      'Academic history',
      'Document management',
    ],
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    lightGradient: 'from-blue-50 to-blue-100',
    accentColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    impact: '90% faster student data access',
  },
  {
    icon: Clock,
    title: 'Attendance System',
    subtitle: 'Digital Attendance Tracking',
    description:
      'Smart attendance marking with real-time tracking and automated parent notifications. Eliminate manual registers forever.',
    benefits: [
      'Digital marking',
      'Real-time tracking',
      'Parent notifications',
      'Attendance reports',
    ],
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    lightGradient: 'from-green-50 to-green-100',
    accentColor: 'text-green-600',
    bgColor: 'bg-green-50',
    impact: 'Save 2 hours daily',
  },
  {
    icon: CreditCard,
    title: 'Fee Management',
    subtitle: 'Automated Fee Collection',
    description:
      'Streamlined fee collection with payment tracking, automated reminders, and comprehensive financial reporting.',
    benefits: [
      'Online payments',
      'Automated reminders',
      'Payment tracking',
      'Financial reports',
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    lightGradient: 'from-purple-50 to-purple-100',
    accentColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    impact: '3x faster fee collection',
  },
  {
    icon: Megaphone,
    title: 'Notice & Communication',
    subtitle: 'Instant Announcements',
    description:
      'Send instant announcements to parents, students, and staff through multiple channels. Keep everyone informed effortlessly.',
    benefits: [
      'Multi-channel messaging',
      'Instant delivery',
      'Read receipts',
      'Scheduled announcements',
    ],
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    lightGradient: 'from-orange-50 to-orange-100',
    accentColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    impact: '100% communication reach',
  },
  {
    icon: UserCheck,
    title: 'Parent Portal',
    subtitle: 'Complete Parent Access',
    description:
      'Dedicated portal for parents to view attendance, fees, notices, and communicate directly with teachers.',
    benefits: [
      'Real-time updates',
      'Direct messaging',
      'Fee status',
      'Academic progress',
    ],
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    lightGradient: 'from-pink-50 to-pink-100',
    accentColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    impact: '95% parent satisfaction',
  },
  {
    icon: Calendar,
    title: 'Holiday & Calendar',
    subtitle: 'Academic Planning',
    description:
      'Complete academic calendar management with holiday scheduling, event planning, and automated notifications.',
    benefits: [
      'Academic calendar',
      'Event scheduling',
      'Holiday management',
      'Automated reminders',
    ],
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
    lightGradient: 'from-indigo-50 to-indigo-100',
    accentColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    impact: 'Zero scheduling conflicts',
  },
  {
    icon: Shield,
    title: 'Anonymous Complaints',
    subtitle: 'Safe Feedback System',
    description:
      'Secure anonymous feedback system for addressing sensitive issues while maintaining institutional reputation.',
    benefits: [
      'Anonymous reporting',
      'Issue tracking',
      'Resolution workflow',
      'Privacy protection',
    ],
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    lightGradient: 'from-green-50 to-green-100',
    accentColor: 'text-green-600',
    bgColor: 'bg-green-50',
    impact: '100% confidential feedback',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    subtitle: 'Data-Driven Insights',
    description:
      'Comprehensive analytics on attendance trends, fee collection, student performance, and operational metrics.',
    benefits: [
      'Performance analytics',
      'Trend analysis',
      'Custom reports',
      'Data visualization',
    ],
    color: 'yellow',
    gradient: 'from-yellow-500 to-yellow-600',
    lightGradient: 'from-yellow-50 to-yellow-100',
    accentColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    impact: 'Data-driven decisions',
  },
  {
    icon: GraduationCap,
    title: 'Grade & Section Management',
    subtitle: 'Academic Structure',
    description:
      'Organize classes, assign students to sections, and manage academic structure with complete flexibility.',
    benefits: [
      'Class organization',
      'Section management',
      'Student assignment',
      'Academic structure',
    ],
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
    lightGradient: 'from-violet-50 to-violet-100',
    accentColor: 'text-violet-600',
    bgColor: 'bg-violet-50',
    impact: 'Perfect organization',
  },
];

export default function FeaturesPage() {
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
              <Star className="w-4 h-4 mr-2 text-yellow-500" />9 Essential
              Modules
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Features That
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                Transform Schools
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every feature is designed to solve real problems that educational
              institutions face daily. These aren't just tools – they're
              solutions that directly impact your time, money, and operational
              efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group h-full cursor-pointer"
              >
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <CardContent className="px-8 py-4 relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${feature.bgColor} ${feature.accentColor} border-0 font-medium`}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {feature.impact}
                      </Badge>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                        {feature.title}
                      </h2>
                      <p
                        className={`text-sm font-semibold ${feature.accentColor} uppercase tracking-wide`}
                      >
                        {feature.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-3 mb-3">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle
                            className={`w-4 h-4 ${feature.accentColor} flex-shrink-0`}
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    {/* <Button
                      variant="ghost"
                      className={`w-full justify-between group-hover:bg-gradient-to-r group-hover:${feature.gradient}  group-hover:text-white transition-all duration-300 font-semibold`}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button> */}
                  </CardContent>

                  {/* Decorative Elements */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${feature.gradient} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity duration-500`}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      {/* <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              These 9 modules solve every major challenge educational
              institutions face. Start your transformation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section> */}

      <CTA />
    </div>
  );
}
