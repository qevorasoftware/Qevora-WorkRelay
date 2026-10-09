import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { PageTransition } from '../../components/layout/page-transition'
import { Card, CardHeader } from '../../components/ui/card'
import { Badge, approvalStatusTone, approvalStatusLabel, requestStatusLabel, requestStatusTone } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { EmptyState } from '../../components/ui/empty-state'
import { AvatarOf } from '../../components/ui/avatar'
import { Tabs } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { clientById } from '../../mocks/projects'
import { dueLabel } from '../../lib/utils'

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, requests, approvals, files, activity, users } = useWorkspaceStore()
  const [tab, setTab] = useState('overview')
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <PageTransition>
        <Card>
          <EmptyState
            icon={ArrowLeft}
            title="Project not found"
            hint="It may have been removed, or the link is wrong."
            action={<Button variant="secondary" onClick={() => navigate('/projects')}>Back to projects</Button>}
          />
        </Card>
      </PageTransition>
    )
  }

  const client = clientById(project.clientId)
  const projectRequests = requests.filter((r) => r.projectId === project.id)
  const projectApprovals = approvals.filter((a) => a.projectId === project.id)
  const projectFiles = files.filter((f) => f.projectId === project.id)

  return (
    <PageTransition>
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[var(--accent)]">
        <ArrowLeft size={13} /> All projects
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">{project.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone="neutral">{client?.company}</Badge>
              <Badge tone="info">Client: {client?.name}</Badge>
              <Badge tone="warning">Due {dueLabel(project.dueDate)}</Badge>
            </div>
          </div>
          <div className="w-full max-w-56">
            <div className="mb-1.5 flex justify-between text-xs font-semibold">
              <span className="text-muted">Progress</span>
              <span className="tabular-nums">{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
        </div>

        <div className="mt-5">
          <Tabs
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'overview', label: 'Overview' },
              { value: 'requests', label: 'Requests', count: projectRequests.length },
              { value: 'approvals', label: 'Approvals', count: projectApprovals.length },
              { value: 'files', label: 'Files', count: projectFiles.length },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        {tab === 'overview' && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Milestones" />
              <div className="space-y-1 px-4 pb-4">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-xl px-2 py-2">
                    {m.done ? (
                      <CheckCircle2 size={17} className="shrink-0 text-[var(--success)]" />
                    ) : (
                      <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[var(--line-strong)]" />
                    )}
                    <span className={`flex-1 text-sm ${m.done ? 'text-muted line-through' : 'font-medium'}`}>{m.title}</span>
                    <span className="text-xs text-muted">{dueLabel(m.dueDate)}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Recent activity" />
              <div className="space-y-2.5 px-5 pb-5">
                {activity.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5 text-xs">
                    <AvatarOf userId={a.actorId} size="xs" className="mt-0.5" />
                    <p className="min-w-0 flex-1 text-muted">
                      <span className="font-semibold text-[var(--text)]">{a.action}</span>{' '}
                      <span className="font-medium text-[var(--text)]">{a.target}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === 'requests' && (
          <Card>
            <CardHeader title="Requests" action={<Button size="sm" variant="secondary" onClick={() => navigate('/requests?new=1')}>New request</Button>} />
            {projectRequests.length === 0 ? (
              <EmptyState title="No requests yet" hint="Create the first content request for this project." />
            ) : (
              <div className="divide-y divide-[var(--line)] px-3 pb-3">
                {projectRequests.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center gap-3 px-2 py-3">
                    <AvatarOf userId={r.assigneeId} size="sm" />
                    <div className="min-w-0 flex-1 basis-40">
                      <p className="truncate text-sm font-semibold">{r.title}</p>
                      <p className="text-xs text-muted">Due {dueLabel(r.dueDate)}</p>
                    </div>
                    <Badge tone={requestStatusTone[r.status]}>{requestStatusLabel[r.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {tab === 'approvals' && (
          <Card>
            <CardHeader title="Approvals" />
            {projectApprovals.length === 0 ? (
              <EmptyState title="No approvals yet" />
            ) : (
              <div className="divide-y divide-[var(--line)] px-3 pb-3">
                {projectApprovals.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-3 px-2 py-3">
                    <div className="min-w-0 flex-1 basis-40">
                      <p className="truncate text-sm font-semibold">{a.artifact} <span className="text-muted">{a.version}</span></p>
                      <p className="text-xs text-muted">Reviewer: {users.find((u) => u.id === a.reviewerId)?.name}</p>
                    </div>
                    <Badge tone={approvalStatusTone[a.status]}>{approvalStatusLabel[a.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {tab === 'files' && (
          <Card>
            <CardHeader title="Files" />
            {projectFiles.length === 0 ? (
              <EmptyState title="No files yet" />
            ) : (
              <div className="divide-y divide-[var(--line)] px-3 pb-3">
                {projectFiles.map((f) => (
                  <div key={f.id} className="flex flex-wrap items-center gap-3 px-2 py-3">
                    <div className="min-w-0 flex-1 basis-40">
                      <p className="truncate text-sm font-semibold">{f.name}</p>
                      <p className="text-xs text-muted">{f.sizeLabel} · {f.version}</p>
                    </div>
                    <Badge tone={f.visibility === 'client' ? 'info' : 'neutral'}>{f.visibility === 'client' ? 'Client' : 'Internal'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
