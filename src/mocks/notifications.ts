import type { ActivityItem, Notification } from '../types'

export const notifications: Notification[] = [
  { id: 'n1', type: 'approval', title: 'Approval pending', body: 'Shakti Textiles — Homepage design v2.0 is awaiting review', target: '/approvals', read: false, at: '2026-10-09T08:10:00' },
  { id: 'n2', type: 'request', title: 'Request due soon', body: 'Logo source files (SVG / AI) are due Oct 13', target: '/requests', read: false, at: '2026-10-09T07:30:00' },
  { id: 'n3', type: 'mention', title: 'Priya mentioned you', body: '"Keep the client-facing note simple…" in Team chat', target: '/chat', read: true, at: '2026-10-09T09:15:00' },
  { id: 'n4', type: 'file', title: 'New file uploaded', body: 'menu-concepts.fig added to Café Meraki — Brand & Site', target: '/files', read: true, at: '2026-10-08T16:05:00' },
  { id: 'n5', type: 'system', title: 'Validation reminder', body: 'Customer interviews: 6 of 10 completed — 4 to go this week', target: '/settings', read: false, at: '2026-10-08T11:00:00' },
]

export const activity: ActivityItem[] = [
  { id: 'ac1', actorId: 'u3', kind: 'approval', action: 'submitted', target: 'Homepage design v2.0', at: '2026-10-08T09:12:00' },
  { id: 'ac2', actorId: 'u5', kind: 'chat', action: 'messaged in', target: 'Shakti Textiles — Project chat', at: '2026-10-09T09:40:00' },
  { id: 'ac3', actorId: 'u2', kind: 'request', action: 'created', target: 'Homepage hero copy', at: '2026-10-05T09:20:00' },
  { id: 'ac4', actorId: 'u5', kind: 'approval', action: 'requested changes on', target: 'Homepage design v1.0', at: '2026-10-04T14:30:00' },
  { id: 'ac5', actorId: 'u6', kind: 'approval', action: 'requested changes on', target: 'Logo concepts v1.0', at: '2026-10-05T18:20:00' },
  { id: 'ac6', actorId: 'u3', kind: 'file', action: 'uploaded', target: 'menu-concepts.fig', at: '2026-10-05T11:20:00' },
  { id: 'ac7', actorId: 'u4', kind: 'request', action: 'completed', target: 'Social handles + analytics access', at: '2026-10-05T17:00:00' },
  { id: 'ac8', actorId: 'u2', kind: 'project', action: 'updated milestone in', target: 'Café Meraki — Brand & Site', at: '2026-10-08T15:45:00' },
]
