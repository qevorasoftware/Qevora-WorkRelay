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
        className={cn('inline-flex items-center gap-0.5 rounded-[10px] p-[3px]', className)}
        style={{ background: 'var(--fill)' }}
        aria-label="Filters"
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'rounded-[8px] px-3 py-[5px] text-[12.5px] font-medium text-muted transition-all',
              'data-[state=active]:bg-[var(--surface)] data-[state=active]:text-[var(--text)] data-[state=active]:shadow-sm'
            )}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span className="ml-1 text-[10.5px] opacity-60 tabular-nums">{item.count}</span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}
