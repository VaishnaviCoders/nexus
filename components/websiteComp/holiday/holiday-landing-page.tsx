'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Shield,
  Users,
  Bell,
  Download,
  Trash2,
  Smartphone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HolidayLandingPage() {
  const [faqQuery, setFaqQuery] = React.useState('');

  const faqs = [
    {
      q: 'How do approvals work for staff leave?',
      a: 'Requests route to the right approver with clear status updates for staff and administrators.',
    },
    {
      q: 'Can parents view holiday updates?',
      a: 'Yes, a parent-friendly view keeps them informed about upcoming holidays and changes.',
    },
    {
      q: 'How are emergencies handled?',
      a: 'Trigger an emergency flow that prioritizes safety and clear communication across all stakeholders.',
    },
    {
      q: 'Can we import data from spreadsheets?',
      a: 'Yes, quickly import via well-structured CSV templates with real-time validation.',
    },
    {
      q: 'Is there a mobile experience?',
      a: 'A clean, responsive interface works beautifully across devices for admins, staff, and parents.',
    },
  ];
  const filteredFaqs = faqs.filter(
    (i) =>
      i.q.toLowerCase().includes(faqQuery.toLowerCase()) ||
      i.a.toLowerCase().includes(faqQuery.toLowerCase())
  );

  const parentPreviews = [
    { src: '/images/HeroHoliday.png', alt: 'Parent app inbox preview' },
    {
      src: '/parent-app-notification.jpg',
      alt: 'Parent app notifications preview',
    },
    {
      src: '/parent-app-holiday-view.jpg',
      alt: 'Parent app holiday view preview',
    },
  ];

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" aria-hidden />
            <span className="font-semibold">Holiday Manager</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-primary">
              Features
            </a>
            <a href="#timeline" className="hover:text-primary">
              How it works
            </a>
            <a href="#testimonials" className="hover:text-primary">
              Social proof
            </a>
            <a href="#faq" className="hover:text-primary">
              FAQ
            </a>
          </nav>
          <Button asChild size="sm">
            <a href="#cta" aria-label="Get started">
              Get started
            </a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-4">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              <span className="font-medium">
                New: Emergency handling built-in
              </span>
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold text-balance">
              Streamline School Holidays and Keep Everyone Informed
            </h1>
            <p className="mt-4 text-muted-foreground text-pretty">
              A modern, reliable system for leave approvals, emergency
              workflows, and transparent parent communication—built to reduce
              admin work and improve trust.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <a href="#cta">Start free trial</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#features">Explore features</a>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> RLS-ready and
                secure
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />{' '}
                Mobile-friendly
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Clear audit
                trails
              </li>
            </ul>
          </div>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Unified Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src="/images/HeroHoliday.png"
                alt="Admin dashboard preview"
                className="w-full rounded-md border"
              />
              <p className="text-sm text-muted-foreground">
                Approvals, scheduling, and parent updates—all in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-semibold">12k+</div>
            <div className="text-xs text-muted-foreground mt-1">
              Requests processed
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold">99.95%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Uptime this year
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold">3x</div>
            <div className="text-xs text-muted-foreground mt-1">
              Faster approvals
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold">+92</div>
            <div className="text-xs text-muted-foreground mt-1">
              NPS / Parent trust
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-4 py-16 space-y-10"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Role-based approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Route requests to the right approvers with full transparency and
              instant status updates.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Emergency workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Trigger critical steps with one action. Notify staff and parents
              with clear instructions.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" /> Imports &
                templates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Upload structured CSV templates and validate in real time—no messy
              spreadsheets.
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" /> Safe delete options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Archive, soft-delete, or permanently remove—your choice with
                explicit confirmations.
              </p>
              <img
                src="/delete-flows.jpg"
                alt="Delete flow options preview"
                className="w-full rounded-md border"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" /> Parent app
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-4 overflow-x-auto snap-x">
                {parentPreviews.map((p, i) => (
                  <img
                    key={i}
                    src={
                      p.src ||
                      '/placeholder.svg?height=200&width=320&query=parent app preview'
                    }
                    alt={p.alt}
                    className="h-[200px] w-auto flex-none rounded-md border snap-center"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Clear updates and messages help parents stay aligned with school
                schedules.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3 text-sm">
          <li className="rounded-lg border p-4">
            <div className="font-medium">1. Submit</div>
            <p className="text-muted-foreground mt-1">
              Staff create a request with details and dates.
            </p>
          </li>
          <li className="rounded-lg border p-4">
            <div className="font-medium">2. Approve</div>
            <p className="text-muted-foreground mt-1">
              Requests route to approvers for quick review.
            </p>
          </li>
          <li className="rounded-lg border p-4">
            <div className="font-medium">3. Notify</div>
            <p className="text-muted-foreground mt-1">
              Parents receive clear and timely notifications.
            </p>
          </li>
        </ol>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Trusted by school leaders
        </h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              “We cut our approval time by more than half. Teachers and parents
              love the clarity.”
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Emergency workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              “Emergency handling is clear and calm—everyone knows what to do.”
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              “Finally, no more back-and-forth email threads. Everything lives
              in one place.”
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Specs */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Built for reliability
        </h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Role-based access, audit logs, and secure data handling as a first
              principle.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Keep staff and parents aligned with a shared source of truth.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Clear states and notifications reduce confusion and follow-ups.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Frequently asked questions
          </h2>
          <div className="hidden md:block w-[320px]">
            <Input
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              placeholder="Search FAQs"
              aria-label="Search FAQs"
            />
          </div>
        </div>
        <div className="md:hidden mt-4">
          <Input
            value={faqQuery}
            onChange={(e) => setFaqQuery(e.target.value)}
            placeholder="Search FAQs"
            aria-label="Search FAQs"
          />
        </div>
        <div className="mt-6 space-y-4">
          {filteredFaqs.map((item, idx) => (
            <details key={idx} className="rounded-lg border p-4">
              <summary className="cursor-pointer select-none font-medium">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-6xl px-4 pb-20">
        <Card>
          <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Ready to streamline your holiday workflows?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start your free trial today and experience clarity in every
                approval and update.
              </p>
            </div>
            <Button asChild size="lg">
              <a href="#" className="inline-flex items-center gap-2">
                Get started <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>
            &copy; {new Date().getFullYear()} Holiday Manager. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary">
              Privacy
            </a>
            <a href="#" className="hover:text-primary">
              Terms
            </a>
            <a href="#" className="hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
