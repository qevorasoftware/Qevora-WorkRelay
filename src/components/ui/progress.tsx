import { cn } from '../../lib/utils'

export function Progress({ value, className, tone = 'accent' }: {
  value: number
  className?: string
  tone?: 'accent' | 'success' | 'warning' | 'danger'
}) {
  const tones = {
    accent: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
  }
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full', className)}
      style={{ background: 'color-mix(in srgb, var(--text) 10%, transparent)' }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: `linear-gradient(90deg, ${tones[tone]}, color-mix(in srgb, ${tones[tone]} 62%, var(--accent-2)))`, boxShadow: '0 0 10px color-mix(in srgb, ' + tones[tone] + ' 40%, transparent)' }}
      />
    </div>
  )
}
