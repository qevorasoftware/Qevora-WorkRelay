import { Outlet } from 'react-router-dom'
import { Sidebar, SidebarDrawer } from './sidebar'
import { Topbar } from './topbar'
import { CommandPalette } from './command-palette'
import { Toaster } from '../feedback/toaster'
import { useUiStore } from '../../stores/ui-store'

export function AppShell() {
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)

  return (
    <div className="mesh min-h-screen">
      {/* Full-bleed layout — no max-width cap; space is used edge to edge */}
      <div className="flex w-full px-4 xl:px-6">
        <Sidebar />
        <SidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="pb-16">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette />
      <Toaster />
    </div>
  )
}
