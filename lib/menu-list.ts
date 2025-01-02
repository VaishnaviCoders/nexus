import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
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

export function getMenuList(pathname: string): Group[] {
  return [
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
          href: '',
          label: 'Lead',
          icon: SquarePen,
          submenus: [
            {
              href: '/leads',
              label: 'All Leads',
            },
            {
              href: '/leads/new',
              label: 'New Lead',
            },
          ],
        },
        {
          href: '/dashboard/students',
          label: 'Students',
          icon: Bookmark,
        },
        {
          href: '/tags',
          label: 'Tags',
          icon: Tag,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/users',
          label: 'Users',
          icon: Users,
        },
        {
          href: 'dashboard/settings',
          label: 'Settings',
          icon: Settings,
        },
      ],
    },
  ];
}
