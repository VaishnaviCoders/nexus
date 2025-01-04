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

// roleMenus.ts
import {
  LayoutGrid,
  SquarePen,
  Bookmark,
  Tag,
  Users,
  Settings,
  LucideIcon,
  Settings2,
  FileWarning,
  User2,
} from 'lucide-react';

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
      groupLabel: 'Contents',
      menus: [
        {
          href: '/leads',
          label: 'Lead',
          icon: SquarePen,
          submenus: [
            { href: '/dashboard/leads', label: 'All Leads' },
            { href: '/leads/new', label: 'New Lead' },
          ],
        },
        {
          href: '/teachers',
          label: 'Teacher',
          icon: User2,
          submenus: [
            { href: '/dashboard/teachers', label: 'All Teachers' },
            { href: '/teacher/create', label: 'Create Teacher' },
            { href: '/dashboard/salary', label: 'Teacher Salary' },
          ],
        },
        { href: '/dashboard/admin', label: 'Admin', icon: Settings },
        { href: '/dashboard/students', label: 'Students', icon: Users },
        { href: '/dashboard/courses', label: 'Courses', icon: Bookmark },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: '/users', label: 'Users', icon: Users },
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
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Contents',
      menus: [
        { href: '/dashboard/students', label: 'Students', icon: Bookmark },
        { href: '/dashboard/courses', label: 'Courses', icon: Tag },
        { href: '/dashboard/teachers', label: 'Teachers', icon: Tag },
        { href: '/dashboard/my-salary', label: 'Salary', icon: Tag },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: '/dashboard/settings', label: 'Settings', icon: Settings2 },
        { href: '/dashboard/support', label: 'Support', icon: FileWarning },
      ],
    },
  ],
  STUDENT: [
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
      groupLabel: 'Learning',
      menus: [
        { href: '/dashboard/courses', label: 'Courses', icon: Tag },
        { href: '/dashboard/attendance', label: 'Attendance', icon: Tag },
        { href: '/dashboard/Student-profile', label: 'Student', icon: Tag },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: '/dashboard/settings', label: 'Settings', icon: Settings2 },
        { href: '/dashboard/support', label: 'Support', icon: FileWarning },
      ],
    },
  ],
};
