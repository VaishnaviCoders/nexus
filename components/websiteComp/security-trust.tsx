import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Lock,
  Server,
  Eye,
  FileCheck,
  Clock,
  Award,
  Users,
  CheckCircle,
  Zap,
  Cpu,
  Database,
  Fingerprint,
  BarChart3,
  Heart,
} from 'lucide-react';

const trustFactors = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description:
      '256-bit SSL encryption, regular security audits, and GDPR compliance ensure your data is always protected.',
    color: 'text-green-600 bg-green-100',
    gradient: 'from-green-500 to-emerald-500',
    features: [
      'End-to-end encryption',
      'Regular penetration testing',
      'GDPR compliant',
    ],
  },
  {
    icon: Server,
    title: '99.9% Uptime Guarantee',
    description:
      'Hosted on enterprise-grade cloud infrastructure with automatic backups and disaster recovery.',
    color: 'text-blue-600 bg-blue-100',
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Auto-scaling infrastructure',
      'Real-time monitoring',
      'Disaster recovery',
    ],
  },
  {
    icon: Eye,
    title: 'Complete Transparency',
    description:
      "Full audit trails, activity logs, and compliance reports. You always know what's happening in your system.",
    color: 'text-purple-600 bg-purple-100',
    gradient: 'from-purple-500 to-violet-500',
    features: [
      'Activity audit logs',
      'Real-time alerts',
      'Compliance dashboard',
    ],
  },
  {
    icon: Users,
    title: 'Trusted by 50+ Schools',
    description:
      'Join hundreds of schools across India who rely on our platform for their daily operations.',
    color: 'text-orange-600 bg-orange-100',
    gradient: 'from-orange-500 to-amber-500',
    features: [
      '24/7 dedicated support',
      'Success managers',
      'Training programs',
    ],
  },
];

const certifications = [
  {
    name: 'ISO 27001',
    description: 'Information Security',
    icon: Award,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    name: 'GDPR',
    description: 'Data Protection',
    icon: Fingerprint,
    color: 'text-green-600 bg-green-100',
  },
  {
    name: 'SOC 2',
    description: 'Security & Availability',
    icon: BarChart3,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    name: 'PCI DSS',
    description: 'Payment Security',
    icon: Shield,
    color: 'text-orange-600 bg-orange-100',
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: 'Student Data Protection',
    description:
      'All personal information is encrypted and access-controlled with role-based permissions',
    color: 'bg-green-500',
    stats: '100% encrypted',
  },
  {
    icon: FileCheck,
    title: 'Audit Ready',
    description:
      'Complete audit trails and compliance reports available instantly for inspections',
    color: 'bg-blue-500',
    stats: 'Auto-generated reports',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description:
      '99.9% uptime means your school operations never stop with zero downtime updates',
    color: 'bg-purple-500',
    stats: '99.9% uptime',
  },
  {
    icon: Heart,
    title: 'Peace of Mind',
    description:
      'Focus on education while we handle the technical security with 24/7 monitoring',
    color: 'bg-orange-500',
    stats: '24/7 monitoring',
  },
];

export function SecurityTrust() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-4">
            Trusted & Secure
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Data is Safe with Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand that student and financial data is sensitive. That's
            why we've built enterprise-grade security into every aspect of our
            platform.
          </p>
        </div>

        {/* Trust Factors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {trustFactors.map((factor, index) => (
            <Card
              key={index}
              className="border-0 hover:shadow-xl shadow-md  transition-all duration-500 group hover:-translate-y-2 bg-white/80 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Gradient Border Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${factor.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              <CardContent className="p-8 relative">
                {/* Animated Icon */}
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 ${factor.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    <factor.icon className="h-10 w-10" />
                  </div>
                  {/* <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-4 border-green-500 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div> */}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">
                  {factor.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4 text-center">
                  {factor.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  {factor.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Certifications */}
          <div className="space-y-8">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Compliance & Certifications
                </h3>
              </div>
              <p className="text-gray-600 text-lg mb-8">
                Our platform meets the highest industry standards for security
                and data protection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-gray-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 ${cert.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    >
                      <cert.icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-1">
                        {cert.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {cert.description}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle className="h-3 w-3" />
                        Certified
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-24 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">
                    24/7 Proactive Monitoring
                  </h4>
                  <p className="text-blue-50 leading-relaxed">
                    Our dedicated technical team monitors system health
                    round-the-clock with automated alerts and instant response
                    protocols. Get enterprise support via phone, email, or chat
                    within 2 minutes.
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Live Monitoring</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>2-min response time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
              <h3 className="text-3xl font-bold text-gray-900">
                What This Means for Your School
              </h3>
            </div>

            <div className="space-y-3">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <div
                      className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    {/* <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-700 border shadow-sm">
                      {feature.stats}
                    </div> */}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg mb-2">
                      {feature.title}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Schools Secured</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100K+</div>
                  <div className="text-sm text-gray-600">Users Protected</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">
                    Security Incidents
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
