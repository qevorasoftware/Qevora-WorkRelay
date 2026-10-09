import type { ActivityItem } from '../types'

const session = (n: number) => `WR-SESS-${(4128 + n * 37).toString(36).toUpperCase()}`

export const activity: ActivityItem[] = [
  {
    id: 'ac1', actorId: 'u3', kind: 'approval', action: 'submitted for approval', target: 'Homepage design v2.0', at: '2026-10-08T09:12:00',
    detail: {
      entity: 'approval', entityLabel: 'Homepage design', entityRef: 'a1', version: 'v2.0',
      projectName: 'Shakti Textiles — Website Redesign', clientName: 'Shakti Textiles',
      changes: [{ field: 'Version', from: 'v1.0', to: 'v2.0' }, { field: 'Status', from: 'Changes requested', to: 'Pending review' }],
      comment: 'Hero visual reworked to the lighter textile direction Rita asked for.',
      device: 'MacBook Pro 16"', browser: 'Safari 26.0', ip: '103.21.58.74', location: 'Surat, Gujarat, IN', sessionRef: session(1),
    },
  },
  {
    id: 'ac2', actorId: 'u5', kind: 'chat', action: 'sent a message in', target: 'Shakti Textiles — Project chat', at: '2026-10-09T09:40:00',
    detail: {
      entity: 'conversation', entityLabel: 'Shakti Textiles — Project chat', entityRef: 'cv2',
      projectName: 'Shakti Textiles — Website Redesign', clientName: 'Shakti Textiles',
      changes: [{ field: 'Messages', from: '2', to: '3' }],
      comment: '"The new hero looks much better. I\'ll send the logo source files by Friday."',
      device: 'iPhone 17 Pro', browser: 'WorkRelay PWA (iOS 26)', ip: '49.36.180.212', location: 'Ahmedabad, Gujarat, IN', sessionRef: session(2),
    },
  },
  {
    id: 'ac3', actorId: 'u2', kind: 'request', action: 'created request', target: 'Homepage hero copy', at: '2026-10-05T09:20:00',
    detail: {
      entity: 'request', entityLabel: 'Homepage hero copy', entityRef: 'r1',
      projectName: 'Shakti Textiles — Website Redesign', clientName: 'Shakti Textiles',
      changes: [
        { field: 'Status', from: '—', to: 'Open' },
        { field: 'Owner', from: '—', to: 'Rita Joshi (Client)' },
        { field: 'Visibility', from: '—', to: 'Client-visible' },
        { field: 'Due date', from: '—', to: 'Oct 12, 2026' },
      ],
      device: 'iPad Air 13"', browser: 'Safari 26.0', ip: '103.21.58.90', location: 'Surat, Gujarat, IN', sessionRef: session(3),
    },
  },
  {
    id: 'ac4', actorId: 'u5', kind: 'approval', action: 'requested changes on', target: 'Homepage design v1.0', at: '2026-10-04T14:30:00',
    detail: {
      entity: 'approval', entityLabel: 'Homepage design', entityRef: 'a1', version: 'v1.0',
      projectName: 'Shakti Textiles — Website Redesign', clientName: 'Shakti Textiles',
      changes: [{ field: 'Status', from: 'Pending', to: 'Changes requested' }],
      comment: 'Hero image feels dated — please try a lighter, textile-focused visual.',
      device: 'Windows 11 Laptop', browser: 'Chrome 141.0', ip: '117.99.44.18', location: 'Surat, Gujarat, IN', sessionRef: session(4),
    },
  },
  {
    id: 'ac5', actorId: 'u6', kind: 'approval', action: 'requested changes on', target: 'Logo concepts v1.0', at: '2026-10-05T18:20:00',
    detail: {
      entity: 'approval', entityLabel: 'Logo concepts', entityRef: 'a2', version: 'v1.0',
      projectName: 'Café Meraki — Brand & Site', clientName: 'Café Meraki',
      changes: [{ field: 'Status', from: 'Pending', to: 'Changes requested' }],
      comment: 'Closer to a hand-drawn mark please — option 2 direction.',
      device: 'MacBook Air 13"', browser: 'Arc 2.0', ip: '157.32.9.201', location: 'Vadodara, Gujarat, IN', sessionRef: session(5),
    },
  },
  {
    id: 'ac6', actorId: 'u3', kind: 'file', action: 'uploaded', target: 'menu-concepts.fig', at: '2026-10-05T11:20:00',
    detail: {
      entity: 'file', entityLabel: 'menu-concepts.fig', entityRef: 'f4', version: 'v1',
      projectName: 'Café Meraki — Brand & Site', clientName: 'Café Meraki',
      changes: [
        { field: 'File', from: '—', to: 'menu-concepts.fig' },
        { field: 'Size', from: '—', to: '12 MB' },
        { field: 'Visibility', from: '—', to: 'Client-visible' },
      ],
      device: 'MacBook Pro 16"', browser: 'Figma desktop → WorkRelay', ip: '103.21.58.74', location: 'Surat, Gujarat, IN', sessionRef: session(6),
    },
  },
  {
    id: 'ac7', actorId: 'u4', kind: 'request', action: 'completed request', target: 'Social handles + analytics access', at: '2026-10-05T17:00:00',
    detail: {
      entity: 'request', entityLabel: 'Social handles + analytics access', entityRef: 'r5',
      projectName: 'Café Meraki — Brand & Site', clientName: 'Café Meraki',
      changes: [{ field: 'Status', from: 'Awaiting client', to: 'Complete' }],
      device: 'Windows 11 Desktop', browser: 'Firefox 146.0', ip: '49.36.190.8', location: 'Rajkot, Gujarat, IN', sessionRef: session(7),
    },
  },
  {
    id: 'ac8', actorId: 'u2', kind: 'project', action: 'updated milestone in', target: 'Café Meraki — Brand & Site', at: '2026-10-08T15:45:00',
    detail: {
      entity: 'project', entityLabel: 'Café Meraki — Brand & Site', entityRef: 'p2',
      projectName: 'Café Meraki — Brand & Site', clientName: 'Café Meraki',
      changes: [
        { field: 'Milestone "Logo & identity"', from: 'In progress', to: 'Done' },
        { field: 'Project progress', from: '64%', to: '78%' },
      ],
      device: 'iPad Air 13"', browser: 'Safari 26.0', ip: '103.21.58.90', location: 'Surat, Gujarat, IN', sessionRef: session(8),
    },
  },
]
