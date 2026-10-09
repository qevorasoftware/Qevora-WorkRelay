import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AtSign, Bell, CheckCheck, FileText, Inbox, Sparkles, File } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { EmptyState } from '../../components/ui/empty-state'
import { Tabs } from '../../components/ui/tabs'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { relativeTime } from '../../lib/utils'
import type { Notification } from '../../types'

const typeIcon: Record<Notification['type'], LucideIcon> = {
  approval: FileText,
  request: Inbox,
  mention: AtSign,
  file: File,
  system: Sparkles,
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, markNotification, markAllNotifications } = useWorkspaceStore()
  const [filter, setFilter] = useState('all')

  const filtered = notifications.filter((n) => filter === 'all' || (filter === 'unread' && !n.read))

  return (
    <PageTransition>
      <PageHeader
        title="Notifications"
        subtitle="Approval activity, mentions and delivery updates."
        actions={
          <Button variant="secondary" onClick={markAllNotifications}>
            <CheckCheck size={15} /> Mark all read
          </Button>
        }
      />

      <div className="mb-5">
        <Tabs
          value={filter}
          onValueChange={setFilter}
          items={[
            { value: 'all', label: 'All', count: notifications.length },
            { value: 'unread', label: 'Unread', count: notifications.filter((n) => !n.read).length },
          ]}
        />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={Bell} title="All caught up" hint="No notifications in this view." />
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {filtered.map((n) => {
              const Icon = typeIcon[n.type]
              return (
                <button
                  key={n.id}
                  onClick={() => { markNotification(n.id); navigate(n.target) }}
                  className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--text)_4%,transparent)]"
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${n.read ? 'bg-card2 text-muted' : 'bg-[color-mix(in_srgb,var(--accent)_13%,transparent)] text-[var(--accent)]'}`}>
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`truncate text-sm ${n.read ? 'font-medium text-muted' : 'font-bold'}`}>{n.title}</span>
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" aria-label="Unread" />}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{n.body}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted">{relativeTime(n.at)}</span>
                </button>
              )
            })}
          </div>
        )}
      </Card>
    </PageTransition>
  )
}
