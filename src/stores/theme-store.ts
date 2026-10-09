import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'
export type Density = 'comfortable' | 'compact'

interface ThemeState {
  mode: ThemeMode
  density: Density
  setMode: (mode: ThemeMode) => void
  setDensity: (density: Density) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      density: 'comfortable',
      setMode: (mode) => set({ mode }),
      setDensity: (density) => set({ density }),
    }),
    {
      name: 'workrelay-ui',
      partialize: (s) => ({ mode: s.mode, density: s.density }),
    }
  )
)

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

/** Applies theme + density to <html>. Call once in providers. */
export function bindThemeToDocument() {
  const apply = () => {
    const { mode, density } = useThemeStore.getState()
    const root = document.documentElement
    const next = resolveTheme(mode)
    if (root.dataset.theme !== next) {
      root.dataset.themeSwitching = ''
      root.dataset.theme = next
      requestAnimationFrame(() => {
        requestAnimationFrame(() => delete root.dataset.themeSwitching)
      })
    }
    root.dataset.density = density
  }
  apply()
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (useThemeStore.getState().mode === 'system') apply()
  }
  mq.addEventListener('change', onChange)
  const unsub = useThemeStore.subscribe(apply)
  return () => {
    mq.removeEventListener('change', onChange)
    unsub()
  }
}
