import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, Eye, FileImage, FileText, FolderOpen,
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
import { cn, dueLabel, relativeTime } from '../../lib/utils'
import type { Approval, Request } from '../../types'

/** Client workspace — Section 11: shows ONLY client-safe requests,
 *  files and approvals. Internal notes and internal chat never appear. */
export function PortalPage() {
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

  /* ---- Client picker (no client chosen) ---- */
  if (!client) {
    return (
      <div className="mesh flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold">Choose a client workspace</h1>
            <Link to="/" className="btn btn-ghost btn-sm"><ArrowLeft size={14} /> Back to app</Link>
          </div>
          <div className="space-y-3">
            {clients.filter((c) => c.portalStatus === 'active').map((c) => (
              <Card key={c.id} className="card-hover flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
                  <FolderOpen size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.company}</p>
                  <p className="text-xs text-muted">{c.name} · {projects.filter((p) => p.clientId === c.id).length} project(s)</p>
                </div>
                <Button size="sm" onClick={() => navigate(`/portal/${c.id}`)}>Open</Button>
              </Card>
            ))}
          </div>
        </div>
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
      toast(`Thank you! “${provideFor.title}” is now in review 🙏`)
    }
    setProvideFor(null)
    setProvideText('')
  }

  const decide = () => {
    if (approvalDecision) {
      decideApproval(approvalDecision.a.id, approvalDecision.d, decisionComment.trim() || undefined)
      toast(approvalDecision.d === 'approved' ? 'Approved — thank you! ✅' : 'Change request sent to the team')
    }
    setApprovalDecision(null)
    setDecisionComment('')
  }

  const activeChat = visibleChats[0]

  return (
    <div className="mesh min-h-screen">
      {/* Portal header */}
      <header className="liquid-glass sticky top-4 z-30 mx-4 flex h-14 items-center gap-3 px-4">
        <ShieldCheck size={20} className="shrink-0 text-[var(--success)]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{client.company} — Client Workspace</p>
          <p className="flex items-center gap-1 truncate text-[11px] text-muted">
            <Eye size={11} /> You see only client-safe items. Internal notes are hidden.
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar user={contact ?? users[0]} size="sm" />
          <span className="text-xs font-semibold">{contact?.name}</span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/clients')}>
          <ArrowLeft size={14} /> Exit portal
        </Button>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        {/* Project summary */}
        <Card className="mb-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold">{clientProjects[0]?.name ?? 'Project'}</p>
              <p className="mt-0.5 text-xs text-muted">{clientProjects[0]?.tagline}</p>
            </div>
            <Badge tone="success"><Globe size={11} /> Secure demo portal</Badge>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={clientProjects[0]?.progress ?? 0} />
            <span className="text-xs font-semibold tabular-nums text-muted">{clientProjects[0]?.progress ?? 0}%</span>
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

        {/* Requests */}
        {tab === 'requests' && (
          <div className="space-y-3">
            {visibleRequests.length === 0 && (
              <Card><EmptyState icon={Inbox} title="No open requests" hint="The team will add requests here when needed." /></Card>
            )}
            {visibleRequests.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{r.title}</p>
                    <p className="mt-1 max-w-xl text-xs text-muted">{r.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge tone={requestStatusTone[r.status]}>{requestStatusLabel[r.status]}</Badge>
                    <span className={cn('text-[11px]', dueLabel(r.dueDate).includes('overdue') ? 'font-semibold text-[var(--danger)]' : 'text-muted')}>
                      Due {dueLabel(r.dueDate)}
                    </span>
                  </div>
                </div>
                {r.status === 'awaiting-client' && (
                  <div className="mt-4">
                    <Button size="sm" onClick={() => setProvideFor(r)}>
                      <UploadCloud size={14} /> Provide content
                    </Button>
                  </div>
                )}
                {r.status === 'in-review' && (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--info)]">
                    <CheckCircle2 size={13} /> Received — the team is reviewing it.
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Approvals */}
        {tab === 'approvals' && (
          <div className="space-y-3">
            {visibleApprovals.map((a) => (
              <Card key={a.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">{a.artifact} <span className="badge badge-accent ml-1 align-middle">{a.version}</span></p>
                    <p className="mt-0.5 text-xs text-muted">Latest update {relativeTime(a.history[a.history.length - 1]?.at ?? a.history[0].at)}</p>
                  </div>
                  <Badge tone={approvalStatusTone[a.status]}>{approvalStatusLabel[a.status]}</Badge>
                </div>
                {a.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setApprovalDecision({ a, d: 'approved' })}>
                      <CheckCircle2 size={14} /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setApprovalDecision({ a, d: 'changes-requested' })}>
                      <RotateCcw size={14} /> Request changes
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

        {/* Files */}
        {tab === 'files' && (
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleFiles.map((f) => (
              <Card key={f.id} className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card2 text-muted">
                  {f.kind === 'image' ? <FileImage size={17} /> : <FileText size={17} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{f.name}</p>
                  <p className="text-[11px] text-muted">{f.sizeLabel} · {f.version} · {relativeTime(f.uploadedAt)}</p>
                </div>
              </Card>
            ))}
            {visibleFiles.length === 0 && <Card className="sm:col-span-2"><EmptyState icon={FolderOpen} title="No shared files yet" /></Card>}
          </div>
        )}

        {/* Chat (client-visible only) */}
        {tab === 'chat' && (
          <Card className="flex h-[26rem] flex-col overflow-hidden">
            {activeChat ? (
              <>
                <div className="border-b border-line px-4 py-2.5 text-sm font-bold">{activeChat.name}</div>
                <div className="flex-1 space-y-3 overflow-y-auto scroll-thin p-4">
                  {activeChat.messages.map((m) => {
                    const mine = m.senderId === CURRENT_USER_ID
                    return (
                      <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-[80%] px-3.5 py-2.5 text-sm shadow-sm', mine ? 'bubble-own' : 'bubble-other')}>
                          {!mine && <p className="mb-0.5 text-[11px] font-bold opacity-80">{userById(m.senderId)?.name}</p>}
                          <p>{m.body}</p>
                          <p className={cn('mt-1 text-[10px]', mine ? 'text-right opacity-75' : 'text-muted')}>{relativeTime(m.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-2 border-t border-line p-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={1}
                    placeholder="Write to the team…"
                    aria-label="Client message composer"
                    className="input flex-1 resize-none py-2.5"
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

        <p className="mt-6 text-center text-[11px] text-muted">
          Demo portal — client actions update the same workspace state, without internal data exposure.
        </p>
      </main>

      {/* Provide content dialog */}
      <Dialog open={!!provideFor} onOpenChange={(o) => !o && setProvideFor(null)}>
        {provideFor && (
          <DialogContent
            title={`Provide content — ${provideFor.title}`}
            description="Attach a note about what you're providing. (File attach arrives with secure storage.)"
          >
            <Textarea
              value={provideText}
              onChange={(e) => setProvideText(e.target.value)}
              placeholder="e.g. Final hero copy attached — headline + sub + CTA confirmed with marketing…"
              aria-label="Content note"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setProvideFor(null)}>Cancel</Button>
              <Button onClick={provideContent}>Send to team</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Approval decision dialog */}
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
              <Button variant={approvalDecision.d === 'approved' ? 'primary' : 'outline'} onClick={decide}>
                {approvalDecision.d === 'approved' ? 'Approve' : 'Send change request'}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
