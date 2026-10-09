import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, CheckCircle2, Zap, Users } from 'lucide-react'

/** Split-screen auth layout — glass card on ambient canvas. */
export function AuthLayout({ title, subtitle, children, footer }: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="ambient flex min-h-dvh">
      {/* Brand side */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 lg:flex">
        <Link to="/login" className="flex items-center gap-2.5">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-[16px] font-semibold tracking-tight">WorkRelay</span>
        </Link>

        <div className="max-w-md">
          <h1 className="text-[34px] font-semibold leading-tight tracking-tight">
            One workspace.<br />Clear requests.<br />Faster approvals.
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-muted">
            The client collaboration and delivery platform for web design agencies —
            requests, approvals, chat and files in one premium workspace.
          </p>
          <div className="mt-8 space-y-3.5">
            {[
              { icon: Zap, text: 'Approval workflows that unblock delivery' },
              { icon: Users, text: 'A portal your clients actually understand' },
              { icon: ShieldCheck, text: '2FA, verified sessions and audit-ready activity' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-[13.5px] text-muted">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--accent)]" style={{ background: 'var(--accent-tint)' }}>
                  <f.icon size={15} />
                </span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11.5px] text-faint">© 2026 Qevora Software · MIT License</p>
      </div>

      {/* Form side */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-10 lg:w-[520px] lg:px-10">
        <Link to="/login" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-[16px] font-semibold tracking-tight">WorkRelay</span>
        </Link>

        <div className="w-full max-w-[400px]">
          <div className="glass-card p-6 sm:p-7">
            <h2 className="text-[20px] font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
            <div className="mt-5">{children}</div>
          </div>
          {footer && <div className="mt-4 text-center text-[12.5px] text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export function AuthError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="rounded-lg px-3 py-2 text-[12.5px] font-medium text-[var(--danger)]" role="alert" style={{ background: 'var(--danger-tint)' }}>
      {message}
    </p>
  )
}

export function AuthSuccess({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-medium text-[var(--success)]" style={{ background: 'var(--success-tint)' }}>
      <CheckCircle2 size={13} /> {message}
    </p>
  )
}
