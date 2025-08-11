import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Lock, Eye } from 'lucide-react';

export default function page() {
  return (
    <main className="flex-1">
      <section className="w-full my-5">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
              <Lock className="mr-2 h-3 w-3" />
              100% Anonymous & Secure
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Your Voice
              </span>
              <br />
              <span className="text-slate-900">Matters</span>
            </h1>
            <p className="mx-auto max-w-[600px] text-slate-600 md:text-xl">
              Report incidents safely and anonymously. We're here to listen,
              protect, and take action.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard/anonymous-complaints/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
              >
                File a Complaint
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/anonymous-complaints/track">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 hover:bg-slate-50"
              >
                Track Complaint
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-white/50 backdrop-blur-sm">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Complete Anonymity
            </h3>
            <p className="text-slate-600">
              Your identity is never revealed. Report without fear of
              retaliation.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">POSH Compliant</h3>
            <p className="text-slate-600">
              Specialized support for harassment and sensitive complaints.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200">
            <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Secure & Encrypted
            </h3>
            <p className="text-slate-600">
              All data is encrypted and handled with highest security standards.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
