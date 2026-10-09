import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, CheckCircle2, FolderKanban, Inbox, MessageSquare,
  Clock, Plus, Globe,
} from 'lucide-react'
import { PageTransition } from '../../components/layout/page-transition'
import { Card, CardHeader } from '../../components/ui/card'
import { Badge, healthTone, projectStatusLabel } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { ListSkeleton } from '../../components/ui/skeleton'
import { EmptyState } from '../../components/ui/empty-state'
import { AvatarOf } from '../../components/ui/avatar'
import { Tabs } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
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
      delay(700).then(markLoaded)
    }
  }, [loaded, markLoaded])

  const pending = approvals.filter((a) => a.status === 'pending')
  const awaiting = requests.filter((r) => r.status === 'awaiting-client')
  const unread = conversations.reduce((sum, c) => sum + c.unread, 0)

  const stats = [
    { label: 'Active projects', value: projects.filter((p) => p.status !== 'completed').length, delta: '+1 this week', icon: FolderKanban, tone: 'accent' as const, to: '/projects' },
    { label: 'Pending approvals', value: pending.length, delta: '2 due soon', icon: CheckCircle2, tone: 'warning' as const, to: '/approvals' },
    { label: 'Awaiting client', value: awaiting.length, delta: '1 overdue', icon: Inbox, tone: 'info' as const, to: '/requests' },
    { label: 'Unread messages', value: unread, delta: 'in 2 chats', icon: MessageSquare, tone: 'success' as const, to: '/chat' },
  ]

  const filteredActivity = useMemo(
    () => activity.filter((a) => activityFilter === 'all' || a.kind === activityFilter).slice(0, 7),
    [activity, activityFilter]
  )

  return (
    <PageTransition>
      {/* Hero */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">
            Good morning, <span className="gradient-text">Aarav</span> 👋
          </h1>
          <p className="mt-1 text-sm text-muted">Here's what needs your attention today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/portal')}>
            <Globe size={15} /> Client portal
          </Button>
          <Button onClick={() => navigate('/requests?new=1')}>
            <Plus size={16} /> New request
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <button key={s.label} onClick={() => navigate(s.to)} className="card card-hover p-5 text-left">
            <div className="flex items-start justify-between">
              <span className={`chip chip-${s.tone}`}>
                <s.icon size={19} />
              </span>
              <span className="badge badge-neutral">
                <ArrowUpRight size={11} />
                {s.delta}
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold tabular-nums tracking-tight">
              {loaded ? s.value : '–'}
            </p>
            <p className="mt-0.5 text-xs font-medium text-muted">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Delivery pulse + blockers */}
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Delivery pulse"
            action={
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 text-[11px] font-semibold text-muted sm:inline-flex">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" />
                  Requests completed · weekly
                </span>
                <Badge tone="success">+33% vs last week</Badge>
              </div>
            }
          />
          <div className="px-4 pb-4 pt-1">
            <AreaChart data={deliveryPulse} ariaLabel="Requests completed per week, last 8 weeks, trending up" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Approval blockers" action={<Clock size={15} className="text-muted" />} />
          <div className="space-y-2 px-4 pb-4">
            {pending.slice(0, 3).map((a) => (
              <button
                key={a.id}
                onClick={() => navigate('/approvals')}
                className="flex w-full items-center gap-3 rounded-xl border border-line bg-card2/60 p-3 text-left transition-colors hover:border-[var(--accent)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">
                    {a.artifact} <span className="text-muted">{a.version}</span>
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {clientById(a.projectId === 'p1' ? 'c1' : a.projectId === 'p2' ? 'c2' : 'c3')?.company}
                  </p>
                </div>
                <Badge tone="warning">Pending</Badge>
              </button>
            ))}
            {pending.length === 0 && (
              <EmptyState icon={CheckCircle2} title="No pending approvals" hint="Everything has been reviewed." />
            )}
          </div>
        </Card>
      </div>

      {/* Projects + activity */}
      <div className="mt-5 grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        <Card className="xl:col-span-2 2xl:col-span-3">
          <CardHeader
            title="Projects"
            action={
              <button
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                onClick={() => navigate('/projects')}
              >
                View all <ArrowRight size={12} />
              </button>
            }
          />
          {!loaded ? (
            <ListSkeleton rows={4} />
          ) : (
            <div className="divide-y divide-[var(--line)] px-2 pb-2">
              {projects.map((p) => {
                const client = clientById(p.clientId)
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="flex w-full flex-wrap items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--text)_4%,transparent)]"
                  >
                    <div className="min-w-0 flex-1 basis-48">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-muted">{client?.company}</p>
                    </div>
                    <div className="flex w-28 items-center gap-2">
                      <Progress
                        value={p.progress}
                        tone={p.health === 'blocked' ? 'danger' : p.health === 'at-risk' ? 'warning' : 'accent'}
                      />
                      <span className="w-8 text-right text-[11px] font-semibold tabular-nums text-muted">
                        {p.progress}%
                      </span>
                    </div>
                    <Badge tone={healthTone[p.health]}>{projectStatusLabel[p.status]}</Badge>
                  </button>
                )
              })}
            </div>
          )}
        </Card>

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
                { value: 'file', label: 'Files' },
              ]}
            />
            <div className="mt-3 space-y-2.5">
              {filteredActivity.length === 0 && (
                <EmptyState title="No activity of this type" hint="Try another filter." />
              )}
              {filteredActivity.map((a: ActivityItem) => (
                <div key={a.id} className="flex items-start gap-2.5 text-xs">
                  <AvatarOf userId={a.actorId} size="xs" className="mt-0.5" />
                  <p className="min-w-0 flex-1 text-muted">
                    <span className="font-semibold text-[var(--text)]">{a.action}</span>{' '}
                    <span className="font-medium text-[var(--text)]">{a.target}</span>
                    <span className="ml-1.5 whitespace-nowrap opacity-70">· {relativeTime(a.at)}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}
