import { useState } from 'react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { SelectDropdown } from '../../components/ui/select-dropdown'
import { Input, Textarea, FieldError } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { requestSchema, type RequestInput } from '../../lib/validation'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useUiStore } from '../../stores/ui-store'

const emptyForm: RequestInput = {
  title: '', description: '', projectId: '', assigneeId: '', dueDate: '', visibility: 'client',
}

export function RequestDialog({ open, onOpenChange, defaultProjectId }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultProjectId?: string
}) {
  const { projects, users, createRequest } = useWorkspaceStore()
  const toast = useUiStore((s) => s.toast)
  const [form, setForm] = useState<RequestInput>({ ...emptyForm, projectId: defaultProjectId ?? '' })
  const [errors, setErrors] = useState<Partial<Record<keyof RequestInput, string>>>({})

  const set = (key: keyof RequestInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = requestSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof RequestInput, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RequestInput
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    const created = createRequest(parsed.data)
    toast(`Request "${created.title}" created`)
    setForm({ ...emptyForm })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="New request"
        description="Ask the client (or your team) for content, files or access."
      >
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="rq-title">Title</label>
            <Input id="rq-title" value={form.title} onChange={set('title')} placeholder="Homepage hero copy" aria-invalid={!!errors.title} />
            <FieldError message={errors.title} />
          </div>

          <div>
            <label className="label" htmlFor="rq-desc">Description</label>
            <Textarea id="rq-desc" value={form.description} onChange={set('description')} placeholder="What exactly do you need? Format, counts, links…" aria-invalid={!!errors.description} />
            <FieldError message={errors.description} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="rq-project">Project</label>
              <SelectDropdown
                value={form.projectId}
                onChange={(v) => { setForm((f) => ({ ...f, projectId: v })); setErrors((er) => ({ ...er, projectId: undefined })) }}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                placeholder="Select project…"
                ariaLabel="Project"
                invalid={!!errors.projectId}
              />
              <FieldError message={errors.projectId} />
            </div>
            <div>
              <label className="label" htmlFor="rq-assignee">Owner</label>
              <SelectDropdown
                value={form.assigneeId}
                onChange={(v) => { setForm((f) => ({ ...f, assigneeId: v })); setErrors((er) => ({ ...er, assigneeId: undefined })) }}
                options={users.map((u) => ({ value: u.id, label: `${u.name} — ${u.role}` }))}
                placeholder="Select owner…"
                ariaLabel="Owner"
                invalid={!!errors.assigneeId}
              />
              <FieldError message={errors.assigneeId} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="rq-due">Due date</label>
              <Input id="rq-due" type="date" value={form.dueDate} onChange={set('dueDate')} aria-invalid={!!errors.dueDate} />
              <FieldError message={errors.dueDate} />
            </div>
            <div>
              <span className="label">Visibility</span>
              <div className="flex gap-2">
                {(['client', 'internal'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, visibility: v }))}
                    className={`btn btn-sm flex-1 ${form.visibility === v ? 'btn-primary' : 'btn-secondary'}`}
                    aria-pressed={form.visibility === v}
                  >
                    {v === 'client' ? 'Client-visible' : 'Internal only'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
