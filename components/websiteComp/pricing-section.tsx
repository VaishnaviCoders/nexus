'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Check, CheckCheck, CheckCircle } from 'lucide-react';

export default function PricingSection() {
  const [students, setStudents] = useState(100);
  const basePrice = 0;
  const studentPrice = 79;
  const price = basePrice + students * studentPrice;

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-center">
        {/* Top Dots and line - can be a separate component */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-black dark:bg-white" />
          <div className="h-px w-4 bg-black dark:bg-white" />
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
            <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
          </div>
        </div>
      </div>
      <div className="mb-12 space-y-3 text-center">
        <h2 className="font-medium text-4xl text-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
          Affordable for every school
        </h2>
        <p className="mx-auto max-w-xl text-black/60 text-sm tracking-tighter sm:text-base dark:text-white/60">
          Pay per student. Scale as you grow. No hidden costs.
        </p>
      </div>
      <div className="relative mx-auto max-w-6xl bg-white">
        <Card className="rounded-2xl border border-black/10 bg-black/5 dark:border-white/5 dark:bg-zinc-900/50 p-6 sm:p-10">
          <CardContent className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-medium text-red-500/85 text-xs tracking-tighter dark:text-red-500/85">
                    Pricing
                  </span>
                </div>
                <h3 className="mb-1.5 font-medium text-2xl text-black tracking-tighter sm:text-3xl dark:text-white">
                  Grow with your institution
                </h3>
                <p className="text-black/60 text-sm tracking-tighter dark:text-white/60">
                  Start with any number of students and scale as your
                  institution expands.
                </p>
              </div>
              {/* Counter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black text-sm tracking-tighter dark:text-white">
                    Number of Students
                  </span>
                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={students <= 1}
                      onClick={() => setStudents((s) => Math.max(1, s - 50))}
                      className="h-7 w-7"
                    >
                      -
                    </Button>
                    <div className="w-14 text-center font-semibold text-black text-xl tracking-tighter dark:text-white">
                      {students}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={students >= 1000}
                      onClick={() => setStudents((s) => Math.min(1000, s + 50))}
                      className="h-7 w-7"
                    >
                      +
                    </Button>
                  </div>
                </div>
                {/* Slider */}
                <div className="relative pt-1">
                  <Slider
                    value={[students]}
                    min={1}
                    max={1000}
                    onValueChange={([v]) => setStudents(v)}
                  />
                  <div className="mt-1.5 flex justify-between">
                    <span className="text-black/40 text-xs tracking-tighter dark:text-white/40">
                      1 student
                    </span>
                    <span className="text-black/40 text-xs tracking-tighter dark:text-white/40">
                      1000 students
                    </span>
                  </div>
                </div>
              </div>
              {/* Pricing */}
              <div className="border-black/10 border-t pt-4 dark:border-white/10">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div className="flex items-end gap-1.5">
                    <span className="font-semibold text-5xl text-black tracking-tighter sm:text-6xl dark:text-white">
                      ₹{price}
                    </span>
                    <span className="mb-1.5 text-base text-black/60 tracking-tighter dark:text-white/60">
                      /month
                    </span>
                  </div>
                  {/* CTA */}
                  <div className="flex flex-col items-end gap-1.5">
                    <Button className="bg-red-500/85 hover:bg-red-500/95 text-white py-2 px-6">
                      Start for Free
                    </Button>
                    <p className="text-black/50 text-xs tracking-tighter dark:text-white/50">
                      No setup fees required.
                    </p>
                  </div>
                </div>
                <div className="space-y-0.5 text-black/50 text-xs tracking-tighter dark:text-white/50">
                  <p>Base: ₹0/mo + {students} student × ₹79</p>
                  <p className="text-black/40 dark:text-white/40">
                    Billed monthly, cancel anytime
                  </p>
                </div>
              </div>
            </div>
            {/* Features list */}
            <div className="space-y-4">
              <h4 className="mb-3 font-medium text-black text-sm tracking-tighter dark:text-white">
                Everything included:
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  'Complete Student Management',
                  'Online Fee Payment System',
                  'Attendance Tracking',
                  'Parent-Teacher Communication',
                  'Digital Notice Board',
                  'Holiday Calendar Management',
                  'Document Verification System',
                  'Fee Receipt Generation',
                  'Bulk Student Import',
                  'Many More',
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="flex h-3.5 bg-green-50 w-3.5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 ">
                        {/* Add actual icon */}
                        <CheckCircle className="w-5 h-5 text-green-500  " />
                      </div>
                    </div>
                    <span className="text-black/70 text-sm leading-tight tracking-tighter dark:text-white/70">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              {/* Statistics */}
              <div className="mt-6 border-black/10 border-t pt-6 dark:border-white/10">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="mb-1 font-semibold text-3xl text-black tracking-tighter sm:text-4xl dark:text-white">
                      50+
                    </div>
                    <div className="text-black/50 text-xs tracking-tighter dark:text-white/50">
                      Schools using our platform
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 font-semibold text-3xl text-black tracking-tighter sm:text-4xl dark:text-white">
                      99%
                    </div>
                    <div className="text-black/50 text-xs tracking-tighter dark:text-white/50">
                      Fee collection rate
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 font-semibold text-3xl text-black tracking-tighter sm:text-4xl dark:text-white">
                      10K+
                    </div>
                    <div className="text-black/50 text-xs tracking-tighter dark:text-white/50">
                      Students managed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Service highlights */}
      <div className="relative mt-12">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 text-center md:grid-cols-3">
          {[
            {
              title: '24/7 School Support',
              desc: 'Get help whenever you need it from our dedicated education support team',
            },
            {
              title: 'Free School Setup',
              desc: 'Personalized onboarding to get your school running quickly',
            },
            {
              title: 'Regular Updates',
              desc: 'Continuous improvements and new features at no extra cost',
            },
          ].map((item) => (
            <div className="space-y-1.5" key={item.title}>
              <p className="font-medium text-black tracking-tighter dark:text-white">
                {item.title}
              </p>
              <p className="text-black/60 text-sm tracking-tighter dark:text-white/60">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
