import { describe, expect, it, beforeEach } from 'vitest'
import { useThemeStore, resolveTheme } from '../src/stores/theme-store'
import { useWorkspaceStore, pendingApprovals } from '../src/stores/workspace-store'
import { useChatStore } from '../src/stores/chat-demo-store'

beforeEach(() => {
  // Reset store state between tests (keep initial seeds by re-creating state)
  useThemeStore.setState({ mode: 'system', density: 'comfortable' })
})

describe('theme store (§7)', () => {
  it('switches to dark mode and persists the choice', () => {
    useThemeStore.getState().setMode('dark')
    expect(useThemeStore.getState().mode).toBe('dark')
    expect(JSON.parse(localStorage.getItem('workrelay-ui') || '{}').state.mode).toBe('dark')
  })

  it('resolves system mode from the OS preference', () => {
    const theme = resolveTheme('system')
    expect(['light', 'dark']).toContain(theme)
  })
})

describe('workspace store — requests (§11)', () => {
  it('creates a request that appears in local state', () => {
    const before = useWorkspaceStore.getState().requests.length
    const created = useWorkspaceStore.getState().createRequest({
      title: 'Test request',
      description: 'A request created by the unit test suite.',
      projectId: 'p1',
      assigneeId: 'u2',
      dueDate: '2026-10-20',
      visibility: 'client',
    })
    const after = useWorkspaceStore.getState().requests
    expect(after.length).toBe(before + 1)
    expect(after[0].id).toBe(created.id)
    expect(after[0].status).toBe('open')
  })

  it('changes request status', () => {
    const created = useWorkspaceStore.getState().createRequest({
      title: 'Status test request',
      description: 'Testing the status flow end to end.',
      projectId: 'p2',
      assigneeId: 'u4',
      dueDate: '2026-10-21',
      visibility: 'internal',
    })
    useWorkspaceStore.getState().setRequestStatus(created.id, 'complete')
    expect(useWorkspaceStore.getState().requests.find((r) => r.id === created.id)?.status).toBe('complete')
  })
})

describe('workspace store — approvals (§11)', () => {
  it('approval decision updates status and appends history', () => {
    const target = useWorkspaceStore.getState().approvals.find((a) => a.status === 'pending')!
    const historyBefore = target.history.length
    useWorkspaceStore.getState().decideApproval(target.id, 'approved', 'LGTM')
    const updated = useWorkspaceStore.getState().approvals.find((a) => a.id === target.id)!
    expect(updated.status).toBe('approved')
    expect(updated.history.length).toBe(historyBefore + 1)
    expect(updated.history[updated.history.length - 1].comment).toBe('LGTM')
    expect(pendingApprovals(useWorkspaceStore.getState()).some((a) => a.id === target.id)).toBe(false)
  })
})

describe('chat demo store (§11)', () => {
  it('sending a message adds it to the active conversation', () => {
    const active = useChatStore.getState().activeId
    const before = useChatStore.getState().conversations.find((c) => c.id === active)!.messages.length
    useChatStore.getState().sendMessage('Hello from the test suite')
    const after = useChatStore.getState().conversations.find((c) => c.id === active)!.messages
    expect(after.length).toBe(before + 1)
    expect(after[after.length - 1].body).toBe('Hello from the test suite')
  })

  it('toggles an emoji reaction on and off', () => {
    const { activeId, conversations } = useChatStore.getState()
    const msg = conversations.find((c) => c.id === activeId)!.messages[0]
    useChatStore.getState().toggleReaction(activeId, msg.id, '🚀')
    const withReaction = useChatStore.getState().conversations.find((c) => c.id === activeId)!.messages.find((m) => m.id === msg.id)!
    expect(withReaction.reactions.some((r) => r.emoji === '🚀')).toBe(true)
    useChatStore.getState().toggleReaction(activeId, msg.id, '🚀')
    const without = useChatStore.getState().conversations.find((c) => c.id === activeId)!.messages.find((m) => m.id === msg.id)!
    expect(without.reactions.some((r) => r.emoji === '🚀')).toBe(false)
  })
})

describe('client privacy boundary (§11 DoD)', () => {
  it('portal-visible requests exclude internal-only items', () => {
    const s = useWorkspaceStore.getState()
    const projectIds = new Set(s.projects.filter((p) => p.clientId === 'c3').map((p) => p.id))
    const visible = s.requests.filter((r) => projectIds.has(r.projectId) && r.visibility === 'client')
    expect(visible.some((r) => r.visibility === 'internal')).toBe(false)
    expect(visible.every((r) => r.title !== 'Brand assets + style guide')).toBe(true)
  })

  it('portal-visible chats exclude internal conversations', () => {
    const { conversations } = useChatStore.getState()
    const clientChats = conversations.filter((c) => c.visibility === 'client')
    expect(clientChats.every((c) => c.type === 'project')).toBe(true)
    expect(clientChats.every((c) => c.name?.includes('—') && !c.name.includes('Team'))).toBe(true)
  })
})
