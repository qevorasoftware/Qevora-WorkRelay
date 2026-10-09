import type { User } from '../../types'
import { avatarStyle, cn } from '../../lib/utils'
import { userById } from '../../mocks/users'

export function Avatar({ user, size = 'md', className }: {
  user: User
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-[11px]',
    lg: 'w-12 h-12 text-sm',
  }
  return (
    <span
      title={user.name}
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none', sizes[size], className)}
      style={avatarStyle(user.hue)}
      aria-label={user.name}
    >
      {user.initials}
    </span>
  )
}

export function AvatarOf({ userId, size = 'md', className }: { userId: string; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }) {
  const user = userById(userId)
  if (!user)
    return <span className={cn('inline-block rounded-full bg-fill', size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-9 h-9' : size === 'sm' ? 'w-7 h-7' : 'w-5 h-5', className)} />
  return <Avatar user={user} size={size} className={className} />
}

export function AvatarGroup({ userIds, max = 4 }: { userIds: string[]; max?: number }) {
  const shown = userIds.slice(0, max)
  return (
    <span className="flex -space-x-2">
      {shown.map((id) => (
        <AvatarOf key={id} userId={id} size="sm" className="ring-2 ring-[var(--surface)]" />
      ))}
      {userIds.length > max && (
        <span className="inline-flex w-7 h-7 items-center justify-center rounded-full border border-line bg-card text-[10px] font-semibold text-muted">
          +{userIds.length - max}
        </span>
      )}
    </span>
  )
}
