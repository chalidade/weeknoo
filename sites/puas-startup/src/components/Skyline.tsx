import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Decorative Riyadh skyline at dusk — Kingdom Centre (arched crown) and
 * Al Faisaliah (pyramid with sphere) among generic towers, with lit windows.
 * Pure SVG, deterministic, no external images. Not a section: Hero and Cta
 * place it as a backdrop.
 */

type Tower = { x: number; w: number; h: number; top?: 'flat' | 'step' | 'spire' }

// Back row (hazy) and front row (solid). x/w/h in a 1440×320 viewBox.
const BACK: Tower[] = [
  { x: 20, w: 60, h: 120 }, { x: 95, w: 46, h: 170, top: 'step' }, { x: 160, w: 70, h: 135 },
  { x: 250, w: 40, h: 205, top: 'spire' }, { x: 305, w: 64, h: 150 }, { x: 390, w: 52, h: 185, top: 'step' },
  { x: 460, w: 70, h: 140 }, { x: 545, w: 44, h: 215, top: 'spire' }, { x: 770, w: 58, h: 175, top: 'step' },
  { x: 840, w: 40, h: 140 }, { x: 960, w: 66, h: 190, top: 'step' }, { x: 1040, w: 48, h: 150 },
  { x: 1100, w: 60, h: 225, top: 'spire' }, { x: 1180, w: 72, h: 160 }, { x: 1265, w: 50, h: 195, top: 'step' },
  { x: 1330, w: 90, h: 130 },
]
const FRONT: Tower[] = [
  { x: 0, w: 90, h: 80 }, { x: 110, w: 56, h: 110 }, { x: 185, w: 80, h: 70 }, { x: 285, w: 50, h: 125, top: 'step' },
  { x: 350, w: 90, h: 85 }, { x: 455, w: 62, h: 105 }, { x: 530, w: 80, h: 75 }, { x: 750, w: 70, h: 95 },
  { x: 990, w: 64, h: 115, top: 'step' }, { x: 1070, w: 90, h: 80 }, { x: 1175, w: 58, h: 120 },
  { x: 1250, w: 84, h: 90 }, { x: 1350, w: 90, h: 105, top: 'step' },
]

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function towerPath({ x, w, h, top = 'flat' }: Tower) {
  const y = 320 - h
  if (top === 'step') {
    const s = w * 0.2
    return `M${x} 320V${y + 14}H${x + s}V${y}H${x + w - s}V${y + 14}H${x + w}V320Z`
  }
  if (top === 'spire') {
    const c = x + w / 2
    return `M${x} 320V${y + 18}L${c - 4} ${y}V${y - 28}H${c + 4}V${y}L${x + w} ${y + 18}V320Z`
  }
  return `M${x} 320V${y}H${x + w}V320Z`
}

function Windows({ towers, seed, opacity }: { towers: Tower[]; seed: number; opacity: number }) {
  const rects: ReactNode[] = []
  towers.forEach((t, ti) => {
    const cols = Math.max(2, Math.floor((t.w - 10) / 12))
    const rows = Math.floor((t.h - 30) / 14)
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const k = seed + ti * 131 + r * 17 + c * 7
        const v = rand(k)
        if (v > 0.32) continue
        rects.push(
          <rect
            key={k}
            x={t.x + 6 + c * 12}
            y={320 - t.h + 24 + r * 14}
            width={5}
            height={6}
            rx={1}
            fill="var(--gold-2)"
            opacity={opacity * (0.4 + v * 2)}
            className={v < 0.06 ? 'skyline-twinkle' : undefined}
            style={v < 0.06 ? { animationDelay: `${(k % 50) / 10}s` } : undefined}
          />,
        )
      }
  })
  return <>{rects}</>
}

export function Skyline({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const back = `sk-back-${id}`
  const front = `sk-front-${id}`
  const edge = `sk-edge-${id}`
  const glow = `sk-glow-${id}`

  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={cn('pointer-events-none block w-full', className)}
    >
      <defs>
        <linearGradient id={back} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14514a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0a2b29" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={front} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b3a35" />
          <stop offset="1" stopColor="var(--background)" />
        </linearGradient>
        <linearGradient id={edge} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--gold-1)" />
          <stop offset="0.5" stopColor="var(--gold-2)" />
          <stop offset="1" stopColor="var(--gold-3)" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="1" r="0.6">
          <stop offset="0" stopColor="var(--gold-1)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--gold-1)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* horizon glow behind the landmarks */}
      <ellipse cx="720" cy="320" rx="520" ry="230" fill={`url(#${glow})`} />

      {/* back row */}
      <g fill={`url(#${back})`} opacity="0.55">
        {BACK.map((t, i) => (
          <path key={i} d={towerPath(t)} />
        ))}
      </g>
      <g opacity="0.55">
        <Windows towers={BACK} seed={11} opacity={0.5} />
      </g>

      {/* Kingdom Centre — tapering tower with the parabolic arch and skybridge */}
      <g>
        <path
          d="M622 320 L640 120 Q646 62 652 14 L659 14 Q664 104 680 108 Q696 104 701 14 L708 14 Q714 62 720 120 L738 320 Z"
          fill={`url(#${front})`}
          stroke={`url(#${edge})`}
          strokeWidth="1.5"
        />
        <rect x="664" y="48" width="32" height="3" rx="1.5" fill={`url(#${edge})`} />
        <Windows towers={[{ x: 640, w: 80, h: 190 }]} seed={77} opacity={0.6} />
      </g>

      {/* Al Faisaliah — pyramid tower, golden sphere and spire */}
      <g>
        <path
          d="M868 320 L896 92 L904 92 L932 320 Z"
          fill={`url(#${front})`}
          stroke={`url(#${edge})`}
          strokeWidth="1.5"
        />
        <path d="M876 320 L900 140 L924 320" fill="none" stroke="var(--gold-2)" strokeOpacity="0.25" />
        <line x1="900" y1="92" x2="900" y2="30" stroke={`url(#${edge})`} strokeWidth="2" />
        <circle cx="900" cy="78" r="13" fill={`url(#${edge})`} />
        <circle cx="900" cy="78" r="22" fill="var(--gold-1)" opacity="0.15" className="skyline-twinkle" />
      </g>

      {/* front row */}
      <g fill={`url(#${front})`}>
        {FRONT.map((t, i) => (
          <path key={i} d={towerPath(t)} />
        ))}
      </g>
      <Windows towers={FRONT} seed={23} opacity={0.75} />

      {/* ground line */}
      <rect x="0" y="318" width="1440" height="2" fill={`url(#${edge})`} opacity="0.5" />
    </svg>
  )
}
