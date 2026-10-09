import { Dialog, DialogContent } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  FileArchive, FileImage, FileText, Figma, Download, Eye,
  FileAudio, FileVideo, FileCode2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useUiStore } from '../../stores/ui-store'
import { relativeTime } from '../../lib/utils'
import type { FileItem } from '../../types'

const kindIcon: Record<FileItem['kind'], LucideIcon> = {
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

  const url = file.objectUrl
  const mime = file.mime ?? ''
  const textLike = /\.(txt|md|csv|json|log|xml|yml|yaml)$/i.test(file.name) || mime.startsWith('text/')

  const isImg = url && (mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(file.name))
  const isPdf = url && (mime === 'application/pdf' || /\.pdf$/i.test(file.name))
  const isVideo = url && (mime.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name))
  const isAudio = url && (mime.startsWith('audio/') || /\.(mp3|wav|ogg|m4a)$/i.test(file.name))
  const isCode = /\.(js|jsx|ts|tsx|css|html|py|sh)$/i.test(file.name) && (url || file.textPreview)

  const download = () => {
    if (url) {
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      return
    }
    toast(`Downloading ${file.name} (demo)`, 'info')
  }

  return (
    <Dialog open={!!file} onOpenChange={(o) => !o && onClose()}>
      <DialogContent title={file.name} description={`${file.sizeLabel} · ${file.version} · uploaded ${relativeTime(file.uploadedAt)}`} className="w-[min(94vw,640px)]">
        <div className="space-y-4">
          {/* ----- Real previews for uploaded files ----- */}
          {isImg && (
            <img
              src={url}
              alt={`Preview of ${file.name}`}
              className="max-h-[60vh] w-full rounded-xl border border-line object-contain"
              style={{ background: 'var(--fill)' }}
            />
          )}

          {isPdf && (
            <iframe
              src={url}
              title={`Preview of ${file.name}`}
              className="h-[60vh] w-full rounded-xl border border-line bg-white"
            />
          )}

          {isVideo && (
            <video src={url} controls className="max-h-[60vh] w-full rounded-xl border border-line" style={{ background: '#000' }} />
          )}

          {isAudio && (
            <div className="rounded-xl border border-line p-5" style={{ background: 'var(--fill)' }}>
              <audio src={url} controls className="w-full" />
            </div>
          )}

          {(file.textPreview || (textLike && url)) && !isCode && (
            <pre className="scroll-thin max-h-[55vh] overflow-auto rounded-xl border border-line p-4 text-[12px] leading-relaxed whitespace-pre-wrap break-words" style={{ background: 'var(--fill)' }}>
              {file.textPreview}
            </pre>
          )}

          {isCode && (
            <pre className="scroll-thin max-h-[55vh] overflow-auto rounded-xl border border-line p-4 font-mono text-[12px] leading-relaxed" style={{ background: 'var(--fill)' }}>
              <code>{file.textPreview ?? '…'}</code>
            </pre>
          )}

          {/* ----- Mock panel for seeded demo files ----- */}
          {!isImg && !isPdf && !isVideo && !isAudio && !(file.textPreview || textLike) && !isCode && (
            <>
              <div
                className="flex h-48 items-center justify-center rounded-xl border border-line"
                style={{ background: 'var(--fill)' }}
                role="img"
                aria-label={`Placeholder preview of ${file.name}`}
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface)] shadow-sm"
                  style={{ color: kindTone[file.kind] }}
                >
                  <Icon size={28} />
                </span>
              </div>
              <p className="text-center text-[11px] text-muted">
                {url ? 'This format has no inline preview — download to view.' : 'Seeded demo file — upload your own file to see a real preview.'}
              </p>
            </>
          )}

          <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px]" style={{ background: 'var(--fill)' }}>
            <div className="min-w-0">
              <p className="font-semibold">Version history</p>
              <p className="mt-0.5 truncate text-muted">{file.version} (current) · {file.visibility === 'client' ? 'Shared with client' : 'Internal only'}</p>
            </div>
            <Badge tone={file.visibility === 'client' ? 'info' : 'neutral'}>{file.visibility === 'client' ? 'Client' : 'Internal'}</Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => toast('Version history arrives with backend storage', 'info')}>
              <Eye size={14} /> Versions
            </Button>
            <Button className="flex-1" onClick={download}>
              <Download size={14} /> Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
