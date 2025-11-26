'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, X, Menu, UserCircleIcon, LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Bell,
  Settings2,
  CheckSquare,
  ReceiptIndianRupee,
  BookOpen,
  ClipboardList,
  MessageSquare,
  FileText,
  ShieldCheck,
  FileBarChart,
  School,
  GraduationCap,
  UsersRound,
  Library,
  Building2,
  ClipboardCheck,
  PencilRuler,
  Lightbulb,
  Users2,
  BookOpenText,
  HelpCircle,
  Trophy,
  BarChart3,
  Newspaper,
  Megaphone,
} from 'lucide-react';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NavItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  highlighted?: boolean;
};

const megaMenuData = {
  Features: {
    'Core Platform': [
      {
        icon: LayoutDashboard,
        title: 'Dashboard',
        description: 'Unified control center for school admins.',
      },
      {
        icon: Users,
        title: 'Student Management',
        description: 'Add, manage & organize student records easily.',
      },
      {
        icon: Bell,
        title: 'Notifications',
        description: 'WhatsApp, SMS & email updates in one place.',
      },
      {
        icon: Settings2,
        title: 'Integrations',
        description: 'Connect to payment gateways & messaging services.',
      },
    ],
    'Daily Operations': [
      {
        icon: CheckSquare,
        title: 'Attendance',
        description: '2-tap attendance for teachers and admins.',
      },
      {
        icon: ReceiptIndianRupee,
        title: 'Fee Management',
        description: 'Online fees, reminders & auto receipts.',
        badge: 'Hot',
        highlight: true,
      },
      {
        icon: BookOpen,
        title: 'Exams & Results',
        description: 'Build exams, enter marks & auto-generate results.',
      },
      {
        icon: ClipboardList,
        title: 'Assignments',
        description: 'Share homework & track submissions.',
      },
    ],
    'Communication & Compliance': [
      {
        icon: MessageSquare,
        title: 'Parent Portal',
        description: 'Real-time updates for parents.',
      },
      {
        icon: FileText,
        title: 'Documents',
        description: 'Upload TCs, Aadhaar, certificates & verify.',
      },
      {
        icon: ShieldCheck,
        title: 'Complaints (Anonymous)',
        description: 'Safe channel for students & parents.',
      },
      {
        icon: FileBarChart,
        title: 'Reports & Analytics',
        description: 'Automatic insights on fees & attendance.',
        badge: 'New',
      },
    ],
  },
  Industries: {
    Schools: [
      {
        icon: School,
        title: 'K-12 Schools',
        description: 'For CBSE, ICSE, State & private schools.',
      },
      {
        icon: GraduationCap,
        title: 'High Schools',
        description: 'Attendance, results & fee automation.',
      },
      {
        icon: UsersRound,
        title: 'Pre-schools',
        description: 'Simple operations & parent communication.',
      },
    ],
    Colleges: [
      {
        icon: Library,
        title: 'Degree Colleges',
        description: 'Timetables, attendance & fee workflows.',
      },
      {
        icon: Building2,
        title: 'Junior Colleges',
        description: 'Class tracking & exam management.',
      },
      {
        icon: ClipboardCheck,
        title: 'Professional Institutes',
        description: 'Nursing, pharmacy, paramedical, etc.',
      },
    ],
    'Coaching & Others': [
      {
        icon: PencilRuler,
        title: 'Coaching Classes',
        description: 'Perfect for NEET, JEE & competitive centers.',
      },
      {
        icon: Lightbulb,
        title: 'Skill Academies',
        description: 'Coding, language, and training institutes.',
      },
      {
        icon: Users2,
        title: 'Small Tutors / Academies',
        description: 'Simple CRM for micro institutes.',
      },
    ],
  },
  Resources: {
    Learn: [
      {
        icon: BookOpenText,
        title: 'Guides',
        description: 'Practical guides for school admins.',
      },
      {
        icon: HelpCircle,
        title: 'Help Center',
        description: 'FAQs, tutorials & setup help.',
      },
    ],
    Success: [
      {
        icon: Trophy,
        title: 'Case Studies',
        description: 'Stories from schools saving time & money.',
      },
      {
        icon: BarChart3,
        title: 'Reports',
        description: 'Industry insights & data breakdowns.',
      },
    ],
    Updates: [
      {
        icon: Newspaper,
        title: 'Blogs',
        description: 'Tips, news & product updates.',
      },
      {
        icon: Megaphone,
        title: 'Announcements',
        description: "What's new in the platform.",
      },
    ],
  },
};

const MenuSection = ({ title, items }: { title: string; items: NavItem[] }) => (
  <div className="space-y-4">
    {/* Section Title */}
    <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
      {title}
    </h3>

    {/* Menu Items */}
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            href="#"
            className={cn(
              'group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border border-transparent',
              'hover:bg-accent/50 hover:shadow-sm hover:border-accent/50',
              item.highlighted ? 'bg-primary/5 border-primary/20' : ''
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'mt-0.5 p-2 rounded-lg transition-all duration-200',
                'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
                item.highlighted ? 'bg-primary text-primary-foreground' : ''
              )}
            >
              <Icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'text-sm font-medium transition-colors',
                    item.highlighted
                      ? 'text-primary font-semibold'
                      : 'text-foreground group-hover:text-primary'
                  )}
                >
                  {item.title}
                </div>

                {/* Badge */}
                {item.badge && (
                  <Badge
                    variant={
                      item.badge === 'Hot'
                        ? 'ALUMNI_REFERRAL'
                        : item.badge === 'New'
                          ? 'ATTENDED'
                          : 'default'
                    }
                    className="animate-fade-in uppercase"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 group-hover:text-foreground/80 transition-colors">
                {item.description}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

export function MegaNavbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['Features', 'Industries', 'Resources'];

  // Lock background scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <span className="font-semibold font-mono">Shiksha Cloud</span>
          </Link>

          <div className="flex items-center gap-1 relative">
            {navItems.map((item) => (
              <div
                key={item}
                onMouseEnter={() => setActiveMenu(item)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                  {item}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      activeMenu === item ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeMenu === item && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-screen max-w-4xl">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-6">
                      <div className="grid grid-cols-3 gap-6">
                        {Object.entries(
                          megaMenuData[item as keyof typeof megaMenuData]
                        ).map(([section, items]) => (
                          <MenuSection
                            key={section}
                            title={section}
                            items={items}
                          />
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between bg-blue-600 rounded-lg p-3 text-white">
                          <div>
                            <div className="font-medium text-sm">
                              Ready to get started?
                            </div>
                            <div className="text-xs text-blue-100 mt-0.5">
                              Join 1000+ schools using Shiksha Cloud
                            </div>
                          </div>
                          <Link
                            href="/select-organization"
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                          >
                            Start Free Trial
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/blogs"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              Blogs
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Pricing
              </Button>
            </Link>

            <SignedOut>
              <SignInButton signUpForceRedirectUrl="/dashboard">
                <Button
                  variant="outline"
                  className="bg-white text-blue-500 hover:bg-blue-50 hover:text-blue-600 border-blue-300 shadow-none"
                >
                  <UserCircleIcon />
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm" className="text-sm font-medium">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="flex lg:hidden items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <span className="font-semibold font-mono">Shiksha Cloud</span>
          </Link>

          <div className="flex items-center gap-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setActiveMenu(null);
              }}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="
            lg:hidden border-t bg-background 
            animate-in slide-in-from-top duration-200
            max-h-[80vh] overflow-y-auto overscroll-contain scroll-smooth
          "
        >
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item} className="space-y-1">
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === item ? null : item)
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md transition-colors"
                >
                  {item}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeMenu === item ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeMenu === item && (
                  <div className="pl-3 space-y-4 py-2 animate-in slide-in-from-top-1 duration-150">
                    {Object.entries(
                      megaMenuData[item as keyof typeof megaMenuData]
                    ).map(([section, items]) => (
                      <div key={section} className="space-y-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                          {section}
                        </h3>
                        <div className="space-y-0.5">
                          {items.map((subitem) => {
                            const Icon = subitem.icon;
                            return (
                              <Link
                                key={subitem.title}
                                href="#"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-accent/50 transition-colors"
                              >
                                <div className="p-1.5 rounded-md bg-primary/10 text-primary mt-0.5">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground">
                                    {subitem.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {subitem.description}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md transition-colors"
            >
              Blogs
            </Link>

            <div className="pt-4 space-y-2 border-t mt-4">
              <Link href="/pricing" className="block">
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-start"
                >
                  Pricing
                </Button>
              </Link>

              <SignedOut>
                <SignInButton signUpForceRedirectUrl="/dashboard">
                  <Button
                    variant="outline"
                    className="bg-white text-blue-500 hover:bg-blue-50 hover:text-blue-600 border-blue-300 shadow-none"
                  >
                    <UserCircleIcon />
                    Get Started
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard" className="block">
                  <Button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
