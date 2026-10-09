import type { Client, Project } from '../types'

export const clients: Client[] = [
  { id: 'c1', name: 'Rita Joshi', company: 'Shakti Textiles', contactUserId: 'u5', portalStatus: 'active', since: '2025-08-14' },
  { id: 'c2', name: 'Manav Desai', company: 'Café Meraki', contactUserId: 'u6', portalStatus: 'active', since: '2026-01-22' },
  { id: 'c3', name: 'Rhea Kapoor', company: 'FitZone Gym', contactUserId: 'u7', portalStatus: 'invited', since: '2026-09-18' },
  { id: 'c4', name: 'Ishaan Mehta', company: 'Nyasa Interiors', contactUserId: 'u8', portalStatus: 'off', since: '2026-09-30' },
]

export const projects: Project[] = [
  {
    id: 'p1', clientId: 'c1', name: 'Shakti Textiles — Website Redesign',
    tagline: 'Full website redesign with new product catalogue and lead capture.',
    status: 'in-progress', health: 'on-track', progress: 62, dueDate: '2026-11-06',
    milestones: [
      { id: 'm1', title: 'Discovery & sitemap', dueDate: '2026-09-26', done: true },
      { id: 'm2', title: 'Content collection', dueDate: '2026-10-14', done: false },
      { id: 'm3', title: 'Design approval', dueDate: '2026-10-21', done: false },
      { id: 'm4', title: 'Development & QA', dueDate: '2026-11-02', done: false },
      { id: 'm5', title: 'Launch', dueDate: '2026-11-06', done: false },
    ],
  },
  {
    id: 'p2', clientId: 'c2', name: 'Café Meraki — Brand & Site',
    tagline: 'Brand refresh, menu pages and online reservation flow.',
    status: 'review', health: 'on-track', progress: 78, dueDate: '2026-10-24',
    milestones: [
      { id: 'm1', title: 'Brand discovery', dueDate: '2026-09-20', done: true },
      { id: 'm2', title: 'Logo & identity', dueDate: '2026-10-08', done: true },
      { id: 'm3', title: 'Menu page approval', dueDate: '2026-10-12', done: false },
      { id: 'm4', title: 'Launch', dueDate: '2026-10-24', done: false },
    ],
  },
  {
    id: 'p3', clientId: 'c3', name: 'FitZone — Landing Page',
    tagline: 'High-conversion landing page for the new membership offer.',
    status: 'blocked', health: 'blocked', progress: 35, dueDate: '2026-10-30',
    milestones: [
      { id: 'm1', title: 'Wireframes', dueDate: '2026-10-03', done: true },
      { id: 'm2', title: 'Brand assets received', dueDate: '2026-10-15', done: false },
      { id: 'm3', title: 'Design & build', dueDate: '2026-10-27', done: false },
      { id: 'm4', title: 'Launch', dueDate: '2026-10-30', done: false },
    ],
  },
  {
    id: 'p4', clientId: 'c4', name: 'Nyasa Interiors — Portfolio',
    tagline: 'Visual-first portfolio site with project case studies.',
    status: 'planning', health: 'at-risk', progress: 10, dueDate: '2026-12-01',
    milestones: [
      { id: 'm1', title: 'Kickoff workshop', dueDate: '2026-10-20', done: false },
      { id: 'm2', title: 'Content & photography', dueDate: '2026-11-10', done: false },
      { id: 'm3', title: 'Design', dueDate: '2026-11-24', done: false },
    ],
  },
]

export const clientById = (id: string) => clients.find((c) => c.id === id)
export const projectById = (id: string) => projects.find((p) => p.id === id)
