import { motion, useReducedMotion } from 'motion/react'
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
  const reduce = useReducedMotion()
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="liquid-glass inline-flex items-center gap-0.5 rounded-[10px] p-[3px]"
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
              'relative inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-[5px] text-[12px] font-medium transition-colors',
              active ? 'text-[var(--text)]' : 'text-muted hover:text-[var(--text)]'
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${label}`}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-lg bg-[var(--surface)] shadow-sm"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {Icon && <Icon size={14} />}
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
