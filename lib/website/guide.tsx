'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Check,
  ArrowRight,
  Star,
  Users,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  MessageCircle,
  Calendar,
  CreditCard,
  FileText,
  BarChart3,
  Smartphone,
  Cloud,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';

// Utility functions for steps and interactions
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Main Guide Component
export default function ModernSchoolManagementGuide() {
  const [activeSection, setActiveSection] = useState('problem');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Student Management',
      description:
        'Complete digital profiles with documents, attendance, and academic history',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Attendance Tracking',
      description:
        'Real-time attendance with AI suggestions and instant parent notifications',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Fee Management',
      description:
        'Online payments, automated reminders, and complete financial tracking',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Communication Hub',
      description:
        'Multi-channel notifications via SMS, Email, WhatsApp, and push',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Document Management',
      description:
        'Digital upload, verification, and secure storage for all documents',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description:
        'Data-driven insights and automated reporting for better decisions',
    },
  ];

  const benefits = [
    { metric: '70%', label: 'Reduction in Administrative Work' },
    { metric: '40-60%', label: 'Improvement in On-Time Fee Collection' },
    { metric: '95%+', label: 'Message Delivery Rate' },
    { metric: '24 Hours', label: 'To Go Live' },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      students: 'Up to 100',
      features: [
        'All Core Features',
        'Basic Notifications',
        'Community Support',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Premium',
      price: '₹2,999',
      period: 'per month',
      students: 'Up to 500',
      features: [
        'Unlimited Notifications',
        'Advanced Analytics',
        'Priority Support',
        'API Access',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored',
      students: 'Unlimited',
      features: [
        'Dedicated Manager',
        'Custom Integrations',
        'SLA Guarantee',
        'Multi-Campus',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      duration: '5 minutes',
      description: 'Create your organization account',
    },
    {
      number: 2,
      title: 'Configure',
      duration: '30 minutes',
      description: 'Set up grades, sections, and fees',
    },
    {
      number: 3,
      title: 'Onboard Teachers',
      duration: '30 minutes',
      description: 'Add teaching staff',
    },
    {
      number: 4,
      title: 'Enroll Students',
      duration: '1-2 hours',
      description: 'Bulk import student data',
    },
    {
      number: 5,
      title: 'Go Live',
      duration: 'Immediate',
      description: 'Start using all features',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge
              variant="secondary"
              className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm"
            >
              🚀 Transforming Indian Education Since 2025
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              The Complete Guide to
              <span className="block bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Modern School Management
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
              How Shiksha.cloud is Automating Administrative Tasks, Eliminating
              Paperwork, and Revolutionizing Education in India
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 rounded-full font-semibold"
              >
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 rounded-full font-semibold"
              >
                Watch Demo <Play className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold mb-2">
                    {benefit.metric}
                  </div>
                  <div className="text-blue-200 text-sm">{benefit.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-300/20 rounded-full blur-lg"></div>
      </section>

      {/* Table of Contents Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-6 hide-scrollbar">
            {[
              { id: 'problem', label: 'The Problem' },
              { id: 'solution', label: 'Our Solution' },
              { id: 'features', label: 'Features' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'getting-started', label: 'Get Started' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* The Problem Section */}
      <section id="problem" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 bg-red-50 text-red-600 border-red-200"
            >
              The Challenge
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              The Problem with Traditional School Management
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              If you're running an educational institution in India, you know
              the daily challenges all too well
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Administrative Burden',
                description:
                  'Hours spent on paper registers, manual attendance tracking, and fee collection',
                icon: '📋',
                color: 'red',
              },
              {
                title: 'Communication Gap',
                description:
                  'Important notices get lost, parents miss reminders, emergency announcements are slow',
                icon: '📞',
                color: 'blue',
              },
              {
                title: 'Data Management',
                description:
                  'Records scattered across registers and Excel sheets, making reporting nearly impossible',
                icon: '📊',
                color: 'green',
              },
              {
                title: 'Fee Collection',
                description:
                  'Manual tracking, paper receipts, constant follow-ups, and reconciliation nightmares',
                icon: '💰',
                color: 'amber',
              },
              {
                title: 'Transparency Issues',
                description:
                  'Parents lack real-time access to attendance, fees, and academic information',
                icon: '👁️',
                color: 'purple',
              },
              {
                title: 'Scalability Barrier',
                description:
                  "Manual systems don't scale - what works for 200 students fails with 500",
                icon: '📈',
                color: 'indigo',
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`p-6 rounded-2xl border-2 border-${problem.color}-100 bg-gradient-to-br from-${problem.color}-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className={`text-3xl mb-4`}>{problem.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Cost Analysis */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-16 p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              The Real Cost of Manual Management
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  task: 'Attendance Compilation',
                  time: '3-4 hours daily',
                  cost: '₹8,000/month',
                },
                {
                  task: 'Fee Tracking',
                  time: '5-6 hours weekly',
                  cost: '₹4,000/month',
                },
                {
                  task: 'Parent Queries',
                  time: '2-3 hours daily',
                  cost: '₹6,000/month',
                },
                {
                  task: 'Document Management',
                  time: 'Countless hours',
                  cost: '₹2,000/month',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="text-sm text-gray-600 mb-2">{item.task}</div>
                  <div className="text-lg font-bold text-red-600 mb-1">
                    {item.time}
                  </div>
                  <div className="text-md font-semibold text-gray-800">
                    {item.cost}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6 p-4 bg-white rounded-xl shadow-sm">
              <div className="text-lg font-bold text-gray-800">
                Total Administrative Cost: ₹15,000-20,000 monthly
              </div>
              <div className="text-sm text-gray-600 mt-2">
                That could be automated with Shiksha.cloud
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        id="solution"
        className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500 text-white border-green-400">
              The Solution
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              What is Shiksha.cloud?
            </h2>
            <p className="text-xl text-blue-200 leading-relaxed">
              A complete digital transformation platform designed specifically
              for the Indian education ecosystem
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Purpose-Built for Indian Schools
                    </h3>
                    <p className="text-blue-200">
                      Understands Indian fee structures, academic calendars, and
                      communication preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      47+ Real, Working Features
                    </h3>
                    <p className="text-blue-200">
                      Battle-tested solutions that schools use every day to run
                      more efficiently
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Enterprise-Grade Technology
                    </h3>
                    <p className="text-blue-200">
                      Built on Next.js 15, Supabase, and Clerk Authentication
                      for maximum security
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {['Admin', 'Teacher', 'Student', 'Parent'].map(
                    (role, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-bold">{role} Portal</div>
                        <div className="text-sm text-blue-200 mt-1">
                          Personalized Dashboard
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-center">
                  <div className="text-2xl font-bold">24 Hours</div>
                  <div className="text-sm">To Go Live</div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 bg-blue-50 text-blue-600 border-blue-200"
            >
              Powerful Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Core Features That Make a Difference
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Every feature solves real-world problems that educators face daily
            </p>
          </motion.div>

          <Tabs defaultValue="student" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="student">Student Management</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="fee">Fee Management</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-4">
              <Card className="border-2 border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    Complete Student Management System
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Digital profiles, document management, and comprehensive
                    tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-lg">
                        Key Capabilities
                      </h4>
                      <ul className="space-y-2">
                        {[
                          'Bulk Import via CSV/Sheets',
                          'Digital Document Verification',
                          'Profile Self-Updates',
                          'Advanced Search & Filter',
                          'Complete Audit Trail',
                        ].map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-xl">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          2 Days → 2 Hours
                        </div>
                        <div className="text-gray-700">
                          Enrollment processing time reduction
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card className="border-2 border-green-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-green-600" />
                    Smart Attendance Management
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Real-time tracking with AI suggestions and instant
                    notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-lg">
                        For All Stakeholders
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="font-semibold text-green-700">
                            Teachers
                          </div>
                          <div className="text-sm text-gray-600">
                            Single-click interface, AI suggestions, 1-2 minutes
                            per class
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-700">
                            Parents
                          </div>
                          <div className="text-sm text-gray-600">
                            Real-time absence notifications, pattern visibility
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-purple-700">
                            Administrators
                          </div>
                          <div className="text-sm text-gray-600">
                            School-wide analytics, trend identification
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-xl">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          95%+
                        </div>
                        <div className="text-gray-700">
                          Reduction in attendance compilation time
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fee">
              <Card className="border-2 border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-amber-600" />
                    Complete Fee Management
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Online payments, automated reminders, and financial tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-lg">
                        Payment Features
                      </h4>
                      <ul className="space-y-2">
                        {[
                          'UPI, Cards, Net Banking',
                          'PhonePe Integration',
                          'Automatic Receipts',
                          'Installment Plans',
                          'Late Fee Automation',
                        ].map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-xl">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600 mb-2">
                          40-60%
                        </div>
                        <div className="text-gray-700">
                          Improvement in on-time fee collection
                        </div>
                        <div className="text-lg font-bold mt-2 text-amber-700">
                          80% time reduction
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication">
              <Card className="border-2 border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                    Multi-Channel Communication
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Ensure 100% reach with SMS, Email, WhatsApp, and push
                    notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-lg">
                        Communication Types
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          'School Announcements',
                          'Grade-Specific',
                          'Individual Messages',
                          'Emergency Alerts',
                          'Event Reminders',
                          'Fee Confirmations',
                        ].map((type, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded-lg border text-center"
                          >
                            <div className="text-sm font-medium text-gray-700">
                              {type}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-xl">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          95%+
                        </div>
                        <div className="text-gray-700">
                          Message delivery rate
                        </div>
                        <div className="text-lg font-bold mt-2 text-purple-700">
                          vs 40-50% traditional
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* All Features Grid */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-20 bg-gradient-to-br from-slate-50 to-blue-100"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 bg-green-50 text-green-600 border-green-200"
            >
              Real Impact
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              How Each Stakeholder Benefits
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Transformative results for everyone in your educational ecosystem
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Before & After Comparison */}
            <Card className="shadow-2xl border-2 border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
                <CardTitle className="text-2xl text-red-700">
                  Before Shiksha.cloud
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    'No visibility into attendance records',
                    'Manual fee payment with paper receipts',
                    'Missed important school notices',
                    'Constant phone calls to school office',
                    'Difficulty tracking student progress',
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="text-2xl text-green-700">
                  After Shiksha.cloud
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    'Real-time attendance visibility',
                    'Online fee payment 24/7',
                    'Instant notifications for all updates',
                    '70% reduction in office calls',
                    'Complete transparency and control',
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {[
              {
                name: 'Rajesh Kumar',
                role: 'School Principal',
                content:
                  'We went from 250 to 600 students in 2 years. With Shiksha.cloud, our same team handles double the students efficiently.',
                avatar: '👨‍💼',
              },
              {
                name: 'Priya Sharma',
                role: 'Working Parent',
                content:
                  "As a working mother, Shiksha.cloud gives me complete information about my daughter's attendance and fees on my phone.",
                avatar: '👩‍💼',
              },
              {
                name: 'Anjali Desai',
                role: 'Mathematics Teacher',
                content:
                  "I used to spend 30-40 minutes daily on attendance. Now it takes 5 minutes total. It's made my job so much easier.",
                avatar: '👩‍🏫',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 bg-purple-50 text-purple-600 border-purple-200"
            >
              Simple Pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Pricing That Makes Sense
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              No per-user fees. No hidden costs. Just transparent pricing for
              every size institution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl border-2 p-8 ${
                  plan.popular
                    ? 'border-blue-300 bg-gradient-to-b from-blue-50 to-white shadow-2xl scale-105'
                    : 'border-gray-200 bg-white shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period !== 'forever' &&
                      plan.period !== 'tailored' && (
                        <span className="text-gray-600">/{plan.period}</span>
                      )}
                  </div>
                  <div className="text-gray-600 mb-4">
                    {plan.students} Students
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 text-lg font-semibold rounded-xl ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Guarantee */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                30-Day Money-Back Guarantee
              </h3>
            </div>
            <p className="text-gray-700 text-lg">
              Try Shiksha.cloud risk-free. If you're not satisfied, get a full
              refund, no questions asked.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section
        id="getting-started"
        className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-500 text-white border-amber-400">
              Get Started
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Your Journey to Digital Transformation
            </h2>
            <p className="text-xl text-blue-200 leading-relaxed">
              Go live in less than 24 hours with our guided setup process
            </p>
          </motion.div>

          {/* Steps Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-700 transform -translate-x-1/2 z-0"></div>

              {/* Steps */}
              <div className="space-y-8 relative z-10">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start gap-6"
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-blue-800 relative z-10">
                      <div className="text-white font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex-1 border border-white/20">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white">
                          {step.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-white/10 text-blue-200 border-white/20"
                        >
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-blue-200">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mt-16"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Ready to Transform Your Institution?
                </h3>
                <p className="text-blue-200 text-lg mb-6">
                  Join thousands of schools already experiencing the
                  Shiksha.cloud difference
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 rounded-full font-semibold"
                  >
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 rounded-full font-semibold"
                  >
                    Schedule Demo <Play className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <p className="text-blue-300 text-sm mt-4">
                  No credit card required • 14-day free trial • Setup assistance
                  included
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Shiksha.cloud
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question:
                  'Is Shiksha.cloud suitable for my type of institution?',
                answer:
                  'Yes! Whether you run a primary school, secondary school, coaching center, college, or any educational institution, Shiksha.cloud adapts to your needs. Our flexible structure supports various institution types.',
              },
              {
                question: 'How long does it take to set up?',
                answer:
                  'Most institutions are fully operational within 24 hours. Basic setup takes 1-2 hours, and student bulk import can be completed in minutes.',
              },
              {
                question: 'Do I need technical knowledge to use Shiksha.cloud?',
                answer:
                  'No. The platform is designed to be intuitive and user-friendly. If you can use WhatsApp or email, you can use Shiksha.cloud. We also provide comprehensive documentation and support.',
              },
              {
                question: 'Is my data secure?',
                answer:
                  'Yes. We use enterprise-grade encryption, secure authentication, regular backups, and follow industry best practices. Your data is protected with the same level of security used by banks and financial institutions.',
              },
              {
                question: 'Can parents pay fees online?',
                answer:
                  'Yes. Parents can pay fees 24/7 using UPI, cards, net banking, or digital wallets through our secure payment gateway integration with PhonePe.',
              },
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 border-gray-100 rounded-2xl px-6 hover:border-blue-200 transition-colors"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-blue-600 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Join the Education Revolution Today
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Thousands of institutions across India are already experiencing
              the Shiksha.cloud difference. It's your turn to transform your
              school management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 rounded-full font-semibold"
              >
                Contact Sales <MessageCircle className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Setup assistance</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Cloud className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">Shiksha.cloud</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Making school management effortless so educators can focus on what
              matters most—teaching and nurturing students.
            </p>
            <div className="flex justify-center gap-6 text-gray-400">
              <div>© 2025 Shiksha.cloud</div>
              <div>•</div>
              <div>All rights reserved</div>
            </div>
            <div className="mt-4 text-gray-500 text-sm">
              Built with <Heart className="w-4 h-4 text-red-500 inline" /> for
              Indian education
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
