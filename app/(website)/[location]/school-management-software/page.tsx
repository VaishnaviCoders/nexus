import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Users,
  BarChart3,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Smartphone,
  Cloud,
  Database,
  Lock,
  DatabaseBackupIcon,
  LucideCircleArrowOutDownRight,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ location: string }>;
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { location } = await params;
//   const locationName = location.charAt(0).toUpperCase() + location.slice(1);

//   return {
//     title: `Best School Management Software in ${locationName} | Shiksha Cloud`,
//     description: `Leading school management system in ${locationName}. Cloud-based ERP for schools, colleges, and institutes with powerful automation tools. Try free today!`,
//     keywords: `school management software ${locationName}, school ERP ${locationName}, school automation ${locationName}, best school management system`,
//     alternates: {
//       canonical: `https://www.shiksha.cloud/${location}/school-management-software`,
//     },
//   };
// }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  const title = `Best School Management Software in ${locationName} | Shiksha Cloud`;
  const description = `Leading cloud-based school ERP software in ${locationName}. Automate attendance, fees, communication & administration. Free plan available. Start your digital transformation today!`;
  const canonicalUrl = `https://www.shiksha.cloud/${location}/school-management-software`;

  return {
    title,
    description,
    keywords: [
      `school management software ${locationName}`,
      `school ERP ${locationName}`,
      `school management system ${locationName}`,
      `educational software ${locationName}`,
      `student management system ${locationName}`,
      `fee management software ${locationName}`,
      `attendance management system ${locationName}`,
      `cloud school software ${locationName}`,
      `digital school platform ${locationName}`,
      `education ERP ${locationName}`,
      'school automation',
      'online fee payment',
      'student portal',
      'parent app',
      'teacher management',
      'academic management system',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_IN',
      url: canonicalUrl,
      siteName: 'Shiksha Cloud',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Shiksha Cloud - School Management Software in ${locationName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // yahoo: 'your-yahoo-verification-code',
    },
    category: 'education',
  };
}

function generateLocalBusinessStructuredData(locationName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: `Shiksha Cloud - School Management Software in ${locationName}`,
    description: `Cloud-based school management software serving educational institutions in ${locationName}. Digital transformation for schools, colleges, and coaching centers.`,
    url: 'https://www.shiksha.cloud',
    logo: 'https://www.shiksha.cloud/logo.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: locationName,
      addressCountry: 'IN',
    },
    areaServed: locationName,
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        // You can add actual coordinates for the location
        latitude: 0,
        longitude: 0,
      },
      geoRadius: '50000',
    },
    offers: {
      '@type': 'Offer',
      description: 'School Management Software Solutions',
      areaServed: locationName,
    },
    sameAs: [
      // Add your social media profiles
      'https://twitter.com/shikshacloud',
      'https://linkedin.com/company/shikshacloud',
      'https://facebook.com/shikshacloud',
    ],
  };
}

function generateProductStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Shiksha Cloud School Management Software',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Comprehensive cloud-based school management system for Indian educational institutions',
    featureList: [
      'Student Management',
      'Fee Management & Online Payments',
      'Attendance Tracking',
      'Parent-Teacher Communication',
      'Exam Management',
      'Document Management',
      'Analytics & Reporting',
    ],
    screenshot: 'https://www.shiksha.cloud/screenshot.jpg',
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  const localBusinessStructuredData =
    generateLocalBusinessStructuredData(locationName);
  const productStructuredData = generateProductStructuredData();
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description:
        'Complete student lifecycle management from admission to alumni tracking',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description:
        'Real-time insights and comprehensive reports for data-driven decisions',
    },
    {
      icon: Clock,
      title: 'Attendance Tracking',
      description:
        'Automated attendance with biometric and mobile app integration',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description:
        'Enterprise-grade security with data encryption and compliance standards',
    },
    {
      icon: Zap,
      title: 'Fee Management',
      description:
        'Streamlined fee collection with multiple payment gateway integration',
    },
    {
      icon: CheckCircle2,
      title: 'Exam Management',
      description:
        'Complete exam scheduling, result processing, and performance tracking',
    },
  ];

  const benefits = [
    {
      number: '500+',
      label: 'Schools Trust Us',
      description: 'Across India and beyond',
    },
    {
      number: '50K+',
      label: 'Active Users',
      description: 'Teachers, students, and parents',
    },
    {
      number: '99.9%',
      label: 'Uptime',
      description: 'Reliable cloud infrastructure',
    },
    {
      number: '24/7',
      label: 'Support',
      description: 'Dedicated customer success team',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Principal, Delhi Public School',
      content:
        'Shiksha Cloud transformed how we manage our school. The automation saved us 20 hours per week!',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: "Administrator, St. Mary's Academy",
      content:
        'Best investment for our school. Parents love the transparency and real-time updates.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      role: 'Director, Global International School',
      content:
        'The support team is exceptional. They helped us migrate seamlessly from our old system.',
      rating: 5,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <main className="w-full">
        {/* Hero Section */}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          {/* Hero Section */}
          <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Trusted by Schools Across {locationName}
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your School in{' '}
                  <span className="text-green-600">{locationName}</span> with
                  Smart Management
                </h1>

                {/* Subheading */}
                <p className="text-xl text-gray-600 leading-relaxed">
                  Shiksha Cloud is a comprehensive, cloud-based school
                  management system designed specifically for Indian educational
                  institutions. Connect students, parents, teachers, and
                  administrators on a single unified platform.
                </p>

                {/* Key Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Save 70%+ Administrative Time',
                    'GDPR Compliant & Bank-Level Security',
                    '99.9% Uptime Guarantee',
                    'Mobile Responsive & PWA Support',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 px-8 py-3 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                  >
                    Watch Demo
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 pt-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Bank-Level Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>10,000+ Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Feature Cards */}
              <div className="space-y-6">
                {/* Main Feature Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        All-in-One School Management
                      </h3>
                      <p className="text-gray-600">
                        Complete solution for students, parents, teachers, and
                        administrators. From attendance to fee payments, all in
                        one platform.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: '💰',
                      title: 'Fee Management',
                      desc: 'Online payments with automated receipts',
                    },
                    {
                      icon: '📊',
                      title: 'Attendance Tracking',
                      desc: 'Digital registers with AI suggestions',
                    },
                    {
                      icon: '📱',
                      title: 'Parent Portal',
                      desc: 'Real-time updates & communication',
                    },
                    {
                      icon: '🎯',
                      title: 'Teacher Dashboard',
                      desc: 'Streamlined class management',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Security Card */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">
                      Enterprise Security & Compliance
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800">
                        End-to-end Encryption
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800">GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800">Daily Backups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800">
                        Multi-tenant Architecture
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-green-200 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
          </section>
        </div>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Everything You Need to Run Your School
              </h2>
              <p className="text-xl text-slate-600">
                Comprehensive features designed specifically for educational
                institutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center text-white">
                  <div className="text-5xl font-bold mb-2">
                    {benefit.number}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {benefit.label}
                  </div>
                  <div className="text-blue-100">{benefit.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Card className="mt-8 max-w-7xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Enterprise-Grade Security & Reliability
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span>End-to-end encryption & GDPR compliance</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Database className="w-4 h-4 text-green-500" />
                    <span>Multi-tenant architecture with data isolation</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Smartphone className="w-4 h-4 text-green-500" />
                    <span>Mobile responsive & PWA support</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DatabaseBackupIcon className="w-4 h-4 text-green-500" />
                    <span>Automated daily backups</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Cloud className="w-4 h-4 text-green-500" />
                    <span>99.9% uptime guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <LucideCircleArrowOutDownRight className="w-4 h-4 text-green-500" />
                    <span>Regular security audits</span>
                  </div>
                </div>
              </div>

              <div className="ml-6">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  asChild
                >
                  <Link href={'https://www.shiksha.cloud/why-us'}>Why Us</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Why Schools Choose Shiksha Cloud in {locationName}
              </h2>
              <p className="text-xl text-slate-600">
                Designed for Indian schools with local support and compliance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-6">
                {[
                  'Local support team in India',
                  'Compliance with CBSE, ICSE, and State boards',
                  'Multi-language support',
                  'Affordable pricing for all school sizes',
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-lg text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[
                  'Easy migration from existing systems',
                  'Mobile app for teachers and parents',
                  'Real-time notifications and updates',
                  'Secure data backup and recovery',
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-lg text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Loved by School Leaders
              </h2>
              <p className="text-xl text-slate-600">
                See what principals and administrators say about Shiksha Cloud
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="p-8 border border-slate-200 bg-white"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}

        <div className=" py-20 relative w-full max-w-4xl mx-auto overflow-hidden rounded-[40px] bg-orange-500 p-6 sm:p-10 md:p-20">
          <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
            <div className="absolute top-1/2 right-[-45%] aspect-square h-[800px] w-[800px] -translate-y-1/2">
              <div className="absolute inset-0 rounded-full bg-orange-400 opacity-30"></div>
              <div className="absolute inset-0 scale-[0.8] rounded-full bg-orange-300 opacity-30"></div>
              <div className="absolute inset-0 scale-[0.6] rounded-full bg-orange-200 opacity-30"></div>
              <div className="absolute inset-0 scale-[0.4] rounded-full bg-orange-100 opacity-30"></div>
              <div className="absolute inset-0 scale-[0.2] rounded-full bg-orange-50 opacity-30"></div>
              <div className="absolute inset-0 scale-[0.1] rounded-full bg-white/50 opacity-30"></div>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl md:mb-4 md:text-5xl">
              Ready to Transform Your School?
            </h1>
            <p className="mb-6 max-w-md text-base text-white sm:text-lg md:mb-8">
              Join 500+ schools already using Shiksha Cloud. Start your free
              trial today.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg rounded-lg font-semibold"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg bg-transparent"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <section className="py-16 bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Questions? We're here to help.
                </h3>
                <p className="text-slate-400">
                  Contact our sales team for a personalized demo
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg whitespace-nowrap">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
