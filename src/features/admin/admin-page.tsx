import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ShieldCheck, UserPlus, MoreHorizontal, Search, Users,
  UserCheck, KeyRound, Ban, Trash2, Sparkles,
} from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Input, FieldError } from '../../components/ui/input'
import { SelectDropdown } from '../../components/ui/select-dropdown'
import { EmptyState } from '../../components/ui/empty-state'
import { Dropdown, DropdownTrigger, DropdownContent } from '../../components/ui/dropdown'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { Tabs } from '../../components/ui/tabs'
import { useAuthStore, type AuthUser, type Role } from '../auth/auth-store'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useUiStore } from '../../stores/ui-store'

const roleTone: Record<Role, 'accent' | 'info' | 'neutral'> = {
  Owner: 'accent', Admin: 'info', Member: 'neutral',
}
const statusTone = { active: 'success', invited: 'warning', suspended: 'danger' } as const

export function AdminPage() {
  const me = useAuthStore((s) => s.users.find((u) => u.id === s.sessionUserId))
  const authUsers = useAuthStore((s) => s.users)
  const adminSetRole = useAuthStore((s) => s.adminSetRole)
  const adminSetStatusById = useAuthStore((s) => s.adminSetStatusById)
  const adminInvite = useAuthStore((s) => s.adminInvite)
  const adminRemove = useAuthStore((s) => s.adminRemove)
  const workspaceUsers = useWorkspaceStore((s) => s.users)
  const toast = useUiStore((s) => s.toast)
  const reduce = useReducedMotion()

  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('Member')
  const [inviteError, setInviteError] = useState<string>()
  const [confirmRemove, setConfirmRemove] = useState<AuthUser | null>(null)

  /* Directory = everyone: workspace demo people + auth accounts */
  const directory = useMemo(() => {
    const authById = new Map(authUsers.map((u) => [u.id, u]))
    const rows: {
      key: string; name: string; email: string; role: Role; status: AuthUser['status']
      verified: boolean; twoFa: boolean; joined: string; hue: number; authId?: string
    }[] = []
    for (const w of workspaceUsers) {
      const a = authById.get(w.id)
      rows.push({
        key: w.id, name: w.name, email: w.email, hue: w.hue,
        role: a?.role ?? (w.role === 'Agency Owner' ? 'Owner' : w.role.includes('Client') ? 'Member' : 'Admin'),
        status: a?.status ?? (w.id === 'u1' ? 'active' : 'invited'),
        verified: a?.emailVerified ?? w.id === 'u1',
        twoFa: a?.twoFactorEnabled ?? false,
        joined: a?.createdAt ?? '2026-08-01',
        authId: a?.id,
      })
    }
    for (const a of authUsers) {
      if (!rows.some((r) => r.key === a.id)) {
        rows.push({
          key: a.id, name: `${a.firstName} ${a.lastName}`.trim() || a.email, email: a.email, hue: 210,
          role: a.role, status: a.status, verified: a.emailVerified, twoFa: a.twoFactorEnabled,
          joined: a.createdAt, authId: a.id,
        })
      }
    }
    return rows
  }, [authUsers, workspaceUsers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return directory.filter((r) => {
      const matchT = tab === 'all'
        || (tab === 'members' && r.role !== 'Member' && r.status !== 'invited')
        || (tab === 'invited' && r.status === 'invited')
        || (tab === 'suspended' && r.status === 'suspended')
      const matchQ = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      return matchT && matchQ
    })
  }, [directory, tab, query])

  const isOwner = me?.role === 'Owner'
  if (!me || !isOwner) {
    return (
      <PageTransition>
        <Card className="mx-auto max-w-md mt-10">
          <EmptyState
            icon={ShieldCheck}
            title="Admin access required"
            hint="This area is only for workspace Owners. Ask your administrator for access."
          />
        </Card>
      </PageTransition>
    )
  }

  const stats = [
    { label: 'Total people', value: directory.length, icon: Users, tone: 'accent' as const },
    { label: 'Active', value: directory.filter((r) => r.status === 'active').length, icon: UserCheck, tone: 'success' as const },
    { label: 'Pending invites', value: directory.filter((r) => r.status === 'invited').length, icon: UserPlus, tone: 'warning' as const },
    { label: '2FA enabled', value: directory.filter((r) => r.twoFa).length, icon: KeyRound, tone: 'info' as const },
  ]

  return (
    <PageTransition>
      <PageHeader
        title="Admin panel"
        subtitle="People, roles and workspace access — Owner tools."
        actions={<Button onClick={() => { setInviteOpen(true); setInviteEmail(''); setInviteError(undefined) }}><UserPlus size={15} /> Invite people</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduce ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : i * 0.05, duration: 0.35 }}
          >
            <Card className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] text-muted">{s.label}</p>
                <span className={`badge badge-${s.tone} h-7 w-7 items-center justify-center !rounded-lg !p-0`}><s.icon size={13} /></span>
              </div>
              <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 mt-5 flex flex-wrap items-center gap-3">
        <Tabs
          value={tab}
          onValueChange={setTab}
          items={[
            { value: 'all', label: 'Everyone', count: directory.length },
            { value: 'members', label: 'Team', count: directory.filter((r) => r.status === 'active').length },
            { value: 'invited', label: 'Invited', count: directory.filter((r) => r.status === 'invited').length },
            { value: 'suspended', label: 'Suspended', count: directory.filter((r) => r.status === 'suspended').length },
          ]}
        />
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people" aria-label="Search people" className="h-9 w-56 pl-8 text-[12.5px]" />
        </div>
      </div>

      {/* Directory */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No people match" hint="Try a different filter or search." />
        ) : (
          <div className="divide-y divide-[var(--hairline)] px-2 py-2">
            {filtered.map((r) => (
              <div key={r.key} className="flex flex-wrap items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--fill)]">
                <Avatar user={{ id: r.key, name: r.name, email: r.email, role: '', initials: r.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(), hue: r.hue }} size="md" />
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-[13.5px] font-medium">{r.name}</p>
                  <p className="truncate text-[12px] text-muted">{r.email}</p>
                </div>
                <Badge tone={roleTone[r.role]}>{r.role}</Badge>
                <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                <Badge tone={r.verified ? 'success' : 'warning'}>{r.verified ? 'Verified' : 'Unverified'}</Badge>
                <Badge tone={r.twoFa ? 'info' : 'neutral'}>{r.twoFa ? '2FA on' : '2FA off'}</Badge>
                <span className="hidden text-[11.5px] text-faint lg:inline">Joined {new Date(r.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>

                <Dropdown>
                  <DropdownTrigger asChild>
                    <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Manage ${r.name}`}>
                      <MoreHorizontal size={15} />
                    </button>
                  </DropdownTrigger>
                  <DropdownContent
                    items={[
                      {
                        label: `Make ${r.role === 'Admin' ? 'Member' : 'Admin'}`,
                        icon: ShieldCheck,
                        disabled: r.role === 'Owner',
                        onSelect: () => {
                          const next: Role = r.role === 'Admin' ? 'Member' : 'Admin'
                          if (r.authId) adminSetRole(r.authId, next)
                          toast(`${r.name} is now ${next}`)
                        },
                      },
                      {
                        label: r.status === 'suspended' ? 'Restore access' : 'Suspend access',
                        icon: Ban,
                        disabled: r.role === 'Owner',
                        onSelect: () => {
                          if (r.authId) adminSetStatusById(r.authId, r.status === 'suspended' ? 'active' : 'suspended')
                          toast(r.status === 'suspended' ? `${r.name} restored` : `${r.name} suspended`)
                        },
                      },
                      {
                        label: 'Reset password (email link)',
                        icon: KeyRound,
                        onSelect: () => toast(`Reset link sent to ${r.email} (demo)`, 'info'),
                      },
                      {
                        label: 'Remove from workspace',
                        icon: Trash2,
                        danger: true,
                        disabled: r.role === 'Owner',
                        onSelect: () => setConfirmRemove({ ...(r as unknown as AuthUser), id: r.authId ?? r.key, email: r.email, role: r.role }),
                      },
                    ]}
                  />
                </Dropdown>
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-faint">
        <Sparkles size={11} /> Demo admin — changes persist in your browser only
      </p>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={(o) => !o && setInviteOpen(false)}>
        <DialogContent title="Invite people" description="They'll get an email with a join link (demo shows it locally).">
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="inv-email">Email address</label>
              <Input id="inv-email" type="email" value={inviteEmail} onChange={(e) => { setInviteEmail(e.target.value); setInviteError(undefined) }} placeholder="teammate@studio.com" />
              <FieldError message={inviteError} />
            </div>
            <div>
              <label className="label" htmlFor="inv-role">Role</label>
              <SelectDropdown
                value={inviteRole}
                onChange={(v) => setInviteRole(v as Role)}
                options={[
                  { value: 'Member', label: 'Member — projects and chat' },
                  { value: 'Admin', label: 'Admin — manage people and settings' },
                ]}
                ariaLabel="Role"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) { setInviteError('Enter a valid email'); return }
                if (adminInvite(inviteEmail.trim(), inviteRole)) {
                  toast(`Invite sent to ${inviteEmail}`)
                  setInviteOpen(false)
                } else {
                  setInviteError('That email is already in the workspace')
                }
              }}>Send invite</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove confirm */}
      <Dialog open={!!confirmRemove} onOpenChange={(o) => !o && setConfirmRemove(null)}>
        {confirmRemove && (
          <DialogContent title={`Remove ${confirmRemove.email}?`} description="They lose access to all projects immediately. Their completed work stays in history.">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmRemove(null)}>Cancel</Button>
              <Button className="btn-danger" onClick={() => {
                adminRemove(confirmRemove.id)
                toast(`${confirmRemove.email} removed`)
                setConfirmRemove(null)
              }}>Remove</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageTransition>
  )
}
