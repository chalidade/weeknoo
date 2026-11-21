import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Flat Riyadh skyline with the sun coming up behind Kingdom Centre (the arched
 * crown) and Al Faisaliah (pyramid with a golden sphere) to its right.
 * Decorative, pure SVG, deterministic. Not a section: a tile places it along
 * its bottom edge and gives it a height; the art then fills that box from the
 * centre outwards, so the two landmarks stay in view at every tile width.
 */

type Tower = { x: number; w: number; h: number; top?: 'flat' | 'step' | 'spire' }

const H = 320

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
const LANDMARKS: Tower[] = [
  { x: 640, w: 80, h: 190 },
  { x: 884, w: 32, h: 170 },
]

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function towerPath({ x, w, h, top = 'flat' }: Tower) {
  const y = H - h
  if (top === 'step') {
    const s = w * 0.2
    return `M${x} ${H}V${y + 14}H${x + s}V${y}H${x + w - s}V${y + 14}H${x + w}V${H}Z`
  }
  if (top === 'spire') {
    const c = x + w / 2
    return `M${x} ${H}V${y + 18}L${c - 4} ${y}V${y - 28}H${c + 4}V${y}L${x + w} ${y + 18}V${H}Z`
  }
  return `M${x} ${H}V${y}H${x + w}V${H}Z`
}

function windows(towers: Tower[], seed: number, share: number) {
  const out: ReactNode[] = []
  towers.forEach((t, ti) => {
    const cols = Math.max(2, Math.floor((t.w - 10) / 12))
    const rows = Math.floor((t.h - 30) / 14)
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const k = seed + ti * 131 + r * 17 + c * 7
        const v = rand(k)
        if (v > share) continue
        out.push(
          <rect
            key={k}
            x={t.x + 6 + c * 12}
            y={H - t.h + 24 + r * 14}
            width={5}
            height={6}
            className={cn('fill-amber', v < 0.03 && 'scene-twinkle')}
          />,
        )
      }
  })
  return out
}

export function Skyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 1440 ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={cn('pointer-events-none block', className)}
    >
      <circle cx="680" cy="150" r="118" className="scene-sun fill-amber" />

      <g className="fill-pine">
        {BACK.map((t, i) => (
          <path key={i} d={towerPath(t)} />
        ))}
      </g>
      <g opacity="0.6">{windows(BACK, 11, 0.12)}</g>

      <g className="fill-ink">
        {FRONT.map((t, i) => (
          <path key={i} d={towerPath(t)} />
        ))}
        {/* Kingdom Centre — the sun shows through its arched crown */}
        <path d="M622 320 L640 120 Q646 62 652 14 L659 14 Q664 104 680 108 Q696 104 701 14 L708 14 Q714 62 720 120 L738 320 Z" />
        <rect x="664" y="48" width="32" height="4" />
        {/* Al Faisaliah — pyramid, spire and golden sphere */}
        <path d="M868 320 L896 92 L904 92 L932 320 Z" />
        <rect x="898.5" y="30" width="3" height="64" />
      </g>
      <circle cx="900" cy="78" r="12" className="fill-amber" />
      {windows(FRONT, 23, 0.2)}
      {windows(LANDMARKS, 77, 0.2)}
    </svg>
  )
}
