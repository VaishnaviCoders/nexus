import {
  LayoutGrid,
  Users,
  Settings,
  LucideIcon,
  Calendar,
  Bell,
  DollarSign,
  UserPlus,
  MessageSquare,
  Backpack,
  GraduationCap,
  ScrollText,
  FileCheck,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export const roleMenus: Record<string, Group[]> = {
  ADMIN: [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Management',
      menus: [
        {
          href: '/leads',
          label: 'Lead Management',
          icon: UserPlus,
          submenus: [
            { href: '/dashboard/leads', label: 'All Leads' },
            { href: '/leads/new', label: 'New Lead' },
            { href: '/leads/convert', label: 'Convert Lead' },
          ],
        },
        {
          href: '/teachers',
          label: 'Teacher Management',
          icon: GraduationCap,
          submenus: [
            { href: '/dashboard/teachers', label: 'All Teachers' },
            { href: '/teachers/attendance', label: 'Attendance' },
            { href: '/teachers/salary', label: 'Salary' },
            { href: '/teachers/leaves', label: 'Leave Management' },
          ],
        },
        {
          href: '/students',
          label: 'Student Management',
          icon: Users,
          submenus: [
            { href: '/dashboard/students', label: 'All Students' },
            { href: '/students/import', label: 'Bulk Import' },
            { href: '/students/documents', label: 'Documents' },
          ],
        },
      ],
    },
    {
      groupLabel: 'Monitoring',
      menus: [
        {
          href: '/attendance',
          label: 'Attendance Monitor',
          icon: Calendar,
          submenus: [
            { href: '/attendance/checkin', label: 'Check-in Times' },
            { href: '/attendance/checkout', label: 'Check-out Times' },
          ],
        },
        {
          href: '/notice-board',
          label: 'Notice Board',
          icon: Bell,
          submenus: [
            { href: '/notices/pending', label: 'Pending Approval' },
            { href: '/notices/approved', label: 'Approved Notices' },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [{ href: '/settings', label: 'Settings', icon: Settings }],
    },
  ],
  TEACHER: [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Management',
      menus: [
        {
          href: '/leads',
          label: 'Lead Management',
          icon: UserPlus,
          submenus: [
            { href: '/leads/view', label: 'View Leads' },
            { href: '/leads/new', label: 'New Lead' },
            { href: '/leads/convert', label: 'Convert Lead' },
          ],
        },
        {
          href: '/students',
          label: 'Student Management',
          icon: Users,
          submenus: [
            { href: '/students/view', label: 'View Students' },
            { href: '/students/import', label: 'Bulk Import' },
            { href: '/students/fees', label: 'Send Reminders' },
          ],
        },
      ],
    },
    {
      groupLabel: 'Personal',
      menus: [
        {
          href: '/leaves',
          label: 'Leave Management',
          icon: Calendar,
          submenus: [
            { href: '/leaves/request', label: 'Request Leave' },
            { href: '/leaves/status', label: 'Leave Status' },
          ],
        },
        {
          href: '/notices',
          label: 'Notice Board',
          icon: Bell,
          submenus: [
            { href: '/notices/create', label: 'Create Notice' },
            { href: '/notices/view', label: 'View Notices' },
          ],
        },
      ],
    },
  ],
  STUDENT: [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Student Portal',
          icon: Backpack,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Academic',
      menus: [
        {
          href: '/assignments',
          label: 'Assignments',
          icon: ScrollText,
          submenus: [{ href: '/assignments/view', label: 'View Assignments' }],
        },
        {
          href: '/attendance',
          label: 'Attendance',
          icon: Calendar,
          submenus: [{ href: '/attendance/view', label: 'View Records' }],
        },
        {
          href: '/fees',
          label: 'Fees Management',
          icon: DollarSign,
          submenus: [
            { href: '/fees/history', label: 'Payment History' },
            { href: '/fees/upcoming', label: 'Upcoming Fees' },
            { href: '/fees/download', label: 'Download Receipt' },
          ],
        },
      ],
    },
    {
      groupLabel: 'Communication',
      menus: [
        {
          href: '/complaints',
          label: 'Teacher Feedback',
          icon: MessageSquare,
          submenus: [{ href: '/complaints/submit', label: 'Submit Feedback' }],
        },
        {
          href: '/notices',
          label: 'Notice Board',
          icon: Bell,
          submenus: [{ href: '/notices/view', label: 'View Notices' }],
        },
      ],
    },
    {
      groupLabel: 'Documents',
      menus: [
        {
          href: '/documents',
          label: 'My Documents',
          icon: FileCheck,
          submenus: [
            { href: '/documents/upload', label: 'Upload Documents' },
            { href: '/documents/view', label: 'View Documents' },
          ],
        },
      ],
    },
  ],
  PARENT: [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Monitoring',

      menus: [
        {
          href: '/my-children',
          label: 'My Children',
          icon: Users,
        },
        {
          href: '/attendance',
          label: 'Attendance Monitor',
          icon: Calendar,
          submenus: [
            { href: '/attendance/checkin', label: 'Check-in Times' },
            { href: '/attendance/checkout', label: 'Check-out Times' },
          ],
        },
        {
          href: '/notice-board',
          label: 'Notice Board',
          icon: Bell,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [{ href: '/settings', label: 'Settings', icon: Settings }],
    },
  ],
};
