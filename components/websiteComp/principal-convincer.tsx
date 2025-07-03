'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Layers,
  DollarSign,
  Smartphone,
  MessageSquare,
  Eye,
  MapPin,
  Headphones,
  Brain,
  CheckCircle,
  Star,
  ArrowRight,
  IndianRupee,
  Clock,
  Users,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

const convincingPoints = [
  {
    icon: Layers,
    title: 'All-in-One Platform',
    subtitle: 'No More Juggling Multiple Systems',
    description:
      'Stop switching between Excel, WhatsApp, PDFs, and separate apps. Everything you need - fees, attendance, complaints, notices - all in one powerful platform.',
    benefits: [
      'Replace 5+ different systems',
      'Single login for everything',
      'No data duplication',
      'Unified dashboard view',
    ],
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    lightGradient: 'from-blue-50 to-blue-100',
    accentColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    impact: 'Save 3+ hours daily',
    costSaving: '₹50,000/year saved',
  },
  {
    icon: DollarSign,
    title: 'Low Cost, High Impact',
    subtitle: 'Just ₹79 Per User Per month',
    description:
      "At less than ₹2 per day , you get a premium system that saves hours of admin time and improves fee collection. That's cheaper than a pen!",
    benefits: [
      'Only ₹79/user/month',
      'No hidden charges',
      'Premium features included',
      'ROI within 30 days',
    ],
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    lightGradient: 'from-green-50 to-green-100',
    accentColor: 'text-green-600',
    bgColor: 'bg-green-50',
    impact: '10x ROI guaranteed',
    costSaving: '₹2,00,000/year saved',
  },
  {
    icon: Smartphone,
    title: '100% Mobile-Ready',
    subtitle: 'Works on Any Phone',
    description:
      "Teachers, students, and parents can access everything from any smartphone. No app downloads needed - just open the browser and you're ready.",
    benefits: [
      'No app installation required',
      'Works on any device',
      'PWA App available',
      'Touch-friendly interface',
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    lightGradient: 'from-purple-50 to-purple-100',
    accentColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    impact: '100% accessibility',
    costSaving: 'Zero device costs',
  },
  {
    icon: MessageSquare,
    title: 'Automated Fee Reminders',
    subtitle: 'Better Collection, Less Hassle',
    description:
      'Parents get automatic reminders via SMS, email, and WhatsApp. No more staff time wasted on follow-ups. Watch your collection rates soar.',
    benefits: [
      'SMS/Email/WhatsApp alerts',
      'Automated scheduling',
      'Payment link included',
      'Collection tracking',
    ],
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    lightGradient: 'from-orange-50 to-orange-100',
    accentColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    impact: '85% faster collection',
    costSaving: '₹1,50,000/year saved',
  },
  {
    icon: Eye,
    title: 'Complete Transparency',
    subtitle: 'Build Trust with Parents',
    description:
      "Parents see everything in real-time: notices, attendance, fees, complaints. Build trust and professionalism in today's competitive education market.",
    benefits: [
      'Real-time updates',
      'Complete visibility',
      'Parent satisfaction',
      'Professional image',
    ],
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    lightGradient: 'from-pink-50 to-pink-100',
    accentColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    impact: '95% parent satisfaction',
    costSaving: 'Priceless reputation',
  },
  {
    icon: MapPin,
    title: 'Built for Indian Schools',
    subtitle: 'Designed for CBSE, ICSE & Coaching',
    description:
      'Emergency holidays, primary parents, stream/section logic - everything is tailored specifically for Indian education system requirements.',
    benefits: [
      'CBSE/ICSE compatible',
      'Indian holiday calendar',
      'Multi-language support',
      'Local compliance',
    ],
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
    lightGradient: 'from-indigo-50 to-indigo-100',
    accentColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    impact: 'Perfect fit guaranteed',
    costSaving: 'No customization costs',
  },
  {
    icon: Headphones,
    title: 'Live Support & Setup',
    subtitle: 'We Handle Everything',
    description:
      'Complete setup, data import, role configuration, and staff training - all included at no extra cost. You focus on education, we handle the tech.',
    benefits: [
      'Free data migration',
      'Staff training included',
      '24/7 support',
      'Setup in 24 hours',
    ],
    color: 'teal',
    gradient: 'from-teal-500 to-teal-600',
    lightGradient: 'from-teal-50 to-teal-100',
    accentColor: 'text-teal-600',
    bgColor: 'bg-teal-50',
    impact: 'Zero setup hassle',
    costSaving: '₹25,000 setup saved',
  },
  {
    icon: Brain,
    title: 'AI-Powered Reports',
    subtitle: 'Smart Insights Automatically',
    description:
      'Get monthly summaries of fees, attendance, and performance auto-generated in PDF. Make data-driven decisions without the manual work.',
    benefits: [
      'Auto-generated reports',
      'Smart insights',
      'Trend analysis',
      'PDF downloads',
    ],
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
    lightGradient: 'from-violet-50 to-violet-100',
    accentColor: 'text-violet-600',
    bgColor: 'bg-violet-50',
    impact: 'Data-driven decisions',
    costSaving: '₹30,000/year saved',
  },
  {
    icon: ShieldCheck,
    title: 'Staff & System Accountability',
    subtitle: 'Track Everything, Stay in Control',
    description:
      'Get real-time visibility into teacher attendance marking, notice delivery, complaint status, and fee actions. No more guesswork — the system keeps everyone accountable and transparent.',
    benefits: [
      'Track staff activity logs',
      'Monitor teacher attendance marking',
      'See who sent what & when',
      'Better governance & control',
    ],
    color: 'red',
    gradient: 'from-red-500 to-red-600',
    lightGradient: 'from-red-50 to-red-100',
    accentColor: 'text-red-600',
    bgColor: 'bg-red-50',
    impact: 'Full control for admins',
    costSaving: '₹40,000/year in mismanagement losses prevented',
  },
];

export default function PrincipalConvincer() {
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
              className="mb-4 px-6 py-3 text-lg font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-0"
            >
              <IndianRupee className="w-5 h-5 mr-2 text-green-600" />
              Only ₹79 user per month
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Why Principals
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {' '}
                Choose Shiksha.cloud
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              "Sir/Ma'am, Shiksha.cloud is designed for schools like yours —
              simple, powerful, and stress-free. Here's exactly why it's the
              smartest investment you'll make this year."
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ₹79
                </div>
                <div className="text-sm text-gray-600">Per user/Month</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                <div className="text-sm text-gray-600">Schools trust us</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  85%
                </div>
                <div className="text-sm text-gray-600">
                  Faster fee collection
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  24hrs
                </div>
                <div className="text-sm text-gray-600">Setup time</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Convincing Points Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {convincingPoints.map((point, index) => (
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
                    className={`absolute inset-0 bg-gradient-to-br ${point.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <CardContent className="px-8 py-6 relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${point.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <point.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={`${point.bgColor} ${point.accentColor} border-0 font-medium mb-2`}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {point.impact}
                        </Badge>
                        <div className="text-xs font-bold text-green-600">
                          {point.costSaving}
                        </div>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                        {point.title}
                      </h2>
                      <p
                        className={`text-sm font-semibold ${point.accentColor} uppercase tracking-wide`}
                      >
                        {point.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                      {point.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-3 mb-6">
                      {point.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle
                            className={`w-4 h-4 ${point.accentColor} flex-shrink-0`}
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Decorative Elements */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${point.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${point.gradient} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity duration-500`}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
