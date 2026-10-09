import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar, SidebarDrawer } from './sidebar'
import { Topbar } from './topbar'
import { CommandPalette } from './command-palette'
import { Toaster } from '../feedback/toaster'
import { useUiStore } from '../../stores/ui-store'

export function AppShell() {
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const navigate = useNavigate()
  void navigate

  return (
    <div className="mesh min-h-screen">
      <div className="mx-auto flex w-full max-w-[1440px] gap-0 px-4">
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
