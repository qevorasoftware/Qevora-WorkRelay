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
        <button className="btn btn-ghost btn-icon btn-sm relative" aria-label={`Notifications (${unread.length} unread)`}>
          <Bell size={16} />
          {unread.length > 0 && (
            <span className="absolute right-1 top-1 h-[7px] w-[7px] rounded-full bg-[var(--accent)]" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[21rem] p-0">
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
          <p className="text-[13px] font-semibold">Notifications</p>
          <button
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[var(--accent)] hover:underline"
            onClick={markAll}
          >
            <CheckCheck size={12} /> Mark all read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto scroll-thin">
          {unread.length === 0 && (
            <p className="px-3 py-8 text-center text-xs text-muted">You're all caught up</p>
          )}
          {notifications.slice(0, 6).map((n) => {
            const Icon = typeIcon[n.type]
            return (
              <button
                key={n.id}
                onClick={() => { markOne(n.id); navigate(n.target) }}
                className="flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--fill)]"
              >
                <Icon size={15} className="mt-0.5 shrink-0 text-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold">
                    {n.title}
                    {!n.read && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] align-middle" />}
                  </span>
                  <span className="block truncate text-[11.5px] text-muted">{n.body}</span>
                  <span className="mt-0.5 block text-[10px] text-faint">{relativeTime(n.at)}</span>
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
