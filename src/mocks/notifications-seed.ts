import type { Notification } from '../types'

export const notifications: Notification[] = [
  { id: 'n1', type: 'approval', title: 'Approval pending', body: 'Shakti Textiles — Homepage design v2.0 is awaiting review', target: '/approvals', read: false, at: '2026-10-09T08:10:00' },
  { id: 'n2', type: 'request', title: 'Request due soon', body: 'Logo source files (SVG / AI) are due Oct 13', target: '/requests', read: false, at: '2026-10-09T07:30:00' },
  { id: 'n3', type: 'mention', title: 'Priya mentioned you', body: '"Keep the client-facing note simple…" in Team chat', target: '/chat', read: true, at: '2026-10-09T09:15:00' },
  { id: 'n4', type: 'file', title: 'New file uploaded', body: 'menu-concepts.fig added to Café Meraki — Brand & Site', target: '/files', read: true, at: '2026-10-08T16:05:00' },
  { id: 'n5', type: 'system', title: 'Validation reminder', body: 'Customer interviews: 6 of 10 completed — 4 to go this week', target: '/settings', read: false, at: '2026-10-08T11:00:00' },
]
