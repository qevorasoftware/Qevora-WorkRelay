import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../../lib/utils'

export function Switch({ checked, onCheckedChange, label }: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-line transition-colors',
        'bg-[color-mix(in_srgb,var(--text)_14%,transparent)]',
        'data-[state=checked]:bg-[var(--accent)]'
      )}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-4.5 w-4.5 translate-x-1 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[1.55rem]" />
    </SwitchPrimitive.Root>
  )
}
