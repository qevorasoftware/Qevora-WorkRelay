import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore, demoAuthenticatorCode } from '../src/features/auth/auth-store'

const fresh = () => {
  useAuthStore.setState({
    users: structuredClone(useAuthStore.getState().users.filter((u) => u.id === 'u1')),
    sessionUserId: null,
    pending: null,
    twoFaChallenge: null,
  })
}

describe('auth store — demo flows', () => {
  beforeEach(fresh)

  it('demo credentials sign in', () => {
    expect(useAuthStore.getState().login('demo@qevora.studio', 'demo1234')).toBe('ok')
    expect(useAuthStore.getState().sessionUserId).toBe('u1')
  })

  it('rejects bad credentials', () => {
    expect(useAuthStore.getState().login('demo@qevora.studio', 'wrong')).toBe('bad-credentials')
  })

  it('register -> wrong OTP rejected -> right OTP creates member session', () => {
    const s = useAuthStore.getState()
    s.register({ firstName: 'Nisha', lastName: 'Patel', email: 'nisha@studio.com', password: 'passw0rd8' })
    expect(useAuthStore.getState().pending?.email).toBe('nisha@studio.com')
    expect(useAuthStore.getState().verifyEmailOtp('000000')).toBe(false)
    const otp = useAuthStore.getState().pending!.otp
    expect(useAuthStore.getState().verifyEmailOtp(otp)).toBe(true)
    const after = useAuthStore.getState()
    expect(after.sessionUserId).not.toBe(null)
    expect(after.users.find((u) => u.email === 'nisha@studio.com')?.role).toBe('Member')
  })

  it('2FA: enable -> login challenges -> authenticator and backup codes both work', () => {
    const st = useAuthStore.getState()
    expect(st.login('demo@qevora.studio', 'demo1234')).toBe('ok')
    const started = st.startTwoFa()!
    expect(started.backupCodes).toHaveLength(8)
    const secret = useAuthStore.getState().users.find((u) => u.id === 'u1')!.twoFactorSecret!
    expect(useAuthStore.getState().confirmTwoFa(secret.slice(0, 6))).toBe(true)
    useAuthStore.getState().logout()

    expect(useAuthStore.getState().login('demo@qevora.studio', 'demo1234')).toBe('2fa')
    const code = demoAuthenticatorCode(useAuthStore.getState().users.find((u) => u.id === 'u1'))
    expect(useAuthStore.getState().verifyTwoFa('999999')).toBe(false)
    expect(useAuthStore.getState().verifyTwoFa(code!)).toBe(true)
    useAuthStore.getState().logout()

    useAuthStore.getState().login('demo@qevora.studio', 'demo1234')
    const backup = useAuthStore.getState().users.find((u) => u.id === 'u1')!.backupCodes![0]
    expect(useAuthStore.getState().verifyTwoFa(backup)).toBe(true)
    expect(useAuthStore.getState().users.find((u) => u.id === 'u1')!.backupCodes).not.toContain(backup)
  })
})
