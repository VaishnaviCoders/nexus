import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ModeToggle } from '@/components/mode-toggle';
import { CreateOrganization } from '@clerk/nextjs';
import Features from '../../components/websiteComp/Features';
import BentoGrid from '../../components/websiteComp/BentoGrid';
import Testimonials from '../../components/websiteComp/Testimonials';
import Footer from '../../components/websiteComp/Footer';
// import { Spotlight } from '@/components/ui/Spotlight';
import { TextScramble } from '@/components/ui/text-scramble';
import DotPattern from '@/components/ui/dot-pattern';
// import { TextEffectWithExit } from '@/components/ui/TextEffectWithExit';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import IntegrationComponent from '../../components/websiteComp/IntegrationComponent';
import Link from 'next/link';
import { Shield, ShieldCheck } from 'lucide-react';
// import MagicBentoGrid from '../components/websiteComp/magic-bento';

export default async function IndexPage() {
  return (
    <main className="mx-2">
      {/* <Spotlight className="" /> */}
      <header className="flex items-center justify-between my-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-green-400" />
          <h1>NEXUS CRM</h1>
        </div>

        <div className="flex items-center space-x-2">
          <ModeToggle />

          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <Button variant="outline" className="z-10" size={'sm'}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <div className="relative flex h-[500px]  w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
        <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
          Everything Your School Needs — In One Smart CRM
        </p>
        <TextScramble
          className="font-mono text-sm my-5 h-3"
          duration={1.2}
          characterSet=". "
        >
          Automate Admin, Engage Students, Empower Educators
        </TextScramble>

        {/* <div className="h-5">
          <TextEffectWithExit />
        </div> */}

        <div className="my-4 z-10 flex items-center justify-between gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Get Early Access</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-0 [&>button]:hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <CreateOrganization afterCreateOrganizationUrl={'/dashboard'} />
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="z-10">
            Download PDF
          </Button>
        </div>
        <DotPattern
          className={cn(
            '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]'
          )}
        />
      </div>
      <BentoGrid />

      <Features />

      {/* <div className="w-full mx-auto lg:max-w-screen-xl lg:mx-auto px-4 md:px-12">
        <MagicBentoGrid />
      </div> */}

      <IntegrationComponent />
      <Testimonials />

      <Footer />
    </main>
  );
}
