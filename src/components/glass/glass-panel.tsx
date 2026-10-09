import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

/** Liquid Glass surface — use for navigation, floating toolbars, popovers, modals.
 *  Dense content should stay on solid .card surfaces (§17.5). */
export function GlassPanel({ className, strong = false, ...props }: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return <div className={cn(strong ? 'glass-strong' : 'liquid-glass', className)} {...props} />
}
