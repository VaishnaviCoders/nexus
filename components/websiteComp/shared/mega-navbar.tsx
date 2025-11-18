'use client';
import React, { useState } from 'react';
import { ChevronDown, X, Menu } from 'lucide-react';
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
import { SignedIn, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

type NavItem = {
  icon: React.ElementType;
  title: string;
  description: string;
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
        title: 'Blog',
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
  <div className="space-y-3">
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            href="#"
            className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200"
          >
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center gap-2 group">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            {/* <span className="font-semibold text-lg tracking-tight">
              Shiksha Cloud
            </span> */}
          </Link>

          {/* Desktop Menu */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item}
                className="relative"
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

                {/* Mega Menu Dropdown */}
                {activeMenu === item && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-screen max-w-4xl">
                    <div className="bg-background border rounded-xl shadow-lg p-6 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              Blog
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Pricing
              </Button>
            </Link>
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
            <span className="font-semibold  font-mono">Shiksha Cloud</span>
          </Link>

          <div className="flex items-center gap-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
        <div className="lg:hidden border-t bg-background animate-in slide-in-from-top duration-200">
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

                {/* Mobile Submenu */}
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
              href="/blog"
              className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md transition-colors"
            >
              Blog
            </Link>

            <div className="pt-4 space-y-2 border-t mt-4">
              <Link href="/pricing" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Pricing
                </Button>
              </Link>
              <SignedIn>
                <Link href="/dashboard" className="block">
                  <Button className="w-full">Dashboard</Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
