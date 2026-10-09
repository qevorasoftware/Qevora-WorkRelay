import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export function PageTransition({ children, fill }: { children: ReactNode; fill?: boolean }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={fill ? 'flex min-h-0 flex-1 flex-col' : undefined}>{children}</div>
  return (
    <motion.div
      className={fill ? 'flex min-h-0 flex-1 flex-col' : undefined}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
