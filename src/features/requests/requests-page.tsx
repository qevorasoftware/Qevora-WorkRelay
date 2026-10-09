import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDownUp, Inbox, MoreHorizontal, Plus } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge, VisibilityBadge, requestStatusLabel, requestStatusTone } from '../../components/ui/badge'
import { AvatarOf } from '../../components/ui/avatar'
import { EmptyState } from '../../components/ui/empty-state'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../components/ui/dropdown'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/input'
import { RequestDialog } from './request-dialog'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useUiStore } from '../../stores/ui-store'
import { projectById } from '../../mocks/projects'
import { dueLabel, isOverdue } from '../../lib/utils'
import type { RequestStatus } from '../../types'

const statusFlow: RequestStatus[] = ['open', 'awaiting-client', 'in-review', 'complete']

export function RequestsPage() {
  const { requests, users, setRequestStatus } = useWorkspaceStore()
  const toast = useUiStore((s) => s.toast)
  const [params, setParams] = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')

  useEffect(() => {
    if (params.get('new') === '1') {
      setDialogOpen(true)
      params.delete('new')
      setParams(params, { replace: true })
    }
  }, [params, setParams])

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        const matchS = statusFilter === 'all' || r.status === statusFilter
        const matchP = projectFilter === 'all' || r.projectId === projectFilter
        return matchS && matchP
      }),
    [requests, statusFilter, projectFilter]
  )

  const countFor = (s: string) => (s === 'all' ? requests.length : requests.filter((r) => r.status === s).length)

  return (
    <PageTransition>
      <PageHeader
        title="Requests"
        subtitle="Track content, file and access requests across every project."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> New request
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-line bg-card2 p-1">
          {['all', ...statusFlow].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--card)] text-[var(--accent)] shadow-sm'
                  : 'text-muted hover:text-[var(--text)]'
              }`}
            >
              {s === 'all' ? 'All' : requestStatusLabel[s as RequestStatus]}
              <span className="ml-1.5 text-[10px] opacity-70">{countFor(s)}</span>
            </button>
          ))}
        </div>
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="h-9 w-auto max-w-56" aria-label="Filter by project">
          <option value="all">All projects</option>
          {useWorkspaceStore.getState().projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No requests here"
            hint="Adjust the filters or create a new request."
            action={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus size={14} /> New request</Button>}
          />
        ) : (
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                  <th className="px-5 py-3 font-semibold">Request</th>
                  <th className="px-3 py-3 font-semibold">Project</th>
                  <th className="px-3 py-3 font-semibold">Owner</th>
                  <th className="px-3 py-3 font-semibold"><ArrowDownUp size={12} className="mr-1 inline" />Due</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Visibility</th>
                  <th className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filtered.map((r) => {
                  const project = projectById(r.projectId)
                  const overdue = isOverdue(r.dueDate) && r.status !== 'complete'
                  return (
                    <tr key={r.id} className="transition-colors hover:bg-[color-mix(in_srgb,var(--text)_3%,transparent)]">
                      <td className="max-w-64 px-5 py-3">
                        <p className="truncate font-semibold">{r.title}</p>
                        <p className="truncate text-xs text-muted">{r.description}</p>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted">{project?.name.split(' — ')[1] ?? project?.name}</td>
                      <td className="px-3 py-3"><AvatarOf userId={r.assigneeId} size="sm" /></td>
                      <td className={`px-3 py-3 text-xs font-medium ${overdue ? 'text-[var(--danger)]' : 'text-muted'}`}>{dueLabel(r.dueDate)}</td>
                      <td className="px-3 py-3"><Badge tone={requestStatusTone[r.status]}>{requestStatusLabel[r.status]}</Badge></td>
                      <td className="px-3 py-3"><VisibilityBadge visibility={r.visibility} /></td>
                      <td className="px-3 py-3 text-right">
                        <Dropdown>
                          <DropdownTrigger asChild>
                            <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Actions for ${r.title}`}>
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownTrigger>
                          <DropdownContent
                            items={statusFlow
                              .filter((s) => s !== r.status)
                              .map((s) => ({
                                label: `Move to ${requestStatusLabel[s]}`,
                                onSelect: () => {
                                  setRequestStatus(r.id, s)
                                  toast(`“${r.title}” → ${requestStatusLabel[s]}`)
                                },
                              }))}
                          />
                        </Dropdown>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <RequestDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultProjectId={projectFilter !== 'all' ? projectFilter : undefined} />
      <span className="hidden">{users.length}</span>
    </PageTransition>
  )
}
