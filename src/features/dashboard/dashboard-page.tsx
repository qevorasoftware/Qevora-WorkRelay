import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus } from 'lucide-react'
import { PageTransition } from '../../components/layout/page-transition'
import { Card, CardHeader } from '../../components/ui/card'
import { Badge, healthTone, projectStatusLabel } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { ListSkeleton } from '../../components/ui/skeleton'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { Tabs } from '../../components/ui/tabs'
import { AreaChart } from '../../components/ui/area-chart'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useChatStore } from '../../stores/chat-demo-store'
import { delay } from '../../services/project-adapter'
import { clientById } from '../../mocks/projects'
import { relativeTime } from '../../lib/utils'
import type { ActivityItem } from '../../types'

const deliveryPulse = [
  { label: '24 Aug', value: 3 },
  { label: '31 Aug', value: 5 },
  { label: '7 Sep', value: 4 },
  { label: '14 Sep', value: 7 },
  { label: '21 Sep', value: 6 },
  { label: '28 Sep', value: 9 },
  { label: '5 Oct', value: 8 },
  { label: '12 Oct', value: 12 },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const { loaded, markLoaded, projects, requests, approvals, activity } = useWorkspaceStore()
  const conversations = useChatStore((s) => s.conversations)
  const [activityFilter, setActivityFilter] = useState('all')

  useEffect(() => {
    if (!loaded) {
      delay(600).then(markLoaded)
    }
  }, [loaded, markLoaded])

  const pending = approvals.filter((a) => a.status === 'pending')
  const awaiting = requests.filter((r) => r.status === 'awaiting-client')
  const unread = conversations.reduce((sum, c) => sum + c.unread, 0)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const stats = [
    { label: 'Active projects', value: projects.filter((p) => p.status !== 'completed').length, to: '/projects' },
    { label: 'Pending approvals', value: pending.length, to: '/approvals' },
    { label: 'Awaiting client', value: awaiting.length, to: '/requests' },
    { label: 'Unread messages', value: unread, to: '/chat' },
  ]

  const filteredActivity = useMemo(
    () => activity.filter((a) => activityFilter === 'all' || a.kind === activityFilter).slice(0, 8),
    [activity, activityFilter]
  )

  return (
    <PageTransition>
      {/* Title */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Good morning, Aarav</h1>
          <p className="mt-0.5 text-[13px] text-muted">{today} · Here's what needs your attention.</p>
        </div>
        <Button onClick={() => navigate('/requests?new=1')}>
          <Plus size={15} /> New request
        </Button>
      </div>

      {/* Stat strip — quiet tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => navigate(s.to)}
            className="card card-hover px-5 py-4 text-left"
          >
            <p className="text-[12.5px] text-muted">{s.label}</p>
            <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">
              {loaded ? s.value : '–'}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {/* Delivery pulse */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Delivery pulse"
            action={<span className="text-[12px] text-muted">Requests completed · weekly</span>}
          />
          <div className="px-4 pb-4 pt-1">
            <AreaChart data={deliveryPulse} ariaLabel="Requests completed per week, last 8 weeks" />
          </div>
        </Card>

        {/* Needs attention */}
        <Card>
          <CardHeader
            title="Needs attention"
            action={
              <button className="text-[12px] font-medium text-[var(--accent)] hover:underline" onClick={() => navigate('/approvals')}>
                All
              </button>
            }
          />
          <div className="divide-y divide-[var(--hairline)] px-2 pb-2">
            {pending.slice(0, 3).map((a) => (
              <button
                key={a.id}
                onClick={() => navigate('/approvals')}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--fill)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">
                    {a.artifact} <span className="text-muted">{a.version}</span>
                  </p>
                  <p className="truncate text-[11.5px] text-muted">
                    {clientById(a.projectId === 'p1' ? 'c1' : a.projectId === 'p2' ? 'c2' : 'c3')?.company}
                  </p>
                </div>
                <Badge tone="warning">Pending</Badge>
                <ChevronRight size={14} className="text-faint" />
              </button>
            ))}
            {pending.length === 0 && (
              <EmptyState title="Nothing pending" hint="Every approval has been reviewed." />
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {/* Projects — Apple list, not cards */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Projects"
            action={
              <button className="text-[12px] font-medium text-[var(--accent)] hover:underline" onClick={() => navigate('/projects')}>
                View all
              </button>
            }
          />
          {!loaded ? (
            <ListSkeleton rows={4} />
          ) : (
            <div className="divide-y divide-[var(--hairline)] px-2 pb-2">
              {projects.map((p) => {
                const client = clientById(p.clientId)
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="flex w-full flex-wrap items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[var(--fill)]"
                  >
                    <div className="min-w-0 flex-1 basis-44">
                      <p className="truncate text-[13.5px] font-medium">{p.name}</p>
                      <p className="truncate text-[11.5px] text-muted">{client?.company}</p>
                    </div>
                    <div className="flex w-24 items-center gap-2">
                      <Progress value={p.progress} tone={p.health === 'blocked' ? 'danger' : p.health === 'at-risk' ? 'warning' : 'accent'} />
                      <span className="w-8 text-right text-[11px] tabular-nums text-muted">{p.progress}%</span>
                    </div>
                    <Badge tone={healthTone[p.health]}>{projectStatusLabel[p.status]}</Badge>
                    <ChevronRight size={14} className="text-faint" />
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader title="Recent activity" />
          <div className="px-4 pb-4">
            <Tabs
              value={activityFilter}
              onValueChange={setActivityFilter}
              items={[
                { value: 'all', label: 'All' },
                { value: 'approval', label: 'Approvals' },
                { value: 'request', label: 'Requests' },
                { value: 'chat', label: 'Chat' },
              ]}
            />
            <div className="mt-2.5 space-y-2">
              {filteredActivity.length === 0 && (
                <EmptyState title="No activity of this type" hint="Try another filter." />
              )}
              {filteredActivity.map((a: ActivityItem) => (
                <div key={a.id} className="text-[12px] leading-snug text-muted">
                  <span className="font-medium text-[var(--text)]">{a.target}</span>{' '}
                  <span>{a.action}</span>
                  <span className="ml-1 whitespace-nowrap text-faint">· {relativeTime(a.at)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}
