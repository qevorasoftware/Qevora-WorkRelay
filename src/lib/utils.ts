import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function relativeTime(iso: string) {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then
  const min = Math.round(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hrs = Math.round(min / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(iso)
}

export function isOverdue(dueDate: string) {
  return new Date(dueDate).getTime() < Date.now()
}

export function dueLabel(dueDate: string) {
  const d = new Date(dueDate)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  if (isToday) return 'Today'
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return '1 day overdue'
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
  return formatDate(dueDate)
}

export function avatarStyle(hue: number) {
  return {
    background: `linear-gradient(135deg, hsl(${hue} 62% 55%), hsl(${(hue + 40) % 360} 62% 45%))`,
  }
}
