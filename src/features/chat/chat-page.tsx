import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCheck, Globe, Lock, MessageSquare, Reply, Search, Send, Smile, X } from 'lucide-react'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarOf } from '../../components/ui/avatar'
import { EmptyState } from '../../components/ui/empty-state'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { useChatStore } from '../../stores/chat-demo-store'
import { CURRENT_USER_ID, userById } from '../../mocks/users'
import { projectById } from '../../mocks/projects'
import { cn, relativeTime } from '../../lib/utils'
import type { Conversation, Message } from '../../types'

const QUICK_EMOJI = ['👍', '❤️', '🎉', '👀']

function ConversationRow({ c, active, onSelect }: {
  c: Conversation
  active: boolean
  onSelect: () => void
}) {
  const title = c.name ?? userById(c.participantIds.find((p) => p !== CURRENT_USER_ID) ?? '')?.name ?? 'Conversation'
  const last = c.messages[c.messages.length - 1]
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        active ? '' : 'hover:bg-[var(--fill)]'
      )}
      style={active ? { background: 'var(--accent-tint)' } : undefined}
    >
      {c.type === 'group' ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--accent)]" style={{ background: 'var(--accent-tint)' }}><MessageSquare size={15} /></span>
      ) : (
        <AvatarOf userId={c.participantIds.find((p) => p !== CURRENT_USER_ID) ?? c.participantIds[0]} size="md" />
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{title}</span>
          {c.visibility === 'internal'
            ? <Lock size={11} className="shrink-0 text-faint" aria-label="Internal" />
            : <Globe size={11} className="shrink-0 text-[var(--info)]" aria-label="Client-visible" />}
          {c.unread > 0 && (
            <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-semibold text-[var(--on-accent)]">
              {c.unread}
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-muted">
          {last ? `${userById(last.senderId)?.name.split(' ')[0]}: ${last.body}` : 'No messages yet'}
        </span>
      </span>
    </button>
  )
}

function ReactionChip({ emoji, count, mine, onToggle }: {
  emoji: string
  count: number
  mine: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={mine}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] transition-colors',
        mine ? 'text-[var(--accent)]' : 'text-muted hover:text-[var(--text)]'
      )}
      style={{ background: mine ? 'var(--accent-tint)' : 'var(--fill)' }}
    >
      {emoji} {count}
    </button>
  )
}

function MessageBubble({ message, onReply }: {
  message: Message
  onReply: (m: Message) => void
}) {
  const toggle = useChatStore((s) => s.toggleReaction)
  const activeId = useChatStore((s) => s.activeId)
  const conversations = useChatStore((s) => s.conversations)
  const mine = message.senderId === CURRENT_USER_ID
  const sender = userById(message.senderId)
  const replyTo = message.replyToId
    ? conversations.find((c) => c.id === activeId)?.messages.find((m) => m.id === message.replyToId)
    : undefined

  return (
    <div className={cn('group flex items-end gap-2', mine ? 'flex-row-reverse' : 'flex-row')}>
      {!mine && <AvatarOf userId={message.senderId} size="sm" className="mb-5" />}
      <div className={cn('max-w-[78%] sm:max-w-[64%]')}>
        <div className={cn('px-3.5 py-2 text-[13.5px] leading-relaxed', mine ? 'bubble-own' : 'bubble-other')}>
          {!mine && <p className="mb-0.5 text-[11px] font-semibold opacity-70">{sender?.name}</p>}
          {replyTo && (
            <p className={cn('mb-1.5 truncate rounded-md border-l-2 px-2 py-1 text-[11px]',
              mine ? 'border-white/60 bg-white/15' : 'border-[var(--accent)] text-muted')}
              style={!mine ? { background: 'var(--fill)' } : undefined}>
              ↩ {replyTo.body}
            </p>
          )}
          <p className="whitespace-pre-wrap break-words">{message.body}</p>
          <p className={cn('mt-1 flex items-center gap-1 text-[10px]', mine ? 'justify-end opacity-70' : 'text-faint')}>
            {relativeTime(message.createdAt)}
            {mine && <CheckCheck size={11} aria-label="Read" />}
          </p>
        </div>
        <div className={cn('mt-1 flex items-center gap-1', mine ? 'justify-end' : 'justify-start')}>
          {message.reactions.map((r) => (
            <ReactionChip
              key={r.emoji}
              emoji={r.emoji}
              count={r.userIds.length}
              mine={r.userIds.includes(CURRENT_USER_ID)}
              onToggle={() => toggle(activeId, message.id, r.emoji)}
            />
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-faint opacity-0 transition-opacity hover:text-[var(--text)] focus:opacity-100 group-hover:opacity-100"
                aria-label="Add reaction"
              >
                <Smile size={13} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1.5">
              <div className="flex gap-0.5">
                {QUICK_EMOJI.map((e) => (
                  <button
                    key={e}
                    className="rounded-lg p-1.5 text-lg transition-transform hover:scale-125"
                    onClick={() => toggle(activeId, message.id, e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <button
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-faint opacity-0 transition-opacity hover:text-[var(--text)] focus:opacity-100 group-hover:opacity-100"
            aria-label="Reply"
            onClick={() => onReply(message)}
          >
            <Reply size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ChatPage() {
  const { conversations, activeId, setActive, replyTo, setReplyTo, sendMessage } = useChatStore()
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [showListOnMobile, setShowListOnMobile] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const active = conversations.find((c) => c.id === activeId)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) =>
      (c.name ?? userById(c.participantIds.find((p) => p !== CURRENT_USER_ID) ?? '')?.name ?? '')
        .toLowerCase()
        .includes(q)
    )
  }, [conversations, query])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [active?.messages.length, activeId])

  const send = () => {
    if (!draft.trim()) return
    sendMessage(draft)
    setDraft('')
  }

  const typingUser = active?.id === 'cv2' ? userById('u5') : undefined

  return (
    <PageTransition>
      <Card className="flex h-[calc(100vh-9rem)] min-h-[460px] overflow-hidden">
        {/* Conversation list */}
        <div className={cn('flex w-full flex-col border-r border-line sm:w-[260px] sm:shrink-0', showListOnMobile ? 'flex' : 'hidden sm:flex')}>
          <div className="border-b border-line p-2.5">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search conversations"
                className="input h-8 pl-8 text-[12.5px]"
              />
            </div>
          </div>
          <div className="flex-1 space-y-0.5 overflow-y-auto scroll-thin p-1.5">
            {filtered.length === 0 && <EmptyState icon={Search} title="No conversations found" />}
            {filtered.map((c) => (
              <ConversationRow
                key={c.id}
                c={c}
                active={c.id === activeId}
                onSelect={() => { setActive(c.id); setShowListOnMobile(false) }}
              />
            ))}
          </div>
        </div>

        {/* Message pane */}
        <div className={cn('min-w-0 flex-1 flex-col bg-[var(--bg)]', showListOnMobile ? 'hidden sm:flex' : 'flex')}>
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-line bg-[var(--surface)] px-4 py-2.5">
                <button className="btn btn-ghost btn-icon btn-sm sm:hidden" aria-label="Back to conversations" onClick={() => setShowListOnMobile(true)}>
                  ←
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold">
                    {active.name ?? userById(active.participantIds.find((p) => p !== CURRENT_USER_ID) ?? '')?.name}
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {active.type === 'project' && projectById(active.projectId ?? '')?.name}
                    {active.type === 'group' && `${active.participantIds.length} members`}
                    {active.type === 'dm' && 'Direct message'}
                  </p>
                </div>
                <Badge tone={active.visibility === 'internal' ? 'neutral' : 'info'}>
                  {active.visibility === 'internal' ? <><Lock size={10} /> Internal</> : <><Globe size={10} /> Client-visible</>}
                </Badge>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scroll-thin px-4 py-4">
                {active.messages.map((m) => (
                  <MessageBubble key={m.id} message={m} onReply={setReplyTo} />
                ))}
                {typingUser && (
                  <p className="animate-pulse pl-10 text-[11px] text-muted">{typingUser.name.split(' ')[0]} is typing…</p>
                )}
              </div>

              <div className="border-t border-line bg-[var(--surface)] p-2.5">
                {replyTo && (
                  <div className="mb-2 flex items-center gap-2 rounded-lg border-l-2 border-[var(--accent)] px-3 py-1.5 text-[11.5px]" style={{ background: 'var(--fill)' }}>
                    <span className="min-w-0 flex-1 truncate text-muted">
                      Replying to <strong className="text-[var(--text)]">{userById(replyTo.senderId)?.name}</strong>: {replyTo.body}
                    </span>
                    <button onClick={() => setReplyTo(null)} aria-label="Cancel reply" className="text-muted hover:text-[var(--danger)]">
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <Avatar user={userById(CURRENT_USER_ID)!} size="sm" className="mb-0.5 hidden sm:inline-flex" />
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        send()
                      }
                    }}
                    placeholder="iMessage"
                    aria-label="Message composer"
                    rows={1}
                    className="input max-h-24 min-h-[36px] flex-1 resize-none py-1.5"
                  />
                  <button className="btn btn-primary btn-icon" aria-label="Send message" onClick={send} disabled={!draft.trim()}>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon={MessageSquare} title="Pick a conversation" hint="Choose a conversation from the list." />
          )}
        </div>
      </Card>
    </PageTransition>
  )
}
