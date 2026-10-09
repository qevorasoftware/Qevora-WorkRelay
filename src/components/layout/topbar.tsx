import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Monitor, Moon, Search, Sun } from 'lucide-react'
import { routeTitles } from './nav-config'
import { NotificationsPopover } from './notifications-popover'
import { Segmented } from '../ui/segmented'
import { useThemeStore } from '../../stores/theme-store'
import { useUiStore } from '../../stores/ui-store'
import { Dropdown, DropdownTrigger, DropdownContent } from '../ui/dropdown'
import { Avatar } from '../ui/avatar'
import { CURRENT_USER_ID, userById } from '../../mocks/users'

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
    <header className="liquid-glass sticky top-3 z-30 mx-4 flex h-[54px] items-center gap-2 rounded-full px-4 lg:mx-6 lg:px-5">
      <button
        className="btn btn-ghost btn-icon btn-sm lg:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu size={17} />
      </button>

      <h2 className="text-[13.5px] font-semibold tracking-tight">{title}</h2>
      <div className="flex-1" />

      <button
        className="hidden h-8 items-center gap-2 rounded-lg px-2.5 text-[12.5px] text-muted transition-colors hover:text-[var(--text)] sm:flex"
        style={{ background: 'var(--fill)' }}
        onClick={() => setPaletteOpen(true)}
      >
        <Search size={13} />
        Search
        <span className="kbd ml-4">⌘K</span>
      </button>

      <button
        className="btn btn-ghost btn-icon btn-sm sm:hidden"
        aria-label="Search"
        onClick={() => setPaletteOpen(true)}
      >
        <Search size={16} />
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

      <NotificationsPopover />

      <Dropdown>
        <DropdownTrigger asChild>
          <button className="btn btn-ghost btn-icon btn-sm rounded-full" aria-label="Account menu">
            <Avatar user={me} size="sm" />
          </button>
        </DropdownTrigger>
        <DropdownContent
          items={[
            { label: 'Profile & settings', onSelect: () => navigate('/settings') },
            { label: 'View client portal', onSelect: () => navigate('/portal') },
            { label: 'Sign out', danger: true, onSelect: () => useUiStore.getState().toast('Demo — no auth in the frontend MVP', 'info') },
          ]}
        />
      </Dropdown>
    </header>
  )
}
