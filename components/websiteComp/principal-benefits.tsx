import { Card, CardContent } from '@/components/ui/card';
import {
  DollarSign,
  Clock,
  Shield,
  Users,
  FileText,
  MessageSquare,
  Eye,
  Zap,
} from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Cut Costs by 60%',
    description:
      'Eliminate paper, reduce staff overtime, and automate fee collection. Most schools save ₹2-5 lakhs annually.',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: Clock,
    title: 'Save 15+ Hours Weekly',
    description:
      'Automated attendance, fee reminders, and report generation. Your staff can focus on education, not paperwork.',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description:
      'Your student data is encrypted and secure. GDPR compliant with regular security audits and backups.',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: Users,
    title: 'Happy Parents = Happy Principal',
    description:
      'Real-time updates, online fee payments, and instant communication keep parents satisfied and engaged.',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    icon: FileText,
    title: 'Instant Reports & Compliance',
    description:
      'Generate audit reports, board presentations, and compliance documents in seconds, not hours.',
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    icon: Eye,
    title: 'Complete Staff Accountability',
    description:
      "Track teacher attendance, performance, and activities. Know exactly what's happening in your school.",
    color: 'text-red-600 bg-red-100',
  },
  {
    icon: Zap,
    title: 'Works Every Day, All Day',
    description:
      '99.9% uptime with 24/7 support. Your school operations never stop, and neither do we.',
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    icon: MessageSquare,
    title: 'Modern, Not Boring',
    description:
      'Built with latest technology (Next.js), not outdated PHP. Your staff will actually enjoy using it.',
    color: 'text-teal-600 bg-teal-100',
  },
];

export function PrincipalBenefits() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Principals Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand what keeps you up at night. Here's how we solve your
            biggest challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center mb-4`}
                >
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Transform Your School Management?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join hundreds of principals who've already made the switch to
            modern, efficient school management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Schedule Free Demo
            </button>
            <button className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
