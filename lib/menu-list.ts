import {
  LayoutGrid,
  Users,
  Settings,
  LucideIcon,
  Calendar,
  Bell,
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
          href: '/dashboard/attendance/analytics',
          label: 'Attendance Monitor',
          icon: Calendar,
          // submenus: [
          //   { href: '/dashboard/attendance', label: 'Student Attendance' },
          //   {
          //     href: '/dashboard/teacher-attendance',
          //     label: 'Teacher Attendance',
          //   },
          // ],
        },
        {
          href: '/dashboard/notices',
          label: 'Notice Board',
          icon: Bell,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
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
        },
      ],
    },
    {
      groupLabel: 'Management',
      menus: [
        {
          href: '/dashboard/attendance/mark',
          label: 'Take Attendance',
          icon: Calendar,
        },
        {
          href: '/dashboard/grades',
          label: 'Class Management',
          icon: School,
        },
        {
          href: '/dashboard/fees/teacher',
          label: 'Fees Management',
          icon: IndianRupee,
        },
        {
          href: '/dashboard/leads',
          label: 'Lead Management',
          icon: UserPlus,
        },
        {
          href: '/dashboard/students',
          label: 'Students Management',
          icon: Users,
        },
      ],
    },

    {
      groupLabel: 'Personal',
      menus: [
        // {
        //   href: '/leaves',
        //   label: 'Leave Management',
        //   icon: Calendar,
        // },
        {
          href: '/dashboard/notices',
          label: 'Notice Board',
          icon: Bell,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
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
          href: '/dashboard/assignments',
          label: 'Assignments',
          icon: ScrollText,
        },
        {
          href: '/dashboard/child-attendance',
          label: 'Attendance',
          icon: Calendar,
        },
        {
          href: '/dashboard/fees/student',
          label: 'Fees Management',
          icon: IndianRupee,
        },
      ],
    },
    {
      groupLabel: 'Communication',
      menus: [
        {
          href: '/dashboard/complaints',
          label: 'Teacher Feedback',
          icon: MessageSquare,
        },
        {
          href: '/dashboard/notices',
          label: 'Notice Board',
          icon: Bell,
        },
        {
          href: '/dashboard/complaints',
          label: 'Anonymous complaints',
          icon: Bell,
        },
      ],
    },
    {
      groupLabel: 'Documents',
      menus: [
        {
          href: '/dashboard/documents',
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
          icon: IndianRupee,
        },
        {
          href: '/dashboard/child-attendance',
          label: 'Attendance Monitor',
          icon: Calendar,
        },
        {
          href: '/dashboard/notices',
          label: 'Notice Board',
          icon: Bell,
        },
        {
          href: '/dashboard/remark',
          label: 'Remark ',
          icon: Bell,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      ],
    },
  ],
};
