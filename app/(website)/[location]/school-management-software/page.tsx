import React from 'react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  Users,
  BarChart3,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';

// ✅ Define the expected params type
interface Props {
  params: Promise<{ location: string }>;
}

// ✅ Async metadata function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  return {
    title: `Best School Management Software in ${locationName}`,
    description: `Leading school management system in ${locationName}. Cloud-based ERP for schools, colleges, and institutes with powerful automation tools.`,
    keywords: `school management software ${locationName}, school ERP ${locationName}, school automation ${locationName}`,
    alternates: {
      canonical: `https://www.shiksha.cloud/${location}/school-management-software`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">
        School Management Software in {locationName}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Shiksha Cloud offers the most trusted school management ERP in{' '}
        {locationName}. Manage admissions, attendance, exams, fees, and staff
        seamlessly — all in one dashboard.
      </p>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Transform Your School Management
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 text-balance">
            Shiksha Cloud offers the most trusted school management ERP. Manage
            admissions, attendance, exams, fees, and staff seamlessly — all in
            one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Start Free Trial</Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Powerful Features for Modern Schools
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Student Management',
                description:
                  'Complete student profiles, admission tracking, and parent communication in one place.',
              },
              {
                icon: BarChart3,
                title: 'Academic Analytics',
                description:
                  'Real-time performance tracking, grade management, and detailed academic reports.',
              },
              {
                icon: Clock,
                title: 'Attendance System',
                description:
                  'Automated attendance tracking with real-time notifications to parents.',
              },
              {
                icon: Shield,
                title: 'Fee Management',
                description:
                  'Secure online fee collection, payment tracking, and automated reminders.',
              },
              {
                icon: Zap,
                title: 'Staff Portal',
                description:
                  'Streamlined staff management, payroll, and performance evaluation tools.',
              },
              {
                icon: CheckCircle2,
                title: 'Exam Management',
                description:
                  'Schedule exams, manage results, and generate comprehensive performance reports.',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Shiksha Cloud?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                'Cloud-based solution accessible from anywhere',
                '24/7 customer support and technical assistance',
                'Secure data encryption and regular backups',
                'Scalable for schools of any size',
                'Easy integration with existing systems',
                'Affordable pricing with no hidden costs',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Trusted by 500+ Schools
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-gray-700 italic">
                    "Shiksha Cloud has transformed how we manage our school. The
                    system is intuitive and our staff adopted it immediately."
                  </p>
                  <p className="text-gray-900 font-semibold mt-2">
                    - Principal, Delhi Public School
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-gray-700 italic">
                    "The best investment we made for our school. Parent
                    engagement has increased significantly."
                  </p>
                  <p className="text-gray-900 font-semibold mt-2">
                    - Director, Mumbai International School
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '₹5,000',
                period: '/month',
                students: 'Up to 500 students',
                features: [
                  'Basic student management',
                  'Attendance tracking',
                  'Email support',
                ],
              },
              {
                name: 'Professional',
                price: '₹12,000',
                period: '/month',
                students: 'Up to 2,000 students',
                features: [
                  'All Starter features',
                  'Advanced analytics',
                  'Fee management',
                  'Priority support',
                ],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'pricing',
                students: 'Unlimited students',
                features: [
                  'All features',
                  'Custom integrations',
                  'Dedicated account manager',
                  '24/7 support',
                ],
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`p-8 flex flex-col ${plan.highlighted ? 'ring-2 ring-blue-600 shadow-lg' : ''}`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.students}</p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-6 text-lg ${
                    plan.highlighted
                      ? ''
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTC Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8 text-balance">
            Join 500+ schools already using Shiksha Cloud. Start your free trial
            today with no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-6 text-lg font-semibold"
            >
              Start Free Trial Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700 px-8 py-6 text-lg font-semibold bg-transparent"
            >
              Schedule a Demo
            </Button>
          </div>
          <p className="text-blue-100 mt-8">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  );
}
