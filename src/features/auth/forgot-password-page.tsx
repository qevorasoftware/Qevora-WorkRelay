import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout, AuthError, AuthSuccess } from './auth-layout'
import { DemoMailbox, PasswordStrength } from './otp-input'
import { useAuthStore, passwordSchema } from './auth-store'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset)
  const resetPassword = useAuthStore((s) => s.resetPassword)
  const resendOtp = useAuthStore((s) => s.resendOtp)
  const pending = useAuthStore((s) => s.pending)

  const [step, setStep] = useState<'email' | 'otp' | 'new'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [next, setNext] = useState('')
  const [error, setError] = useState<string>()
  const [ok, setOk] = useState<string>()

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (requestPasswordReset(email)) {
      setError(undefined)
      setStep('otp')
    } else {
      setError('No account found with that email. Try the demo: demo@qevora.studio')
    }
  }

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.trim().length === 6) {
      setError(undefined)
      setStep('new')
    } else {
      setError('Enter the full 6-digit code')
    }
  }

  const submitNew = (e: React.FormEvent) => {
    e.preventDefault()
    const check = passwordSchema.safeParse(next)
    if (!check.success) {
      setError(check.error.issues[0].message)
      return
    }
    if (resetPassword(otp, next)) {
      setOk('Password updated — sign in with your new password.')
      setTimeout(() => navigate('/login', { replace: true }), 1800)
    } else {
      setError('Could not reset — the code may have expired. Request a new one.')
      setStep('email')
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={step === 'email' ? 'We\'ll email you a 6-digit reset code.' : step === 'otp' ? `Enter the code sent to ${pending?.email}` : 'Choose a new password.'}
      footer={<Link to="/login" className="font-medium text-[var(--accent)] hover:underline">← Back to sign in</Link>}
    >
      {step === 'email' && (
        <form onSubmit={submitEmail} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="fp-email">Account email</label>
            <Input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
          </div>
          <AuthError message={error} />
          <Button type="submit" className="w-full">Send reset code</Button>
        </form>
      )}

      {step === 'otp' && pending && (
        <form onSubmit={submitOtp} className="space-y-4">
          <DemoMailbox email={pending.email} otp={pending.otp} purpose="password reset" />
          <div>
            <label className="label" htmlFor="fp-otp">Reset code</label>
            <Input id="fp-otp" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(undefined) }} className="text-center font-mono text-lg tracking-[0.3em]" placeholder="••••••" />
          </div>
          <AuthError message={error} />
          <Button type="submit" className="w-full">Continue</Button>
          <Button type="button" variant="ghost" className="w-full" onClick={resendOtp}>Resend code</Button>
        </form>
      )}

      {step === 'new' && (
        <form onSubmit={submitNew} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="fp-new">New password</label>
            <Input id="fp-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} aria-invalid={!!error} />
            <PasswordStrength password={next} />
          </div>
          <AuthError message={error} />
          <AuthSuccess message={ok} />
          <Button type="submit" className="w-full">Update password</Button>
        </form>
      )}
    </AuthLayout>
  )
}
