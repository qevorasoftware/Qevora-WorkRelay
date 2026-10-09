import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import type { ApprovalStatus, Health, ProjectStatus, RequestStatus, Visibility } from '../../types'

export type BadgeTone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export function Badge({ tone = 'neutral', className, children }: {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}) {
  return <span className={cn('badge', `badge-${tone}`, className)}>{children}</span>
}

export const projectStatusTone: Record<ProjectStatus, BadgeTone> = {
  planning: 'neutral',
  'in-progress': 'accent',
  review: 'warning',
  blocked: 'danger',
  completed: 'success',
}

export const requestStatusTone: Record<RequestStatus, BadgeTone> = {
  open: 'accent',
  'awaiting-client': 'warning',
  'in-review': 'info',
  complete: 'success',
}

export const approvalStatusTone: Record<ApprovalStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  'changes-requested': 'danger',
}

export const healthTone: Record<Health, BadgeTone> = {
  'on-track': 'success',
  'at-risk': 'warning',
  blocked: 'danger',
}

export const requestStatusLabel: Record<RequestStatus, string> = {
  open: 'Open',
  'awaiting-client': 'Awaiting client',
  'in-review': 'In review',
  complete: 'Complete',
}

export const approvalStatusLabel: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  'changes-requested': 'Changes requested',
}

export const projectStatusLabel: Record<ProjectStatus, string> = {
  planning: 'Planning',
  'in-progress': 'In progress',
  review: 'In review',
  blocked: 'Blocked',
  completed: 'Completed',
}

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return (
    <Badge tone={visibility === 'client' ? 'info' : 'neutral'}>
      {visibility === 'client' ? 'Client' : 'Internal'}
    </Badge>
  )
}
