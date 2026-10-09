import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, CheckCircle2, ShieldCheck, Download } from 'lucide-react'
import { AuthLayout, AuthError } from './auth-layout'
import { VerifyFlow } from './login-page'
import { useAuthStore, passwordSchema, demoAuthenticatorCode } from './auth-store'
import { Button } from '../../components/ui/button'
import { Input, FieldError } from '../../components/ui/input'
import { PasswordStrength } from './otp-input'

type Step = 'details' | 'verify' | 'twofa-offer' | 'twofa-setup' | 'done'

function QrPlaceholder({ secret }: { secret: string }) {
  // Deterministic pseudo-QR (demo only) — real implementation uses a QR library
  const cells = useMemo(() => {
    const size = 21
    const out: boolean[] = []
    let seed = [...secret].reduce((a, c) => a + c.charCodeAt(0), 7)
    for (let i = 0; i < size * size; i++) {
      seed = (seed * 31 + 17) % 997
      out.push(seed % 2 === 0)
    }
    const finder = (r: number, c: number) =>
      (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7)
    return out.map((v, i) => {
      const r = Math.floor(i / size)
      const c = i % size
      if (finder(r, c)) {
        const rr = r % (size < 7 ? 7 : 7)
        void rr
        const lr = r < 7 ? r : r - (size - 7)
        const lc = c < 7 ? c : c - (size - 7)
        const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6
        const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
        return edge || core
      }
      return v
    })
  }, [secret])
  const size = 21
  return (
    <div className="mx-auto w-fit rounded-xl border border-line bg-white p-3 shadow-sm">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-40 w-40" role="img" aria-label="Authenticator QR code (demo)">
        {cells.map((on, i) =>
          on ? <rect key={i} x={i % size} y={Math.floor(i / size)} width="1" height="1" fill="#1D1D1F" /> : null
        )}
      </svg>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const pending = useAuthStore((s) => s.pending)
  const startTwoFa = useAuthStore((s) => s.startTwoFa)
  const confirmTwoFa = useAuthStore((s) => s.confirmTwoFa)
  const me = useAuthStore((s) => s.users.find((u) => u.id === s.sessionUserId))
  const demoCode = demoAuthenticatorCode(me)

  const [step, setStep] = useState<Step>('details')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [setup, setSetup] = useState<{ secret: string; backupCodes: string[] } | null>(null)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState<string>()
  const [copied, setCopied] = useState(false)

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (firstName.trim().length < 2) next.firstName = 'Enter your first name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email'
    const pw = passwordSchema.safeParse(password)
    if (!pw.success) next.password = pw.error.issues[0].message
    if (password !== confirm) next.confirm = 'Passwords don\'t match'
    setErrors(next)
    if (Object.keys(next).length) return
    register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password })
    setStep('verify')
  }

  /* ---- Step: verify email ---- */
  if (step === 'verify' || (pending && step === 'details' && false)) {
    return (
      <AuthLayout title="Verify your email" subtitle={`One last step — confirm ${pending?.email ?? email} is yours.`}
        footer={<Link to="/login" className="font-medium text-[var(--accent)] hover:underline">← Back to sign in</Link>}>
        <VerifyFlow onVerified={() => setStep('twofa-offer')} />
      </AuthLayout>
    )
  }

  /* ---- Step: offer 2FA after verification (session created by VerifyFlow) ---- */
  if (step === 'twofa-offer') {
    return (
      <AuthLayout title="Secure your account" subtitle="Add a second factor so only you can sign in — even with your password.">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl p-3.5" style={{ background: 'var(--success-tint)' }}>
            <CheckCircle2 size={18} className="shrink-0 text-[var(--success)]" />
            <p className="text-[13px] font-medium text-[var(--success)]">Email verified — your account is live!</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold"><ShieldCheck size={15} className="text-[var(--accent)]" /> Authenticator app (recommended)</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              Works with iCloud Keychain, Google Authenticator, 1Password, Authy and any TOTP app.
              You'll also get 8 backup codes for emergencies.
            </p>
          </div>
          <Button className="w-full" onClick={() => { const s = startTwoFa(); if (s) { setSetup(s); setStep('twofa-setup') } }}>
            Set up authenticator
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep('done')}>Maybe later</Button>
        </div>
      </AuthLayout>
    )
  }

  /* ---- Step: 2FA setup ---- */
  if (step === 'twofa-setup' && setup) {
    return (
      <AuthLayout title="Set up authenticator" subtitle="Scan the QR (or paste the key), then enter the 6-digit code it shows.">
        <div className="space-y-4">
          <div className="flex justify-center"><QrPlaceholder secret={setup.secret} /></div>
          <p className="text-center text-[10.5px] text-faint">Demo QR — a real build renders a scannable otpauth:// code</p>

          <button
            className="flex w-full items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-left"
            onClick={() => { navigator.clipboard?.writeText(setup.secret); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          >
            <span className="min-w-0">
              <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-faint">Manual setup key</span>
              <span className="block truncate font-mono text-[13px]">{setup.secret}</span>
            </span>
            {copied ? <CheckCircle2 size={15} className="shrink-0 text-[var(--success)]" /> : <Copy size={15} className="shrink-0 text-muted" />}
          </button>

          {demoCode && (
            <div className="rounded-xl border border-dashed border-[var(--accent)] p-3" style={{ background: 'var(--accent-tint)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">Demo authenticator shows</p>
              <p className="mt-1 text-center font-mono text-2xl font-bold tracking-[0.35em] text-[var(--accent)]">{demoCode}</p>
            </div>
          )}

          <div>
            <label className="label">Enter the 6-digit code</label>
            <Input inputMode="numeric" maxLength={6} value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(undefined) }} className="text-center font-mono text-lg tracking-[0.3em]" placeholder="••••••" />
            <FieldError message={otpError} />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              if (confirmTwoFa(otp)) setStep('done')
              else setOtpError('That code didn\'t match — check the demo code above.')
            }}
          >
            Verify and enable 2FA
          </Button>
        </div>
      </AuthLayout>
    )
  }

  /* ---- Step: done + backup codes ---- */
  if (step === 'done') {
    return (
      <AuthLayout title="You're all set 🎉" subtitle="Your workspace is ready. Save your backup codes somewhere safe.">
        <div className="space-y-4">
          {me?.twoFactorEnabled && setup && (
            <div className="rounded-xl border border-line p-4">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold"><ShieldCheck size={14} className="text-[var(--success)]" /> 2FA is on</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {setup.backupCodes.map((c) => (
                  <span key={c} className="rounded-lg px-2 py-1 font-mono text-[11.5px]" style={{ background: 'var(--fill)' }}>{c}</span>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => window.print()}>
                <Download size={13} /> Save codes
              </Button>
            </div>
          )}
          <Button className="w-full" onClick={() => navigate('/')}>Enter workspace →</Button>
        </div>
      </AuthLayout>
    )
  }

  /* ---- Step: details ---- */
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free during validation — no card needed."
      footer={<>Already have an account? <Link to="/login" className="font-medium text-[var(--accent)] hover:underline">Sign in</Link></>}
    >
      <form onSubmit={submitDetails} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="rg-fn">First name</label>
            <Input id="rg-fn" autoComplete="given-name" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors((er) => { const n = { ...er }; delete n.firstName; return n }) }} placeholder="Aarav" aria-invalid={!!errors.firstName} />
            <FieldError message={errors.firstName} />
          </div>
          <div>
            <label className="label" htmlFor="rg-ln">Last name</label>
            <Input id="rg-ln" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Shah" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="rg-email">Work email</label>
          <Input id="rg-email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((er) => { const n = { ...er }; delete n.email; return n }) }} placeholder="you@studio.com" aria-invalid={!!errors.email} />
          <FieldError message={errors.email} />
        </div>
        <div>
          <label className="label" htmlFor="rg-pw">Password</label>
          <Input id="rg-pw" type="password" autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((er) => { const n = { ...er }; delete n.password; return n }) }} placeholder="At least 8 characters" aria-invalid={!!errors.password} />
          <PasswordStrength password={password} />
          <FieldError message={errors.password} />
        </div>
        <div>
          <label className="label" htmlFor="rg-pw2">Confirm password</label>
          <Input id="rg-pw2" type="password" autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setErrors((er) => { const n = { ...er }; delete n.confirm; return n }) }} aria-invalid={!!errors.confirm} />
          <FieldError message={errors.confirm} />
        </div>
        <p className="text-[10.5px] leading-relaxed text-faint">
          By continuing you agree to the demo terms. This is a frontend prototype — data stays in your browser.
        </p>
        <AuthError message={errors.form} />
        <Button type="submit" className="w-full">Create account</Button>
      </form>
    </AuthLayout>
  )
}
