'use client';

import { useState } from 'react';
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  UserCheck,
  BookOpen,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Zap,
  HeadphonesIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SupportPopup } from './SupportPopup';
import { DialogDescription } from '@radix-ui/react-dialog';

// Import the features data
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
      },
      {
        feature: 'Online Fee Payment',
        description: 'UPI/Card/Bank options for paying fees directly',
      },
      {
        feature: 'Receive Notices',
        description: 'Get school announcements via SMS, Email, WhatsApp',
      },
      {
        feature: 'Student Profile Page',
        description: 'Students can update their own basic information',
      },
      {
        feature: 'Attendance History',
        description: 'View personal daily/monthly attendance with status',
      },
      {
        feature: 'View Holiday Calendar',
        description: 'See declared and upcoming holidays (planned/emergency)',
      },
      {
        feature: 'Upload Documents',
        description: 'Upload Aadhaar, TC, Birth Certificate, etc.',
      },
      {
        feature: 'Track Document Status',
        description: 'See verification status of uploaded documents',
      },
      {
        feature: 'Anonymous Complaint',
        description: 'Submit issues privately to school admin/teachers',
      },
      {
        feature: 'View Section & Teachers',
        description: 'View assigned grade, section, and teachers',
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
      },
      {
        feature: 'View & Download Receipts',
        description:
          'Get receipts via WhatsApp, SMS, Email, or direct download',
      },
      {
        feature: 'Get Notifications',
        description:
          'Alerts via WhatsApp, SMS, and Email (fees, notices, attendance)',
      },
      {
        feature: 'Track Fee History',
        description: 'Full view of past payments, dues, and reminders',
      },
      {
        feature: 'Link with Child Profiles',
        description: "Monitor children's data and progress",
      },
      {
        feature: 'Multiple Parents per Child',
        description: 'Both parents get alerts, primary parent can be set',
      },
      {
        feature: 'Anonymous Complaint Box',
        description: 'Raise issues privately to the school',
      },
      {
        feature: 'Notices & Announcements',
        description: 'View and receive school-wide notices',
      },
      {
        feature: "View Child's Attendance",
        description: 'Track attendance records of children',
      },
      {
        feature: 'Parent Profile',
        description: 'Edit your profile info and view children connected',
      },
    ],
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
      },
      {
        feature: 'Manage Classes',
        description: 'View students and subjects in assigned sections',
      },
      {
        feature: 'Take Attendance',
        description: 'Mark student attendance with 1 click, AI suggestions',
      },
      {
        feature: 'View Section Summary',
        description: 'See attendance overview and late/absent stats',
      },
      {
        feature: 'Assign Subjects',
        description: 'Assigned to subjects per section and grade',
      },
      {
        feature: 'Receive Notices',
        description:
          'Notices from admin delivered to dashboard and via messages',
      },
      {
        feature: 'Complaint Resolution',
        description: 'Investigate and update complaint status',
      },
      {
        feature: 'Upload Documents',
        description: 'Upload ID, resume, and certificates',
      },
      {
        feature: 'Holiday Calendar Access',
        description: 'Know upcoming breaks or declared holidays',
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
      },
      {
        feature: 'Add & Assign Teachers',
        description: 'Add teachers and assign them to sections and subjects',
      },
      {
        feature: 'Grade & Section Management',
        description: 'Create/edit class names and sections like 10-A, 12-B',
      },
      {
        feature: 'Fee Setup & Tracking',
        description:
          'Create fee categories, assign to students, monitor collections',
      },
      {
        feature: 'Online Payments Tracking',
        description: 'Monitor payments including platform fee and status',
      },
      {
        feature: 'Bulk Student Import',
        description: 'Import student records via Google Sheet or CSV template',
      },
      {
        feature: 'Holiday Management',
        description: 'Create/declare planned or sudden holidays',
      },
      {
        feature: 'Notice Publishing System',
        description:
          'Approve, reject, or schedule notices for students and staff',
      },
      {
        feature: 'Dashboard Reporting',
        description: 'View overall fee, attendance, complaint stats',
      },
      {
        feature: 'Notification Logs',
        description: 'Track who received which messages, on which channel',
      },
      {
        feature: 'Document Verification',
        description: 'Review and verify submitted student/teacher documents',
      },
      {
        feature: 'Manage Complaints',
        description: 'Investigate anonymous issues from students or parents',
      },
      {
        feature: 'Admin Profile & Settings',
        description:
          'Update admin contact details, password, and notification preferences',
      },
      {
        feature: 'Organization Plans',
        description:
          'Control features based on Free, Premium, Enterprise plans',
      },
    ],
  },
};

// FAQ data organized by user type
const faqData = {
  general: [
    {
      question: 'How do I get started with the platform?',
      answer:
        'Getting started is easy! First, your school admin will create your account and send you login credentials via email or SMS. Once you receive them, simply log in and complete your profile setup. Each user type (Student, Parent, Teacher, Admin) has a personalized dashboard with relevant features.',
    },
    {
      question: 'Is my data secure on this platform?',
      answer:
        'We use enterprise-grade security measures including SSL encryption, secure data centers, and regular security audits. Your personal information is never shared with third parties, and we comply with all data protection regulations.',
    },
    {
      question: 'Can I access the platform on my mobile device?',
      answer:
        'Yes! Our platform is fully responsive and works seamlessly on all devices - smartphones, tablets, and desktops. We also have dedicated mobile apps available for download from the App Store and Google Play Store.',
    },
    {
      question: 'What should I do if I forget my password?',
      answer:
        "Click on 'Forgot Password' on the login page and enter your registered email or phone number. You'll receive a password reset link via email or SMS. Follow the instructions to create a new password.",
    },
  ],
  student: [
    {
      question: 'How do I pay my fees online?',
      answer:
        "Go to the 'Fees' section in your dashboard, select the pending fee, and click 'Pay Now'. You can pay using UPI, debit/credit cards, or net banking. After successful payment, you'll receive a receipt via email and SMS.",
    },
    {
      question: 'Where can I view my attendance record?',
      answer:
        "Your attendance is available in the 'Attendance' section of your dashboard. You can view daily, weekly, or monthly attendance with detailed status (Present, Absent, Late). The system also shows your attendance percentage.",
    },
    {
      question: 'How do I upload required documents?',
      answer:
        "Navigate to 'Documents' in your profile section. Click 'Upload New Document', select the document type (Aadhaar, Birth Certificate, etc.), and upload a clear photo or scan. You can track verification status in the same section.",
    },
  ],
  parent: [
    {
      question: 'How can I link multiple children to my account?',
      answer:
        "In your parent dashboard, go to 'Children' section and click 'Add Child'. Enter your child's student ID or registration number. Once verified by the school admin, you'll have access to all their information and can manage their fees and track attendance.",
    },
    {
      question: "Will I get notifications about my child's activities?",
      answer:
        "Yes! You'll receive real-time notifications via WhatsApp, SMS, and email for attendance updates, fee reminders, school notices, and important announcements. You can customize notification preferences in your profile settings.",
    },
    {
      question: "Can both parents access the same child's information?",
      answer:
        "Both parents can be linked to the same child's profile. The system supports multiple parents per child, and you can designate a primary parent for administrative purposes while both receive important notifications.",
    },
  ],
  teacher: [
    {
      question: 'How do I take attendance for my classes?',
      answer:
        "Go to your 'Classes' section, select the class and date, then mark attendance with a single click per student. The system provides AI suggestions based on patterns and allows bulk actions for efficiency. Attendance is automatically saved and synced.",
    },
    {
      question: 'How can I communicate with parents about student issues?',
      answer:
        "Use the 'Complaints' or 'Communication' section to send messages directly to parents. You can also update complaint statuses and provide feedback on student performance. All communications are logged for reference.",
    },
    {
      question: 'Where do I upload my teaching credentials?',
      answer:
        "In your profile section under 'Documents', you can upload your resume, teaching certificates, ID proof, and other credentials. These documents help build trust with parents and are verified by the school administration.",
    },
  ],
  admin: [
    {
      question: 'How do I add new students in bulk?',
      answer:
        "Use the 'Bulk Import' feature in the Students section. Download our CSV template, fill in student details, and upload the file. The system will validate data and create accounts automatically, sending login credentials to students and parents.",
    },
    {
      question: 'How can I track fee collections and payments?',
      answer:
        "The 'Financial Dashboard' provides comprehensive fee tracking with real-time payment status, collection reports, and pending dues. You can generate detailed reports, send payment reminders, and monitor transaction fees.",
    },
    {
      question: 'How do I manage different user roles and permissions?',
      answer:
        "In 'User Management', you can assign roles (Student, Parent, Teacher, Admin) and set specific permissions for each role. You can also create custom roles with tailored access levels based on your school's requirements.",
    },
  ],
};

// Contact information
const contactInfo = {
  phone: '+91 8459324821',
  email: 'support@shiksha.cloud',
  whatsapp: '+91 8459324821',
  address: 'Pimple Saudagar, Pune 411027',
  hours: '24/7 Support Available',
};

export default function SupportPageContent({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUserType, setActiveUserType] = useState('general');
  const [expandedFeatures, setExpandedFeatures] = useState<
    Record<string, boolean>
  >({});

  const toggleFeatureExpansion = (userType: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [userType]: !prev[userType],
    }));
  };

  const filteredFAQs =
    faqData[activeUserType as keyof typeof faqData]?.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HeadphonesIcon className="h-4 w-4" />
            24/7 Support Available
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How can we help you today?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant support for students, parents, teachers, and
            administrators. Find answers, contact our team, or explore our
            comprehensive help resources.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for help articles, features, or common questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-2 focus:border-primary"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle className="text-xl font-semibold">
                    Support Center
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Get in touch with our support team
                  </DialogDescription>
                </DialogHeader>
                <SupportPopup userId={userId} organizationId={organizationId} />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-transparent"
            >
              <Phone className="h-5 w-5" />
              Call Us: {contactInfo.phone}
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">
                Support Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {'<2hrs'}
              </div>
              <div className="text-sm text-muted-foreground">
                Average Response
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">
                Issue Resolution
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Help Articles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - FAQ and Search Results */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground mb-6">
                  Find quick answers to common questions organized by user type.
                </p>

                {/* User Type Tabs */}
                <Tabs
                  value={activeUserType}
                  onValueChange={setActiveUserType}
                  className="mb-6"
                >
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                    <TabsTrigger value="general" className="text-xs md:text-sm">
                      General
                    </TabsTrigger>
                    <TabsTrigger value="student" className="text-xs md:text-sm">
                      Student
                    </TabsTrigger>
                    <TabsTrigger value="parent" className="text-xs md:text-sm">
                      Parent
                    </TabsTrigger>
                    <TabsTrigger value="teacher" className="text-xs md:text-sm">
                      Teacher
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="text-xs md:text-sm">
                      Admin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQs.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      No results found for "{searchQuery}"
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Ask Our Support Team</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                        <DialogHeader className="px-6 py-4 border-b">
                          <DialogTitle className="text-xl font-semibold">
                            Support Center
                          </DialogTitle>
                          <DialogDescription className="text-sm text-muted-foreground">
                            Get in touch with our support team
                          </DialogDescription>
                        </DialogHeader>
                        <SupportPopup />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              {/* Feature Overview */}
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Platform Features by User Type
                </h2>
                <p className="text-muted-foreground mb-8">
                  Explore what each user type can do on our platform. Click to
                  see detailed features.
                </p>

                <div className="space-y-6">
                  {Object.entries(featuresData).map(([userType, data]) => {
                    const Icon = data.icon;
                    const isExpanded = expandedFeatures[userType];

                    return (
                      <Card key={userType} className="overflow-hidden">
                        <CardHeader
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleFeatureExpansion(userType)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-3 rounded-lg bg-${data.color}-100 dark:bg-${data.color}-900/20`}
                              >
                                <Icon
                                  className={`h-6 w-6 text-${data.color}-600 dark:text-${data.color}-400`}
                                />
                              </div>
                              <div>
                                <CardTitle className="text-xl">
                                  {userType}
                                </CardTitle>
                                <CardDescription>
                                  {data.completed.length} features available
                                </CardDescription>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="pt-0">
                            <div className="grid md:grid-cols-2 gap-4">
                              {data.completed.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/30"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-sm mb-1">
                                      {feature.feature}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {feature.description}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Resources */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Multiple ways to reach our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Phone Support</div>
                      <div className="text-sm text-muted-foreground">
                        {contactInfo.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email Support</div>
                      <div className="text-sm text-muted-foreground">
                        {contactInfo.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-sm text-muted-foreground">
                        {contactInfo.whatsapp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Support Hours</div>
                      <div className="text-sm text-muted-foreground">
                        {contactInfo.hours}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Start Live Chat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                        <DialogHeader className="px-6 py-4 border-b">
                          <DialogTitle className="text-xl font-semibold">
                            Support Center
                          </DialogTitle>
                          <DialogDescription className="text-sm text-muted-foreground">
                            Get in touch with our support team
                          </DialogDescription>
                        </DialogHeader>
                        <SupportPopup />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Links
                  </CardTitle>
                  <CardDescription>Common support resources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto p-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Getting Started Guide</div>
                      <div className="text-xs text-muted-foreground">
                        Step-by-step setup instructions
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto p-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Video Tutorials</div>
                      <div className="text-xs text-muted-foreground">
                        Watch how-to videos
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto p-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">System Status</div>
                      <div className="text-xs text-muted-foreground">
                        Check platform availability
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto p-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Feature Requests</div>
                      <div className="text-xs text-muted-foreground">
                        Suggest new features
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Satisfaction Guarantee */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">
                    100% Satisfaction Guarantee
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We're committed to resolving your issues quickly and
                    effectively. If you're not satisfied, we'll make it right.
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    98% Customer Satisfaction Rate
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Still need help?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our support team is here to help you succeed. Get in touch and we'll
            respond quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contact Support Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle className="text-xl font-semibold">
                    Support Center
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Get in touch with our support team
                  </DialogDescription>
                </DialogHeader>
                <SupportPopup />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-transparent"
            >
              <Mail className="h-5 w-5" />
              Email: {contactInfo.email}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
