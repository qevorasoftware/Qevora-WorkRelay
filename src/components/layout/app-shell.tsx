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
    <div className="min-h-screen">
      <div className="flex w-full">
        <Sidebar />
        <SidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div className="min-w-0 flex-1 bg-[var(--bg)]">
          <Topbar />
          <main className="mx-auto w-full max-w-[1180px] px-5 py-7 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette />
      <Toaster />
    </div>
  )
}
