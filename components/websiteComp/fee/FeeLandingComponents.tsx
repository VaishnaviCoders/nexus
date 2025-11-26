'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ArrowRight,
  CreditCard,
  FileText,
  PieChart,
  Bell,
  Shield,
  Smartphone,
  Quote,
  Clock,
  AlertCircle,
  Banknote,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Download,
  RefreshCw,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  IndianRupee,
  MessageSquare,
  Mail,
  Globe,
  Lock,
  Eye,
  Wallet,
  Receipt,
} from 'lucide-react';

export default function FeeManagementPage() {


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Zap className="h-3 w-3 mr-1" />
                Automated Payment Reconciliation
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  Smart Fee
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Management</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Transform fee collection from chaos to clarity. Automate reminders, eliminate errors, and get instant financial insights.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/25">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-2">
                  <Eye className="h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-muted-foreground">No setup fees</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-muted-foreground">Live in 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-muted-foreground">Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px]">
              {/* Main Dashboard Card */}
              <Card className="relative z-10 shadow-2xl border-2">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle>Fee Dashboard</CardTitle>
                    <Badge variant="outline" className="gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Collections</p>
                      <p className="text-2xl font-bold">₹45.2L</p>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>+12% vs last month</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Collection Rate</p>
                      <p className="text-2xl font-bold">98.5%</p>
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Above target</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Progress</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-600 w-[85%] rounded-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Paid</p>
                      <p className="text-lg font-bold text-green-600">₹38.4L</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-lg font-bold text-orange-600">₹6.8L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Notification Card */}
              <Card className="absolute -bottom-4 -right-4 w-72 shadow-xl border-2 border-primary/20 z-20 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <Bell className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-muted-foreground">Amit Kumar - Grade 10A</p>
                      <p className="text-xs font-medium text-green-600">₹12,500</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Stats Card */}
              <Card className="absolute -top-4 -left-4 w-48 shadow-xl border-2 border-blue-500/20 z-20 animate-in slide-in-from-top-8 duration-1000 delay-500">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">1,250</p>
                  <p className="text-xs text-muted-foreground">Active Students</p>
                </CardContent>
              </Card>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-20 -right-20 h-72 w-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-20 -left-20 h-72 w-72 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="text-center text-sm font-semibold text-muted-foreground mb-8 tracking-wider">
            TRUSTED BY 500+ LEADING EDUCATIONAL INSTITUTIONS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {['DPS Delhi', 'Ryan International', 'Vibgyor High', 'Kendriya Vidyalaya', 'Delhi Public School'].map((school) => (
              <div key={school} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-foreground">{school}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The Challenge</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              The Hidden Cost of Manual Fee Management
            </h2>
            <p className="text-xl text-muted-foreground">
              Traditional fee collection is costing schools thousands in lost revenue and administrative overhead.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Payment Delays",
                desc: "Average 45-day collection cycle drains cash flow and creates operational stress.",
                color: "red",
                stat: "45 days"
              },
              {
                icon: AlertCircle,
                title: "Reconciliation Chaos",
                desc: "Manual matching of payments takes 100+ hours monthly and is error-prone.",
                color: "orange",
                stat: "100+ hrs"
              },
              {
                icon: XCircle,
                title: "Revenue Leakage",
                desc: "Missed follow-ups and manual errors result in 15-20% revenue loss annually.",
                color: "yellow",
                stat: "15-20%"
              }
            ].map((item, i) => (
              <Card key={i} className={`relative overflow-hidden border-2 bg-gradient-to-br from-${item.color}-50/50 to-background dark:from-${item.color}-950/20 dark:to-background`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/10 rounded-full blur-2xl`} />
                <CardHeader>
                  <div className={`h-14 w-14 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-4`}>
                    <item.icon className={`h-7 w-7 text-${item.color}-600`} />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <div className={`text-3xl font-bold text-${item.color}-600`}>{item.stat}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/50 to-background border-y">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">The Solution</Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Automated, Intelligent,
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Error-Free</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your fee collection into a strategic advantage with end-to-end automation.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "Instant Invoice Generation",
                    desc: "Create and distribute thousands of invoices in seconds with smart templates.",
                    color: "blue"
                  },
                  {
                    icon: Bell,
                    title: "Multi-Channel Reminders",
                    desc: "Automated WhatsApp, SMS, and email reminders that increase payment rates by 30%.",
                    color: "green"
                  },
                  {
                    icon: Wallet,
                    title: "Universal Payment Support",
                    desc: "Accept UPI, cards, net banking, and cash with instant reconciliation.",
                    color: "purple"
                  },
                  {
                    icon: BarChart3,
                    title: "Live Financial Insights",
                    desc: "Real-time dashboards showing collections, pending amounts, and trends.",
                    color: "orange"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`mt-1 h-12 w-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
              <Card className="relative shadow-2xl border-2">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle>Payment Analytics</CardTitle>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">October Collections</p>
                      <p className="text-3xl font-bold">₹45,20,000</p>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600 h-8">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      On Track
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Collection Progress</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 w-[85%] rounded-full shadow-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 p-4 rounded-xl border border-red-200/50 dark:border-red-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-red-600" />
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <p className="text-xl font-bold text-red-600">₹5,40,000</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 p-4 rounded-xl border border-green-200/50 dark:border-green-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-xs text-muted-foreground">Collected</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">₹39,80,000</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-3">
                      {[
                        { method: "UPI", amount: "18.2L", percent: 45 },
                        { method: "Cards", amount: "12.5L", percent: 31 },
                        { method: "Net Banking", amount: "9.1L", percent: 24 }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{item.method}</span>
                            <span className="font-medium">₹{item.amount}</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Complete Solution</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools designed to handle every aspect of fee management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: IndianRupee,
                title: "Online Fee Collection",
                desc: "Integrated gateway supporting UPI, cards, wallets, and net banking with instant receipts.",
                color: "emerald"
              },
              {
                icon: MessageSquare,
                title: "Smart Reminders",
                desc: "WhatsApp and SMS alerts with personalized messages based on due dates and payment history.",
                color: "blue"
              },
              {
                icon: PieChart,
                title: "Financial Analytics",
                desc: "Visual dashboards with collection trends, defaulter lists, and revenue projections.",
                color: "purple"
              },
              {
                icon: FileText,
                title: "Flexible Fee Structures",
                desc: "Configure tuition, transport, hostel, and activity fees with grade-wise customization.",
                color: "orange"
              },
              {
                icon: Lock,
                title: "Security & Compliance",
                desc: "Role-based access, audit trails, and PCI-DSS compliant payment processing.",
                color: "red"
              },
              {
                icon: Smartphone,
                title: "Parent Mobile App",
                desc: "Parents view dues, make payments, and download receipts instantly from their phones.",
                color: "cyan"
              },
              {
                icon: Receipt,
                title: "Auto Reconciliation",
                desc: "Automatic matching of bank transactions with student records, saving 100+ hours monthly.",
                color: "pink"
              },
              {
                icon: Calendar,
                title: "Installment Plans",
                desc: "Create flexible payment schedules with automatic tracking and reminder sequences.",
                color: "teal"
              },
              {
                icon: Download,
                title: "Export & Reports",
                desc: "Download detailed reports in Excel, PDF format for audits and board presentations.",
                color: "violet"
              }
            ].map((feature, i) => (
              <Card 
                key={i} 
                className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer"
              >
                <CardHeader>
                  <div className={`h-14 w-14 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                    <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary to-purple-600 text-primary-foreground">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Impact That Matters</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "30%", label: "Increase in On-time Payments", icon: TrendingUp },
              { value: "100+", label: "Admin Hours Saved Monthly", icon: Clock },
              { value: "98.5%", label: "Average Collection Rate", icon: CheckCircle2 },
              { value: "0", label: "Calculation Errors", icon: Shield }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-5xl md:text-6xl font-bold tracking-tighter">{stat.value}</div>
                <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl font-bold mb-4">Loved by Schools Nationwide</h2>
            <p className="text-xl text-muted-foreground">See what administrators and parents say about us.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "WhatsApp reminders have transformed our collection efficiency. Parents love the convenience, and our overdue list dropped by 60% in just two months.",
                author: "Rajesh Kumar",
                role: "Principal, St. Xavier's High School",
                rating: 5,
                color: "blue"
              },
              {
                quote: "Bank reconciliation used to take our team 3 full days. Now it's done automatically in minutes. The accuracy is perfect, and reports are crystal clear.",
                author: "Meera Singh",
                role: "Accounts Manager, DPS International",
                rating: 5,
                color: "purple"
              },
              {
                quote: "As a parent of two children, fee payment is now effortless. I get instant receipts on my phone, and I can track everything in the app. No more queues!",
                author: "Priya Sharma",
                role: "Parent",
                rating: 5,
                color: "green"
              }
            ].map((testimonial, i) => (
              <Card key={i} className={`border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-${testimonial.color}-50/50 to-background dark:from-${testimonial.color}-950/20 dark:to-background`}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className={`h-5 w-5 rounded-full bg-${testimonial.color}-500/20 flex items-center justify-center`}>
                        <Check className={`h-3 w-3 text-${testimonial.color}-600`} />
                      </div>
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="text-muted-foreground italic leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className={`h-12 w-12 rounded-full bg-${testimonial.color}-500/10 flex items-center justify-center shrink-0`}>
                      <Users className={`h-6 w-6 text-${testimonial.color}-600`} />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 border-t">
        <div className="mx-auto max-w-5xl">
          <Card className="relative overflow-hidden border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10" />
            <CardContent className="relative p-12 md:p-16 text-center space-y-8">
              <div className="space-y-4">
                <Badge className="mb-2">Start Today</Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Ready to Transform Your Fee Management?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join 500+ schools using Shiksha Cloud for secure, efficient, and automated fee collection.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/25">
                  Schedule Free Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg">
                  Contact Sales Team
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>24/7 support included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about our fee management system.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How quickly can we get started?",
                answer: "Most schools are up and running within 24 hours. We provide dedicated onboarding support, data migration assistance, and staff training to ensure a smooth transition."
              },
              {
                question: "What payment methods are supported?",
                answer: "We support all major payment methods including UPI, credit/debit cards, net banking, mobile wallets, and cash payments. All online transactions are processed securely through our PCI-DSS compliant gateway."
              },
              {
                question: "Can parents pay fees through the mobile app?",
                answer: "Yes! Parents can view fee details, make payments, download receipts, and track payment history directly through our mobile app available on iOS and Android."
              },
              {
                question: "How does automatic reconciliation work?",
                answer: "Our system automatically matches bank deposits with student accounts using smart algorithms. It identifies payments by reference numbers, amounts, and timing, eliminating manual reconciliation work."
              },
              {
                question: "Is our financial data secure?",
                answer: "Absolutely. We use bank-grade encryption, secure cloud infrastructure, and comply with all data protection regulations. Your data is backed up daily and protected with role-based access controls."
              },
              {
                question: "What kind of reports can we generate?",
                answer: "You can generate collection reports, defaulter lists, payment trend analysis, class-wise summaries, payment method breakdowns, and custom reports. All reports are exportable in Excel and PDF formats."
              }
            ].map((faq, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed pl-9">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" size="lg" className="gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat with our team
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA Banner */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-primary-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Start collecting fees smarter today</h3>
              <p className="text-primary-foreground/80">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" variant="secondary" className="h-12 px-8 shadow-xl">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 bg-white/10 hover:bg-white/20 border-white/20 text-white">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}