import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
}

/** Apple-style dropdown menu (iOS 26 look) — replaces every native <select>.
 *  The menu renders in a PORTAL with fixed positioning, so it never clips or
 *  scroll-traps inside dialogs/overflow containers; it follows its trigger on
 *  scroll and flips upward when there's no room below. */
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
  const [pos, setPos] = useState<{ left: number; top: number; width: number; up: boolean } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))

  const measure = useCallback(() => {
    const trigger = rootRef.current?.querySelector('button')
    if (!trigger) return
    const r = trigger.getBoundingClientRect()
    const menuH = Math.min(options.length * 38 + 12, 300)
    const up = r.bottom + menuH + 12 > window.innerHeight && r.top - menuH - 12 > 0
    setPos({ left: r.left, top: up ? r.top - menuH - 6 : r.bottom + 6, width: r.width, up })
  }, [options.length])

  useLayoutEffect(() => {
    if (open) measure()
  }, [open, measure])

  /* Follow the trigger while any container scrolls; close if unmounted region scrolls far */
  useEffect(() => {
    if (!open) return
    const onScroll = () => measure()
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!rootRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        setOpen(false)
      }
    }
    /* Native-level guards on the portal menu (React handlers alone are too
     * late for document-level listeners):
     * - stopPropagation on pointerdown -> Radix's outside-pointerdown dismiss
     *   never sees menu interaction.
     * - preventDefault on mousedown -> the browser never moves focus into the
     *   menu, so the dialog never gets a focus-out dismissal. */
    const menu = menuRef.current
    const stopPointer = (e: Event) => e.stopPropagation()
    const preventFocus = (e: Event) => { e.preventDefault(); e.stopPropagation() }
    menu?.addEventListener('pointerdown', stopPointer)
    menu?.addEventListener('mousedown', preventFocus)
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey, true)
      menu?.removeEventListener('pointerdown', stopPointer)
      menu?.removeEventListener('mousedown', preventFocus)
    }
  }, [open, measure, pos])

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
          if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setActive(selectedIndex)
              setOpen(true)
            }
            return
          }
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
          else if (e.key === 'Enter') { e.preventDefault(); if (options[active]) choose(options[active].value) }
          else if (e.key === 'Escape') { e.stopPropagation(); setOpen(false) }
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

      {open && pos && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          aria-label={ariaLabel}
          data-state="open"
          className="select-menu anim-pop scroll-thin fixed z-[90] max-h-[300px] overflow-y-auto rounded-2xl p-1.5 outline-none"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            left: pos.left,
            top: pos.top,
            minWidth: pos.width,
            maxWidth: 'min(340px, 92vw)',
            transformOrigin: pos.up ? 'bottom left' : 'top left',
          }}
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
        </div>,
        document.body
      )}
    </div>
  )
}
