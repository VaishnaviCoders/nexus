import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Shield,
  Smartphone,
  Bell,
  CheckCircle2,
  Star,
  Play,

  CreditCard,
  FileText,
  Download,
} from 'lucide-react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Fee Management',
  description: 'Fee Management',

}
export default function FeeManagementPage() {

  return (
    <div className="min-h-screen bg-background">
      {/* Aggressive Hero - Focus on Pain Point */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-background dark:from-slate-950 dark:via-blue-950/20">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Proposition */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  Schools lose ₹2-5 lakhs annually to late payments
                </span>
              </div>

              <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
                Stop Chasing Parents.
                <span className="block text-primary mt-2">Start Collecting Fees.</span>
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed">
                Shiksha Cloud automates your entire fee collection process. Get paid faster, reduce admin work by 80%, and never miss a payment again.
              </p>

              {/* Social Proof Numbers */}
              <div className="flex flex-wrap gap-6 py-4">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Schools Trust Us</div>
                </div>
                <div className="border-l pl-6">
                  <div className="text-3xl font-bold">₹450Cr+</div>
                  <div className="text-sm text-muted-foreground">Collected Annually</div>
                </div>
                <div className="border-l pl-6">
                  <div className="text-3xl font-bold">98.5%</div>
                  <div className="text-sm text-muted-foreground">Collection Rate</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button size="lg" className="h-14 text-base px-8 shadow-lg hover:shadow-xl transition-all">
                  <Play className="h-5 w-5 mr-2" />
                  Watch 2-Min Demo
                </Button>
                <Button size="lg" variant="outline" className="h-14 text-base px-8">
                  Calculate Your Savings
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Live in 24 hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>No setup cost</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Right: Live Dashboard Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <Card className="relative border-2 shadow-2xl">
                <CardHeader className="border-b bg-gradient-to-br from-muted/50 to-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500" />
                      </div>
                      <span className="text-sm font-medium ml-2">Live Dashboard</span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Real-time
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {/* Today's Collections */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/20 p-5 rounded-xl border border-green-200/50 dark:border-green-900/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Today's Collections</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-400">₹3,45,000</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                        <TrendingUp className="h-4 w-4" />
                        +18%
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Last updated: 2 minutes ago</span>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Pending</p>
                      <p className="text-lg font-bold">₹8.2L</p>
                      <p className="text-xs text-orange-600">142 students</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">This Month</p>
                      <p className="text-lg font-bold">₹45.2L</p>
                      <p className="text-xs text-green-600">85% collected</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Reminders</p>
                      <p className="text-lg font-bold">320</p>
                      <p className="text-xs text-blue-600">Sent today</p>
                    </div>
                  </div>

                  {/* Recent Payment */}
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground">RECENT PAYMENT</p>
                      <Badge variant="secondary" className="text-xs">Just now</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Amit Kumar - Grade 10A</p>
                        <p className="text-xs text-muted-foreground">UPI Payment</p>
                      </div>
                      <p className="text-lg font-bold text-green-600">₹12,500</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-background border-2 border-primary/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">30%</p>
                    <p className="text-xs text-muted-foreground">Faster Collections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section - High Converting */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4">ROI Calculator</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See How Much You'll Save
            </h2>
            <p className="text-xl text-muted-foreground">
              Schools using Shiksha Cloud save an average of ₹2.8L annually
            </p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Students</label>
                    <input 
                      type="number" 
                      defaultValue="500"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Average Fee Per Student (₹)</label>
                    <input 
                      type="number" 
                      defaultValue="25000"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Late Payment Rate (%)</label>
                    <input 
                      type="number" 
                      defaultValue="25"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-6 rounded-xl border-2 border-primary/20">
                  <h3 className="font-semibold text-lg mb-6">Your Annual Savings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Faster collections</span>
                      <span className="font-bold text-green-600">₹1,87,500</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Admin time saved</span>
                      <span className="font-bold text-green-600">₹96,000</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Reduced errors</span>
                      <span className="font-bold text-green-600">₹42,000</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-primary/30">
                      <span className="font-bold text-lg">Total Annual Savings</span>
                      <span className="font-bold text-3xl text-primary">₹3,25,500</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full mt-6 h-12">
                    Get Your Custom ROI Report
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem-Solution (Before & After) */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Before & After Shiksha Cloud
            </h2>
            <p className="text-xl text-muted-foreground">
              See the transformation schools experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before Card */}
            <Card className="border-2 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
              <CardHeader>
                <Badge variant="destructive" className="w-fit mb-2">Without Automation</Badge>
                <CardTitle className="text-2xl">Manual Fee Collection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "45-day average collection cycle",
                  "100+ hours monthly on reconciliation",
                  "15-20% revenue leakage annually",
                  "Constant parent complaints about receipts",
                  "Payment tracking in Excel sheets",
                  "Missing follow-ups on late payments"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="text-red-600 text-xs font-bold">✕</span>
                    </div>
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* After Card */}
            <Card className="border-2 border-green-200 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-green-600 hover:bg-green-700">With Shiksha Cloud</Badge>
                <CardTitle className="text-2xl">Automated Fee System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "7-day average collection with auto-reminders",
                  "5 minutes for complete reconciliation",
                  "98.5% collection rate consistently",
                  "Instant digital receipts to parents",
                  "Real-time dashboard & analytics",
                  "Automated WhatsApp payment reminders"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="h-3 w-3 text-green-600 font-bold" />
                    </div>
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof - Video Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results from Real Schools
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                school: "Delhi Public School",
                principal: "Rajesh Kumar",
                image: "/api/placeholder/400/300",
                result: "Reduced collection time by 65%",
                quote: "We went from chasing parents for weeks to getting paid within days. The ROI was immediate.",
                students: "1,200"
              },
              {
                school: "St. Xavier's High",
                principal: "Meera Singh",
                image: "/api/placeholder/400/300",
                result: "Saved ₹4.2L in first year",
                quote: "Our accounts team now focuses on strategy instead of manual data entry. Game changer.",
                students: "850"
              },
              {
                school: "Ryan International",
                principal: "Amit Sharma",
                image: "/api/placeholder/400/300",
                result: "99% parent satisfaction",
                quote: "Parents love the convenience. They can pay from anywhere, anytime. Complaints dropped to zero.",
                students: "2,000"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="border-2 hover:shadow-xl transition-all overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />
                  <div className="relative z-10 h-16 w-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-primary ml-1" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white text-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    {testimonial.students} students
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="font-medium text-lg mb-2 text-green-600">
                    {testimonial.result}
                  </p>
                  <p className="text-muted-foreground italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.principal}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.school}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase with Interactive Tabs */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Collect Fees Faster
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features that actually make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Bell, title: "Smart Reminders", desc: "Auto WhatsApp & SMS before due dates", color: "blue" },
              { icon: Zap, title: "Instant Reconciliation", desc: "Auto-match payments in real-time", color: "green" },
              { icon: Smartphone, title: "Parent App", desc: "Pay, track, download receipts", color: "purple" },
              { icon: BarChart3, title: "Live Analytics", desc: "Collection trends & forecasts", color: "orange" },
              { icon: CreditCard, title: "All Payment Modes", desc: "UPI, Cards, Net Banking, Cash", color: "pink" },
              { icon: Shield, title: "Bank-Grade Security", desc: "Encrypted & PCI-DSS compliant", color: "red" },
              { icon: FileText, title: "Custom Fee Structure", desc: "Flexible plans for every need", color: "teal" },
              { icon: Download, title: "One-Click Reports", desc: "Export to Excel, PDF instantly", color: "indigo" }
            ].map((feature, i) => (
              <Card key={i} className="group hover:shadow-lg  transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6 text-center">
                  <div className={`h-14 w-14 mx-auto rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

   

      {/* Trust Bar */}
      <section className="py-8 px-4 bg-muted/50 border-y">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Schools Trust Us</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">₹450Cr+</div>
              <div className="text-sm text-muted-foreground">Collected Annually</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">98.5%</div>
              <div className="text-sm text-muted-foreground">Avg Collection Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}