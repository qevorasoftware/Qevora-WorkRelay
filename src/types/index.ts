export type ID = string

export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'blocked' | 'completed'
export type RequestStatus = 'open' | 'awaiting-client' | 'in-review' | 'complete'
export type ApprovalStatus = 'pending' | 'approved' | 'changes-requested'
export type Visibility = 'client' | 'internal'
export type Health = 'on-track' | 'at-risk' | 'blocked'
export type FileKind = 'image' | 'doc' | 'archive' | 'design'

export interface User {
  id: ID
  name: string
  email: string
  role: string
  initials: string
  hue: number
  online?: boolean
}

export interface Client {
  id: ID
  name: string
  company: string
  contactUserId: ID
  portalStatus: 'active' | 'invited' | 'off'
  since: string
}

export interface Milestone {
  id: ID
  title: string
  dueDate: string
  done: boolean
}

export interface Project {
  id: ID
  clientId: ID
  name: string
  tagline: string
  status: ProjectStatus
  health: Health
  progress: number
  dueDate: string
  milestones: Milestone[]
}

export interface Request {
  id: ID
  projectId: ID
  title: string
  description: string
  assigneeId: ID
  status: RequestStatus
  dueDate: string
  visibility: Visibility
  createdAt: string
}

export interface ApprovalEvent {
  version: string
  action: 'submitted' | 'approved' | 'changes-requested'
  byUserId: ID
  at: string
  comment?: string
}

export interface Approval {
  id: ID
  projectId: ID
  artifact: string
  version: string
  status: ApprovalStatus
  reviewerId: ID
  history: ApprovalEvent[]
}

export interface Reaction {
  emoji: string
  userIds: ID[]
}

export interface Message {
  id: ID
  senderId: ID
  body: string
  createdAt: string
  replyToId?: ID
  reactions: Reaction[]
}

export interface Conversation {
  id: ID
  type: 'dm' | 'group' | 'project'
  name?: string
  participantIds: ID[]
  projectId?: ID
  visibility: Visibility
  unread: number
  messages: Message[]
}

export interface FileItem {
  id: ID
  projectId: ID
  name: string
  kind: FileKind
  sizeLabel: string
  version: string
  uploadedById: ID
  uploadedAt: string
  visibility: Visibility
  progress?: number
  uploading?: boolean
}

export interface Notification {
  id: ID
  type: 'approval' | 'request' | 'mention' | 'file' | 'system'
  title: string
  body: string
  target: string
  read: boolean
  at: string
}

export interface ActivityItem {
  id: ID
  actorId: ID
  kind: 'request' | 'approval' | 'chat' | 'file' | 'project'
  action: string
  target: string
  at: string
}
