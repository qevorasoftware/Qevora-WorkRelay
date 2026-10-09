import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap } from 'lucide-react'
import { AuthLayout, AuthError } from './auth-layout'
import { OtpInput, DemoAuthenticatorHint, DemoMailbox } from './otp-input'
import { useAuthStore, demoAuthenticatorCode } from './auth-store'
import { SocialButtons } from './social-buttons'
import { Button } from '../../components/ui/button'
import { Input, FieldError } from '../../components/ui/input'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dest = (location.state as { from?: string } | null)?.from ?? '/'
  const login = useAuthStore((s) => s.login)
  const verifyTwoFa = useAuthStore((s) => s.verifyTwoFa)
  const users = useAuthStore((s) => s.users)
  const challenge = useAuthStore((s) => s.twoFaChallenge)
  const pending = useAuthStore((s) => s.pending)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string>()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState<string>()


  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    if (!email.trim() || !password) {
      setError('Enter your email and password')
      return
    }
    const result = login(email, password)
    if (result === 'ok') navigate(dest, { replace: true })
    else if (result === '2fa') setOtp('')
    else if (result === 'unverified') return
    else setError('Email or password is incorrect')
  }

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyTwoFa(otp)) navigate(dest, { replace: true })
    else setOtpError('That code didn\'t match. Try the current one.')
  }

  const challengeUser = users.find((u) => u.id === challenge?.userId)
  const pendingUser = users.find((u) => u.email.toLowerCase() === pending?.email.toLowerCase())

  /* ---- 2FA step ---- */
  if (challenge) {
    return (
      <AuthLayout
        title="Two-factor verification"
        subtitle={`Enter the 6-digit code from your authenticator for ${challengeUser?.email}`}
        footer={<Link to="/login" className="font-medium text-[var(--accent)] hover:underline" onClick={() => useAuthStore.setState({ twoFaChallenge: null })}>← Back to sign in</Link>}
      >
        <form onSubmit={submitOtp} className="space-y-4">
          <DemoAuthenticatorHint code={challenge.otp} />
          <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError(undefined) }} />
          <FieldError message={otpError} />
          <Button type="submit" className="w-full">Verify and sign in</Button>
        </form>
      </AuthLayout>
    )
  }

  /* ---- unverified: redirect-ish to verify ---- */
  if (pending?.purpose === 'verify-email' && pendingUser && !pendingUser.emailVerified) {
    return <VerifyNotice />
  }

  return (
    <AuthLayout
      title="Sign in to WorkRelay"
      subtitle="Welcome back — pick up where your projects left off."
      footer={<>New to WorkRelay? <Link to="/register" className="font-medium text-[var(--accent)] hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="li-email">Email</label>
          <Input id="li-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="li-pw">Password</label>
            <Link to="/forgot" className="mb-1 text-[11.5px] font-medium text-[var(--accent)] hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Input id="li-pw" type={showPw ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
            <button type="button" aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--text)]">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <AuthError message={error} />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--hairline)]" />
        <span className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">demo access</span>
        <span className="h-px flex-1 bg-[var(--hairline)]" />
      </div>

      {/* Demo credentials — front and centre so anyone can sign in */}
      <div className="glass-card rounded-2xl p-3.5">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="badge-accent flex h-6 w-6 shrink-0 items-center justify-center !border-0"><Zap size={12} /></span>
          <p className="text-[12.5px] font-semibold">Try the full workspace — no signup</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            aria-label="Fill demo email"
            onClick={() => { setEmail('demo@qevora.studio'); setError(undefined) }}
            className="rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-3 py-2 text-left transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:shadow-[0_6px_18px_-8px_rgba(0,0,0,0.25)]"
          >
            <p className="text-[9.5px] font-semibold uppercase tracking-wider text-faint">Email · tap to fill</p>
            <p className="truncate text-[12.5px] font-medium">demo@qevora.studio</p>
          </button>
          <button
            type="button"
            aria-label="Fill demo password"
            onClick={() => { setPassword('demo1234'); setError(undefined) }}
            className="rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-3 py-2 text-left transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:shadow-[0_6px_18px_-8px_rgba(0,0,0,0.25)]"
          >
            <p className="text-[9.5px] font-semibold uppercase tracking-wider text-faint">Password · tap to fill</p>
            <p className="truncate text-[12.5px] font-medium">demo1234</p>
          </button>
        </div>
        <Button
          variant="secondary"
          className="mt-2.5 w-full"
          onClick={() => {
            setEmail('demo@qevora.studio')
            setPassword('demo1234')
            const result = login('demo@qevora.studio', 'demo1234')
            if (result === 'ok') navigate(dest, { replace: true })
          }}
        >
          <Zap size={14} /> One-click demo sign in
        </Button>
      </div>

      <SocialButtons />
    </AuthLayout>
  )
}

function VerifyNotice() {
  const pending = useAuthStore((s) => s.pending)!
  const users = useAuthStore((s) => s.users)
  const user = users.find((u) => u.email.toLowerCase() === pending.email.toLowerCase())
  void demoAuthenticatorCode(user)
  return (
    <AuthLayout title="Verify your email" subtitle={`We need to verify ${pending.email} before you can sign in.`}
      footer={<Link to="/login" className="font-medium text-[var(--accent)] hover:underline">← Back to sign in</Link>}>
      <VerifyFlow />
    </AuthLayout>
  )
}

export function VerifyFlow({ onVerified }: { onVerified?: () => void } = {}) {
  const pending = useAuthStore((s) => s.pending)
  const verifyEmailOtp = useAuthStore((s) => s.verifyEmailOtp)
  const resendOtp = useAuthStore((s) => s.resendOtp)
  const navigate = useNavigate()
  const location = useLocation()
  const dest = (location.state as { from?: string } | null)?.from ?? '/'
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string>()
  const [resent, setResent] = useState(false)

  if (!pending) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyEmailOtp(otp)) {
      if (onVerified) onVerified()
      else navigate(dest, { replace: true })
    }
    else setError('The code is wrong or expired — request a new one.')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <DemoMailbox email={pending.email} otp={pending.otp} purpose="email verification" />
      <OtpInput value={otp} onChange={(v) => { setOtp(v); setError(undefined) }} />
      <AuthError message={error} />
      <Button type="submit" className="w-full">Verify email</Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => { resendOtp(); setResent(true); setTimeout(() => setResent(false), 2500) }}
      >
        {resent ? 'New code sent ✓' : 'Resend code'}
      </Button>
    </form>
  )
}
