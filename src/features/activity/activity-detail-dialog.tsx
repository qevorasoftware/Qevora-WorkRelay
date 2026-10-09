import {
  FileText, FolderKanban, Inbox, MessageSquare, File, MapPin, Wifi,
  MonitorSmartphone, Globe2, ShieldCheck, Quote,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { AvatarOf } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useNavigate } from 'react-router-dom'
import type { ActivityItem } from '../../types'

const entityIcon: Record<ActivityItem['detail']['entity'], LucideIcon> = {
  request: Inbox,
  approval: FileText,
  conversation: MessageSquare,
  file: File,
  project: FolderKanban,
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="w-24 shrink-0 pt-px text-[11.5px] font-medium uppercase tracking-wide text-faint">{label}</span>
      <span className="min-w-0 flex-1 text-right text-[12.5px] font-medium">{children}</span>
    </div>
  )
}

export function ActivityDetailDialog({ item, onClose }: {
  item: ActivityItem | null
  onClose: () => void
}) {
  const navigate = useNavigate()
  const { users, clients } = useWorkspaceStore()
  if (!item) return null

  const actor = users.find((u) => u.id === item.actorId)
  const EntityIcon = entityIcon[item.detail.entity]
  const when = new Date(item.at).toLocaleString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })

  const goTo = () => {
    onClose()
    const ref = item.detail.entityRef
    if (item.detail.entity === 'request') navigate('/requests')
    else if (item.detail.entity === 'approval') navigate('/approvals')
    else if (item.detail.entity === 'file') navigate('/files')
    else if (item.detail.entity === 'conversation') navigate('/chat')
    else if (ref) navigate(`/projects/${ref}`)
  }

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[min(94vw,600px)]" title="Activity detail" description="Complete record of this change — every field, who, when and from where.">
        <div className="space-y-4">
          {/* Hero */}
          <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: 'var(--fill)' }}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[var(--accent)]" style={{ background: 'var(--accent-tint)' }}>
              <EntityIcon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-snug">
                {item.detail.entityLabel}
                {item.detail.version && <span className="badge badge-accent ml-1.5 align-middle">{item.detail.version}</span>}
              </p>
              <p className="mt-0.5 text-[12px] text-muted capitalize">{item.action}</p>
            </div>
            <Badge tone="neutral">{item.kind}</Badge>
          </div>

          {/* Who */}
          <section className="rounded-2xl border border-line p-4">
            <p className="mb-2 text-[12px] font-semibold">Who did it</p>
            <div className="flex items-center gap-3">
              <AvatarOf userId={item.actorId} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{actor?.name}</p>
                <p className="truncate text-[11.5px] text-muted">{actor?.role} · {actor?.email}</p>
              </div>
              <Badge tone="success" className="shrink-0"><ShieldCheck size={10} /> Verified</Badge>
            </div>
          </section>

          {/* What changed — full diff */}
          <section className="rounded-2xl border border-line p-4">
            <p className="mb-1 text-[12px] font-semibold">What changed ({item.detail.changes.length} {item.detail.changes.length === 1 ? 'field' : 'fields'})</p>
            <div className="divide-y divide-[var(--hairline)]">
              {item.detail.changes.map((c, i) => (
                <div key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 text-[12.5px]">
                  <span className="w-36 shrink-0 font-medium text-muted">{c.field}</span>
                  <span className="max-w-[180px] truncate rounded-md px-1.5 py-0.5 line-through opacity-60" style={{ background: 'var(--danger-tint)', color: 'var(--danger)' }}>
                    {c.from === '—' ? 'empty' : c.from}
                  </span>
                  <span className="text-faint">→</span>
                  <span className="max-w-[220px] truncate rounded-md px-1.5 py-0.5 font-medium" style={{ background: 'var(--success-tint)', color: 'var(--success)' }}>
                    {c.to}
                  </span>
                </div>
              ))}
            </div>
            {item.detail.comment && (
              <div className="mt-3 flex gap-2 rounded-xl p-3" style={{ background: 'var(--fill)' }}>
                <Quote size={13} className="mt-0.5 shrink-0 text-faint" />
                <p className="text-[12.5px] italic leading-relaxed text-muted">{item.detail.comment}</p>
              </div>
            )}
          </section>

          {/* Context */}
          <section className="rounded-2xl border border-line px-4 py-2">
            <Row label="When">{when}</Row>
            {item.detail.projectName && <Row label="Project">{item.detail.projectName}</Row>}
            {item.detail.clientName && <Row label="Client">{item.detail.clientName}</Row>}
            <Row label="Session"><span className="font-mono text-[11.5px]">{item.detail.sessionRef}</span></Row>
          </section>

          {/* Session / device */}
          <section className="grid grid-cols-2 gap-2.5">
            {[
              { icon: MonitorSmartphone, label: 'Device', value: item.detail.device },
              { icon: Globe2, label: 'Browser', value: item.detail.browser },
              { icon: Wifi, label: 'IP address', value: item.detail.ip },
              { icon: MapPin, label: 'Location', value: item.detail.location },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-line p-3">
                <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-faint">
                  <m.icon size={11} /> {m.label}
                </p>
                <p className="mt-1 truncate text-[12.5px] font-medium" title={m.value}>{m.value}</p>
              </div>
            ))}
          </section>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button onClick={goTo}>Open related {item.detail.entity}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
