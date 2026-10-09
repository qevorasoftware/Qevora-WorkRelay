import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useUiStore } from '../../stores/ui-store'
import { cn } from '../../lib/utils'

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

export function Toaster() {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)
  const reduce = useReducedMotion()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(92vw,340px)] flex-col gap-2" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <motion.div
              key={t.id}
              layout
              initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="glass-sheet pointer-events-auto flex items-start gap-2.5 rounded-xl p-3"
            >
              <Icon size={16} className={cn('mt-0.5 shrink-0', {
                success: 'text-[var(--success)]',
                error: 'text-[var(--danger)]',
                info: 'text-[var(--info)]',
              }[t.type])} />
              <p className="flex-1 text-[13px] font-medium">{t.message}</p>
              <button
                className="btn btn-ghost btn-icon btn-sm -mt-0.5 -mr-1"
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
              >
                <X size={13} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
