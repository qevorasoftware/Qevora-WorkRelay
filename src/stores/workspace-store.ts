import { create } from 'zustand'
import type {
  ActivityChange, ActivityDetail, ActivityItem, Approval, ApprovalStatus,
  Client, FileItem, Notification, Project, Request, RequestStatus, User,
} from '../types'
import { users } from '../mocks/users'
import { clients, projects } from '../mocks/projects'
import { approvals, requests } from '../mocks/requests'
import { files } from '../mocks/files'
import { notifications as seedNotifications } from '../mocks/notifications-seed'
import { activity as seedActivity } from '../mocks/activity'
import { CURRENT_USER_ID } from '../mocks/users'

let idCounter = 100
const nextId = (prefix: string) => `${prefix}${++idCounter}`

interface WorkspaceState {
  loaded: boolean
  users: User[]
  clients: Client[]
  projects: Project[]
  requests: Request[]
  approvals: Approval[]
  files: FileItem[]
  notifications: Notification[]
  activity: ActivityItem[]

  markLoaded: () => void
  createRequest: (input: {
    title: string
    description: string
    projectId: string
    assigneeId: string
    dueDate: string
    visibility: 'client' | 'internal'
  }) => Request
  setRequestStatus: (id: string, status: RequestStatus) => void
  decideApproval: (id: string, decision: Exclude<ApprovalStatus, 'pending'>, comment?: string) => void
  addFile: (input: { projectId: string; name: string; kind: FileItem['kind']; sizeLabel: string; visibility: FileItem['visibility']; objectUrl?: string; mime?: string; textPreview?: string }) => FileItem
  updateFile: (id: string, patch: Partial<FileItem>) => void
  markNotification: (id: string) => void
  markAllNotifications: () => void
}

const sessionRef = () =>
  `WR-SESS-${Math.abs(Date.now() % 10_000_000).toString(36).toUpperCase()}`

const logActivity = (
  state: WorkspaceState,
  kind: ActivityItem['kind'],
  action: string,
  target: string,
  detail: Omit<ActivityDetail, 'device' | 'browser' | 'ip' | 'location' | 'sessionRef'>
): ActivityItem[] => [
  {
    id: nextId('ac'),
    actorId: CURRENT_USER_ID,
    kind,
    action,
    target,
    at: new Date().toISOString(),
    detail: {
      ...detail,
      device: 'MacBook Pro 16"',
      browser: 'Safari 26.0',
      ip: '103.21.58.74',
      location: 'Surat, Gujarat, IN',
      sessionRef: sessionRef(),
    },
  },
  ...state.activity,
]

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  loaded: false,
  users,
  clients,
  projects,
  requests,
  approvals,
  files,
  notifications: seedNotifications,
  activity: seedActivity,

  markLoaded: () => set({ loaded: true }),

  createRequest: (input) => {
    const request: Request = {
      id: nextId('r'),
      ...input,
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    set((s) => {
      const owner = s.users.find((u) => u.id === input.assigneeId)
      const project = s.projects.find((p) => p.id === input.projectId)
      const client = s.clients.find((c) => c.id === project?.clientId)
      const changes: ActivityChange[] = [
        { field: 'Status', from: '—', to: 'Open' },
        { field: 'Owner', from: '—', to: owner ? `${owner.name} (${owner.role})` : input.assigneeId },
        { field: 'Visibility', from: '—', to: input.visibility === 'client' ? 'Client-visible' : 'Internal only' },
        { field: 'Due date', from: '—', to: input.dueDate },
      ]
      return {
        requests: [request, ...s.requests],
        activity: logActivity(s, 'request', 'created request', request.title, {
          entity: 'request',
          entityLabel: request.title,
          entityRef: request.id,
          projectName: project?.name,
          clientName: client?.company,
          changes,
        }),
      }
    })
    return request
  },

  setRequestStatus: (id, status) => {
    set((s) => {
      const request = s.requests.find((r) => r.id === id)
      if (!request) return s
      const statusLabels: Record<RequestStatus, string> = {
        open: 'Open', 'awaiting-client': 'Awaiting client', 'in-review': 'In review', complete: 'Complete',
      }
      const project = s.projects.find((p) => p.id === request.projectId)
      const client = s.clients.find((c) => c.id === project?.clientId)
      return {
        requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        activity: logActivity(s, 'request', 'updated status of', request.title, {
          entity: 'request',
          entityLabel: request.title,
          entityRef: request.id,
          projectName: project?.name,
          clientName: client?.company,
          changes: [{ field: 'Status', from: statusLabels[request.status], to: statusLabels[status] }],
        }),
      }
    })
  },

  decideApproval: (id, decision, comment) => {
    set((s) => {
      const approval = s.approvals.find((a) => a.id === id)
      if (!approval) return s
      const project = s.projects.find((p) => p.id === approval.projectId)
      const client = s.clients.find((c) => c.id === project?.clientId)
      return {
        approvals: s.approvals.map((a) =>
          a.id === id
            ? {
                ...a,
                status: decision,
                history: [
                  ...a.history,
                  { version: a.version, action: decision, byUserId: CURRENT_USER_ID, at: new Date().toISOString(), comment },
                ],
              }
            : a
        ),
        activity: logActivity(s, 'approval', decision === 'approved' ? 'approved' : 'requested changes on', approval.artifact, {
          entity: 'approval',
          entityLabel: approval.artifact,
          entityRef: approval.id,
          version: approval.version,
          projectName: project?.name,
          clientName: client?.company,
          changes: [{ field: 'Decision', from: 'Pending', to: decision === 'approved' ? 'Approved' : 'Changes requested' }],
          comment,
        }),
      }
    })
  },

  addFile: (input) => {
    const file: FileItem = {
      id: nextId('f'),
      projectId: input.projectId,
      name: input.name,
      kind: input.kind,
      sizeLabel: input.sizeLabel,
      version: 'v1',
      uploadedById: CURRENT_USER_ID,
      uploadedAt: new Date().toISOString(),
      visibility: input.visibility,
      uploading: true,
      progress: 0,
      objectUrl: input.objectUrl,
      mime: input.mime,
      textPreview: input.textPreview,
    }
    set((s) => {
      const project = s.projects.find((p) => p.id === input.projectId)
      const client = s.clients.find((c) => c.id === project?.clientId)
      return {
        files: [file, ...s.files],
        activity: logActivity(s, 'file', 'uploaded', file.name, {
          entity: 'file',
          entityLabel: file.name,
          entityRef: file.id,
          version: file.version,
          projectName: project?.name,
          clientName: client?.company,
          changes: [
            { field: 'File', from: '—', to: file.name },
            { field: 'Size', from: '—', to: input.sizeLabel },
            { field: 'Visibility', from: '—', to: input.visibility === 'client' ? 'Client-visible' : 'Internal only' },
          ],
        }),
      }
    })
    return file
  },

  updateFile: (id, patch) =>
    set((s) => ({
      files: s.files.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),

  markNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotifications: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}))

/* ---------- selectors ---------- */
export const pendingApprovals = (s: WorkspaceState) => s.approvals.filter((a) => a.status === 'pending')
export const openRequests = (s: WorkspaceState) => s.requests.filter((r) => r.status !== 'complete')
export const awaitingClientRequests = (s: WorkspaceState) => s.requests.filter((r) => r.status === 'awaiting-client')
export const unreadNotifications = (s: WorkspaceState) => s.notifications.filter((n) => !n.read)
export const userByIdSel = (s: WorkspaceState, id: string) => s.users.find((u) => u.id === id)
