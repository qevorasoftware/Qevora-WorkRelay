import { useNavigate } from 'react-router-dom'
import { Building2, ExternalLink } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { AvatarOf } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { formatDate } from '../../lib/utils'

const portalTone = { active: 'success', invited: 'warning', off: 'neutral' } as const
const portalLabel = { active: 'Portal active', invited: 'Invited', off: 'No portal' }

export function ClientsPage() {
  const navigate = useNavigate()
  const { clients, projects } = useWorkspaceStore()

  return (
    <PageTransition>
      <PageHeader
        title="Clients"
        subtitle="Client list and client workspace access."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {clients.map((c) => {
          const clientProjects = projects.filter((p) => p.clientId === c.id)
          return (
            <Card key={c.id} className="card-hover flex flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
                  <Building2 size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.company}</p>
                  <p className="text-xs text-muted">Client since {formatDate(c.since)}</p>
                </div>
                <Badge tone={portalTone[c.portalStatus]}>{portalLabel[c.portalStatus]}</Badge>
              </div>

              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-line bg-card2/60 p-3">
                <AvatarOf userId={c.contactUserId} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{c.name}</p>
                  <p className="truncate text-[11px] text-muted">Primary contact</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>{clientProjects.length} project{clientProjects.length === 1 ? '' : 's'}</span>
                <span>{clientProjects[0]?.name.split(' — ')[1] ?? '—'}</span>
              </div>

              <div className="mt-4">
                <Button size="sm" className="w-full" disabled={c.portalStatus === 'off'} onClick={() => navigate(`/portal/${c.id}`)}>
                  <ExternalLink size={14} />
                  {c.portalStatus === 'off' ? 'Portal not set up' : 'Open client workspace'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </PageTransition>
  )
}
