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
} from 'lucide-react';

const trustFactors = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description:
      '256-bit SSL encryption, regular security audits, and GDPR compliance ensure your data is always protected.',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: Server,
    title: '99.9% Uptime Guarantee',
    description:
      'Hosted on enterprise-grade cloud infrastructure with automatic backups and disaster recovery.',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: Eye,
    title: 'Complete Transparency',
    description:
      "Full audit trails, activity logs, and compliance reports. You always know what's happening in your system.",
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: Users,
    title: '5+ Schools Trust Us',
    description:
      'Join hundreds of schools across India who rely on our platform for their daily operations.',
    color: 'text-orange-600 bg-orange-100',
  },
];

const certifications = [
  { name: 'ISO 27001', description: 'Information Security' },
  { name: 'GDPR', description: 'Data Protection' },
  { name: 'SOC 2', description: 'Security & Availability' },
  { name: 'PCI DSS', description: 'Payment Security' },
];

export function SecurityTrust() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustFactors.map((factor, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 ${factor.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <factor.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {factor.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {factor.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Compliance & Certifications
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{cert.name}</div>
                      <div className="text-sm text-gray-600">
                        {cert.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">
                24/7 Support & Monitoring
              </h4>
              <p className="text-blue-700 text-sm">
                Our technical team monitors the system round-the-clock to ensure
                everything runs smoothly. Get support via phone, email, or chat
                whenever you need it.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What This Means for You
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Student Data Protection
                  </p>
                  <p className="text-gray-600 text-sm">
                    All personal information is encrypted and access-controlled
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCheck className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Audit Ready</p>
                  <p className="text-gray-600 text-sm">
                    Complete audit trails and compliance reports available
                    instantly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Always Available
                  </p>
                  <p className="text-gray-600 text-sm">
                    99.9% uptime means your school operations never stop
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Peace of Mind</p>
                  <p className="text-gray-600 text-sm">
                    Focus on education while we handle the technical security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
