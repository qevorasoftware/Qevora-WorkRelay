import { useNavigate } from 'react-router-dom'
import { Building2, ChevronRight } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { AvatarOf } from '../../components/ui/avatar'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { formatDate } from '../../lib/utils'

const portalTone = { active: 'success', invited: 'warning', off: 'neutral' } as const
const portalLabel = { active: 'Portal active', invited: 'Invited', off: 'No portal' }

export function ClientsPage() {
  const navigate = useNavigate()
  const { clients, projects } = useWorkspaceStore()

  return (
    <PageTransition>
      <PageHeader title="Clients" subtitle="Client list and client workspace access." />
      <div className="grid gap-3 md:grid-cols-2">
        {clients.map((c) => {
          const clientProjects = projects.filter((p) => p.clientId === c.id)
          const canOpen = c.portalStatus !== 'off'
          return (
            <Card
              key={c.id}
              className={`card-hover p-5 ${canOpen ? 'cursor-pointer' : ''}`}
              onClick={() => canOpen && navigate(`/portal/${c.id}`)}
              role={canOpen ? 'button' : undefined}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-muted" style={{ background: 'var(--fill)' }}>
                  <Building2 size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{c.company}</p>
                  <p className="text-[12px] text-muted">Client since {formatDate(c.since)}</p>
                </div>
                <Badge tone={portalTone[c.portalStatus]}>{portalLabel[c.portalStatus]}</Badge>
              </div>

              <div className="mt-3.5 flex items-center gap-2.5 rounded-xl p-2.5" style={{ background: 'var(--fill)' }}>
                <AvatarOf userId={c.contactUserId} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{c.name}</p>
                  <p className="truncate text-[11px] text-muted">Primary contact</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[12px] text-muted">
                <span>{clientProjects.length} project{clientProjects.length === 1 ? '' : 's'}</span>
                {canOpen ? (
                  <span className="inline-flex items-center gap-1 font-medium text-[var(--accent)]">
                    Open workspace <ChevronRight size={13} />
                  </span>
                ) : (
                  <span>Portal not set up</span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </PageTransition>
  )
}
