import { useMemo, useRef, useState } from 'react'
import { CloudUpload, File, Folder, UploadCloud } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { PageTransition } from '../../components/layout/page-transition'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Select } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { EmptyState } from '../../components/ui/empty-state'
import { FilePreviewModal } from './file-preview-modal'
import { useWorkspaceStore } from '../../stores/workspace-store'
import { useUiStore } from '../../stores/ui-store'
import { projectById } from '../../mocks/projects'
import { cn, relativeTime } from '../../lib/utils'
import type { FileItem } from '../../types'

const kindLabel = { image: 'Image', doc: 'Document', archive: 'Archive', design: 'Design file' }

function kindOf(name: string): FileItem['kind'] {
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(name)) return 'image'
  if (/\.(zip|rar|7z|tar)$/i.test(name)) return 'archive'
  if (/\.(fig|sketch|xd|ai)$/i.test(name)) return 'design'
  return 'doc'
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function FilesPage() {
  const { files, projects, addFile, updateFile } = useWorkspaceStore()
  const toast = useUiStore((s) => s.toast)
  const [projectFilter, setProjectFilter] = useState('all')
  const [preview, setPreview] = useState<FileItem | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(
    () => files.filter((f) => projectFilter === 'all' || f.projectId === projectFilter),
    [files, projectFilter]
  )

  const startUpload = (names: { name: string; size: number }[]) => {
    names.forEach((n) => {
      const file = addFile({
        projectId: projectFilter === 'all' ? 'p1' : projectFilter,
        name: n.name,
        kind: kindOf(n.name),
        sizeLabel: humanSize(n.size || 512000),
        visibility: 'client',
      })
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        updateFile(file.id, { uploading: false, progress: 100 })
        return
      }
      let p = 0
      const timer = setInterval(() => {
        p += 12 + Math.random() * 14
        if (p >= 100) {
          clearInterval(timer)
          updateFile(file.id, { uploading: false, progress: 100 })
          toast(`${file.name} uploaded`)
        } else {
          updateFile(file.id, { progress: p })
        }
      }, 260)
    })
  }

  return (
    <PageTransition>
      <PageHeader
        title="Files"
        subtitle="Project files with mock previews and version labels."
        actions={
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            <UploadCloud size={15} /> Upload
          </Button>
        }
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const dropped = Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, size: f.size }))
          if (dropped.length) startUpload(dropped)
        }}
        className={cn(
          'mb-4 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed p-7 text-center transition-colors',
          dragOver ? 'border-[var(--accent)] bg-[var(--accent-tint)]' : 'border-[var(--hairline-strong)] hover:border-[var(--accent)]'
        )}
      >
        <CloudUpload size={22} className="text-faint" />
        <p className="text-[13px] font-medium">Drop files here or click to upload</p>
        <p className="text-[11.5px] text-muted">Demo upload — files stay in local app state.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          aria-hidden="true"
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []).map((f) => ({ name: f.name, size: f.size }))
            if (picked.length) startUpload(picked)
            e.target.value = ''
          }}
        />
      </div>

      <div className="mb-4">
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="max-w-64" aria-label="Filter files by project">
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Folder} title="No files" hint="Upload something or change the filter." />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((f) => (
            <Card key={f.id} className="card-hover cursor-pointer p-4" onClick={() => !f.uploading && setPreview(f)}>
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--accent)]" style={{ background: 'var(--accent-tint)' }}>
                  <File size={16} />
                </span>
                <Badge tone={f.visibility === 'client' ? 'info' : 'neutral'}>{f.visibility === 'client' ? 'Client' : 'Internal'}</Badge>
              </div>
              <p className="mt-2.5 truncate text-[13px] font-medium">{f.name}</p>
              <p className="mt-0.5 text-[11.5px] text-muted">
                {kindLabel[f.kind]} · {f.sizeLabel} · {f.version}
              </p>
              <p className="mt-0.5 text-[11px] text-faint">
                {projectById(f.projectId)?.name.split(' — ')[1]} · {relativeTime(f.uploadedAt)}
              </p>
              {f.uploading && (
                <div className="mt-2.5">
                  <Progress value={f.progress ?? 0} />
                  <p className="mt-1 text-[10px] font-medium text-muted">Uploading… {Math.round(f.progress ?? 0)}%</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </PageTransition>
  )
}
