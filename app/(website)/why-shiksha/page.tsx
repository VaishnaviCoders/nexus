'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  School,
  CheckCircle,
  Phone,
  MessageSquare,
  Mail,
  Shield,
  IndianRupee,
  Award,
  Zap,
  Heart,
  X,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const slides = [
  // Title Slide - Conventional Business Style
  {
    id: 'title',
    component: () => (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
        <div className="text-center max-w-5xl">
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <School className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Shiksha.cloud
              </h1>
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Complete School Management System for Indian Schools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Streamline fee collection, attendance tracking, and parent
              communication with India's most comprehensive school management
              platform
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-16 max-w-3xl mx-auto">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹79</div>
              <div className="text-gray-600">per student/month</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                2 Days
              </div>
              <div className="text-gray-600">Complete Setup</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Schedule Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    ),
  },

  // Before/After - Text-based with Powerful Words
  {
    id: 'before-after',
    component: () => (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            The Transformation Your School Needs
          </h2>

          <div className="grid grid-cols-2 gap-12">
            {/* Before */}
            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-3xl">😰</div>
                <h3 className="text-2xl font-bold text-red-600">
                  Before Shiksha.cloud
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-700 mb-1">
                      10 phone calls from parents asking about fees
                    </h4>
                    <p className="text-red-600 text-sm">
                      Parents constantly calling office for fee status, due
                      dates, payment confirmations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-700 mb-1">
                      Teachers waste 15 minutes marking attendance on paper
                    </h4>
                    <p className="text-red-600 text-sm">
                      Manual attendance registers, lost records, time wasted
                      every class
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-700 mb-1">
                      Admin spends 2 hours collecting fee information
                    </h4>
                    <p className="text-red-600 text-sm">
                      Manual calculations, chasing payments, preparing reports
                      by hand
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-700 mb-1">
                      Parents complain they don't know school updates
                    </h4>
                    <p className="text-red-600 text-sm">
                      Missed notices, no communication channel, frustrated
                      parents
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-red-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700">
                  😫 Stressed Every Day
                </div>
                <p className="text-red-600 mt-2">
                  Chaos, complaints, and constant firefighting
                </p>
              </div>
            </div>

            {/* After */}
            <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-r-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-3xl">😊</div>
                <h3 className="text-2xl font-bold text-green-600">
                  After Shiksha.cloud
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-700 mb-1">
                      Parents know everything automatically
                    </h4>
                    <p className="text-green-600 text-sm">
                      WhatsApp alerts for fees, attendance, notices - zero phone
                      calls needed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-700 mb-1">
                      Teachers mark attendance in 30 seconds
                    </h4>
                    <p className="text-green-600 text-sm">
                      One-click digital attendance, automatic reports, no
                      paperwork
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-700 mb-1">
                      Fees get collected without phone calls
                    </h4>
                    <p className="text-green-600 text-sm">
                      Automatic UPI payments, instant receipts, real-time
                      tracking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-700 mb-1">
                      School runs smoothly, everyone happy
                    </h4>
                    <p className="text-green-600 text-sm">
                      Parents informed, teachers efficient, admin in control
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">
                  😌 Peace of Mind
                </div>
                <p className="text-green-600 mt-2">
                  Smooth operations, happy parents, efficient staff
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <ArrowRight className="w-8 h-8 mx-auto text-blue-600 mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Transform your school in just 2 days
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // Problem Slide
  {
    id: 'problem',
    component: () => (
      <div className="min-h-screen bg-white p-8 flex items-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            The Problems Every School Faces
          </h2>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Schools Already Using Software
                </h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Paying ₹200-500/student for limited features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>No WhatsApp integration - parents miss updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Complex interfaces that confuse users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Poor support - weeks to resolve issues</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Schools Without Any Software
                </h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Manual fee collection - hours of paperwork</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Lost attendance registers and records</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Parents complain about poor communication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Fear of technology - "Too complicated"</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-gray-100 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              The Cost of Inaction
            </h3>
            <p className="text-lg text-gray-700">
              Schools lose revenue, parents are frustrated, and staff waste time
              on manual work instead of focusing on education.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // Solution Slide
  {
    id: 'solution',
    component: () => (
      <div className="min-h-screen bg-blue-50 p-8 flex items-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-800 mb-12 text-center">
            How Shiksha.cloud Solves Everything
          </h2>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                For Schools Already Using Software
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      Save 60% on Costs
                    </h4>
                    <p className="text-gray-600">
                      From ₹200-500 to just ₹79/student with MORE features
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MessageSquare className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      WhatsApp Integration
                    </h4>
                    <p className="text-gray-600">
                      Every notification reaches parents instantly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      Seamless Migration
                    </h4>
                    <p className="text-gray-600">
                      Complete data transfer in 2 days with zero downtime
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                For Schools Without Software
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Heart className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      Simple & User-Friendly
                    </h4>
                    <p className="text-gray-600">
                      Designed for non-technical users
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      Personal Support
                    </h4>
                    <p className="text-gray-600">
                      24/7 WhatsApp support in Hindi/English
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <IndianRupee className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      Immediate ROI
                    </h4>
                    <p className="text-gray-600">
                      Recover investment in first month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              One Platform for Everything
            </h3>
            <p className="text-lg text-gray-700">
              Fee collection, attendance, notices, document management, and
              parent communication - all in one simple system.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // Features by Role - Only Completed Features
  {
    id: 'features',
    component: () => (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Complete Features for Every User
          </h2>

          <div className="grid grid-cols-2 gap-8">
            {/* Students */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Users className="w-10 h-10 text-blue-600" />
                  <h3 className="text-2xl font-bold text-blue-600">Students</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Pay fees online with UPI/PhonePe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>View & download fee receipts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Get notices via WhatsApp/SMS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>View attendance history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Upload & track documents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Anonymous complaint system</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parents */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Heart className="w-10 h-10 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-600">Parents</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Instant WhatsApp fee reminders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Track child's attendance daily</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Anonymous complaint system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Link multiple children</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Get all school notices instantly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>View fee history & receipts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teachers */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="w-10 h-10 text-purple-600" />
                  <h3 className="text-2xl font-bold text-purple-600">
                    Teachers
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>One-click attendance marking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Manage class sections easily</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>View attendance summaries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Handle complaint resolution</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Upload teaching documents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Personal profile management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admins */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="w-10 h-10 text-orange-600" />
                  <h3 className="text-2xl font-bold text-orange-600">Admins</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Real-time fee collection dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Teacher Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>WhatsApp notice broadcasting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Document verification system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Complete organization setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Holiday & notice management</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    ),
  },

  // Call to Action
  {
    id: 'cta',
    component: () => (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Transform Your School?
          </h2>

          <p className="text-xl mb-12 text-gray-300">
            Join schools already using Shiksha.cloud to streamline operations
            and improve parent satisfaction.
          </p>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <Phone className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-2xl font-bold mb-4">📞 Call Now</h3>
                <div className="text-3xl font-bold text-green-400 mb-4">
                  8459324821
                </div>
                <p className="text-lg text-gray-300">
                  Speak to our education expert
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-2xl font-bold mb-4">✉️ Email Us</h3>
                <div className="text-2xl font-bold text-blue-400 mb-4">
                  care@shiksha.cloud
                </div>
                <p className="text-lg text-gray-300">
                  Get detailed information
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold mb-6">What Happens Next:</h3>
            <div className="grid grid-cols-4 gap-6 text-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  1
                </div>
                <p>Call us today</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  2
                </div>
                <p>Free demo at your school</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  3
                </div>
                <p>Setup in 2 days</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  4
                </div>
                <p>Transform your school</p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 text-2xl"
          >
            <Phone className="w-6 h-6 mr-3" />
            Call Now - 8459324821
          </Button>

          <p className="text-lg mt-8 text-gray-400">
            Don't wait - every day you delay costs you money and parent
            satisfaction.
          </p>
        </div>
      </div>
    ),
  },
];

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative">
      {/* Slide Content */}
      <div className="slide-container">{slides[currentSlide].component()}</div>

      {/* Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur-sm rounded-full px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="text-white hover:bg-white/20"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Slide Counter */}
      <div className="fixed top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
