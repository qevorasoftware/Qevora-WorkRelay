import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

export type Role = 'Owner' | 'Admin' | 'Member'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string // DEMO ONLY — a real product never stores passwords client-side
  phone: string
  jobTitle: string
  department: string
  location: string
  timezone: string
  language: string
  bio: string
  avatarDataUrl?: string
  role: Role
  status: 'active' | 'invited' | 'suspended'
  emailVerified: boolean
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  backupCodes: string[]
  createdAt: string
  lastLoginAt?: string
}

interface PendingFlow {
  email: string
  name?: string
  password?: string
  otp: string
  expiresAt: number
  purpose: 'verify-email' | 'reset-password'
}

interface TwoFaChallenge {
  userId: string
  otp: string
  expiresAt: number
}

interface AuthState {
  users: AuthUser[]
  sessionUserId: string | null
  pending: PendingFlow | null
  twoFaChallenge: TwoFaChallenge | null
  sessions: { id: string; label: string; current: boolean; lastActive: string }[]

  // flows
  register: (input: { firstName: string; lastName: string; email: string; password: string }) => void
  verifyEmailOtp: (otp: string) => boolean
  resendOtp: () => void
  requestPasswordReset: (email: string) => boolean
  resetPassword: (otp: string, newPassword: string) => boolean
  login: (email: string, password: string) => 'ok' | 'bad-credentials' | '2fa' | 'unverified'
  verifyTwoFa: (otp: string) => boolean
  logout: () => void

  // account management
  updateProfile: (patch: Partial<AuthUser>) => void
  changePassword: (current: string, next: string) => boolean
  startTwoFa: () => { secret: string; backupCodes: string[] } | null
  confirmTwoFa: (otp: string) => boolean
  disableTwoFa: (otp: string) => boolean
  revokeSession: (id: string) => void

  // admin
  adminSetRole: (userId: string, role: Role) => void
  adminSetStatus: (userId: AuthUser['status'], userId2?: string) => void
  adminSetStatusById: (userId: string, status: AuthUser['status']) => void
  adminInvite: (email: string, role: Role) => boolean
  adminRemove: (userId: string) => void
}

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Include at least one letter')
  .regex(/[0-9]/, 'Include at least one number')

const genOtp = () => String(Math.floor(100000 + Math.random() * 900000))
const genSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
const genBackupCodes = () =>
  Array.from({ length: 8 }, () =>
    `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
  )

const OTP_TTL = 5 * 60 * 1000

const seedUsers: AuthUser[] = [
  {
    id: 'u1', firstName: 'Aarav', lastName: 'Shah', email: 'demo@qevora.studio', password: 'demo1234',
    phone: '+91 98765 43210', jobTitle: 'Agency Owner', department: 'Leadership', location: 'Surat, Gujarat, IN',
    timezone: 'Asia/Kolkata', language: 'English', bio: 'Running Qevora Studio — building websites and WorkRelay.',
    role: 'Owner', status: 'active', emailVerified: true, twoFactorEnabled: false, backupCodes: [],
    createdAt: '2025-06-01T09:00:00',
  },
]

const defaultSessions = (_email: string) => [
  { id: 's1', label: `MacBook Pro 16" · Safari — Surat, IN`, current: true, lastActive: 'now' },
  { id: 's2', label: `iPhone 17 Pro · WorkRelay PWA — Ahmedabad, IN`, current: false, lastActive: '2h ago' },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      sessionUserId: null,
      pending: null,
      twoFaChallenge: null,
      sessions: defaultSessions('demo@qevora.studio'),

      register: (input) => {
        const exists = get().users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())
        if (exists) return
        const otp = genOtp()
        set({
          pending: {
            email: input.email,
            name: `${input.firstName} ${input.lastName}`.trim(),
            password: input.password,
            otp,
            expiresAt: Date.now() + OTP_TTL,
            purpose: 'verify-email',
          },
        })
      },

      verifyEmailOtp: (otp) => {
        const p = get().pending
        if (!p || p.purpose !== 'verify-email') return false
        if (Date.now() > p.expiresAt || otp.trim() !== p.otp) return false
        const newUser: AuthUser = {
          id: `x${Date.now().toString(36)}`,
          firstName: p.name?.split(' ')[0] ?? 'New',
          lastName: p.name?.split(' ').slice(1).join(' ') ?? 'Member',
          email: p.email,
          password: p.password ?? '',
          phone: '', jobTitle: 'Team Member', department: 'General', location: '',
          timezone: 'Asia/Kolkata', language: 'English', bio: '',
          role: 'Member', status: 'active', emailVerified: true,
          twoFactorEnabled: false, backupCodes: [],
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }
        set((s) => ({
          users: [...s.users, newUser],
          sessionUserId: newUser.id,
          sessions: defaultSessions(p.email),
          pending: null,
        }))
        return true
      },

      resendOtp: () => {
        const p = get().pending
        if (!p) return
        set({ pending: { ...p, otp: genOtp(), expiresAt: Date.now() + OTP_TTL } })
      },

      requestPasswordReset: (email) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
        if (!user) return false
        set({
          pending: {
            email: user.email,
            otp: genOtp(),
            expiresAt: Date.now() + OTP_TTL,
            purpose: 'reset-password',
          },
        })
        return true
      },

      resetPassword: (otp, newPassword) => {
        const p = get().pending
        if (!p || p.purpose !== 'reset-password') return false
        if (Date.now() > p.expiresAt || otp.trim() !== p.otp) return false
        if (!passwordSchema.safeParse(newPassword).success) return false
        set((s) => ({
          users: s.users.map((u) => (u.email === p.email ? { ...u, password: newPassword } : u)),
          pending: null,
        }))
        return true
      },

      login: (email, password) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
        if (!user || user.password !== password) return 'bad-credentials'
        if (!user.emailVerified) {
          const otp = genOtp()
          set({
            pending: { email: user.email, otp, expiresAt: Date.now() + OTP_TTL, purpose: 'verify-email' },
          })
          return 'unverified'
        }
        if (user.twoFactorEnabled) {
          set({
            twoFaChallenge: { userId: user.id, otp: genOtp(), expiresAt: Date.now() + OTP_TTL },
          })
          return '2fa'
        }
        set((s) => ({
          sessionUserId: user.id,
          twoFaChallenge: null,
          sessions: defaultSessions(user.email),
          users: s.users.map((u) => (u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u)),
        }))
        return 'ok'
      },

      verifyTwoFa: (otp) => {
        const c = get().twoFaChallenge
        if (!c) return false
        const user = get().users.find((u) => u.id === c.userId)
        const valid = Date.now() <= c.expiresAt && (otp.trim() === c.otp || user?.backupCodes.includes(otp.trim()))
        if (!valid || !user) return false
        set((s) => ({
          sessionUserId: user.id,
          twoFaChallenge: null,
          sessions: defaultSessions(user.email),
          users: s.users.map((u) =>
            u.id === user.id
              ? { ...u, lastLoginAt: new Date().toISOString(), backupCodes: u.backupCodes.filter((b) => b !== otp.trim()) }
              : u
          ),
        }))
        return true
      },

      logout: () => set({ sessionUserId: null, twoFaChallenge: null }),

      updateProfile: (patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === s.sessionUserId ? { ...u, ...patch } : u)),
        })),

      changePassword: (current, next) => {
        const s = get()
        const me = s.users.find((u) => u.id === s.sessionUserId)
        if (!me || me.password !== current || !passwordSchema.safeParse(next).success) return false
        set({ users: s.users.map((u) => (u.id === me.id ? { ...u, password: next } : u)) })
        return true
      },

      startTwoFa: () => {
        const s = get()
        const me = s.users.find((u) => u.id === s.sessionUserId)
        if (!me || me.twoFactorEnabled) return null
        const secret = genSecret()
        const backupCodes = genBackupCodes()
        set({ users: s.users.map((u) => (u.id === me.id ? { ...u, twoFactorSecret: secret } : u)) })
        return { secret, backupCodes }
      },

      confirmTwoFa: (otp) => {
        const s = get()
        const me = s.users.find((u) => u.id === s.sessionUserId)
        if (!me || !me.twoFactorSecret) return false
        // Demo check: the on-screen demo authenticator code is derived from the secret
        const expected = me.twoFactorSecret.slice(0, 6)
        if (otp.trim() !== expected) return false
        set({ users: s.users.map((u) => (u.id === me.id ? { ...u, twoFactorEnabled: true } : u)) })
        return true
      },

      disableTwoFa: (otp) => {
        const s = get()
        const me = s.users.find((u) => u.id === s.sessionUserId)
        if (!me || !me.twoFactorEnabled) return false
        const expected = (me.twoFactorSecret ?? '').slice(0, 6)
        if (otp.trim() !== expected) return false
        set({
          users: s.users.map((u) =>
            u.id === me.id ? { ...u, twoFactorEnabled: false, twoFactorSecret: undefined, backupCodes: [] } : u
          ),
        })
        return true
      },

      revokeSession: (id) => set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) })),

      adminSetRole: (userId, role) =>
        set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, role } : u)) })),

      adminSetStatus: (_status, _userId2) => undefined,

      adminSetStatusById: (userId, status) =>
        set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, status } : u)) })),

      adminInvite: (email, role) => {
        const exists = get().users.some((u) => u.email.toLowerCase() === email.toLowerCase())
        if (exists) return false
        const user: AuthUser = {
          id: `x${Date.now().toString(36)}`,
          firstName: email.split('@')[0], lastName: '', email,
          password: genOtp(), phone: '', jobTitle: 'Invited', department: 'General', location: '',
          timezone: 'Asia/Kolkata', language: 'English', bio: '',
          role, status: 'invited', emailVerified: false, twoFactorEnabled: false, backupCodes: [],
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ users: [...s.users, user] }))
        return true
      },

      adminRemove: (userId) =>
        set((s) => ({
          users: s.users.filter((u) => u.id !== userId || u.role === 'Owner'),
        })),
    }),
    {
      name: 'workrelay-auth',
      partialize: (s) => ({ users: s.users, sessionUserId: s.sessionUserId, sessions: s.sessions }),
    }
  )
)

/** Demo authenticator code for a user (shown in demo mode only). */
export function demoAuthenticatorCode(u: AuthUser | undefined): string | null {
  if (!u?.twoFactorSecret) return null
  return u.twoFactorSecret.slice(0, 6)
}

export const authSelectors = {
  me: (s: AuthState) => s.users.find((u) => u.id === s.sessionUserId) ?? null,
  isOwner: (s: AuthState) => s.users.find((u) => u.id === s.sessionUserId)?.role === 'Owner',
  pendingEmail: (s: AuthState) => s.pending?.email ?? null,
  pendingOtp: (s: AuthState) => s.pending?.otp ?? null,
  challengeOtp: (s: AuthState) => s.twoFaChallenge?.otp ?? null,
}
