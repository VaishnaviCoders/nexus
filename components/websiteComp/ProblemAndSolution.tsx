'use client';

import type React from 'react';

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Suspense, lazy, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  FileText,
  Users,
  BookOpen,
  IndianRupee,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import AnimatedShinyText from '../ui/animated-shiny-text';

// Lazy load the problem card component

const indianEducationProblems = [
  {
    id: 1,
    icon: Phone,
    title: 'Parents calling non-stop about fees',
    hindiTitle: 'फीस के बारे में लगातार फोन आना',
    scenario:
      "Sharma ji ka phone - 'Sir, Rahul ki fees kab tak bharni hai?' Same question, 50 times daily.",
    pain: '3+ घंटे रोज़ फीस के सवालों में बर्बाद',
    solution: 'Smart Fee Reminder System',
    result:
      'WhatsApp पर automatic reminders, payment links, और due dates. Parents को सब पता रहेगा।',
    timeSaved: '3 hours daily',
    relief: 'Phone silent, mind peaceful!',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'School खुला, Attendance chaos शुरू',
    hindiTitle: 'पहले ही दिन अटेंडेंस में गड़बड़ी',
    scenario:
      'First week of reopening. Teachers are marking attendance on paper, students are shifting sections, and admin has no visibility of daily absentees.',
    pain: 'Paper attendance leads to missing records, proxy entries & 0 accountability',
    solution: 'Digital Attendance System',
    result:
      'Teachers mark attendance on mobile in 2 taps. Admin sees live reports. Parents get auto-alerts on absenteeism.',
    timeSaved: '20+ mins daily per teacher',
    relief: 'Attendance sorted from Day 1',
    color: 'from-indigo-500 to-fuchsia-500',
  },

  {
    id: 3,
    icon: Users,
    title: 'Attendance chaos in large classes',
    hindiTitle: 'बड़ी क्लास में अटेंडेंस की समस्या',
    scenario:
      '80 students की class। Roll call में 15 minutes। Proxy attendance का डर। Monthly report बनाना अलग headache।',
    pain: 'Daily 20 minutes + monthly reports में पूरा दिन',
    solution: 'Quick Attendance System',
    result:
      'Take attendance। Auto-generate monthly reports। Parents को SMS updates।',
    timeSaved: '15 minutes daily + 1 full day monthly',
    relief: 'Attendance = 2 minutes ka kaam!',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    icon: BookOpen,
    title: 'Coaching batch scheduling nightmare',
    hindiTitle: 'कोचिंग बैच का टाइम टेबल बनाना',
    scenario:
      'JEE batch, NEET batch, 12th boards - सब अलग timing। Teachers available नहीं। Rooms clash हो रहे।',
    pain: 'Time table बनाने में पूरा weekend खराब',
    solution: 'Smart Batch Scheduler',
    result:
      'Auto-schedule batches। Teacher availability check। Room booking conflicts avoid।',
    timeSaved: 'Weekend saved',
    relief: 'Scheduling = automatic!',
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 5,
    icon: IndianRupee,
    title: 'Fee collection and accounting mess',
    hindiTitle: 'फीस कलेक्शन और हिसाब-किताब की परेशानी',
    scenario:
      'कौन सा student कितना paid किया? Installments कौन से pending हैं? GST calculation अलग tension।',
    pain: 'Monthly accounts में 3-4 दिन stuck',
    solution: 'Complete Fee Management',
    result:
      'Real-time fee tracking। Auto-GST calculation। Pending fees की instant list।',
    timeSaved: '3 days monthly',
    relief: 'Accounts = crystal clear!',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 6,
    icon: GraduationCap,
    title: 'Student performance tracking chaos',
    hindiTitle: 'स्टूडेंट परफॉर्मेंस ट्रैक करने की समस्या',
    scenario:
      'कौन सा student weak है? Parents को कैसे बताएं? Individual attention किसे चाहिए?',
    pain: 'Student progress manually track करना impossible',
    solution: 'Performance Analytics Dashboard',
    result:
      'Subject-wise performance graphs। Weak areas highlight। Parent reports auto-generate।',
    timeSaved: '2 hours daily',
    relief: "Every student's progress = visible!",
    color: 'from-teal-500 to-blue-500',
  },
  {
    id: 7,
    icon: FileText,
    title: 'Admission season = Paperwork overload',
    hindiTitle: 'Admission के नाम पर कागज़ों का तूफान',
    scenario:
      'July start होते ही dozens of walk-ins daily. Parents fill forms, admins enter details, documents scan करो, verify करो — फिर WhatsApp पर reminders भेजो.',
    pain: 'Bulk admission entry takes 10+ mins per student + errors + duplicate forms',
    solution: 'Digital Admission & Document Upload',
    result:
      'Parents get a link → Fill student data, upload Aadhaar/BirthCert online. Admin reviews & verifies in 1 click. Auto-sync with student database.',
    timeSaved: '10 mins per student',
    relief: 'Admission time = streamlined, stress-free process!',
    color: 'from-cyan-600 to-sky-500',
  },
];

export default function ProblemAndSolution() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const visibleProblems = useMemo(
    () => indianEducationProblems.slice(0, 4), // Show only first 4 for better performance
    []
  );

  return (
    <>
      {/* Hero Section */}
      <div
        className="py-16 px-4 
        "
      >
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Build for Indian Education </span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>

          <h1 className="text-4xl mt-4 md:text-6xl font-bold text-slate-900 mb-6">
            Tired of Spreadsheets, Calls, and Chaos?
            <br />
            <span className="text-lg md:text-xl bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent mt-3">
              Your School Runs Smarter with Shiksha Cloud.
            </span>
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-8">
            Indian schools, colleges और coaching classes के लिए specially
            designed। Daily की problems को minutes में solve करो।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Get Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 bg-transparent"
            >
              Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Problems Section */}
      <div className=" px-4 py-4 max-w-7xl mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <div
            className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4"
            style={{ willChange: 'transform', contain: 'layout' }}
          >
            {visibleProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                isVisible={true}
                isExpanded={expandedCard === problem.id}
                onExpand={() =>
                  setExpandedCard(
                    expandedCard === problem.id ? null : problem.id
                  )
                }
              />
            ))}
          </div>
        </Suspense>
      </div>
      <div className="text-center mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          ये Problems आपको भी परेशान करती हैं?
        </h2>
        <p className="text-slate-600 text-lg">
          हर Indian educator की daily life में ये situations आती हैं। Solution
          भी यहीं है।
        </p>
      </div>
    </>
  );
}

interface ProblemCardProps {
  problem: {
    id: number;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    hindiTitle: string;
    scenario: string;
    pain: string;
    solution: string;
    result: string;
    timeSaved: string;
    relief: string;
    color: string;
  };
  isVisible: boolean;
  onExpand: () => void;
  isExpanded: boolean;
}

const ProblemCard = memo(
  ({ problem, isVisible, onExpand, isExpanded }: ProblemCardProps) => {
    const IconComponent = problem.icon;

    if (!isVisible) return <div className="h-96" />; // Placeholder for virtual scrolling

    return (
      <Card
        className={`h-full flex flex-col group transition-all duration-300 hover:shadow-lg cursor-pointer border border-slate-200 hover:border-slate-300 ${
          isExpanded ? 'shadow-xl border-blue-300' : ''
        }`}
        onClick={onExpand}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`p-3 rounded-lg bg-gradient-to-br ${problem.color} text-white shadow-sm`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {problem.title}
              </h3>
              <p className="text-sm text-slate-600 font-medium">
                {problem.hindiTitle}
              </p>
            </div>
            <ArrowRight
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </div>

          {/* Scenario */}
          <div className="mb-4">
            <p className="text-slate-700 text-sm leading-relaxed italic line-clamp-3">
              "{problem.scenario}"
            </p>
          </div>

          {/* Pain Point */}
          <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
            <p className="text-red-800 text-sm font-medium">{problem.pain}</p>
          </div>

          {/* Solution (Expanded) */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800 font-semibold text-sm">
                  {problem.solution}
                </span>
              </div>
              <p className="text-green-700 text-sm">{problem.result}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <Badge variant="secondary" className="text-xs">
                  {problem.timeSaved}
                </Badge>
              </div>
              <p className="text-blue-600 text-sm font-medium ml-2 px-2 italic">
                {problem.relief}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProblemCard.displayName = 'ProblemCard';
