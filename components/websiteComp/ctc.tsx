'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200/50 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Limited Time: 50% Off First Year
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Institution?
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join 500+ educational institutions that have already
              revolutionized their operations.
              <span className="font-semibold text-blue-700">
                {' '}
                Start your free trial today
              </span>{' '}
              and see the difference in 7 Days.
            </p>
          </motion.div>

          {/* Email Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 mb-16"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
                Start Your Free 30-Day Trial
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                />
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Setup in 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Alternative CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
              <h4 className="text-2xl font-bold mb-4">Book a Demo</h4>
              <p className="mb-6 opacity-90">
                See how EduFlow works with your specific requirements
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
              >
                Schedule Demo
              </Button>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center">
              <h4 className="text-2xl font-bold mb-4">Talk to Sales</h4>
              <p className="mb-6 opacity-90">
                Get a custom quote for your institution's needs
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>

          {/* Final Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-lg text-gray-600">
              <span className="font-semibold text-red-600">Don't wait.</span>{' '}
              Every day you delay is another day of inefficiency, lost revenue,
              and frustrated staff.{' '}
              <span className="font-semibold text-blue-700">
                Transform your institution today.
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
