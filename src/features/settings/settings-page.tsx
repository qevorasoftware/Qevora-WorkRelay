import { useState } from 'react'
import { Monitor, Moon, Sun, UserRound } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card, CardHeader } from '../../components/ui/card'
import { Segmented } from '../../components/ui/segmented'
import { Switch } from '../../components/ui/switch'
import { Input } from '../../components/ui/input'
import { Avatar } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { useThemeStore } from '../../stores/theme-store'
import { useUiStore } from '../../stores/ui-store'
import { CURRENT_USER_ID, userById } from '../../mocks/users'

export function SettingsPage() {
  const { mode, setMode, density, setDensity } = useThemeStore()
  const toast = useUiStore((s) => s.toast)
  const me = userById(CURRENT_USER_ID)!
  const [name, setName] = useState(me.name)
  const [email, setEmail] = useState(me.email)
  const [prefs, setPrefs] = useState({ approvals: true, mentions: true, digest: false })

  return (
    <PageTransition>
      <PageHeader title="Settings" subtitle="Profile, workspace and appearance preferences (demo)." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Appearance" />
          <div className="space-y-5 px-5 pb-5">
            <div>
              <p className="label">Theme</p>
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
              <Switch
                label="Compact density"
                checked={density === 'compact'}
                onCheckedChange={(v) => setDensity(v ? 'compact' : 'comfortable')}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium">Reduced motion</p>
                <p className="text-[12px] text-muted">Follows your OS accessibility setting automatically.</p>
              </div>
              <Badge tone="success">Auto</Badge>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Profile" />
            <form
              className="space-y-4 px-5 pb-5"
              onSubmit={(e) => { e.preventDefault(); toast('Profile saved (demo)') }}
            >
              <div className="flex items-center gap-3">
                <Avatar user={me} size="lg" />
                <div className="text-[12px] text-muted">
                  <p className="font-medium text-[var(--text)]">{me.role}</p>
                  <p>Avatar colors come from your profile.</p>
                </div>
              </div>
              <div>
                <label className="label" htmlFor="st-name">Name</label>
                <Input id="st-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="st-email">Email</label>
                <Input id="st-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" size="sm"><UserRound size={13} /> Save profile</Button>
            </form>
          </Card>

          <Card>
            <CardHeader title="Notification preferences" />
            <div className="space-y-4 px-5 pb-5">
              {([
                ['approvals', 'Approval activity', 'When something needs your review'],
                ['mentions', 'Mentions', 'When someone @mentions you'],
                ['digest', 'Weekly digest', 'A Monday summary of open items'],
              ] as const).map(([key, title, hint]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium">{title}</p>
                    <p className="text-[12px] text-muted">{hint}</p>
                  </div>
                  <Switch
                    label={title}
                    checked={prefs[key]}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
