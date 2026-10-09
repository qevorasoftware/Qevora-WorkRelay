import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

export function EmptyState({ icon: Icon = Inbox, title, hint, action }: {
  icon?: LucideIcon
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-3)]" style={{ background: 'var(--fill)' }}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-[13px] font-semibold">{title}</p>
        {hint && <p className="mt-0.5 text-xs text-muted max-w-xs">{hint}</p>}
      </div>
      {action}
    </div>
  )
}
