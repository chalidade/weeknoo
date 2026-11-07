import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

const TONES = ['from-navy to-royal', 'from-royal to-sky', 'from-[#0b2a63] to-slate', 'from-navy to-[#2563a8]']

export function Portrait({ name, photoUrl, className }: { name: string; photoUrl?: string; className?: string }) {
  const tone = TONES[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % TONES.length]
  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-full ring-1 ring-border ring-offset-2', className)}>
      {photoUrl ? (
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div
          aria-label={name}
          role="img"
          className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br font-semibold tracking-wide text-white', tone)}
        >
          <span className="text-[0.38em]">{initials(name)}</span>
        </div>
      )}
    </div>
  )
}
