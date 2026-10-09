import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

export function EmptyState({ icon: Icon = Inbox, title, hint, action }: {
  icon?: LucideIcon
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card2 border border-line text-muted">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {hint && <p className="mt-1 text-xs text-muted max-w-xs">{hint}</p>}
      </div>
      {action}
    </div>
  )
}
