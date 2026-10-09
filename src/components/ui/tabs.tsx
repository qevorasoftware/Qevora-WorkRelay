import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

export interface TabItem {
  value: string
  label: string
  count?: number
}

export function Tabs({ items, value, onValueChange, className }: {
  items: TabItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange}>
      <TabsPrimitive.List
        className={cn('inline-flex flex-wrap items-center gap-1 rounded-xl border border-line bg-card2 p-1', className)}
        aria-label="Filters"
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition-colors',
              'hover:text-[var(--text)]',
              'data-[state=active]:bg-[var(--card)] data-[state=active]:text-[var(--accent)] data-[state=active]:shadow-sm'
            )}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span className="ml-1.5 text-[10px] opacity-70">{item.count}</span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}
