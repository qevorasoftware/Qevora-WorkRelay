import { Dialog, DialogContent } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { FileArchive, FileImage, FileText, Figma, Download } from 'lucide-react'
import { useUiStore } from '../../stores/ui-store'
import { relativeTime } from '../../lib/utils'
import type { FileItem } from '../../types'

const kindIcon = {
  image: FileImage,
  doc: FileText,
  archive: FileArchive,
  design: Figma,
}

const kindTone = {
  image: 'var(--info)',
  doc: 'var(--warning)',
  archive: 'var(--accent)',
  design: 'var(--success)',
}

export function FilePreviewModal({ file, onClose }: {
  file: FileItem | null
  onClose: () => void
}) {
  const toast = useUiStore((s) => s.toast)
  if (!file) return null
  const Icon = kindIcon[file.kind]

  return (
    <Dialog open={!!file} onOpenChange={(o) => !o && onClose()}>
      <DialogContent title={file.name} description={`${file.sizeLabel} · ${file.version} · uploaded ${relativeTime(file.uploadedAt)}`}>
        <div className="space-y-4">
          <div
            className="flex h-48 items-center justify-center rounded-xl border border-line"
            style={{ background: 'var(--fill)' }}
            aria-label={`Preview of ${file.name} (mock)`}
            role="img"
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface)] shadow-sm"
              style={{ color: kindTone[file.kind] }}
            >
              <Icon size={28} />
            </span>
          </div>
          <p className="text-center text-[11px] text-muted">Mock preview — real previews arrive with the backend storage phase.</p>

          <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px]" style={{ background: 'var(--fill)' }}>
            <div>
              <p className="font-semibold">Version history</p>
              <p className="mt-0.5 text-muted">{file.version} (current) · {file.visibility === 'client' ? 'Shared with client' : 'Internal only'}</p>
            </div>
            <Badge tone={file.visibility === 'client' ? 'info' : 'neutral'}>{file.visibility === 'client' ? 'Client' : 'Internal'}</Badge>
          </div>

          <Button className="w-full" onClick={() => toast(`Downloading ${file.name} (demo)`, 'info')}>
            <Download size={14} /> Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
