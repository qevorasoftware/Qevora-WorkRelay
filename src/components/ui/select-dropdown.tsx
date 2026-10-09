import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
}

/** Apple-style dropdown menu (iOS 26 look) — replaces every native <select>.
 *  Glass popover, checkmark on the selected row, keyboard + outside-click. */
export function SelectDropdown({ value, onChange, options, placeholder, className, ariaLabel, invalid }: {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  ariaLabel?: string
  invalid?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))

  /* Close on outside pointer press */
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const choose = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => { setActive(selectedIndex); setOpen((o) => !o) }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setActive(selectedIndex)
            setOpen(true)
          }
        }}
        className="select-trigger"
        data-open={open}
        data-invalid={!!invalid}
      >
        <span className={cn('truncate', !selected && 'text-muted')}>
          {selected?.label ?? placeholder ?? 'Select…'}
        </span>
        <ChevronDown
          size={14}
          className="shrink-0 text-muted transition-[rotate] duration-200"
          style={{ rotate: open ? '180deg' : '0deg' }}
        />
      </button>

      {open && (
        <div
                    role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          autoFocus
          data-state="open"
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return }
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); return }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); return }
            if (e.key === 'Enter') { e.preventDefault(); if (options[active]) choose(options[active].value) }
          }}
          className="select-menu anim-pop scroll-thin absolute left-0 top-full z-50 mt-1.5 max-h-[300px] min-w-full w-max overflow-y-auto rounded-2xl p-1.5 outline-none"
          style={{ transformOrigin: 'top left' }}
        >
          {options.map((o, i) => {
            const isSel = o.value === value
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o.value)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors',
                  i === active && 'bg-[var(--fill)]',
                  isSel ? 'font-semibold text-[var(--text)]' : 'font-normal text-[var(--text)]'
                )}
              >
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {isSel && <Check size={14} className="shrink-0 text-[var(--accent)]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
