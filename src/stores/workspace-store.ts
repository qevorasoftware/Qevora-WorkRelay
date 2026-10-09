import { create } from 'zustand'
import type {
  ActivityItem, Approval, ApprovalStatus, Client, FileItem, Notification,
  Project, Request, RequestStatus, User,
} from '../types'
import { users } from '../mocks/users'
import { clients, projects } from '../mocks/projects'
import { approvals, requests } from '../mocks/requests'
import { files } from '../mocks/files'
import { notifications as seedNotifications } from '../mocks/notifications'
import { activity as seedActivity } from '../mocks/notifications'
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
  addFile: (input: { projectId: string; name: string; kind: FileItem['kind']; sizeLabel: string; visibility: FileItem['visibility'] }) => FileItem
  updateFile: (id: string, patch: Partial<FileItem>) => void
  markNotification: (id: string) => void
  markAllNotifications: () => void
}

const logActivity = (state: WorkspaceState, kind: ActivityItem['kind'], action: string, target: string): ActivityItem[] => [
  {
    id: nextId('ac'),
    actorId: CURRENT_USER_ID,
    kind,
    action,
    target,
    at: new Date().toISOString(),
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
    set((s) => ({
      requests: [request, ...s.requests],
      activity: logActivity(s, 'request', 'created', request.title),
    }))
    return request
  },

  setRequestStatus: (id, status) => {
    set((s) => {
      const request = s.requests.find((r) => r.id === id)
      return {
        requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        activity: request ? logActivity(s, 'request', `moved ${request.title} to`, status) : s.activity,
      }
    })
  },

  decideApproval: (id, decision, comment) => {
    set((s) => ({
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
      activity: logActivity(s, 'approval', decision === 'approved' ? 'approved' : 'requested changes on', s.approvals.find((a) => a.id === id)?.artifact ?? ''),
    }))
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
    }
    set((s) => ({
      files: [file, ...s.files],
    }))
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
