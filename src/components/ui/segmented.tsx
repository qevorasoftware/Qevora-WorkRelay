import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

export function Segmented<T extends string>({ options, value, onChange, label }: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-xl border border-line bg-card2 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value
        const Icon = opt.icon
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
              active
                ? 'bg-[var(--card)] text-[var(--accent)] shadow-sm'
                : 'text-muted hover:text-[var(--text)]'
            )}
          >
            {Icon && <Icon size={14} />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
