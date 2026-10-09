import { useMemo, useState } from 'react'
import { CheckCircle2, History, RotateCcw } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge, approvalStatusLabel, approvalStatusTone } from '../../components/ui/badge'
import { AvatarOf } from '../../components/ui/avatar'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { Tabs } from '../../components/ui/tabs'
import { ApprovalDialog } from './approval-dialog'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { projectById } from '../../mocks/projects'
import { relativeTime } from '../../lib/utils'
import type { Approval } from '../../types'

export function ApprovalsPage() {
  const { approvals, users } = useWorkspaceStore()
  const [filter, setFilter] = useState('all')
  const [dialogApproval, setDialogApproval] = useState<Approval | null>(null)
  const [decision, setDecision] = useState<'approved' | 'changes-requested'>('approved')

  const filtered = useMemo(
    () => approvals.filter((a) => filter === 'all' || a.status === filter),
    [approvals, filter]
  )
  const countFor = (s: string) => (s === 'all' ? approvals.length : approvals.filter((a) => a.status === s).length)

  const openDialog = (a: Approval, d: 'approved' | 'changes-requested') => {
    setDialogApproval(a)
    setDecision(d)
  }

  return (
    <PageTransition>
      <PageHeader
        title="Approvals"
        subtitle="Design reviews and sign-offs — the workflow that unblocks delivery."
      />

      <div className="mb-4">
        <Tabs
          value={filter}
          onValueChange={setFilter}
          items={[
            { value: 'all', label: 'All', count: countFor('all') },
            { value: 'pending', label: 'Pending', count: countFor('pending') },
            { value: 'changes-requested', label: 'Changes requested', count: countFor('changes-requested') },
            { value: 'approved', label: 'Approved', count: countFor('approved') },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={CheckCircle2} title="Nothing here" hint="No approvals match this filter." />
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((a) => {
            const project = projectById(a.projectId)
            const reviewer = users.find((u) => u.id === a.reviewerId)
            return (
              <Card key={a.id} className="flex flex-col p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold">
                      {a.artifact} <span className="badge badge-accent ml-1 align-middle">{a.version}</span>
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">{project?.name}</p>
                  </div>
                  <Badge tone={approvalStatusTone[a.status]}>{approvalStatusLabel[a.status]}</Badge>
                </div>

                <div className="mt-2.5 flex items-center gap-2 text-[12px] text-muted">
                  <AvatarOf userId={a.reviewerId} size="xs" />
                  Reviewer: <span className="font-medium text-[var(--text)]">{reviewer?.name}</span>
                </div>

                <div className="mt-4 space-y-0 border-l-2 border-[var(--hairline)] pl-4">
                  {a.history.map((h, i) => {
                    const by = users.find((u) => u.id === h.byUserId)
                    const color =
                      h.action === 'approved' ? 'var(--success)'
                      : h.action === 'changes-requested' ? 'var(--danger)'
                      : 'var(--accent)'
                    return (
                      <div key={i} className="relative pb-3 text-[12px]">
                        <span className="absolute -left-[1.35rem] top-1 h-2 w-2 rounded-full border-2 border-[var(--surface)]" style={{ background: color }} />
                        <p>
                          <span className="font-medium capitalize" style={{ color }}>
                            {h.action.replace('-', ' ')}
                          </span>{' '}
                          <span className="text-muted">{h.version} · {by?.name} · {relativeTime(h.at)}</span>
                        </p>
                        {h.comment && <p className="mt-1 rounded-lg px-2.5 py-1.5 italic text-muted" style={{ background: 'var(--fill)' }}>"{h.comment}"</p>}
                      </div>
                    )
                  })}
                </div>

                {a.status !== 'approved' ? (
                  <div className="mt-auto flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => openDialog(a, 'approved')}>
                      <CheckCircle2 size={13} /> Approve
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => openDialog(a, 'changes-requested')}>
                      <RotateCcw size={13} /> Request changes
                    </Button>
                  </div>
                ) : (
                  <p className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[12px] font-medium text-[var(--success)]">
                    <History size={12} /> Decision recorded in history
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <ApprovalDialog
        approval={dialogApproval}
        decision={decision}
        onOpenChange={(open) => !open && setDialogApproval(null)}
      />
    </PageTransition>
  )
}
