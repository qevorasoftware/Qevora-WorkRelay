import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card', className)} {...props} />
}

export function CardHeader({ className, title, action }: {
  className?: string
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-5 pt-4 pb-3', className)}>
      <h3 className="text-sm font-semibold">{title}</h3>
      {action}
    </div>
  )
}
