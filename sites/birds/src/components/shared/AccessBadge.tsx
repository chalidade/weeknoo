import { Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AccessBadge({ type, tone = 'light', className }: { type: 'free' | 'member'; tone?: 'light' | 'dark'; className?: string }) {
  const Icon = type === 'free' ? Unlock : Lock
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase',
        tone === 'dark' ? 'text-white/80' : type === 'free' ? 'text-deck' : 'text-royal',
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {type === 'free' ? 'Free Access' : 'Member Briefing'}
    </span>
  )
}
