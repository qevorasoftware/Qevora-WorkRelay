import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, FolderKanban, Link2, MoreHorizontal } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import { Badge, healthTone, projectStatusLabel, projectStatusTone } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { EmptyState } from '../../components/ui/empty-state'
import { Dropdown, DropdownTrigger, DropdownContent } from '../../components/ui/dropdown'
import { Tabs } from '../../components/ui/tabs'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useUiStore } from '../../stores/ui-store'
import { clientById } from '../../mocks/projects'
import { dueLabel } from '../../lib/utils'

export function ProjectsPage() {
  const navigate = useNavigate()
  const projects = useWorkspaceStore((s) => s.projects)
  const toast = useUiStore((s) => s.toast)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const q = query.trim().toLowerCase()
        const matchQ = !q || p.name.toLowerCase().includes(q)
        const matchS = status === 'all' || p.status === status
        return matchQ && matchS
      }),
    [projects, query, status]
  )

  const statusItems = [
    { value: 'all', label: 'All', count: projects.length },
    { value: 'in-progress', label: 'In progress', count: projects.filter((p) => p.status === 'in-progress').length },
    { value: 'review', label: 'In review', count: projects.filter((p) => p.status === 'review').length },
    { value: 'planning', label: 'Planning', count: projects.filter((p) => p.status === 'planning').length },
    { value: 'blocked', label: 'Blocked', count: projects.filter((p) => p.status === 'blocked').length },
    { value: 'completed', label: 'Completed', count: projects.filter((p) => p.status === 'completed').length },
  ]

  return (
    <PageTransition>
      <PageHeader
        title="Projects"
        subtitle="Search, filter and open project workspaces."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search projects…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
          aria-label="Search projects"
        />
        <Tabs items={statusItems} value={status} onValueChange={setStatus} />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderKanban}
            title="No projects match"
            hint="Try a different search term or status filter."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const client = clientById(p.clientId)
            return (
              <Card key={p.id} className="card-hover flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => navigate(`/projects/${p.id}`)} className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-bold">{p.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{p.tagline}</p>
                  </button>
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Actions for ${p.name}`}>
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownTrigger>
                    <DropdownContent
                      items={[
                        { label: 'Open project', onSelect: () => navigate(`/projects/${p.id}`) },
                        { label: 'View client portal', icon: ExternalLink, onSelect: () => navigate(`/portal/${p.clientId}`) },
                        { label: 'Copy link', icon: Link2, onSelect: () => toast('Link copied (demo)', 'info') },
                      ]}
                    />
                  </Dropdown>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge tone={projectStatusTone[p.status]}>{projectStatusLabel[p.status]}</Badge>
                  <Badge tone={healthTone[p.health]}>{p.health === 'on-track' ? 'On track' : p.health === 'at-risk' ? 'At risk' : 'Blocked'}</Badge>
                  <Badge tone="neutral">{client?.company}</Badge>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Progress value={p.progress} tone={p.health === 'blocked' ? 'danger' : p.health === 'at-risk' ? 'warning' : 'accent'} />
                  <span className="w-9 text-right text-[11px] font-semibold tabular-nums text-muted">{p.progress}%</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
                  <span>Due {dueLabel(p.dueDate)}</span>
                  <span>{p.milestones.filter((m) => m.done).length}/{p.milestones.length} milestones</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageTransition>
  )
}
