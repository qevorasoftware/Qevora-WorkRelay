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
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/25" />
      <DialogPrimitive.Content
        className={cn(
          'anim-pop fixed left-1/2 top-1/2 z-50 w-[min(94vw,520px)] max-h-[88vh] overflow-y-auto scroll-thin -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-card p-6 shadow-xl focus:outline-none',
          className
        )}
      >
        <div className="mb-4 pr-8">
          <DialogPrimitive.Title className="text-[17px] font-semibold tracking-tight">{title}</DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-1 text-[13px] text-muted">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        <DialogPrimitive.Close
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-[var(--fill)] hover:text-[var(--text)]"
        >
          <X size={15} />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
