import { useEffect } from 'react'

/** Tracks the pointer and updates --gx/--gy so every Liquid Glass surface
 *  carries a moving specular highlight (iOS device-motion feel on the web).
 *  Disabled for reduced-motion users. */
export function useGlassPointer() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const root = document.documentElement
        root.style.setProperty('--gx', `${((e.clientX / window.innerWidth) * 100).toFixed(1)}%`)
        root.style.setProperty('--gy', `${((e.clientY / window.innerHeight) * 100).toFixed(1)}%`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])
}
