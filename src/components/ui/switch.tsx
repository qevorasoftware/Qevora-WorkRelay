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
        'relative inline-flex h-[26px] w-[42px] shrink-0 cursor-pointer items-center rounded-full transition-colors',
        'bg-[var(--fill-strong)]',
        'data-[state=checked]:bg-[var(--success)]'
      )}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-[22px] w-[22px] translate-x-[2px] rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
    </SwitchPrimitive.Root>
  )
}
