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
      className="inline-flex items-center gap-0.5 rounded-[9px] p-[3px]"
      style={{ background: 'var(--fill)' }}
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
            aria-label={opt.label || opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-[7px] px-2.5 py-[5px] text-[12px] font-medium transition-all',
              active
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
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
