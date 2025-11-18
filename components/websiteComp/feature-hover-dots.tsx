'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  CreditCard,
  Send,
  Users,
  UploadCloud,
  FileCheck,
} from 'lucide-react';

const FeatureHoverDots = () => {
  const data = [
    {
      title: '2-Tap Attendance',
      description:
        'Teachers mark attendance in just 2 taps—saving 18 minutes per class compared to paper registers.',
      icon: CheckSquare,
    },
    {
      title: 'Online Fee Payments',
      description:
        'Parents pay via UPI/cards from their phone and receive instant WhatsApp receipts—schools get 3× faster fee collection.',
      icon: CreditCard,
    },
    {
      title: 'Multi-Channel Notices',
      description:
        'Send urgent school notices across WhatsApp, SMS, and Email in seconds with delivery tracking.',
      icon: Send,
    },
    {
      title: 'Parent Portal',
      description:
        'Parents access attendance, fee status, documents, and notices 24/7—reducing 80% of office queries.',
      icon: Users,
    },
    {
      title: 'Bulk Student Import',
      description:
        'Import 500+ students in minutes using CSV/Google Sheets—get your school live in 24 hours.',
      icon: UploadCloud,
    },
    {
      title: 'Document Verification',
      description:
        'Store and verify Aadhaar, TC, and certificates digitally with real-time status tracking.',
      icon: FileCheck,
    },
    {
      title: 'Auto-Generated Reports',
      description:
        'Daily, weekly, and monthly academic + attendance reports generated automatically—no manual work for teachers.',
      icon: FileCheck,
    },
    {
      title: 'Digital ID Cards',
      description:
        'Generate beautiful, scannable digital ID cards for students and staff—ready to print or download in one click.',
      icon: CreditCard,
    },
  ];

  // Animation variants for the dots
  const dotVariants = {
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Staggered animation for corner dots
  const cornerDotVariants = (delay: number) => ({
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.4, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      },
    },
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 max-w-7xl mx-auto">
      {data.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={index}
            tabIndex={index}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="
              group relative w-full h-full rounded-2xl bg-white border border-gray-200
              shadow-[0_1px_5px_-4px_rgba(36,36,36,0.7),0_4px_8px_0_rgba(36,36,36,0.05)]
              p-4 flex flex-col items-center justify-center max-w-[300px] max-h-[300px] cursor-pointer
            "
          >
            {/* ICON WRAPPER */}
            <div
              className="
                bg-neutral-100 rounded-xl p-3
                shadow-[0_1px_5px_-4px_rgba(19,19,22,0.7),0_0_0_1px_rgba(34,42,53,0.1),0_4px_8px_rgba(34,42,53,0.05)]
                flex flex-col items-center justify-center relative
              "
            >
              <div className="m-4">
                <Icon size={26} />

                {/* Animated corner dots - default state */}
                <motion.div
                  variants={cornerDotVariants(0)}
                  initial="initial"
                  animate="animate"
                  className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full shadow-inner top-3 right-3"
                />
                <motion.div
                  variants={cornerDotVariants(0.5)}
                  initial="initial"
                  animate="animate"
                  className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full shadow-inner top-3 left-3"
                />
                <motion.div
                  variants={cornerDotVariants(1)}
                  initial="initial"
                  animate="animate"
                  className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full shadow-inner bottom-3 right-3"
                />
                <motion.div
                  variants={cornerDotVariants(1.5)}
                  initial="initial"
                  animate="animate"
                  className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full shadow-inner bottom-3 left-3"
                />
              </div>
            </div>

            {/* TITLE */}
            <h3 className="text-[14px] font-semibold text-neutral-900 mt-3">
              {item.title}
            </h3>

            {/* HOVER CONTENT */}
            <div
              className="
                absolute inset-0 bg-white rounded-2xl p-4 text-center
                flex flex-col items-center justify-center
                opacity-0 group-hover:opacity-100
                translate-y-3 group-hover:translate-y-0
                transition-all duration-300 ease-out
              "
            >
              <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-neutral-600 px-4">
                {item.description}
              </p>

              {/* Hover dots with rotation animation */}
              <div className="mt-3">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-2 h-2 bg-gray-300 rounded-full shadow-inner top-5 right-5"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -90, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.75,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-2 h-2 bg-gray-300 rounded-full shadow-inner top-5 left-5"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1.5,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-2 h-2 bg-gray-300 rounded-full shadow-inner bottom-5 right-5"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -90, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 2.25,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-2 h-2 bg-gray-300 rounded-full shadow-inner bottom-5 left-5"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeatureHoverDots;
