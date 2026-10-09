import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogContent({ className, children, title, description }: {
  className?: string
  children: ReactNode
  title: string
  description?: string
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 dark:bg-black/55" />
      <DialogPrimitive.Content
        className={cn(
          'glass-sheet anim-pop fixed left-1/2 top-1/2 z-50 w-[min(94vw,520px)] max-h-[86vh] overflow-y-auto scroll-thin -translate-x-1/2 -translate-y-1/2 p-6 focus:outline-none',
          className
        )}
      >
        {/* Reserve the full close-button column so long titles never run under it */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <DialogPrimitive.Title className="break-words pr-0 text-[17px] font-semibold leading-snug tracking-tight">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1 text-[13px] text-muted">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            aria-label="Close"
            className="sticky top-0 -mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-[var(--fill)] hover:text-[var(--text)]"
          >
            <X size={16} />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
