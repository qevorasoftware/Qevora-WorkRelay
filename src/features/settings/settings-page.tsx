import { useRef, useState } from 'react'
import {
  AtSign, Bell, Monitor, Moon, Palette, ShieldCheck, Sun, UserRound,
  Laptop, Smartphone, KeyRound, Trash2, Camera,
} from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card, CardHeader } from '../../components/ui/card'
import { Segmented } from '../../components/ui/segmented'
import { Switch } from '../../components/ui/switch'
import { Input, Textarea, FieldError } from '../../components/ui/input'
import { SelectDropdown } from '../../components/ui/select-dropdown'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar } from '../../components/ui/avatar'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { Tabs } from '../../components/ui/tabs'
import { useThemeStore } from '../../stores/theme-store'
import { useUiStore } from '../../stores/ui-store'
import { useAuthStore, demoAuthenticatorCode, passwordSchema } from '../auth/auth-store'
import { AuthError, AuthSuccess } from '../auth/auth-layout'

const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Singapore']
const LANGUAGES = ['English', 'Gujarati', 'Hindi', 'Spanish', 'German']

function TwoFactorManager() {
  const me = useAuthStore((s) => s.users.find((u) => u.id === s.sessionUserId))
  const startTwoFa = useAuthStore((s) => s.startTwoFa)
  const confirmTwoFa = useAuthStore((s) => s.confirmTwoFa)
  const disableTwoFa = useAuthStore((s) => s.disableTwoFa)
  const toast = useUiStore((s) => s.toast)

  const [setup, setSetup] = useState<{ secret: string; backupCodes: string[] } | null>(null)
  const [otp, setOtp] = useState('')
  const [disableOpen, setDisableOpen] = useState(false)
  const [disableOtp, setDisableOtp] = useState('')
  const [error, setError] = useState<string>()
  const [copied, setCopied] = useState(false)
  const demoCode = demoAuthenticatorCode(me)

  if (!me) return null

  if (me.twoFactorEnabled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-xl p-3.5" style={{ background: 'var(--success-tint)' }}>
          <div>
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--success)]">
              <ShieldCheck size={14} /> Authenticator 2FA is on
            </p>
            <p className="mt-0.5 text-[12px] text-muted">A second factor is required at every sign-in.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => { setDisableOpen(true); setDisableOtp(''); setError(undefined) }}>
            Turn off
          </Button>
        </div>
        {me.backupCodes.length > 0 && (
          <div className="rounded-xl border border-line p-4">
            <p className="text-[12.5px] font-semibold">Backup codes ({me.backupCodes.length} left)</p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {me.backupCodes.map((c) => <span key={c} className="rounded-lg px-2 py-1 font-mono text-[11.5px]" style={{ background: 'var(--fill)' }}>{c}</span>)}
            </div>
          </div>
        )}

        <Dialog open={disableOpen} onOpenChange={(o) => !o && setDisableOpen(false)}>
          <DialogContent title="Turn off 2FA?" description="Enter the current 6-digit authenticator code to confirm. Your account will be protected by password only.">
            {demoCode && (
              <p className="mb-3 rounded-lg p-2.5 text-center font-mono text-lg font-bold tracking-[0.3em] text-[var(--accent)]" style={{ background: 'var(--accent-tint)' }}>{demoCode}</p>
            )}
            <Input inputMode="numeric" maxLength={6} value={disableOtp} onChange={(e) => { setDisableOtp(e.target.value.replace(/\D/g, '')); setError(undefined) }} className="text-center font-mono text-lg tracking-[0.3em]" placeholder="••••••" />
            <AuthError message={error} />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDisableOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                if (disableTwoFa(disableOtp)) { setDisableOpen(false); toast('2FA turned off') }
                else setError('That code didn\'t match.')
              }}>Turn off 2FA</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-xl p-3.5" style={{ background: 'var(--warning-tint)' }}>
        <div>
          <p className="text-[13px] font-semibold text-[var(--warning)]">2FA is off</p>
          <p className="mt-0.5 text-[12px] text-muted">Your account is protected by password only.</p>
        </div>
        <Button size="sm" onClick={() => { const s = startTwoFa(); if (s) { setSetup(s); setOtp(''); setError(undefined) } }}>
          Enable 2FA
        </Button>
      </div>

      <Dialog open={!!setup} onOpenChange={(o) => !o && setSetup(null)}>
        <DialogContent title="Set up authenticator" description="Scan with iCloud Keychain, Google Authenticator, 1Password or Authy.">
          {setup && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-xl border border-line bg-white p-3">
                  <DemoQr secret={setup.secret} />
                </div>
              </div>
              <button
                className="flex w-full items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-left"
                onClick={() => { navigator.clipboard?.writeText(setup.secret); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              >
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-faint">Manual setup key</span>
                  <span className="block truncate font-mono text-[13px]">{setup.secret}</span>
                </span>
                <span className="shrink-0 text-[11.5px] font-medium text-[var(--accent)]">{copied ? 'Copied ✓' : 'Copy'}</span>
              </button>
              {demoCode && (
                <p className="rounded-lg p-2.5 text-center font-mono text-lg font-bold tracking-[0.3em] text-[var(--accent)]" style={{ background: 'var(--accent-tint)' }}>{demoCode}</p>
              )}
              <div>
                <label className="label">Enter the 6-digit code</label>
                <Input inputMode="numeric" maxLength={6} value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(undefined) }} className="text-center font-mono text-lg tracking-[0.3em]" placeholder="••••••" />
                <FieldError message={error} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setSetup(null)}>Cancel</Button>
                <Button onClick={() => {
                  if (confirmTwoFa(otp)) { setSetup(null); toast('2FA enabled — backup codes saved below') }
                  else setError('That code didn\'t match.')
                }}>Verify and enable</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DemoQr({ secret }: { secret: string }) {
  const size = 21
  const cells = (() => {
    const out: boolean[] = []
    let seed = [...secret].reduce((a, c) => a + c.charCodeAt(0), 7)
    for (let i = 0; i < size * size; i++) {
      seed = (seed * 31 + 17) % 997
      out.push(seed % 2 === 0)
    }
    return out.map((v, i) => {
      const r = Math.floor(i / size), c = i % size
      const inFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7)
      if (!inFinder) return v
      const lr = r < 7 ? r : r - (size - 7)
      const lc = c < 7 ? c : c - (size - 7)
      const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6
      const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
      return edge || core
    })
  })()
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-36 w-36" role="img" aria-label="Authenticator QR (demo)">
      {cells.map((on, i) => (on ? <rect key={i} x={i % size} y={Math.floor(i / size)} width="1" height="1" fill="#1D1D1F" /> : null))}
    </svg>
  )
}

export function SettingsPage() {
  const { mode, setMode, density, setDensity } = useThemeStore()
  const toast = useUiStore((s) => s.toast)
  const me = useAuthStore((s) => s.users.find((u) => u.id === s.sessionUserId))
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const changePassword = useAuthStore((s) => s.changePassword)
  const sessions = useAuthStore((s) => s.sessions)
  const revokeSession = useAuthStore((s) => s.revokeSession)

  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState(() => ({
    firstName: me?.firstName ?? '', lastName: me?.lastName ?? '', email: me?.email ?? '',
    phone: me?.phone ?? '', jobTitle: me?.jobTitle ?? '', department: me?.department ?? '',
    location: me?.location ?? '', timezone: me?.timezone ?? 'Asia/Kolkata', language: me?.language ?? 'English',
    bio: me?.bio ?? '',
  }))
  const [avatar, setAvatar] = useState(me?.avatarDataUrl)
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState<string>()
  const [pwOk, setPwOk] = useState<string>()
  const [prefs, setPrefs] = useState({ approvals: true, mentions: true, digest: false })
  const fileRef = useRef<HTMLInputElement>(null)

  if (!me) return null

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (form.firstName.trim().length < 2) errors.firstName = 'First name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email'
    setProfileErrors(errors)
    if (Object.keys(errors).length) return
    updateProfile(form)
    toast('Profile saved')
  }

  const onAvatar = (f: File | undefined) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { toast('Pick an image file', 'error'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result)
      setAvatar(url)
      updateProfile({ avatarDataUrl: url })
      toast('Avatar updated')
    }
    reader.readAsDataURL(f)
  }

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(undefined); setPwOk(undefined)
    if (pw.next !== pw.confirm) { setPwError('New passwords don\'t match'); return }
    const check = passwordSchema.safeParse(pw.next)
    if (!check.success) { setPwError(check.error.issues[0].message); return }
    if (changePassword(pw.current, pw.next)) {
      setPwOk('Password changed.'); setPw({ current: '', next: '', confirm: '' })
    } else {
      setPwError('Current password is incorrect.')
    }
  }

  return (
    <PageTransition>
      <PageHeader title="Settings" subtitle="Manage your profile, appearance, notifications and account security." />

      <div className="mb-5">
        <Tabs
          value={tab}
          onValueChange={setTab}
          items={[
            { value: 'profile', label: 'Profile' },
            { value: 'appearance', label: 'Appearance' },
            { value: 'notifications', label: 'Notifications' },
            { value: 'security', label: 'Security' },
          ]}
        />
      </div>

      {/* ============ PROFILE — all fields ============ */}
      {tab === 'profile' && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Personal information" />
            <form onSubmit={saveProfile} className="space-y-4 px-5 pb-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="pf-fn">First name</label>
                  <Input id="pf-fn" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} aria-invalid={!!profileErrors.firstName} />
                  <FieldError message={profileErrors.firstName} />
                </div>
                <div>
                  <label className="label" htmlFor="pf-ln">Last name</label>
                  <Input id="pf-ln" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="pf-email">Email</label>
                  <Input id="pf-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} aria-invalid={!!profileErrors.email} />
                  <FieldError message={profileErrors.email} />
                </div>
                <div>
                  <label className="label" htmlFor="pf-phone">Phone</label>
                  <Input id="pf-phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="pf-title">Job title</label>
                  <Input id="pf-title" value={form.jobTitle} onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))} />
                </div>
                <div>
                  <label className="label" htmlFor="pf-dept">Department</label>
                  <Input id="pf-dept" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label" htmlFor="pf-loc">Location</label>
                  <Input id="pf-loc" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Surat, IN" />
                </div>
                <div>
                  <label className="label" htmlFor="pf-tz">Timezone</label>
                  <SelectDropdown
                    value={form.timezone}
                    onChange={(v) => setForm((f) => ({ ...f, timezone: v }))}
                    options={TIMEZONES.map((t) => ({ value: t, label: t }))}
                    ariaLabel="Timezone"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="pf-lang">Language</label>
                  <SelectDropdown
                    value={form.language}
                    onChange={(v) => setForm((f) => ({ ...f, language: v }))}
                    options={LANGUAGES.map((l) => ({ value: l, label: l }))}
                    ariaLabel="Language"
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="pf-bio">Bio</label>
                <Textarea id="pf-bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="A line about you…" />
              </div>
              <div className="flex justify-end">
                <Button type="submit"><UserRound size={14} /> Save profile</Button>
              </div>
            </form>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader title="Avatar" />
              <div className="flex flex-col items-center px-5 pb-5 text-center">
                <div className="relative">
                  {avatar ? (
                    <img src={avatar} alt="Your avatar" className="h-20 w-20 rounded-full border border-line object-cover" />
                  ) : (
                    <Avatar
                    user={{
                      id: me.id,
                      name: `${me.firstName} ${me.lastName}`.trim() || me.email,
                      email: me.email,
                      role: me.jobTitle,
                      initials: `${me.firstName[0] ?? ''}${me.lastName[0] ?? ''}`.toUpperCase() || 'U',
                      hue: 245,
                    }}
                    size="lg"
                  />
                  )}
                  <button
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-[var(--surface)] text-[var(--accent)] shadow-sm transition-transform hover:scale-110"
                    aria-label="Change avatar"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Camera size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-hidden="true" onChange={(e) => { onAvatar(e.target.files?.[0]); e.target.value = '' }} />
                </div>
                <p className="mt-3 text-[12px] text-muted">PNG or JPG, square works best. Stored locally in this demo.</p>
              </div>
            </Card>

            <Card>
              <CardHeader title="Account" />
              <div className="space-y-2.5 px-5 pb-5 text-[12.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Role</span>
                  <Badge tone={me.role === 'Owner' ? 'accent' : 'neutral'}>{me.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Status</span>
                  <Badge tone={me.status === 'active' ? 'success' : 'warning'}>{me.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Email verified</span>
                  <Badge tone="success">Yes</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Member since</span>
                  <span className="font-medium">{new Date(me.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                {me.role !== 'Owner' && (
                  <Button variant="ghost" size="sm" className="mt-2 w-full" style={{ color: 'var(--danger)' }} onClick={() => toast('Account deletion arrives with the backend phase', 'info')}>
                    <Trash2 size={13} /> Delete account
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ============ APPEARANCE ============ */}
      {tab === 'appearance' && (
        <Card>
          <CardHeader title="Appearance" />
          <div className="space-y-5 px-5 pb-5">
            <div>
              <p className="label"><Palette size={12} className="mr-1 inline" /> Theme</p>
              <Segmented
                label="Theme mode"
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ]}
              />
              <p className="mt-2 text-[12px] text-muted">System follows your OS preference. Your choice is remembered on this device.</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium">Compact density</p>
                <p className="text-[12px] text-muted">Tighter spacing for smaller screens.</p>
              </div>
              <Switch label="Compact density" checked={density === 'compact'} onCheckedChange={(v) => setDensity(v ? 'compact' : 'comfortable')} />
            </div>
          </div>
        </Card>
      )}

      {/* ============ NOTIFICATIONS ============ */}
      {tab === 'notifications' && (
        <Card>
          <CardHeader title="Notification preferences" />
          <div className="space-y-4 px-5 pb-5">
            {([
              ['approvals', 'Approval activity', 'When something needs your review', AtSign],
              ['mentions', 'Mentions', 'When someone @mentions you', Bell],
              ['digest', 'Weekly digest', 'A Monday summary of open items', Bell],
            ] as const).map(([key, title, hint, Icon]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-muted" style={{ background: 'var(--fill)' }}>
                    <Icon size={14} />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium">{title}</p>
                    <p className="text-[12px] text-muted">{hint}</p>
                  </div>
                </div>
                <Switch label={title} checked={prefs[key]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ============ SECURITY ============ */}
      {tab === 'security' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader title="Change password" />
            <form onSubmit={submitPassword} className="space-y-4 px-5 pb-5" noValidate>
              <div>
                <label className="label" htmlFor="pw-cur">Current password</label>
                <Input id="pw-cur" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
              </div>
              <div>
                <label className="label" htmlFor="pw-new">New password</label>
                <Input id="pw-new" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
              </div>
              <div>
                <label className="label" htmlFor="pw-con">Confirm new password</label>
                <Input id="pw-con" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
              </div>
              <AuthError message={pwError} />
              <AuthSuccess message={pwOk} />
              <Button type="submit" size="sm"><KeyRound size={13} /> Update password</Button>
            </form>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader title="Two-factor authentication" />
              <div className="px-5 pb-5">
                <TwoFactorManager />
              </div>
            </Card>

            <Card>
              <CardHeader title="Active sessions" />
              <div className="divide-y divide-[var(--hairline)] px-5 pb-5">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 py-2.5">
                    {s.label.includes('iPhone') ? <Smartphone size={15} className="shrink-0 text-muted" /> : <Laptop size={15} className="shrink-0 text-muted" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium">{s.label} {s.current && <Badge tone="success" className="ml-1">This device</Badge>}</p>
                      <p className="text-[11px] text-faint">Active {s.lastActive}</p>
                    </div>
                    {!s.current && (
                      <Button variant="ghost" size="sm" onClick={() => { revokeSession(s.id); toast('Session revoked') }}>Revoke</Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}


    </PageTransition>
  )
}
