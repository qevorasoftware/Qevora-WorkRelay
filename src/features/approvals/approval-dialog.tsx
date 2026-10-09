import { useState } from 'react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { Textarea, FieldError } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useUiStore } from '../../stores/ui-store'
import type { Approval } from '../../types'

export function ApprovalDialog({ approval, decision, onOpenChange }: {
  approval: Approval | null
  decision: 'approved' | 'changes-requested'
  onOpenChange: (open: boolean) => void
}) {
  const decideApproval = useWorkspaceStore((s) => s.decideApproval)
  const toast = useUiStore((s) => s.toast)
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | undefined>()

  const open = !!approval
  const isChanges = decision === 'changes-requested'

  const close = () => {
    setComment('')
    setError(undefined)
    onOpenChange(false)
  }

  const submit = () => {
    if (isChanges && comment.trim().length < 5) {
      setError('Please tell the team what to change (min 5 characters)')
      return
    }
    if (approval) {
      decideApproval(approval.id, decision, comment.trim() || undefined)
      toast(isChanges ? `Changes requested on ${approval.artifact}` : `${approval.artifact} ${approval.version} approved`)
    }
    close()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      {approval && (
        <DialogContent
          title={isChanges ? `Request changes — ${approval.artifact}` : `Approve ${approval.artifact}`}
          description={`${approval.version} · The decision is recorded in the approval history.`}
        >
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="ap-comment">
                Comment {isChanges ? '(required)' : '(optional)'}
              </label>
              <Textarea
                id="ap-comment"
                value={comment}
                onChange={(e) => { setComment(e.target.value); setError(undefined) }}
                placeholder={isChanges ? 'What should be changed?' : 'Looks great, ship it.'}
                aria-invalid={!!error}
              />
              <FieldError message={error} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button onClick={submit}>{isChanges ? 'Request changes' : 'Approve'}</Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
