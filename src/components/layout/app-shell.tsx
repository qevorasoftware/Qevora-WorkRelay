import { Outlet } from 'react-router-dom'
import { Sidebar, SidebarDrawer } from './sidebar'
import { Topbar } from './topbar'
import { CommandPalette } from './command-palette'
import { Toaster } from '../feedback/toaster'
import { useUiStore } from '../../stores/ui-store'
import { useGlassPointer } from '../../lib/use-glass-pointer'

export function AppShell() {
  useGlassPointer()
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)

  return (
    <div className="ambient min-h-screen">
      <div className="flex w-full">
        <Sidebar />
        <SidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div className="min-w-0 flex-1">
          <Topbar />
          {/* Full width on every page — content spans edge to edge */}
          <main className="w-full px-4 pb-14 pt-[72px] sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette />
      <Toaster />
    </div>
  )
}
