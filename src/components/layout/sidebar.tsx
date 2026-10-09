import { NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
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
      <div className="flex items-center gap-3 px-2 pt-1 pb-6">
        <span className="brand-tile">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight">WorkRelay</p>
          <p className="truncate text-[11px] text-muted">Qevora Studio</p>
        </div>
      </div>

      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
        Workspace
      </p>

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

      {/* Pilot card */}
      <div className="mx-1 mb-2 rounded-2xl border border-line bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_14%,transparent)] to-transparent p-3">
        <p className="flex items-center gap-1.5 text-xs font-bold">
          <Sparkles size={13} className="text-[var(--accent)]" />
          Pilot v0.1
        </p>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          Validation phase — your feedback shapes the roadmap.
        </p>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-card2/70 p-2.5">
        <Avatar user={me} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{me.name}</p>
          <p className="truncate text-[10px] text-muted">{me.role}</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" aria-label="Online" />
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
