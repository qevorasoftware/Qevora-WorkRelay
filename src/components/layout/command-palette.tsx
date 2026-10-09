import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  ArrowRight, CheckCircle2, Folder, FolderKanban, Inbox, LayoutDashboard,
  MessageSquare, Moon, Search, Settings, Sun, Users,
} from 'lucide-react'
import { useUiStore } from '../../stores/ui-store'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useChatStore } from '../../stores/chat-demo-store'
import { useThemeStore } from '../../stores/theme-store'
import { cn } from '../../lib/utils'

interface PaletteItem {
  id: string
  label: string
  hint?: string
  icon: React.ComponentType<{ size?: number | string }>
  run: () => void
  group: 'Navigate' | 'Actions' | 'Results'
}

export function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen)
  const setOpen = useUiStore((s) => s.setPaletteOpen)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
    }
  }, [open])

  const { projects, requests, notifications, markAllNotifications } = useWorkspaceStore()
  const conversations = useChatStore((s) => s.conversations)
  const setActive = useChatStore((s) => s.setActive)
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)
  const q = query.trim().toLowerCase()

  const items = useMemo<PaletteItem[]>(() => {
    const go = (to: string) => () => { navigate(to); setOpen(false) }
    const nav: PaletteItem[] = [
      { id: 'nav1', label: 'Overview', icon: LayoutDashboard, run: go('/'), group: 'Navigate' },
      { id: 'nav2', label: 'Projects', icon: FolderKanban, run: go('/projects'), group: 'Navigate' },
      { id: 'nav3', label: 'Requests', icon: Inbox, run: go('/requests'), group: 'Navigate' },
      { id: 'nav4', label: 'Approvals', icon: CheckCircle2, run: go('/approvals'), group: 'Navigate' },
      { id: 'nav5', label: 'Chat', icon: MessageSquare, run: go('/chat'), group: 'Navigate' },
      { id: 'nav6', label: 'Clients', icon: Users, run: go('/clients'), group: 'Navigate' },
      { id: 'nav7', label: 'Settings', icon: Settings, run: go('/settings'), group: 'Navigate' },
    ]
    const actions: PaletteItem[] = [
      { id: 'act1', label: 'New request', hint: 'Create a client content request', icon: Inbox, run: go('/requests?new=1'), group: 'Actions' },
      { id: 'act2', label: 'View client portal', hint: 'See the workspace as a client', icon: Users, run: go('/portal'), group: 'Actions' },
      {
        id: 'act3',
        label: mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        icon: mode === 'dark' ? Sun : Moon,
        run: () => { setMode(mode === 'dark' ? 'light' : 'dark'); setOpen(false) },
        group: 'Actions',
      },
      { id: 'act4', label: 'Mark all notifications read', hint: `${notifications.filter((n) => !n.read).length} unread`, icon: CheckCircle2, run: () => { markAllNotifications(); setOpen(false) }, group: 'Actions' },
    ]
    const results: PaletteItem[] = [
      ...projects.filter((p) => !q || p.name.toLowerCase().includes(q)).slice(0, 4).map((p) => ({
        id: `p-${p.id}`, label: p.name, hint: 'Project', icon: FolderKanban,
        run: go(`/projects/${p.id}`), group: 'Results' as const,
      })),
      ...requests.filter((r) => q && r.title.toLowerCase().includes(q)).slice(0, 4).map((r) => ({
        id: `r-${r.id}`, label: r.title, hint: 'Request', icon: Inbox,
        run: go('/requests'), group: 'Results' as const,
      })),
      ...conversations
        .filter((c) => q && (c.name ?? 'Direct message').toLowerCase().includes(q))
        .slice(0, 3)
        .map((c) => ({
          id: `c-${c.id}`,
          label: c.name ?? 'Direct message',
          hint: 'Conversation',
          icon: MessageSquare,
          run: () => { setActive(c.id); go('/chat')() },
          group: 'Results' as const,
        })),
      ...(!q ? [{ id: 'f-files', label: 'Files', icon: Folder, run: go('/files'), group: 'Results' as const }] : []),
    ]
    return [...actions, ...nav, ...results].filter((item) => {
      if (!q) return true
      return (
        item.label.toLowerCase().includes(q) ||
        (item.hint ?? '').toLowerCase().includes(q) ||
        item.group === 'Results'
      )
    })
  }, [q, projects, requests, conversations, notifications, mode, navigate, setActive, setMode, markAllNotifications, setOpen])

  const grouped = useMemo(() => {
    const groups: Record<string, PaletteItem[]> = {}
    for (const item of items) (groups[item.group] ??= []).push(item)
    return groups
  }, [items])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(items.length - 1, c + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(0, c - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      items[cursor]?.run()
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-cursor="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/30 dark:bg-black/55" />
        <DialogPrimitive.Content
          className="glass-sheet anim-pop fixed left-1/2 top-[12vh] z-[61] w-[min(94vw,560px)] -translate-x-1/2 rounded-2xl focus:outline-none"
          onKeyDown={onInputKey}
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search size={16} className="shrink-0 text-faint" />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCursor(0) }}
              placeholder="Search projects, requests, actions…"
              aria-label="Search"
              className="h-[52px] w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--text-3)]"
            />
            <span className="kbd">ESC</span>
          </div>
          <div ref={listRef} className="max-h-[46vh] overflow-y-auto scroll-thin p-2">
            {Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group} className="mb-1">
                <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold text-faint">{group}</p>
                {groupItems.map((item) => {
                  const idx = items.indexOf(item)
                  const active = idx === cursor
                  return (
                    <button
                      key={item.id}
                      data-cursor={active}
                      onMouseEnter={() => setCursor(idx)}
                      onClick={item.run}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                        active ? 'text-[var(--accent)]' : 'text-muted'
                      )}
                      style={active ? { background: 'var(--accent-tint)' } : undefined}
                    >
                      <item.icon size={15} />
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      {item.hint && <span className="truncate text-[11px] text-faint">{item.hint}</span>}
                      <ArrowRight size={12} className={active ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  )
                })}
              </div>
            ))}
            {items.length === 0 && (
              <p className="px-3 py-8 text-center text-[13px] text-muted">No matches for “{query}”</p>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
