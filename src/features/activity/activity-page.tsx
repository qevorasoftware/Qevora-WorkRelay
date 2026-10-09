import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowUpRight, CheckCircle2, FileText, FolderKanban, Inbox,
  MessageSquare, Search, File, Eye,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { AvatarOf } from '../../components/ui/avatar'
import { EmptyState } from '../../components/ui/empty-state'
import { Tabs } from '../../components/ui/tabs'
import { Input } from '../../components/ui/input'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { userById } from '../../mocks/users'
import { cn, relativeTime } from '../../lib/utils'
import type { ActivityItem } from '../../types'
import { ActivityDetailDialog } from './activity-detail-dialog'

const kindMeta: Record<ActivityItem['kind'], { icon: LucideIcon; color: string; bg: string }> = {
  request: { icon: Inbox, color: 'var(--accent)', bg: 'var(--accent-tint)' },
  approval: { icon: FileText, color: 'var(--warning)', bg: 'var(--warning-tint)' },
  chat: { icon: MessageSquare, color: 'var(--info)', bg: 'var(--info-tint)' },
  file: { icon: File, color: 'var(--success)', bg: 'var(--success-tint)' },
  project: { icon: FolderKanban, color: 'var(--text-2)', bg: 'var(--fill)' },
}

function dayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function ActivityPage() {
  const { activity } = useWorkspaceStore()
  const reduce = useReducedMotion()
  const [kind, setKind] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<ActivityItem | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return activity.filter((a) => {
      const matchK = kind === 'all' || a.kind === kind
      const actor = userById(a.actorId)?.name.toLowerCase() ?? ''
      const matchQ = !q || a.target.toLowerCase().includes(q) || a.action.toLowerCase().includes(q) || actor.includes(q)
      return matchK && matchQ
    })
  }, [activity, kind, query])

  const groups = useMemo(() => {
    const map = new Map<string, ActivityItem[]>()
    for (const a of filtered) {
      const key = dayLabel(a.at)
      ;(map.get(key) ?? map.set(key, []).get(key))!.push(a)
    }
    return [...map.entries()]
  }, [filtered])

  const countFor = (k: string) => (k === 'all' ? activity.length : activity.filter((a) => a.kind === k).length)

  return (
    <PageTransition>
      <PageHeader
        title="Activity"
        subtitle="Every change across the workspace — who, what, when and from where."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs
          value={kind}
          onValueChange={setKind}
          items={[
            { value: 'all', label: 'All', count: countFor('all') },
            { value: 'request', label: 'Requests', count: countFor('request') },
            { value: 'approval', label: 'Approvals', count: countFor('approval') },
            { value: 'chat', label: 'Chat', count: countFor('chat') },
            { value: 'file', label: 'Files', count: countFor('file') },
            { value: 'project', label: 'Projects', count: countFor('project') },
          ]}
        />
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activity"
            aria-label="Search activity"
            className="h-9 w-56 pl-8 text-[12.5px]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Search} title="No activity found" hint="Try a different filter or search term." />
        </Card>
      ) : (
        <div className="space-y-6">
          {groups.map(([day, items]) => (
            <div key={day}>
              <div className="mb-3 flex items-center gap-3">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-faint">{day}</p>
                <span className="badge badge-neutral">{items.length}</span>
                <span className="h-px flex-1 bg-[var(--hairline)]" />
              </div>

              <Card className="relative overflow-hidden p-0">
                {/* timeline rail */}
                <span className="absolute bottom-6 left-[38px] top-6 w-px bg-[var(--hairline)]" aria-hidden="true" />

                <div className="divide-y divide-[var(--hairline)]">
                  {items.map((a, i) => {
                    const meta = kindMeta[a.kind]
                    const Icon = meta.icon
                    const actor = userById(a.actorId)
                    return (
                      <motion.div
                        key={a.id}
                        initial={reduce ? undefined : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reduce ? 0 : i * 0.03, duration: 0.25 }}
                        className="group relative flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--fill)]"
                      >
                        <span className="z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-[2.5px] border-[var(--surface)] shadow-sm" style={{ background: meta.bg, color: meta.color }}>
                          <Icon size={15} />
                        </span>

                        <AvatarOf userId={a.actorId} size="sm" className="shrink-0" />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] leading-snug">
                            <span className="font-semibold">{actor?.name.split(' ')[0]}</span>{' '}
                            <span className="text-muted">{a.action}</span>{' '}
                            <span className="font-semibold">{a.target}</span>
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-faint">
                            {a.detail.projectName} · {a.detail.location.split(',')[0]} · {relativeTime(a.at)}
                          </p>
                        </div>

                        <Badge tone="neutral" className="hidden shrink-0 sm:inline-flex">{a.kind}</Badge>
                        <span className="w-14 shrink-0 text-right text-[11px] tabular-nums text-faint">{relativeTime(a.at)}</span>

                        <button
                          className="btn btn-secondary btn-sm shrink-0 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 md:opacity-60 md:group-hover:opacity-100"
                          onClick={() => setSelected(a)}
                          aria-label={`View details of ${a.target}`}
                        >
                          <Eye size={13} /> View
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </div>
          ))}

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-faint">
            <CheckCircle2 size={12} /> End of activity — {activity.length} events recorded
          </p>
        </div>
      )}

      <ActivityDetailDialog item={selected} onClose={() => setSelected(null)} />
    </PageTransition>
  )
}
