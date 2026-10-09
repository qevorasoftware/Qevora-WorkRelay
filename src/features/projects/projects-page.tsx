import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, FolderKanban } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import { Badge, healthTone, projectStatusLabel, projectStatusTone } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { EmptyState } from '../../components/ui/empty-state'
import { Tabs } from '../../components/ui/tabs'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { clientById } from '../../mocks/projects'
import { dueLabel } from '../../lib/utils'

export function ProjectsPage() {
  const navigate = useNavigate()
  const projects = useWorkspaceStore((s) => s.projects)
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
      <PageHeader title="Projects" subtitle="All client work in one place." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search projects"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-[240px]"
          aria-label="Search projects"
        />
        <Tabs items={statusItems} value={status} onValueChange={setStatus} />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects match"
            hint="Try a different search term or status filter."
          />
        ) : (
          <div className="divide-y divide-[var(--hairline)] px-2 py-2">
            {filtered.map((p) => {
              const client = clientById(p.clientId)
              return (
                <button
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="flex w-full flex-wrap items-center gap-3 rounded-lg px-3 py-3.5 text-left transition-colors hover:bg-[var(--fill)]"
                >
                  <div className="min-w-0 flex-1 basis-52">
                    <p className="truncate text-[14px] font-medium">{p.name}</p>
                    <p className="truncate text-[12px] text-muted">{p.tagline}</p>
                  </div>
                  <div className="flex w-28 items-center gap-2">
                    <Progress value={p.progress} tone={p.health === 'blocked' ? 'danger' : p.health === 'at-risk' ? 'warning' : 'accent'} />
                    <span className="w-8 text-right text-[11px] tabular-nums text-muted">{p.progress}%</span>
                  </div>
                  <span className="w-24 truncate text-[12px] text-muted">{client?.company}</span>
                  <span className="w-20 text-[12px] text-muted">Due {dueLabel(p.dueDate)}</span>
                  <Badge tone={projectStatusTone[p.status]}>{projectStatusLabel[p.status]}</Badge>
                  <Badge tone={healthTone[p.health]}>
                    {p.health === 'on-track' ? 'On track' : p.health === 'at-risk' ? 'At risk' : 'Blocked'}
                  </Badge>
                  <ChevronRight size={14} className="text-faint" />
                </button>
              )
            })}
          </div>
        )}
      </Card>
    </PageTransition>
  )
}
