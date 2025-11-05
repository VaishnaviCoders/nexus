'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  MapPin,
  Rocket,
  Code,
  Database,
  Brain,
  Users,
  Target,
  ExternalLink,
  Github,
  Globe,
  Building,
  GraduationCap,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Terminal,
  Server,
  Activity,
  TrendingUp,
  Shield,
  Cloud,
} from 'lucide-react';
import Link from 'next/link';

export default function AdvancedProfilePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl  font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Sameer Kad
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link href={'https://github.com/DevSammyKad'} target="_blank">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Link>
          </Button>
          {/* <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
          >
            <Link href={'https://www.shiksha.cloud/'} target="_blank">
              <Globe className="w-4 h-4 mr-2" />
              Shiksha.cloud
            </Link>
          </Button> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm text-green-300">
                Available for unique projects
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              Sameer Kad
            </h1>

            {/* Subtitle with Animation */}
            <div className="text-xl md:text-2xl text-gray-300 mb-4">
              <span className="text-purple-400">Founder</span> &{' '}
              <span className="text-pink-400">Full-Stack Developer</span>
            </div>

            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              As a software developer, I've always been passionate about
              building things that make people's lives easier. Currently
              building{' '}
              <Link href={'https://www.shiksha.cloud/'} target="_blank">
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
                  Shiksha.cloud
                </span>{' '}
              </Link>
              to revolutionize education management in India.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                {
                  icon: Trophy,
                  label: 'State Gold Medalist',
                  value: 'Volleyball',
                },
                { icon: MapPin, label: 'Based in', value: 'India' },
                { icon: Building, label: 'Status', value: 'Pre-launch MVP' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-gray-300"
                >
                  <stat.icon className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">{stat.label}:</span>
                  <span className="text-white font-medium">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-3"
              >
                <Link href={'https://www.shiksha.cloud/'}>
                  <Rocket className="w-5 h-5 mr-2" />
                  Explore Shiksha.cloud
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
              >
                <Link href="#tech-stack" scroll={true} className="btn">
                  <Terminal className="w-5 h-5 mr-2" />
                  View Tech Stack
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Visualization */}
      <section className="relative z-10 px-6 py-24" id="tech-stack">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Tech Stack Mastery
            </h2>
            <p className="text-gray-400 text-lg">
              Built with cutting-edge technologies for maximum performance
            </p>
          </div>

          {/* Interactive Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Frontend */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Frontend</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Next.js 15', level: 95 },
                    { name: 'TypeScript', level: 90 },
                    { name: 'Tailwind CSS', level: 95 },
                    { name: 'Framer Motion', level: 85 },
                  ].map((tech, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{tech.name}</span>
                        <span className="text-blue-400">{tech.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${tech.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Backend</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Node.js', level: 92 },
                    { name: 'Prisma ORM', level: 88 },
                    { name: 'PostgreSQL', level: 85 },
                    { name: 'Supabase', level: 90 },
                  ].map((tech, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{tech.name}</span>
                        <span className="text-green-400">{tech.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${tech.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI & Tools */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">AI & Tools</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Hugging Face', level: 80 },
                    { name: 'OpenRouter', level: 75 },
                    { name: 'Clerk Auth', level: 95 },
                    { name: 'Ai Agent', level: 90 },
                  ].map((tech, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{tech.name}</span>
                        <span className="text-purple-400">{tech.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${tech.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shiksha.cloud Showcase */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300">
              <Building className="w-4 h-4 mr-2" />
              Current Focus
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Shiksha.cloud
            </h2>
            <p className="text-gray-400 text-lg">
              India's Next-Gen School CRM Platform
            </p>
          </div>

          {/* Product Dashboard Mockup */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Shiksha.cloud Dashboard
                    </h3>
                    <p className="text-gray-400 text-sm">
                      School Management System
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>

              {/* Mock Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    icon: Users,
                    label: 'Total Students',
                    value: '1,247',
                    change: '+12%',
                  },
                  {
                    icon: CreditCard,
                    label: 'Fee Collection',
                    value: '₹2.4L',
                    change: '+8%',
                  },
                  {
                    icon: Activity,
                    label: 'Attendance Rate',
                    value: '94.2%',
                    change: '+2%',
                  },
                  {
                    icon: TrendingUp,
                    label: 'Growth',
                    value: '23%',
                    change: '+5%',
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="w-5 h-5 text-purple-400" />
                      <span className="text-green-400 text-xs">
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Mock Chart Area */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-700/30 rounded-xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">
                    Revenue Analytics
                  </h4>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <div className="w-3 h-3 bg-pink-500 rounded-full" />
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg flex items-end justify-center">
                  <ChartAreaInteractive />
                  {/* <div className="text-gray-400 text-sm">
                    Interactive Chart Visualization
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Secure Authentication',
                desc: 'Clerk-powered multi-role access control',
              },
              {
                icon: Database,
                title: 'Real-time Data',
                desc: 'PostgreSQL with Prisma ORM for instant updates',
              },
              {
                icon: Brain,
                title: 'AI Insights',
                desc: 'Automated summaries and intelligent analytics',
              },
              {
                icon: CreditCard,
                title: 'Payment Integration',
                desc: 'PhonePe & Wallet Base for seamless transactions',
              },
              {
                icon: Smartphone,
                title: 'Mobile Ready',
                desc: 'Responsive design for all devices',
              },
              {
                icon: Cloud,
                title: 'Cloud Native',
                desc: 'Deployed on Vercel with Supabase backend',
              },
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Roadmap - Enhanced */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300">
              <Target className="w-4 h-4 mr-2" />
              Strategic Roadmap
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Vision & Roadmap
            </h2>
            <p className="text-gray-400 text-lg">
              Building towards India's #1 school CRM platform
            </p>
          </div>

          {/* Progress Overview Dashboard */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    Mission Control Dashboard
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm">On Track</span>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      Phase 1
                    </div>
                    <div className="text-green-300 ">Short Term Goals</div>
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-3/4" />
                    </div>
                    <div className="text-xs text-green-400 mt-1">
                      75% Complete
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="w-6 h-6 text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">
                        NEXT
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      Phase 2
                    </div>
                    <div className="text-blue-300 text-sm">Mid Term Goals</div>
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-1/4" />
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      25% Complete
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <Rocket className="w-6 h-6 text-purple-400" />
                      <span className="text-purple-400 text-sm font-medium">
                        FUTURE
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      Phase 3
                    </div>
                    <div className="text-purple-300 text-sm">
                      Long Term Vision
                    </div>
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/12" />
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                      8% Complete
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-6 h-6 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">
                        IMPACT
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      10K+
                    </div>
                    <div className="text-yellow-300 text-sm">
                      Target Students
                    </div>
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full w-1/8" />
                    </div>
                    <div className="text-xs text-yellow-400 mt-1">
                      1.2K Reached
                    </div>
                  </div>
                </div>

                {/* Timeline Visualization */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">
                      Development Timeline
                    </h4>
                    <div className="text-sm text-gray-400">2024 - 2026</div>
                  </div>
                  <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30" />
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                    <div className="absolute left-1/3 top-0 h-full w-1/6 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full opacity-60" />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Q1 2024</span>
                    <span>Q3 2024</span>
                    <span>Q1 2025</span>
                    <span>Q4 2025</span>
                    <span>2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Phase Cards */}
          <div className="space-y-8">
            {/* Phase 1 - Short Term */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-green-500/20 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          Phase 1: Foundation
                        </h3>
                        <p className="text-green-300 text-sm md:text-xl">
                          Short Term Goals (Q1-Q2 2024)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">
                        75%
                      </div>
                      <div className="text-sm text-green-300">Complete</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'MVP Launch',
                        desc: 'Launch stable MVP with core features',
                        status: 'completed',
                        icon: Rocket,
                        progress: 100,
                      },
                      {
                        title: 'Pilot Schools',
                        desc: 'Onboard 10 pilot schools for testing',
                        status: 'in-progress',
                        icon: Building,
                        progress: 60,
                      },
                      {
                        title: 'Digital Marksheets',
                        desc: 'Complete digital mark sheet module',
                        status: 'pending',
                        icon: GraduationCap,
                        progress: 30,
                      },
                    ].map((goal, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-xl p-4 border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <goal.icon
                            className={`w-5 h-5 ${
                              goal.status === 'completed'
                                ? 'text-green-400'
                                : goal.status === 'in-progress'
                                  ? 'text-yellow-400'
                                  : 'text-gray-400'
                            }`}
                          />
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.status === 'completed'
                                ? 'bg-green-500/20 text-green-300'
                                : goal.status === 'in-progress'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-gray-500/20 text-gray-300'
                            }`}
                          >
                            {goal.status === 'completed'
                              ? 'DONE'
                              : goal.status === 'in-progress'
                                ? 'ACTIVE'
                                : 'PENDING'}
                          </div>
                        </div>
                        <h4 className="text-white font-semibold mb-2">
                          {goal.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {goal.desc}
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-green-400 mt-1">
                          {goal.progress}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 - Mid Term */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-blue-500/20 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          Phase 2: Scale
                        </h3>
                        <p className="text-blue-300">
                          Mid Term Goals (Q3-Q4 2024)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-400">
                        25%
                      </div>
                      <div className="text-sm text-blue-300">Complete</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'AI Auto-Reports',
                        desc: 'Implement recurring billing & AI reports',
                        status: 'in-progress',
                        icon: Brain,
                        progress: 40,
                      },
                      {
                        title: 'Analytics Dashboard',
                        desc: 'Build organization-level analytics',
                        status: 'pending',
                        icon: TrendingUp,
                        progress: 15,
                      },
                      {
                        title: 'Marketing Site',
                        desc: 'Launch marketing website with demos',
                        status: 'pending',
                        icon: Globe,
                        progress: 20,
                      },
                    ].map((goal, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-xl p-4 border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <goal.icon
                            className={`w-5 h-5 ${
                              goal.status === 'completed'
                                ? 'text-blue-400'
                                : goal.status === 'in-progress'
                                  ? 'text-yellow-400'
                                  : 'text-gray-400'
                            }`}
                          />
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.status === 'completed'
                                ? 'bg-blue-500/20 text-blue-300'
                                : goal.status === 'in-progress'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-gray-500/20 text-gray-300'
                            }`}
                          >
                            {goal.status === 'completed'
                              ? 'DONE'
                              : goal.status === 'in-progress'
                                ? 'ACTIVE'
                                : 'PENDING'}
                          </div>
                        </div>
                        <h4 className="text-white font-semibold mb-2">
                          {goal.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {goal.desc}
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-blue-400 mt-1">
                          {goal.progress}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3 - Long Term */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          Phase 3: Dominate
                        </h3>
                        <p className="text-purple-300 ">
                          Long Term Vision (2025-2026)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-400">
                        8%
                      </div>
                      <div className="text-sm text-purple-300">Complete</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: '#1 School CRM',
                        desc: "Become India's leading school CRM",
                        status: 'pending',
                        icon: Trophy,
                        progress: 8,
                      },
                      {
                        title: 'Market Expansion',
                        desc: 'Expand to coaching & higher education',
                        status: 'pending',
                        icon: Building,
                        progress: 5,
                      },
                      {
                        title: 'Mobile App',
                        desc: 'Launch mobile app for all stakeholders',
                        status: 'pending',
                        icon: Smartphone,
                        progress: 12,
                      },
                    ].map((goal, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-xl p-4 border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <goal.icon className="w-5 h-5 text-gray-400" />
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300">
                            FUTURE
                          </div>
                        </div>
                        <h4 className="text-white font-semibold mb-2">
                          {goal.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {goal.desc}
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-purple-400 mt-1">
                          {goal.progress}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Success Metrics
              </h3>
              <p className="text-gray-400">
                Key performance indicators for measuring impact
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: 'Schools Onboarded',
                  current: '3',
                  target: '100+',
                  unit: '',
                },
                {
                  label: 'Students Managed',
                  current: '1.2K',
                  target: '10K+',
                  unit: '',
                },
                {
                  label: 'Revenue Generated',
                  current: '₹50K',
                  target: '₹10L+',
                  unit: '',
                },
                {
                  label: 'User Satisfaction',
                  current: '4.8',
                  target: '4.9+',
                  unit: '/5',
                },
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white mb-1">
                      {metric.current}
                      <span className="text-sm text-gray-400">
                        {metric.unit}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {metric.label}
                    </div>
                    <div className="text-sm text-purple-400">
                      Target: {metric.target}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <h2 className="text-2xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-balance">
                Let's Build Something Amazing
              </h2>
              <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-2xl mx-auto">
                Interested in Shiksha.cloud or want to collaborate on
                cutting-edge education technology? Let's connect and shape the
                future together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-3"
                >
                  <Link
                    href={'https://cal.com/sammykad'}
                    target="_blank"
                    className="flex items-center space-x-1"
                  >
                    {' '}
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Schedule a Demo
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
                  asChild
                >
                  <Link href={'https://github.com/DevSammyKad'} target="_blank">
                    {' '}
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-2">
            Built with ❤️ by Sameer Kad using Next.js 15, ShadCN UI, and
            cutting-edge web technologies
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 Sameer Kad. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const chartData = [
  { date: '2024-04-01', desktop: 222, mobile: 150 },
  { date: '2024-04-02', desktop: 97, mobile: 180 },
  { date: '2024-04-03', desktop: 167, mobile: 120 },
  { date: '2024-04-04', desktop: 242, mobile: 260 },
  { date: '2024-04-05', desktop: 373, mobile: 290 },
  { date: '2024-04-06', desktop: 301, mobile: 340 },
  { date: '2024-04-07', desktop: 245, mobile: 180 },
  { date: '2024-04-08', desktop: 409, mobile: 320 },
  { date: '2024-04-09', desktop: 59, mobile: 110 },
  { date: '2024-04-10', desktop: 261, mobile: 190 },
  { date: '2024-04-11', desktop: 327, mobile: 350 },
  { date: '2024-04-12', desktop: 292, mobile: 210 },
  { date: '2024-04-13', desktop: 342, mobile: 380 },
  { date: '2024-04-14', desktop: 137, mobile: 220 },
  { date: '2024-04-15', desktop: 120, mobile: 170 },
  { date: '2024-04-16', desktop: 138, mobile: 190 },
  { date: '2024-04-17', desktop: 446, mobile: 360 },
  { date: '2024-04-18', desktop: 364, mobile: 410 },
  { date: '2024-04-19', desktop: 243, mobile: 180 },
  { date: '2024-04-20', desktop: 89, mobile: 150 },
  { date: '2024-04-21', desktop: 137, mobile: 200 },
  { date: '2024-04-22', desktop: 224, mobile: 170 },
  { date: '2024-04-23', desktop: 138, mobile: 230 },
  { date: '2024-04-24', desktop: 387, mobile: 290 },
  { date: '2024-04-25', desktop: 215, mobile: 250 },
  { date: '2024-04-26', desktop: 75, mobile: 130 },
  { date: '2024-04-27', desktop: 383, mobile: 420 },
  { date: '2024-04-28', desktop: 122, mobile: 180 },
  { date: '2024-04-29', desktop: 315, mobile: 240 },
  { date: '2024-04-30', desktop: 454, mobile: 380 },
  { date: '2024-05-01', desktop: 165, mobile: 220 },
  { date: '2024-05-02', desktop: 293, mobile: 310 },
  { date: '2024-05-03', desktop: 247, mobile: 190 },
  { date: '2024-05-04', desktop: 385, mobile: 420 },
  { date: '2024-05-05', desktop: 481, mobile: 390 },
  { date: '2024-05-06', desktop: 498, mobile: 520 },
  { date: '2024-05-07', desktop: 388, mobile: 300 },
  { date: '2024-05-08', desktop: 149, mobile: 210 },
  { date: '2024-05-09', desktop: 227, mobile: 180 },
  { date: '2024-05-10', desktop: 293, mobile: 330 },
  { date: '2024-05-11', desktop: 335, mobile: 270 },
  { date: '2024-05-12', desktop: 197, mobile: 240 },
  { date: '2024-05-13', desktop: 197, mobile: 160 },
  { date: '2024-05-14', desktop: 448, mobile: 490 },
  { date: '2024-05-15', desktop: 473, mobile: 380 },
  { date: '2024-05-16', desktop: 338, mobile: 400 },
  { date: '2024-05-17', desktop: 499, mobile: 420 },
  { date: '2024-05-18', desktop: 315, mobile: 350 },
  { date: '2024-05-19', desktop: 235, mobile: 180 },
  { date: '2024-05-20', desktop: 177, mobile: 230 },
  { date: '2024-05-21', desktop: 82, mobile: 140 },
  { date: '2024-05-22', desktop: 81, mobile: 120 },
  { date: '2024-05-23', desktop: 252, mobile: 290 },
  { date: '2024-05-24', desktop: 294, mobile: 220 },
  { date: '2024-05-25', desktop: 201, mobile: 250 },
  { date: '2024-05-26', desktop: 213, mobile: 170 },
  { date: '2024-05-27', desktop: 420, mobile: 460 },
  { date: '2024-05-28', desktop: 233, mobile: 190 },
  { date: '2024-05-29', desktop: 78, mobile: 130 },
  { date: '2024-05-30', desktop: 340, mobile: 280 },
  { date: '2024-05-31', desktop: 178, mobile: 230 },
  { date: '2024-06-01', desktop: 178, mobile: 200 },
  { date: '2024-06-02', desktop: 470, mobile: 410 },
  { date: '2024-06-03', desktop: 103, mobile: 160 },
  { date: '2024-06-04', desktop: 439, mobile: 380 },
  { date: '2024-06-05', desktop: 88, mobile: 140 },
  { date: '2024-06-06', desktop: 294, mobile: 250 },
  { date: '2024-06-07', desktop: 323, mobile: 370 },
  { date: '2024-06-08', desktop: 385, mobile: 320 },
  { date: '2024-06-09', desktop: 438, mobile: 480 },
  { date: '2024-06-10', desktop: 155, mobile: 200 },
  { date: '2024-06-11', desktop: 92, mobile: 150 },
  { date: '2024-06-12', desktop: 492, mobile: 420 },
  { date: '2024-06-13', desktop: 81, mobile: 130 },
  { date: '2024-06-14', desktop: 426, mobile: 380 },
  { date: '2024-06-15', desktop: 307, mobile: 350 },
  { date: '2024-06-16', desktop: 371, mobile: 310 },
  { date: '2024-06-17', desktop: 475, mobile: 520 },
  { date: '2024-06-18', desktop: 107, mobile: 170 },
  { date: '2024-06-19', desktop: 341, mobile: 290 },
  { date: '2024-06-20', desktop: 408, mobile: 450 },
  { date: '2024-06-21', desktop: 169, mobile: 210 },
  { date: '2024-06-22', desktop: 317, mobile: 270 },
  { date: '2024-06-23', desktop: 480, mobile: 530 },
  { date: '2024-06-24', desktop: 132, mobile: 180 },
  { date: '2024-06-25', desktop: 141, mobile: 190 },
  { date: '2024-06-26', desktop: 434, mobile: 380 },
  { date: '2024-06-27', desktop: 448, mobile: 490 },
  { date: '2024-06-28', desktop: 149, mobile: 200 },
  { date: '2024-06-29', desktop: 103, mobile: 160 },
  { date: '2024-06-30', desktop: 446, mobile: 400 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-3)',
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState('90d');

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-06-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row bg-gradient-to-r from-purple-500/10 to-pink-500/10 ">
        <div className="grid flex-1 gap-1">
          <CardTitle className="">Revenue Overview</CardTitle>
          <CardDescription className="">
            Total revenue from Desktop and Mobile
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex bg-black border-white/10 text-white"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 ">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 ">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              stroke="#ccc"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
