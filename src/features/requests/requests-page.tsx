import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Inbox, MoreHorizontal, Plus } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge, VisibilityBadge, requestStatusLabel, requestStatusTone } from '../../components/ui/badge'
import { AvatarOf } from '../../components/ui/avatar'
import { EmptyState } from '../../components/ui/empty-state'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../components/ui/dropdown'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/input'
import { SelectDropdown } from '../../components/ui/select-dropdown'
import { Tabs } from '../../components/ui/tabs'
import { RequestDialog } from './request-dialog'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useUiStore } from '../../stores/ui-store'
import { projectById } from '../../mocks/projects'
import { dueLabel, isOverdue } from '../../lib/utils'
import type { RequestStatus } from '../../types'

const statusFlow: RequestStatus[] = ['open', 'awaiting-client', 'in-review', 'complete']

export function RequestsPage() {
  const { requests, projects, setRequestStatus } = useWorkspaceStore()
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

  const items = [
    { value: 'all', label: 'All', count: countFor('all') },
    ...statusFlow.map((s) => ({ value: s, label: requestStatusLabel[s], count: countFor(s) })),
  ]

  return (
    <PageTransition>
      <PageHeader
        title="Requests"
        subtitle="Content, file and access requests across every project."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={15} /> New request
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs items={items} value={statusFilter} onValueChange={setStatusFilter} />
        <SelectDropdown
          className="w-56"
          value={projectFilter}
          onChange={setProjectFilter}
          ariaLabel="Filter by project"
          options={[{ value: 'all', label: 'All projects' }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
        />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No requests here"
            hint="Adjust the filters or create a new request."
            action={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus size={13} /> New request</Button>}
          />
        ) : (
          <div className="divide-y divide-[var(--hairline)] px-2 py-2">
            {filtered.map((r) => {
              const project = projectById(r.projectId)
              const overdue = isOverdue(r.dueDate) && r.status !== 'complete'
              return (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--fill)] sm:grid sm:grid-cols-[minmax(0,1fr)_9rem_2.25rem_7.5rem_8.5rem_6.5rem_2rem] sm:items-center sm:gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium">{r.title}</p>
                    <p className="truncate text-[12px] text-muted">{r.description}</p>
                  </div>
                  <span className="truncate text-[12px] text-muted">{project?.name.split(' — ')[1] ?? project?.name}</span>
                  <span className="flex justify-center"><AvatarOf userId={r.assigneeId} size="sm" /></span>
                  <span className={`truncate text-[12px] ${overdue ? 'font-medium text-[var(--danger)]' : 'text-muted'}`}>{dueLabel(r.dueDate)}</span>
                  <span><Badge tone={requestStatusTone[r.status]}>{requestStatusLabel[r.status]}</Badge></span>
                  <span><VisibilityBadge visibility={r.visibility} /></span>
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Actions for ${r.title}`}>
                        <MoreHorizontal size={15} />
                      </button>
                    </DropdownTrigger>
                    <DropdownContent
                      items={statusFlow
                        .filter((s) => s !== r.status)
                        .map((s) => ({
                          label: `Move to ${requestStatusLabel[s]}`,
                          onSelect: () => {
                            setRequestStatus(r.id, s)
                            toast(`"${r.title}" → ${requestStatusLabel[s]}`)
                          },
                        }))}
                    />
                  </Dropdown>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <RequestDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultProjectId={projectFilter !== 'all' ? projectFilter : undefined} />
    </PageTransition>
  )
}
