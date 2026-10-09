import { NavLink } from 'react-router-dom'
import { navItems } from './nav-config'
import { Avatar } from '../ui/avatar'
import { userById, CURRENT_USER_ID } from '../../mocks/users'
import { Badge } from '../ui/badge'
import { Tip } from '../ui/tooltip'

function SidebarContent() {
  const me = userById(CURRENT_USER_ID)!
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 pt-1 pb-5">
        <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight">WorkRelay</p>
          <p className="truncate text-[11px] text-muted">Qevora Studio</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1" aria-label="Main navigation">
        {navItems.map((item) =>
          item.phase2 ? (
            <Tip key={item.to} label="Phase 2 — coming later" side="right">
              <span className="nav-item w-full cursor-not-allowed opacity-55" aria-disabled="true">
                <item.icon size={17} />
                <span className="flex-1">{item.label}</span>
                <Badge tone="neutral">P2</Badge>
              </span>
            </Tip>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {({ isActive }) => (
                <span className="nav-item w-full" data-active={isActive}>
                  <item.icon size={17} />
                  {item.label}
                </span>
              )}
            </NavLink>
          )
        )}
      </nav>

      {/* User */}
      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-line bg-card2/70 p-2.5">
        <Avatar user={me} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{me.name}</p>
          <p className="truncate text-[10px] text-muted">{me.role}</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-label="Online" />
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="liquid-glass sticky top-4 hidden h-[calc(100vh-2rem)] w-60 shrink-0 flex-col p-3 lg:flex">
      <SidebarContent />
    </aside>
  )
}

/** Mobile drawer version */
export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      <button
        aria-label="Close navigation"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      />
      <aside className="liquid-glass fixed left-3 top-3 bottom-3 z-50 flex w-64 flex-col p-3 lg:hidden">
        <button
          onClick={onClose}
          className="btn btn-ghost btn-icon btn-sm mb-2 self-end"
          aria-label="Close navigation"
        >
          ✕
        </button>
        <SidebarContent />
      </aside>
    </>
  )
}
