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
        sideOffset={6}
        className="glass-strong anim-pop z-[70] min-w-44 rounded-xl border border-line p-1.5 focus:outline-none"
      >
        {items.map((item) => (
          <DropdownPrimitive.Item
            key={item.label}
            disabled={item.disabled}
            onSelect={item.onSelect}
            className={cn(
              'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors',
              'data-[highlighted]:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] data-[highlighted]:text-[var(--accent)]',
              item.danger && 'text-[var(--danger)] data-[highlighted]:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] data-[highlighted]:text-[var(--danger)]',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {item.icon && <item.icon size={15} />}
            {item.label}
          </DropdownPrimitive.Item>
        ))}
        {children}
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Portal>
  )
}
