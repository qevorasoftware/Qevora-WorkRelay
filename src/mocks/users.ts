import type { User } from '../types'

export const CURRENT_USER_ID = 'u1'

export const users: User[] = [
  { id: 'u1', name: 'Aarav Shah', email: 'aarav@qevora.studio', role: 'Agency Owner', initials: 'AS', hue: 245, online: true },
  { id: 'u2', name: 'Priya Patel', email: 'priya@qevora.studio', role: 'Project Manager', initials: 'PP', hue: 320, online: true },
  { id: 'u3', name: 'Dev Mehta', email: 'dev@qevora.studio', role: 'Lead Designer', initials: 'DM', hue: 190, online: true },
  { id: 'u4', name: 'Nikhil Rao', email: 'nikhil@qevora.studio', role: 'WordPress Developer', initials: 'NR', hue: 150, online: false },
  { id: 'u5', name: 'Rita Joshi', email: 'rita@shaktitextiles.in', role: 'Client — Shakti Textiles', initials: 'RJ', hue: 20, online: true },
  { id: 'u6', name: 'Manav Desai', email: 'manav@cafemeraki.co', role: 'Client — Café Meraki', initials: 'MD', hue: 100, online: false },
  { id: 'u7', name: 'Rhea Kapoor', email: 'rhea@fitzonegym.in', role: 'Client — FitZone Gym', initials: 'RK', hue: 350, online: false },
  { id: 'u8', name: 'Ishaan Mehta', email: 'ishaan@nyasa.in', role: 'Client — Nyasa Interiors', initials: 'IM', hue: 260, online: false },
]

export const userById = (id: string) => users.find((u) => u.id === id)
