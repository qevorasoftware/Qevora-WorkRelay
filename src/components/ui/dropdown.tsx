import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export const Dropdown = DropdownPrimitive.Root
export const DropdownTrigger = DropdownPrimitive.Trigger

export interface DropdownItemDef {
  label: string
  icon?: LucideIcon
  onSelect?: () => void
  danger?: boolean
  disabled?: boolean
}

export function DropdownContent({ items, children }: {
  items: DropdownItemDef[]
  children?: ReactNode
}) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align="end"
        sideOffset={5}
        className="liquid-glass anim-pop z-[70] min-w-44 rounded-xl p-1 focus:outline-none"
      >
        {items.map((item) => (
          <DropdownPrimitive.Item
            key={item.label}
            disabled={item.disabled}
            onSelect={item.onSelect}
            className={cn(
              'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] outline-none transition-colors',
              'data-[highlighted]:bg-[var(--fill)]',
              item.danger && 'text-[var(--danger)]',
              item.disabled && 'opacity-40 cursor-default'
            )}
          >
            {item.icon && <item.icon size={15} className="text-muted" />}
            {item.label}
          </DropdownPrimitive.Item>
        ))}
        {children}
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Portal>
  )
}
