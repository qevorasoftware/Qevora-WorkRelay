import {
  Activity as ActivityIcon, CalendarDays, CheckCircle2, FolderKanban, Inbox,
  LayoutDashboard, MessageSquare, Folder, Settings, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  phase2?: boolean
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/requests', label: 'Requests', icon: Inbox },
  { to: '/approvals', label: 'Approvals', icon: CheckCircle2 },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/files', label: 'Files', icon: Folder },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/activity', label: 'Activity', icon: ActivityIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, phase2: true },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export const routeTitles: Record<string, string> = {
  '/': 'Overview',
  '/projects': 'Projects',
  '/requests': 'Requests',
  '/approvals': 'Approvals',
  '/chat': 'Chat',
  '/files': 'Files',
  '/clients': 'Clients',
  '/activity': 'Activity',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
}
