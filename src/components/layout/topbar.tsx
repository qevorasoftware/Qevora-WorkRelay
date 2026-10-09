import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Monitor, Moon, Search, Sun } from 'lucide-react'
import { routeTitles } from './nav-config'
import { NotificationsPopover } from './notifications-popover'
import { Segmented } from '../ui/segmented'
import { useThemeStore, resolveTheme } from '../../stores/theme-store'
import { useUiStore } from '../../stores/ui-store'
import { Dropdown, DropdownTrigger, DropdownContent } from '../ui/dropdown'
import { Avatar } from '../ui/avatar'
import { CURRENT_USER_ID, userById } from '../../mocks/users'
import { Tip } from '../ui/tooltip'

export function Topbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const setPaletteOpen = useUiStore((s) => s.setPaletteOpen)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)
  const me = userById(CURRENT_USER_ID)!
  const base = '/' + (pathname.split('/')[1] ?? '')
  const title = routeTitles[base] ?? routeTitles[pathname] ?? 'WorkRelay'

  return (
    <header className="liquid-glass sticky top-4 z-30 mb-6 flex h-14 items-center gap-2 rounded-2xl px-3">
      <button
        className="btn btn-ghost btn-icon lg:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu size={18} />
      </button>

      <h2 className="ml-1 text-sm font-bold tracking-tight">{title}</h2>

      <div className="flex-1" />

      <Tip label="Search (⌘K)">
        <button
          className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-card2/60 px-3 text-xs text-muted transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:flex"
          onClick={() => setPaletteOpen(true)}
        >
          <Search size={14} />
          Search…
          <span className="kbd ml-6">⌘K</span>
        </button>
      </Tip>

      <button
        className="btn btn-ghost btn-icon sm:hidden"
        aria-label="Search"
        onClick={() => setPaletteOpen(true)}
      >
        <Search size={18} />
      </button>

      <Segmented
        label="Theme"
        value={mode}
        onChange={(m) => setMode(m as typeof mode)}
        options={[
          { value: 'light', label: '', icon: Sun },
          { value: 'dark', label: '', icon: Moon },
          { value: 'system', label: '', icon: Monitor },
        ]}
      />
      <span className="sr-only">Current resolved theme: {resolveTheme(mode)}</span>

      <NotificationsPopover />

      <Dropdown>
        <DropdownTrigger asChild>
          <button className="btn btn-ghost btn-icon rounded-full" aria-label="Account menu">
            <Avatar user={me} size="sm" />
          </button>
        </DropdownTrigger>
        <DropdownContent
          items={[
            { label: 'Profile & settings', onSelect: () => navigate('/settings') },
            { label: 'View client portal', onSelect: () => navigate('/portal') },
            { label: 'Sign out', danger: true, onSelect: () => useUiStore.getState().toast('Demo only — no auth in frontend MVP', 'info') },
          ]}
        />
      </Dropdown>
    </header>
  )
}
