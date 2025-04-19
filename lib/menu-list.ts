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
  IndianRupee,
  School,
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
          href: '/dashboard/leads',
          label: 'Lead Management',
          icon: UserPlus,
        },
        {
          href: '/dashboard/grades',
          label: 'Class Management',
          icon: School,
        },
        {
          href: '/dashboard/teachers',
          label: 'Teacher Management',
          icon: GraduationCap,
        },
        {
          href: '/dashboard/students',
          label: 'Student Management',
          icon: Users,
        },
        {
          href: '/dashboard/fees/admin',
          label: 'Fees Management',
          icon: IndianRupee,
        },
      ],
    },
    {
      groupLabel: 'Monitoring',
      menus: [
        {
          href: '/dashboard/student-attendance',
          label: 'Attendance Monitor',
          icon: Calendar,
          submenus: [
            { href: '/dashboard/attendance', label: 'Student Attendance' },
            {
              href: '/dashboard/teacher-attendance',
              label: 'Teacher Attendance',
            },
          ],
        },
        {
          href: 'dashboard/notices',
          label: 'Notice Board',
          icon: Bell,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: 'dashboard/settings', label: 'Settings', icon: Settings },
      ],
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
          href: 'dashboard/grades',
          label: 'Class Management',
          icon: Settings,
        },
        {
          href: 'dashboard/fees/teacher',
          label: 'Fees Management',
          icon: Settings,
        },
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
          label: 'Students Management',
          icon: Users,
          submenus: [
            { href: '/dashboard/students', label: 'View Students' },
            { href: '/dashboard/students/import', label: 'Bulk Import' },
            { href: '/dashboard/students/fees', label: 'Send Reminders' },
            {
              href: '/dashboard/attendance/mark',
              label: 'Take Attendance',
            },
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
            { href: '/dashboard/notices/create', label: 'Create Notice' },
            { href: '/dashboard/notices', label: 'View Notices' },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: 'dashboard/settings', label: 'Settings', icon: Settings },
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
        },
        {
          href: '/attendance',
          label: 'Attendance',
          icon: Calendar,
        },
        {
          href: '/dashboard/fees/teacher',
          label: 'Fees Management',
          icon: DollarSign,
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
        },
        {
          href: 'dashboard/notices',
          label: 'Notice Board',
          icon: Bell,
        },
        {
          href: 'dashboard/complaints',
          label: 'Anonymous complaints',
          icon: Bell,
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
          label: 'Parent Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Monitoring',

      menus: [
        {
          href: '/dashboard/my-children',
          label: 'My Children',
          icon: Users,
        },
        {
          href: '/dashboard/fees/parent',
          label: 'Fees ',
          icon: Settings,
        },
        {
          href: '/attendance',
          label: 'Attendance Monitor',
          icon: Calendar,
        },
        {
          href: 'dashboard/notices',
          label: 'Notice Board',
          icon: Bell,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: 'dashboard/settings', label: 'Settings', icon: Settings },
      ],
    },
  ],
};
