import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, CheckCircle2, Zap, Users, Sun, Moon, Monitor, Star, FolderKanban } from 'lucide-react'
import { Segmented } from '../../components/ui/segmented'
import { useThemeStore } from '../../stores/theme-store'

/** Split-screen auth layout — Liquid Glass showroom: vivid mesh, product
 *  showcase, theme switcher. Form renders in an elevated glass card. */
export function AuthLayout({ title, subtitle, children, footer }: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="auth-backdrop" aria-hidden />

      {/* Top bar — brand + theme switcher (works on every auth page) */}
      <header className="relative z-20 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/login" className="liquid-glass flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-7 w-7 rounded-full" />
          <span className="text-[14.5px] font-semibold tracking-tight">WorkRelay</span>
        </Link>
        <Segmented
          label="Auth theme"
          value={mode}
          onChange={(m) => setMode(m as typeof mode)}
          options={[
            { value: 'light', label: '', icon: Sun },
            { value: 'dark', label: '', icon: Moon },
            { value: 'system', label: '', icon: Monitor },
          ]}
        />
      </header>

      <main className="scroll-thin relative z-10 min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-[1180px] items-center gap-12 px-5 pb-10 pt-4 sm:px-8">
          {/* Brand side — headline, features, product showcase */}
          <div className="hidden flex-1 lg:block">
            <p className="auth-rise liquid-glass mb-6 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold" style={{ animationDelay: '0.02s' }}>
              <Star size={12} className="text-[var(--accent)]" /> Built for web design agencies
            </p>
            <h1 className="auth-rise max-w-md text-[44px] font-semibold leading-[1.08] tracking-tight" style={{ animationDelay: '0.08s' }}>
              One workspace.<br />Clear requests.<br />
              <span className="text-gradient">Faster approvals.</span>
            </h1>
            <p className="auth-rise mt-5 max-w-md text-[14.5px] leading-relaxed text-muted" style={{ animationDelay: '0.14s' }}>
              The client collaboration and delivery platform — requests, approvals,
              chat and files in one premium workspace.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                { icon: Zap, text: 'Approval workflows that unblock delivery' },
                { icon: Users, text: 'A portal your clients actually understand' },
                { icon: ShieldCheck, text: '2FA, verified sessions and audit-ready activity' },
              ].map((f, i) => (
                <div key={f.text} className="auth-rise flex items-center gap-3 text-[13.5px] text-muted" style={{ animationDelay: `${0.2 + i * 0.07}s` }}>
                  <span className="liquid-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-[var(--accent)]">
                    <f.icon size={15} />
                  </span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* Product showcase — static rows, never overlapping */}
            <div className="mt-12 max-w-md space-y-3.5">
              <div className="flex items-stretch gap-3.5">
                <div className="floaty glass-card min-w-0 flex-1 p-4" style={{ '--rot': '-1.5deg', animationDelay: '0.6s' } as CSSProperties}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[12.5px] font-semibold">Homepage redesign — v4</p>
                    <span className="badge-success shrink-0"><CheckCircle2 size={11} /> Approved</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted">Client sign-off · 2 min ago</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--fill)]">
                    <div className="h-full w-4/5 rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), #7c5cff)' }} />
                  </div>
                </div>
                <div className="floaty glass-card w-[150px] shrink-0 p-4" style={{ '--rot': '1.2deg', animationDelay: '1.3s' } as CSSProperties}>
                  <div className="flex items-center gap-1.5 text-muted">
                    <FolderKanban size={12} />
                    <p className="truncate text-[10px] font-medium uppercase tracking-wide">Active</p>
                  </div>
                  <p className="mt-0.5 text-[24px] font-semibold tabular-nums leading-none tracking-tight">12</p>
                  <div className="mt-2 flex items-end gap-1">
                    {[38, 55, 42, 70, 88].map((h, i) => (
                      <span key={i} className="w-2.5 rounded-sm" style={{ height: `${Math.round(h * 0.26)}px`, background: i === 4 ? 'var(--accent)' : 'var(--fill)' }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="floaty liquid-glass ml-8 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ '--rot': '-0.8deg', animationDelay: '2s' } as CSSProperties}>
                <div className="flex -space-x-1.5">
                  {['#0a84ff', '#7c5cff', '#ec4899'].map((c) => (
                    <span key={c} className="h-5 w-5 rounded-full border-2 border-white/70" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-[11.5px] font-medium">Clients love it <Star size={10} className="inline text-[#ff9f0a]" /> 4.9</p>
              </div>
            </div>
          </div>

          {/* Form side — elevated glass card */}
          <div className="mx-auto w-full max-w-[440px] lg:mx-0 lg:ml-auto">
            <div className="auth-pop glass-card p-6 sm:p-8">
              <h2 className="text-[21px] font-semibold tracking-tight">{title}</h2>
              {subtitle && <p className="mt-1 text-[13px] leading-relaxed text-muted">{subtitle}</p>}
              <div className="mt-5">{children}</div>
            </div>
            {footer && <div className="mt-4 text-center text-[12.5px] text-muted">{footer}</div>}
            <p className="mt-6 text-center text-[11px] text-faint">© 2026 Qevora Software · MIT License</p>
          </div>
        </div>
      </main>
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
