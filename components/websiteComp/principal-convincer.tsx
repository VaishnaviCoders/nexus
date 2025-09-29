'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { IndianRupee } from 'lucide-react';
import ConvincingPointsGrid from './ConvincingPointsGrid';

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
      <ConvincingPointsGrid />
    </div>
  );
}
