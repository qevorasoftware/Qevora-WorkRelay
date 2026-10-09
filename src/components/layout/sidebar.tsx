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
      <div className="flex items-center gap-2.5 px-1.5 pt-1 pb-5">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-7 w-7 rounded-[7px]" />
        <p className="text-[15px] font-semibold tracking-tight">WorkRelay</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-[2px]" aria-label="Main navigation">
        {navItems.map((item) =>
          item.phase2 ? (
            <Tip key={item.to} label="Coming in Phase 2" side="right">
              <span className="nav-item w-full cursor-default text-[var(--text-3)]" aria-disabled="true">
                <item.icon size={16} />
                <span className="flex-1">{item.label}</span>
                <Badge tone="neutral">Soon</Badge>
              </span>
            </Tip>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {({ isActive }) => (
                <span className="nav-item w-full" data-active={isActive}>
                  <item.icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                  {item.label}
                </span>
              )}
            </NavLink>
          )
        )}
      </nav>

      {/* User */}
      <div className="mt-4 flex items-center gap-2.5 rounded-lg p-2" style={{ background: 'var(--fill)' }}>
        <Avatar user={me} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold">{me.name}</p>
          <p className="truncate text-[11px] text-muted">{me.role}</p>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-label="Online" />
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="liquid-glass sticky top-3 ml-3 hidden h-[calc(100vh-1.5rem)] w-[224px] shrink-0 flex-col rounded-[24px] px-3 pb-4 pt-5 lg:flex">
      <SidebarContent />
    </aside>
  )
}

export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      <button
        aria-label="Close navigation"
        className="fixed inset-0 z-40 bg-black/25 lg:hidden"
        onClick={onClose}
      />
      <aside className="liquid-glass fixed left-3 top-3 bottom-3 z-50 flex w-[248px] flex-col rounded-[24px] px-3 pb-4 pt-5 lg:hidden">
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
