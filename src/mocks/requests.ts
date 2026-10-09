import type { Approval, Request } from '../types'

export const requests: Request[] = [
  {
    id: 'r1', projectId: 'p1', title: 'Homepage hero copy',
    description: 'Final headline, sub-headline and CTA text for the new homepage hero. Please confirm brand tone.',
    assigneeId: 'u5', status: 'awaiting-client', dueDate: '2026-10-12', visibility: 'client', createdAt: '2026-10-05T09:20:00',
  },
  {
    id: 'r2', projectId: 'p1', title: 'Logo source files (SVG / AI)',
    description: 'Vector source files of the Shakti Textiles logo for print-quality usage across the site.',
    assigneeId: 'u5', status: 'open', dueDate: '2026-10-13', visibility: 'client', createdAt: '2026-10-06T11:05:00',
  },
  {
    id: 'r3', projectId: 'p1', title: 'Team photos — leadership page',
    description: '6–8 professional photos of the leadership team, shot in consistent light. Uploading to review folder.',
    assigneeId: 'u3', status: 'in-review', dueDate: '2026-10-10', visibility: 'client', createdAt: '2026-10-02T15:40:00',
  },
  {
    id: 'r4', projectId: 'p2', title: 'Final menu PDF + dish photos',
    description: 'Print-ready autumn menu PDF plus 10 hero shots of signature dishes for the menu page.',
    assigneeId: 'u6', status: 'awaiting-client', dueDate: '2026-10-11', visibility: 'client', createdAt: '2026-10-04T10:00:00',
  },
  {
    id: 'r5', projectId: 'p2', title: 'Social handles + analytics access',
    description: 'Instagram/Facebook handle list and read-only GA4 access for conversion tracking setup.',
    assigneeId: 'u4', status: 'complete', dueDate: '2026-10-05', visibility: 'client', createdAt: '2026-10-01T09:00:00',
  },
  {
    id: 'r6', projectId: 'p3', title: 'Brand assets + style guide',
    description: 'INTERNAL: vendor has been paid and will deliver the FitZone brand kit by Oct 15. Do not expose procurement note to client portal.',
    assigneeId: 'u2', status: 'open', dueDate: '2026-10-15', visibility: 'internal', createdAt: '2026-10-07T13:30:00',
  },
  {
    id: 'r7', projectId: 'p3', title: 'Trainer bios and certifications',
    description: 'Short bios, photos and certification scans for all 6 trainers on the trainers section.',
    assigneeId: 'u7', status: 'awaiting-client', dueDate: '2026-10-18', visibility: 'client', createdAt: '2026-10-06T16:45:00',
  },
  {
    id: 'r8', projectId: 'p1', title: 'SEO keyword confirmation',
    description: 'Confirm the final keyword clusters for the catalogue pages before dev starts on-page SEO.',
    assigneeId: 'u4', status: 'complete', dueDate: '2026-10-06', visibility: 'internal', createdAt: '2026-10-03T12:15:00',
  },
]

export const approvals: Approval[] = [
  {
    id: 'a1', projectId: 'p1', artifact: 'Homepage design', version: 'v2.0', status: 'pending', reviewerId: 'u5',
    history: [
      { version: 'v1.0', action: 'submitted', byUserId: 'u3', at: '2026-09-30T10:00:00' },
      { version: 'v1.0', action: 'changes-requested', byUserId: 'u5', at: '2026-10-04T14:30:00', comment: 'Hero image feels dated — please try a lighter, textile-focused visual.' },
      { version: 'v2.0', action: 'submitted', byUserId: 'u3', at: '2026-10-08T09:10:00' },
    ],
  },
  {
    id: 'a2', projectId: 'p2', artifact: 'Logo concepts', version: 'v1.0', status: 'changes-requested', reviewerId: 'u6',
    history: [
      { version: 'v1.0', action: 'submitted', byUserId: 'u3', at: '2026-10-02T09:00:00' },
      { version: 'v1.0', action: 'changes-requested', byUserId: 'u6', at: '2026-10-05T18:20:00', comment: 'Closer to a hand-drawn mark please — option 2 direction.' },
    ],
  },
  {
    id: 'a3', projectId: 'p2', artifact: 'Menu page design', version: 'v1.2', status: 'pending', reviewerId: 'u6',
    history: [
      { version: 'v1.0', action: 'submitted', byUserId: 'u3', at: '2026-10-06T11:00:00' },
      { version: 'v1.2', action: 'submitted', byUserId: 'u3', at: '2026-10-08T17:25:00' },
    ],
  },
  {
    id: 'a4', projectId: 'p3', artifact: 'Landing wireframes', version: 'v1.0', status: 'approved', reviewerId: 'u2',
    history: [
      { version: 'v1.0', action: 'submitted', byUserId: 'u3', at: '2026-10-01T10:00:00' },
      { version: 'v1.0', action: 'approved', byUserId: 'u2', at: '2026-10-03T12:00:00', comment: 'Structure approved — proceed to design.' },
    ],
  },
  {
    id: 'a5', projectId: 'p1', artifact: 'Footer + contact section', version: 'v1.1', status: 'pending', reviewerId: 'u5',
    history: [
      { version: 'v1.0', action: 'submitted', byUserId: 'u3', at: '2026-10-07T09:40:00' },
      { version: 'v1.1', action: 'submitted', byUserId: 'u3', at: '2026-10-09T08:55:00' },
    ],
  },
]
