import { useRef } from 'react'
import { cn } from '../../lib/utils'

export function OtpInput({ value, onChange, length = 6, disabled }: {
  value: string
  onChange: (v: string) => void
  length?: number
  disabled?: boolean
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const setDigit = (i: number, d: string) => {
    const arr = digits.slice()
    arr[i] = d
    onChange(arr.join('').slice(0, length))
  }

  return (
    <div className="flex gap-2" role="group" aria-label="One-time code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          value={d}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1}`}
          maxLength={1}
          className="input h-12 w-11 text-center text-lg font-semibold"
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '')
            if (!raw) return setDigit(i, '')
            if (raw.length > 1) {
              // paste-like: distribute
              const merged = (value.slice(0, i) + raw).slice(0, length)
              onChange(merged)
              refs.current[Math.min(merged.length, length - 1)]?.focus()
              return
            }
            setDigit(i, raw)
            if (raw && i < length - 1) refs.current[i + 1]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
            if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
            if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  )
}

export function DemoMailbox({ email, otp, purpose }: { email: string; otp: string; purpose: string }) {
  const minutes = 5
  return (
    <div className="rounded-xl border border-dashed border-[var(--accent)] p-3.5" style={{ background: 'var(--accent-tint)' }}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">Demo mailbox</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
        In production, a 6-digit code would arrive at <strong className="text-[var(--text)]">{email}</strong> for {purpose}.
        This demo shows it here:
      </p>
      <p className="mt-2 text-center font-mono text-2xl font-bold tracking-[0.35em] text-[var(--accent)]">{otp}</p>
      <p className="mt-1 text-center text-[10.5px] text-faint">Valid for {minutes} minutes · never share this code</p>
    </div>
  )
}

export function DemoAuthenticatorHint({ code }: { code: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--accent)] p-3.5" style={{ background: 'var(--accent-tint)' }}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">Demo authenticator</p>
      <p className="mt-1 text-[12.5px] text-muted">Your authenticator app would show a rotating code. Demo code:</p>
      <p className="mt-2 text-center font-mono text-2xl font-bold tracking-[0.35em] text-[var(--accent)]">{code}</p>
    </div>
  )
}

export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'A letter', ok: /[a-zA-Z]/.test(password) },
    { label: 'A number', ok: /[0-9]/.test(password) },
  ]
  const passed = checks.filter((c) => c.ok).length
  const tone = passed <= 1 ? 'danger' : passed === 2 ? 'warning' : 'success'
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i < passed ? `var(--${tone})` : 'var(--fill-strong)' }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map((c) => (
          <span key={c.label} className={cn('text-[10.5px]', c.ok ? 'text-[var(--success)]' : 'text-faint')}>
            {c.ok ? '✓' : '·'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}
