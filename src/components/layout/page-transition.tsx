import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'

/** Apple minimal: content appears instantly; at most a whisper fade. */
export function PageTransition({ children }: { children: ReactNode }) {
  void useReducedMotion
  return <div style={{ animation: 'pop-in 0.18s cubic-bezier(0.25,0.1,0.25,1)' }}>{children}</div>
}
