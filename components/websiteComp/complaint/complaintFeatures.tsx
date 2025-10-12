'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Bell,
  FileText,
  Users,
  Smartphone,
  CheckCircle,
  Quote,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function AnonymousComplaintSystemClientPage() {
  return (
    <main className="min-h-dvh">
      <Header />
      <Hero />
      <TrustIndicators />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <FinalCTA />
      <FooterLinks />
    </main>
  );
}

// Local header with anchor nav for single page
function Header() {
  return (
    <header className="border-b border-border sticky top-0 z-30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-pretty">
          Shiksha.cloud
          <span className="sr-only">{'Shiksha.cloud Home'}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="hover:underline underline-offset-4">
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:underline underline-offset-4"
          >
            How it works
          </a>
          <a href="#benefits" className="hover:underline underline-offset-4">
            Benefits
          </a>
          <a
            href="#testimonials"
            className="hover:underline underline-offset-4"
          >
            Testimonials
          </a>
          <a href="#contact" className="hover:underline underline-offset-4">
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <a href="#demo">Schedule Demo</a>
          </Button>
          <Button asChild>
            <a href="#start">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

// Hero section with strong hierarchy and accessible CTAs
function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1
              id="hero-heading"
              className="text-balance text-3xl md:text-5xl font-bold tracking-tight"
            >
              Anonymous Complaint System: Protecting Every Student in Your
              Institution
            </h1>
            <p className="text-pretty mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Advanced safety reporting platform ensuring student protection
              through secure, anonymous channels.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <a href="#start" className="inline-flex items-center gap-2">
                  Get Started Free - Protect Your Students Today{' '}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#demo">Schedule Free Demo</a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Trusted by 500+ Schools</Badge>
              <Badge variant="secondary">ISO 27001 Certified</Badge>
              <Badge variant="secondary">GDPR Compliant</Badge>
              <Badge variant="secondary">POCSO Act Ready</Badge>
            </div>
          </div>

          <Card className="md:ml-auto">
            <CardHeader>
              <CardTitle>Student Safety at a Glance</CardTitle>
              <CardDescription>
                Anonymous, encrypted reporting with instant alerts and compliant
                workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="aspect-[16/10] rounded-lg border bg-muted grid place-items-center text-muted-foreground">
                <span className="text-sm">
                  {'/school-safety-dashboard-preview.jpg'}
                </span>
              </div>
              <ul className="grid gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-1" />
                  <span>
                    Anonymous submissions with unique tracking IDs and
                    zero-knowledge privacy.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-1" />
                  <span>
                    Multi-channel instant alerts via SMS, email, and push
                    notifications.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-1" />
                  <span>
                    POCSO Act documentation and tamper-proof audit trails.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Trust strip to reinforce credibility
function TrustIndicators() {
  return (
    <section aria-label="Trust indicators" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span>Serving 500+ Indian schools</span>
          <Separator
            orientation="vertical"
            className="hidden md:inline-flex h-4"
          />
          <span>ISO 27001 • GDPR • POCSO Ready</span>
          <Separator
            orientation="vertical"
            className="hidden md:inline-flex h-4"
          />
          <span>Multi-language support</span>
          <Separator
            orientation="vertical"
            className="hidden md:inline-flex h-4"
          />
          <span>Secure evidence management</span>
        </div>
      </div>
    </section>
  );
}

// Problem section with statistics and cited sources
function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="px-4 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="problem-heading"
          className="text-balance text-2xl md:text-4xl font-bold tracking-tight"
        >
          The Problem We Must Solve
        </h2>
        <p className="text-pretty mt-3 text-muted-foreground leading-relaxed">
          76% of students don&apos;t report harassment due to fear of
          retaliation —{' '}
          <Link
            href="https://umich.edu/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            University of Michigan Study
          </Link>
          . Anonymous reporting systems reduce school violence by 13.5% —{' '}
          <Link
            href="https://nij.ojp.gov/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            National Institute of Justice
          </Link>
          .
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <CaseCard
            title="Badlapur Sexual Assault (Aug 2024)"
            description="Cleaner assaulted two 4-year-olds in school washrooms. Discovered only after a parent complaint."
            impact="State-wide protests, safety demands"
            links={[
              {
                label: 'Hindustan Times',
                href: 'https://www.hindustantimes.com/cities/mumbai-news/a-year-after-badlapur-sexual-assault-hc-irked-over-persisting-lack-of-security-measures-101758309696806.html',
              },
              {
                label: 'Wikipedia',
                href: 'https://en.wikipedia.org/wiki/Badlapur_school_sexual_abuse_case',
              },
            ]}
          />
          <CaseCard
            title="Pune School Harassment (2024)"
            description="Multiple arrests after prolonged unreported harassment due to fear and pressure."
            impact="Extended unreported incidents, institutional failure"
            links={[
              {
                label: 'Business Standard',
                href: 'https://www.business-standard.com/india-news/teacher-7-others-held-for-sexual-harassment-of-12-year-old-girl-in-pune-124082400343_1.html',
              },
              {
                label: 'Times of India',
                href: 'https://timesofindia.indiatimes.com/city/pune/school-director-fails-to-report-abuse-of-2-boys-by-teacher-held/articleshow/116482255.cms',
              },
            ]}
          />
          <CaseCard
            title="Mumbai Teacher Case (2024)"
            description="Year-long abuse discovered only after family noticed behavioral changes."
            impact="Delayed detection"
            links={[
              {
                label: 'NDTV',
                href: 'https://www.ndtv.com/india-news/mumbai-school-english-teacher-sexually-assaulted-her-student-16-for-a-year-pocso-act-news-8811717',
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function CaseCard({
  title,
  description,
  impact,
  links,
}: {
  title: string;
  description: string;
  impact: string;
  links: { label: string; href: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{impact}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p className="leading-relaxed">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Solution positioning with differentiators
function Solution() {
  return (
    <section
      aria-labelledby="solution-heading"
      className="bg-secondary text-secondary-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2
              id="solution-heading"
              className="text-balance text-2xl md:text-4xl font-bold tracking-tight"
            >
              The Fear-Free Path to Reporting and Resolution
            </h2>
            <p className="text-pretty mt-4 leading-relaxed">
              Shiksha.cloud&apos;s Anonymous Complaint System empowers students
              to report safety concerns without fear. It’s the only school
              management platform with integrated women-safety features and
              legal compliance, designed specifically for Indian institutions
              with multi-language support.
            </p>
          </div>
          <ul className="grid gap-3 text-sm">
            {[
              'Zero-knowledge privacy and unique tracking IDs',
              'Evidence capture with tamper-proof audit trails',
              'Automated role-based alerts to authorities',
              'Multi-language UI for diverse communities',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Feature grid with icons
function Features() {
  const items = [
    {
      icon: Shield,
      title: 'Encrypted Anonymous Submissions',
      description:
        'Unique tracking IDs with zero-knowledge architecture ensure complete anonymity and privacy protection.',
    },
    {
      icon: Bell,
      title: 'Multi-channel Instant Alerts',
      description:
        'SMS, email, push notifications to administrators, parents, and authorities within seconds of submission.',
    },
    {
      icon: FileText,
      title: 'Secure Evidence Management',
      description:
        'Cloud storage with tamper-proof audit trails and legal compliance for POCSO Act requirements.',
    },
    {
      icon: Users,
      title: 'Real-time Dashboard',
      description:
        'Case management, status tracking, and analytics for administrators and designated safety officers.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description:
        'Works on any device with offline submission capabilities and responsive user interface.',
    },
    {
      icon: CheckCircle,
      title: 'Legal Compliance',
      description:
        'Complete POCSO Act documentation, reporting requirements, and audit trail capabilities.',
    },
  ] as const;

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="px-4 py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="features-heading"
          className="text-balance text-2xl md:text-4xl font-bold tracking-tight"
        >
          Key Features
        </h2>
        <p className="text-pretty mt-3 text-muted-foreground leading-relaxed max-w-3xl">
          Enterprise-grade privacy, instant alerting, and compliant workflows
          engineered for safety.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full">
              <CardHeader className="flex-row items-center gap-3">
                <div className="rounded-md bg-secondary text-secondary-foreground p-2">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Four-step process with numbered cards
function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: 'Report Submission',
      description:
        'Anonymous submission via web portal, mobile app, or QR code scanning.',
    },
    {
      step: 2,
      title: 'Instant Alerts',
      description:
        'Automated notifications to designated administrators and authorities.',
    },
    {
      step: 3,
      title: 'Investigation Workflow',
      description:
        'Evidence collection, progress tracking, and comprehensive case management.',
    },
    {
      step: 4,
      title: 'Resolution & Follow-up',
      description:
        'Case closure with prevention measures and ongoing monitoring.',
    },
  ] as const;

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="bg-secondary text-secondary-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <h2
          id="how-heading"
          className="text-balance text-2xl md:text-4xl font-bold tracking-tight"
        >
          How It Works
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <Card key={s.step} className="h-full">
              <CardHeader>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                  {s.step}
                </div>
                <CardTitle className="mt-3 text-lg">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Quantified benefits and stats
function Benefits() {
  const stats = [
    { value: '85%', label: 'Reduction in unreported incidents' },
    { value: '40%', label: 'Faster incident resolution' },
    { value: '100%', label: 'POCSO Act compliance' },
    { value: '500+', label: 'Schools already protected' },
  ] as const;

  const bullets = [
    'Complete legal protection with POCSO Act compliance',
    'Early intervention prevents escalation',
    'Enhanced institutional reputation through proactive safety',
    'Builds trust with parents and community',
  ] as const;

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="px-4 py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="benefits-heading"
          className="text-balance text-2xl md:text-4xl font-bold tracking-tight"
        >
          Tangible Impact for Your Institution
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">
                    {s.value}
                  </CardTitle>
                  <CardDescription>{s.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Why it matters</CardTitle>
              <CardDescription>Benefits beyond compliance</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              <ul className="grid gap-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Testimonials for social proof
function Testimonials() {
  const items = [
    {
      quote:
        'The anonymous reporting system has completely transformed our school safety culture. Students now feel empowered to speak up, and we can address issues before they escalate.',
      author: 'Principal, DPS International',
      role: 'School Administrator',
    },
    {
      quote:
        'Finally, our students feel safe to report harassment without fear of retaliation or judgment. The system is intuitive and provides the anonymity they need.',
      author: 'Student, Class 12',
      role: 'Student',
    },
    {
      quote:
        'As a parent, I have complete peace of mind knowing my daughter can report any issues anonymously through the school’s safety system.',
      author: 'Parent',
      role: 'Parent',
    },
  ] as const;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-secondary text-secondary-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <h2
          id="testimonials-heading"
          className="text-balance text-2xl md:text-4xl font-bold tracking-tight"
        >
          Trusted by Schools, Students, and Parents
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((t, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <Quote className="h-5 w-5 text-primary" aria-hidden />
                <CardTitle className="text-base font-normal leading-relaxed">
                  “{t.quote}”
                </CardTitle>
                <CardDescription>
                  {t.author} • {t.role}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA with contacts and anchor targets for nav buttons
function FinalCTA() {
  return (
    <section
      id="start"
      aria-labelledby="final-cta-heading"
      className="px-4 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl text-center">
        <h2
          id="final-cta-heading"
          className="text-balance text-2xl md:text-4xl font-bold tracking-tight"
        >
          Implement Anonymous Complaint System in Your School Today
        </h2>
        <p className="text-pretty mt-3 text-muted-foreground leading-relaxed">
          Join 500+ schools already protecting their students with comprehensive
          safety reporting.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg">Start Free Trial Now</Button>
          <Button id="demo" size="lg" variant="secondary" asChild>
            <a href="#contact">Schedule Demo &amp; Consultation</a>
          </Button>
        </div>

        <div id="contact" className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phone</CardTitle>
              <CardDescription>Talk to our team</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <a
                href="tel:+91-XXXX-XXXX"
                className="underline underline-offset-4"
              >
                +91-XXXX-XXXX
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email</CardTitle>
              <CardDescription>We reply within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <a
                href="mailto:safety@shiksha.cloud"
                className="underline underline-offset-4"
              >
                safety@shiksha.cloud
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live Chat</CardTitle>
              <CardDescription>24/7 Chat Support</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              Connect with a specialist instantly
            </CardContent>
          </Card>
        </div>
        <ComplianceNote />
      </div>
    </section>
  );
}

// Compliance footnote
function ComplianceNote() {
  return (
    <div className="mt-10 text-xs text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
      POCSO Act 2012 compliance • Indian Data Protection adherence • RTI
      readiness • Audit trail maintenance • Legal documentation support •
      Educational regulatory compliance
    </div>
  );
}

// Footer with internal link groups
function FooterLinks() {
  const navigation = [
    { text: 'Home', url: 'https://shiksha.cloud/' },
    { text: 'Features', url: 'https://shiksha.cloud/features' },
    {
      text: 'School Management System',
      url: 'https://shiksha.cloud/features/school-management',
    },
    {
      text: 'Student Information System',
      url: 'https://shiksha.cloud/features/student-management',
    },
    {
      text: 'Academic Management',
      url: 'https://shiksha.cloud/features/academics',
    },
    {
      text: 'Attendance Management',
      url: 'https://shiksha.cloud/features/attendance',
    },
    { text: 'Fee Management', url: 'https://shiksha.cloud/features/fees' },
    { text: 'Exam Management', url: 'https://shiksha.cloud/features/exams' },
    {
      text: 'Timetable Management',
      url: 'https://shiksha.cloud/features/timetable',
    },
  ];

  const safetyFeatures = [
    {
      text: 'Women Safety Features',
      url: 'https://shiksha.cloud/features/women-safety',
    },
    {
      text: 'Student Safety Dashboard',
      url: 'https://shiksha.cloud/features/safety-dashboard',
    },
    {
      text: 'Anonymous Reporting System',
      url: 'https://shiksha.cloud/features/anonymous-complaints',
    },
    {
      text: 'Incident Management',
      url: 'https://shiksha.cloud/features/incident-management',
    },
    {
      text: 'Emergency Alert System',
      url: 'https://shiksha.cloud/features/emergency-alerts',
    },
    {
      text: 'Campus Safety Monitoring',
      url: 'https://shiksha.cloud/features/campus-safety',
    },
  ];

  const resources = [
    {
      text: 'POCSO Compliance Guide',
      url: 'https://shiksha.cloud/resources/pocso-compliance',
    },
    {
      text: 'School Safety Best Practices',
      url: 'https://shiksha.cloud/blog/school-safety-best-practices',
    },
    {
      text: 'Women Safety in Education',
      url: 'https://shiksha.cloud/blog/women-safety-education',
    },
    {
      text: 'Anonymous Reporting Benefits',
      url: 'https://shiksha.cloud/blog/anonymous-reporting-benefits',
    },
    {
      text: 'School Safety Technology Trends',
      url: 'https://shiksha.cloud/blog/safety-technology-trends',
    },
    { text: 'Case Studies', url: 'https://shiksha.cloud/case-studies' },
  ];

  const legal = [
    { text: 'Privacy Policy', url: 'https://shiksha.cloud/privacy-policy' },
    { text: 'Terms of Service', url: 'https://shiksha.cloud/terms-of-service' },
    { text: 'Data Protection', url: 'https://shiksha.cloud/data-protection' },
    { text: 'GDPR Compliance', url: 'https://shiksha.cloud/gdpr-compliance' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <FooterGroup title="Navigation" links={navigation} />
          <FooterGroup title="Safety Features" links={safetyFeatures} />
          <FooterGroup title="Resources" links={resources} />
          <FooterGroup title="Legal" links={legal} />
        </div>
        <div className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Shiksha.cloud. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: { text: string; url: string }[];
}) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline underline-offset-4"
            >
              {l.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
