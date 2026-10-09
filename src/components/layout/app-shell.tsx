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
    <div className="ambient flex h-dvh w-full overflow-hidden">
      <Sidebar />
      <SidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {/* Pages scroll INSIDE this region — the window itself never scrolls */}
        <main className="scroll-thin flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <Toaster />
    </div>
  )
}
