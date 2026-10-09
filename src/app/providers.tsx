import { useEffect, type ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { bindThemeToDocument } from '../stores/theme-store'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => bindThemeToDocument(), [])
  return <TooltipPrimitive.Provider delayDuration={200}>{children}</TooltipPrimitive.Provider>
}
