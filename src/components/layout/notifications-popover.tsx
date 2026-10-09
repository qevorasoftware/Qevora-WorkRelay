import { useNavigate } from 'react-router-dom'
import { AtSign, Bell, CheckCheck, FileText, File, Inbox, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '../ui/popover'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { relativeTime } from '../../lib/utils'
import { Button } from '../ui/button'
import type { Notification } from '../../types'

const typeIcon: Record<Notification['type'], LucideIcon> = {
  approval: FileText,
  request: Inbox,
  mention: AtSign,
  file: File,
  system: Sparkles,
}

export function NotificationsPopover() {
  const navigate = useNavigate()
  const notifications = useWorkspaceStore((s) => s.notifications)
  const markAll = useWorkspaceStore((s) => s.markAllNotifications)
  const markOne = useWorkspaceStore((s) => s.markNotification)
  const unread = notifications.filter((n) => !n.read)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="btn btn-ghost btn-icon relative" aria-label={`Notifications (${unread.length} unread)`}>
          <Bell size={18} />
          {unread.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold text-white">
              {unread.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[22rem] p-0">
        <div className="flex items-center justify-between px-3 pt-2 pb-1">
          <p className="text-sm font-semibold">Notifications</p>
          <button
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
            onClick={markAll}
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto scroll-thin">
          {unread.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted">You're all caught up 🎉</p>
          )}
          {notifications.slice(0, 6).map((n) => {
            const Icon = typeIcon[n.type]
            return (
              <button
                key={n.id}
                onClick={() => { markOne(n.id); navigate(n.target) }}
                className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)]"
              >
                <Icon size={15} className="mt-0.5 shrink-0 text-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">
                    {n.title}
                    {!n.read && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] align-middle" />}
                  </span>
                  <span className="block truncate text-xs text-muted">{n.body}</span>
                  <span className="mt-0.5 block text-[10px] text-muted">{relativeTime(n.at)}</span>
                </span>
              </button>
            )
          })}
        </div>
        <PopoverClose asChild>
          <div className="border-t border-line p-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/notifications')}>
              View all
            </Button>
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
