import { useEffect, useRef, useState } from 'react'

/** Apple-style count-up: fast start, gentle landing. Respects reduced motion. */
export function useCountUp(target: number, active: boolean, duration = 650): number {
  const [value, setValue] = useState(active ? 0 : target)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, active, duration])

  return value
}
