import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, FileImage, FileText, FolderOpen,
  Globe, Inbox, MessageSquare, RotateCcw, ShieldCheck, UploadCloud,
} from 'lucide-react'
import { Card } from '../../components/ui/card'
import { Badge, requestStatusLabel, requestStatusTone, approvalStatusLabel, approvalStatusTone } from '../../components/ui/badge'
import { Avatar } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/input'
import { Progress } from '../../components/ui/progress'
import { EmptyState } from '../../components/ui/empty-state'
import { Tabs } from '../../components/ui/tabs'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useChatStore } from '../../stores/chat-demo-store'
import { useUiStore } from '../../stores/ui-store'
import { CURRENT_USER_ID, userById } from '../../mocks/users'
import { useGlassPointer } from '../../lib/use-glass-pointer'
import { cn, dueLabel, relativeTime } from '../../lib/utils'
import type { Approval, Request } from '../../types'

/** Client workspace — §11: shows ONLY client-safe requests, files,
 *  approvals and project chats. Internal items never appear. */
export function PortalPage() {
  useGlassPointer()
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { clients, projects, requests, approvals, files, users, setRequestStatus, decideApproval } = useWorkspaceStore()
  const conversations = useChatStore((s) => s.conversations)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const toast = useUiStore((s) => s.toast)

  const [tab, setTab] = useState('requests')
  const [provideFor, setProvideFor] = useState<Request | null>(null)
  const [provideText, setProvideText] = useState('')
  const [approvalDecision, setApprovalDecision] = useState<{ a: Approval; d: 'approved' | 'changes-requested' } | null>(null)
  const [decisionComment, setDecisionComment] = useState('')
  const [draft, setDraft] = useState('')

  const client = clients.find((c) => c.id === clientId)

  const clientProjects = useMemo(
    () => projects.filter((p) => p.clientId === clientId),
    [projects, clientId]
  )
  const projectIds = new Set(clientProjects.map((p) => p.id))

  const visibleRequests = requests.filter((r) => projectIds.has(r.projectId) && r.visibility === 'client')
  const visibleApprovals = approvals.filter((a) => projectIds.has(a.projectId))
  const visibleFiles = files.filter((f) => projectIds.has(f.projectId) && f.visibility === 'client')
  const visibleChats = conversations.filter((c) => c.type === 'project' && c.projectId && projectIds.has(c.projectId) && c.visibility === 'client')

  if (!client) {
    return (
      <div className="ambient flex h-dvh flex-col overflow-hidden">
        <header className="liquid-glass z-30 mx-4 mt-3 flex h-[54px] shrink-0 items-center gap-3 rounded-full px-4 lg:mx-6">
          <ShieldCheck size={17} className="text-[var(--success)]" />
          <p className="text-[13.5px] font-semibold">Client workspace</p>
        </header>
        <main className="scroll-thin mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-[22px] font-semibold tracking-tight">Choose a workspace</h1>
            <Link to="/" className="btn btn-ghost btn-sm"><ArrowLeft size={13} /> Back to app</Link>
          </div>
          <div className="space-y-3">
            {clients.filter((c) => c.portalStatus === 'active').map((c) => (
              <Card key={c.id} className="card-hover flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--accent)]" style={{ background: 'var(--accent-tint)' }}>
                  <FolderOpen size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold">{c.company}</p>
                  <p className="text-[12px] text-muted">{c.name} · {projects.filter((p) => p.clientId === c.id).length} project(s)</p>
                </div>
                <Button size="sm" onClick={() => navigate(`/portal/${c.id}`)}>Open</Button>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  const contact = userById(client.contactUserId)

  const provideContent = () => {
    if (provideText.trim().length < 5) {
      toast('Please add a short note about what you provided', 'error')
      return
    }
    if (provideFor) {
      setRequestStatus(provideFor.id, 'in-review')
      toast(`Thank you! "${provideFor.title}" is now in review`)
    }
    setProvideFor(null)
    setProvideText('')
  }

  const decide = () => {
    if (approvalDecision) {
      decideApproval(approvalDecision.a.id, approvalDecision.d, decisionComment.trim() || undefined)
      toast(approvalDecision.d === 'approved' ? 'Approved — thank you' : 'Change request sent to the team')
    }
    setApprovalDecision(null)
    setDecisionComment('')
  }

  const activeChat = visibleChats[0]

  return (
    <div className="ambient flex h-dvh flex-col overflow-hidden">
      <header className="liquid-glass z-30 mx-4 mt-3 flex h-[54px] shrink-0 items-center gap-3 rounded-full px-4 lg:mx-6">
        <ShieldCheck size={17} className="text-[var(--success)]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold">{client.company}</p>
        </div>
        <Badge tone="success"><Globe size={10} /> Demo portal</Badge>
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar user={contact ?? users[0]} size="sm" />
          <span className="text-[12.5px] font-medium">{contact?.name}</span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/clients')}>
          <ArrowLeft size={13} /> Exit
        </Button>
      </header>

      <main className="scroll-thin w-full flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <Card className="mb-4 p-5">
          <p className="text-[15px] font-semibold">{clientProjects[0]?.name ?? 'Project'}</p>
          <p className="mt-0.5 text-[12.5px] text-muted">{clientProjects[0]?.tagline}</p>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={clientProjects[0]?.progress ?? 0} />
            <span className="text-[12px] tabular-nums text-muted">{clientProjects[0]?.progress ?? 0}%</span>
          </div>
        </Card>

        <div className="mb-4">
          <Tabs
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'requests', label: 'Your requests', count: visibleRequests.length },
              { value: 'approvals', label: 'Approvals', count: visibleApprovals.length },
              { value: 'files', label: 'Files', count: visibleFiles.length },
              { value: 'chat', label: 'Chat', count: visibleChats.length },
            ]}
          />
        </div>

        {tab === 'requests' && (
          <div className="space-y-3">
            {visibleRequests.length === 0 && (
              <Card><EmptyState icon={Inbox} title="No open requests" hint="The team will add requests here when needed." /></Card>
            )}
            {visibleRequests.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold">{r.title}</p>
                    <p className="mt-1 max-w-xl text-[12.5px] text-muted">{r.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge tone={requestStatusTone[r.status]}>{requestStatusLabel[r.status]}</Badge>
                    <span className={cn('text-[11px]', dueLabel(r.dueDate).includes('overdue') ? 'font-medium text-[var(--danger)]' : 'text-muted')}>
                      Due {dueLabel(r.dueDate)}
                    </span>
                  </div>
                </div>
                {r.status === 'awaiting-client' && (
                  <div className="mt-3.5">
                    <Button size="sm" onClick={() => setProvideFor(r)}>
                      <UploadCloud size={13} /> Provide content
                    </Button>
                  </div>
                )}
                {r.status === 'in-review' && (
                  <p className="mt-3.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--info)]">
                    <CheckCircle2 size={12} /> Received — the team is reviewing it.
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {tab === 'approvals' && (
          <div className="space-y-3">
            {visibleApprovals.map((a) => (
              <Card key={a.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[13.5px] font-semibold">{a.artifact} <span className="badge badge-accent ml-1 align-middle">{a.version}</span></p>
                    <p className="mt-0.5 text-[12px] text-muted">Latest update {relativeTime(a.history[a.history.length - 1]?.at ?? a.history[0].at)}</p>
                  </div>
                  <Badge tone={approvalStatusTone[a.status]}>{approvalStatusLabel[a.status]}</Badge>
                </div>
                {a.status === 'pending' && (
                  <div className="mt-3.5 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setApprovalDecision({ a, d: 'approved' })}>
                      <CheckCircle2 size={13} /> Approve
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => setApprovalDecision({ a, d: 'changes-requested' })}>
                      <RotateCcw size={13} /> Request changes
                    </Button>
                  </div>
                )}
              </Card>
            ))}
            {visibleApprovals.length === 0 && (
              <Card><EmptyState icon={CheckCircle2} title="Nothing to review" /></Card>
            )}
          </div>
        )}

        {tab === 'files' && (
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleFiles.map((f) => (
              <Card key={f.id} className="flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted" style={{ background: 'var(--fill)' }}>
                  {f.kind === 'image' ? <FileImage size={16} /> : <FileText size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{f.name}</p>
                  <p className="text-[11px] text-muted">{f.sizeLabel} · {f.version} · {relativeTime(f.uploadedAt)}</p>
                </div>
              </Card>
            ))}
            {visibleFiles.length === 0 && <Card className="sm:col-span-2"><EmptyState icon={FolderOpen} title="No shared files yet" /></Card>}
          </div>
        )}

        {tab === 'chat' && (
          <Card className="flex h-[24rem] flex-col overflow-hidden">
            {activeChat ? (
              <>
                <div className="border-b border-line px-4 py-2.5 text-[13px] font-semibold">{activeChat.name}</div>
                <div className="flex-1 space-y-2.5 overflow-y-auto scroll-thin p-4">
                  {activeChat.messages.map((m) => {
                    const mine = m.senderId === CURRENT_USER_ID
                    return (
                      <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-[80%] px-3.5 py-2 text-[13px] leading-relaxed', mine ? 'bubble-own' : 'bubble-other')}>
                          {!mine && <p className="mb-0.5 text-[11px] font-semibold opacity-70">{userById(m.senderId)?.name}</p>}
                          <p>{m.body}</p>
                          <p className={cn('mt-0.5 text-[10px]', mine ? 'text-right opacity-70' : 'text-faint')}>{relativeTime(m.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-2 border-t border-line p-2.5">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={1}
                    placeholder="Write to the team…"
                    aria-label="Client message composer"
                    className="input max-h-24 flex-1 resize-none py-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (draft.trim()) { sendMessage(draft); setDraft('') }
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary btn-icon"
                    aria-label="Send"
                    disabled={!draft.trim()}
                    onClick={() => { if (draft.trim()) { sendMessage(draft); setDraft('') } }}
                  >
                    ➤
                  </button>
                </div>
              </>
            ) : (
              <EmptyState icon={MessageSquare} title="No client conversation yet" />
            )}
          </Card>
        )}

        <p className="mt-6 text-center text-[11px] text-faint">
          You see only client-safe items — internal notes and internal chat are never shown here.
        </p>
      </main>

      <Dialog open={!!provideFor} onOpenChange={(o) => !o && setProvideFor(null)}>
        {provideFor && (
          <DialogContent
            title={`Provide content — ${provideFor.title}`}
            description="Attach a note about what you're providing. (File attach arrives with secure storage.)"
          >
            <Textarea
              value={provideText}
              onChange={(e) => setProvideText(e.target.value)}
              placeholder="e.g. Final hero copy attached — headline + sub + CTA confirmed…"
              aria-label="Content note"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setProvideFor(null)}>Cancel</Button>
              <Button onClick={provideContent}>Send to team</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!approvalDecision} onOpenChange={(o) => !o && setApprovalDecision(null)}>
        {approvalDecision && (
          <DialogContent
            title={approvalDecision.d === 'approved' ? `Approve ${approvalDecision.a.artifact}?` : `Request changes — ${approvalDecision.a.artifact}`}
            description={approvalDecision.d === 'approved' ? 'The team will proceed with the next milestone.' : 'Tell the team what you would like changed.'}
          >
            <Textarea
              value={decisionComment}
              onChange={(e) => setDecisionComment(e.target.value)}
              placeholder={approvalDecision.d === 'approved' ? 'Looks great!' : 'e.g. Please make the hero lighter…'}
              aria-label="Decision comment"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setApprovalDecision(null)}>Cancel</Button>
              <Button onClick={decide}>
                {approvalDecision.d === 'approved' ? 'Approve' : 'Send change request'}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
