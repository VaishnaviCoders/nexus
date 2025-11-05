import { Button } from '@/components/ui/button';
import Features from '@/components/websiteComp/Features';
import BentoGrid from '@/components/websiteComp/BentoGrid';
import Testimonials from '@/components/websiteComp/Testimonials';
import Footer from '@/components/websiteComp/Footer';
import { Spotlight } from '@/components/ui/Spotlight';
import {
  CreateOrganization,
  // SignInButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from '@clerk/nextjs';
import IntegrationComponent from '@/components/websiteComp/IntegrationComponent';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowRightIcon,
  ShieldCheck,
  UserCircleIcon,
} from 'lucide-react';
import ProblemAndSolution from '@/components/websiteComp/ProblemAndSolution';
import { Metadata } from 'next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DotPattern from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { indianEducationProblems } from '@/constants';
import CardFlip from '@/components/ui/card-flip';
import InstitutesShowcase from '@/components/websiteComp/shared/institute-showcase';
import CTA from '@/components/websiteComp/ctc';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shiksha.cloud'),
  alternates: {
    canonical: '/',
  },
  title: 'Shiksha.cloud – Modern School Management CRM',
  description:
    'All-in-one platform to manage students, fees, attendance, and reports. Built for schools, colleges, and coaching institutes.',
  keywords: [
    'school management software',
    'student information system',
    'fee management',
    'attendance tracker',
    'Shiksha cloud CRM',
  ],
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Shiksha.cloud',
    description: 'Streamline your school operations with Shiksha.cloud',
    url: 'https://shiksha.cloud',
    siteName: 'Shiksha.cloud',
    images: [
      {
        url: 'https://shiksha.cloud/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Shiksha.cloud - School CRM',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function IndexPage() {
  return (
    <main className="mx-2">
      {/* <Spotlight className="" /> */}
      <header className="flex items-center justify-between my-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-green-400" />
          <h1 className="text-primary font-medium">Shiksha Cloud</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* <ModeToggle /> */}

          {/* <SignedOut>
            <SignInButton signUpForceRedirectUrl={'/dashboard'}>
              <Button
                variant="outline"
                className="bg-white text-blue-500 hover:bg-blue-50 hover:text-blue-600 border-blue-300 shadow-none"
              >
                <UserCircleIcon />
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
           */}
          <Button variant="outline" className="z-10" size={'sm'}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          {/* <UserButton />
          </SignedIn> */}
        </div>
      </header>

      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Build for Indian Education </span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
          <DotPattern
            className={cn(
              '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]'
            )}
          />
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
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  Get Early Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md p-0 [&>button]:hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <CreateOrganization afterCreateOrganizationUrl={'/dashboard'} />
              </DialogContent>
            </Dialog>

            <Button size="lg" variant="outline" asChild>
              <Link href="https://gamma.app/docs/Shikshacloud-gtpghwx8wdrjyxs">
                Download PDF
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/* <ProblemAndSolutionFlipCard /> */}

      <div className="w-full px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {indianEducationProblems.map((problem) => (
            <CardFlip
              key={problem.id}
              title={problem.title}
              subtitle={problem.subtitle}
              description={problem.description}
              features={problem.features}
            />
          ))}
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
      </div>

      <BentoGrid />

      <Features />

      {/* <div className="w-full mx-auto lg:max-w-screen-xl lg:mx-auto px-4 md:px-12">
        <MagicBentoGrid />
      </div> */}

      <IntegrationComponent />
      <Testimonials />
      <section className="text-center">
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>✨ Build for Indian Education </span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>

        <DotPattern
          className={cn(
            '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]'
          )}
        />
        <InstitutesShowcase />
        <h1 className="text-lg font-bold md:text-xl bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          Manage Everything. From One Dashboard.
        </h1>
        <h2 className="text-sm text-slate-600 max-w-2xl mx-auto">
          100+ institutes already trust Shiksha Cloud to run smarter, faster,
          and fully digital.
        </h2>
      </section>

      <div className="flex items-center justify-center space-x-5 mt-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Get Early Access
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md p-0 [&>button]:hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CreateOrganization afterCreateOrganizationUrl={'/dashboard'} />
          </DialogContent>
        </Dialog>

        <Button size="lg" variant="outline" asChild>
          <Link href="https://gamma.app/docs/Shikshacloud-gtpghwx8wdrjyxs">
            Download PDF
          </Link>
        </Button>
      </div>
      <Footer />
    </main>
  );
}
