import { useId, type ReactElement } from 'react'
import { cn } from '@/lib/utils'

// Abstract editorial artwork, generated as SVG so the publication needs no
// third-party photography. Every preset is deterministic (seeded PRNG) and
// drawn only from the Birds palette tokens. Swap any `featuredImage` for a
// real photo URL and <Media> renders an <img> instead.

const NAVY = 'var(--navy)'
const ROYAL = 'var(--royal)'
const SKY = 'var(--sky)'
const SLATE = 'var(--slate)'
const GREY = 'var(--muted)'

function rng(seedText: string) {
  let a = [...seedText].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703) >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Preset = (id: string, r: () => number) => ReactElement

const darkBg = (id: string) => (
  <>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#00081d" />
        <stop offset="0.55" stopColor={NAVY} />
        <stop offset="1" stopColor="#06306b" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.7" cy="0.35" r="0.6">
        <stop offset="0" stopColor={ROYAL} stopOpacity="0.55" />
        <stop offset="1" stopColor={ROYAL} stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="800" fill={`url(#${id}-bg)`} />
    <rect width="1200" height="800" fill={`url(#${id}-glow)`} />
  </>
)

const PRESETS: Record<string, Preset> = {
  skyline: (id, r) => {
    const buildings: ReactElement[] = []
    let x = -20
    let i = 0
    while (x < 1220) {
      const w = 40 + r() * 90
      const h = 160 + r() * 380
      const lit = r() > 0.55
      buildings.push(
        <g key={i++}>
          <rect x={x} y={800 - h} width={w - 6} height={h} fill="#020c2a" stroke={ROYAL} strokeOpacity="0.25" />
          {Array.from({ length: Math.floor(h / 26) }).map((_, j) =>
            r() > (lit ? 0.45 : 0.85) ? (
              <rect key={j} x={x + 8 + r() * (w - 26)} y={800 - h + 14 + j * 26} width="6" height="3" fill={SKY} opacity={0.35 + r() * 0.5} />
            ) : null,
          )}
        </g>,
      )
      x += w
    }
    return (
      <>
        {darkBg(id)}
        <circle cx="860" cy="250" r="120" fill={SKY} opacity="0.12" />
        <circle cx="860" cy="250" r="64" fill={SKY} opacity="0.18" />
        {Array.from({ length: 6 }).map((_, k) => (
          <line key={k} x1="0" x2="1200" y1={120 + k * 34} y2={120 + k * 34} stroke={SLATE} strokeOpacity="0.07" />
        ))}
        {buildings}
      </>
    )
  },
  waves: (id, r) => (
    <>
      {darkBg(id)}
      {Array.from({ length: 34 }).map((_, k) => {
        const amp = 30 + r() * 70
        const y0 = 180 + k * 15
        const ph = r() * Math.PI * 2
        const d = Array.from({ length: 61 })
          .map((_, s) => {
            const x = s * 20
            const y = y0 + Math.sin(s / 7 + ph + k / 6) * amp * (0.4 + s / 100)
            return `${s === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`
          })
          .join(' ')
        return <path key={k} d={d} fill="none" stroke={k % 5 === 0 ? SKY : ROYAL} strokeOpacity={k % 5 === 0 ? 0.7 : 0.3} strokeWidth={k % 5 === 0 ? 1.6 : 1} />
      })}
    </>
  ),
  grid: (id, r) => {
    const pts = Array.from({ length: 9 }).map((_, i) => [80 + i * 130, 560 - i * 42 - r() * 70] as const)
    return (
      <>
        {darkBg(id)}
        {Array.from({ length: 25 }).map((_, k) => (
          <line key={`v${k}`} x1={600 + (k - 12) * 20} y1="440" x2={600 + (k - 12) * 160} y2="800" stroke={ROYAL} strokeOpacity="0.35" />
        ))}
        {Array.from({ length: 9 }).map((_, k) => {
          const y = 440 + Math.pow(k / 8, 1.8) * 360
          return <line key={`h${k}`} x1="0" x2="1200" y1={y} y2={y} stroke={ROYAL} strokeOpacity="0.3" />
        })}
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={SKY} strokeWidth="4" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 10 : 5} fill={i === pts.length - 1 ? SKY : NAVY} stroke={SKY} strokeWidth="2.5" />
        ))}
      </>
    )
  },
  orbits: (id, r) => (
    <>
      {darkBg(id)}
      {Array.from({ length: 9 }).map((_, k) => {
        const rx = 90 + k * 62
        const a = r() * Math.PI * 2
        return (
          <g key={k}>
            <ellipse cx="760" cy="400" rx={rx} ry={rx * 0.62} fill="none" stroke={k % 3 === 0 ? SKY : ROYAL} strokeOpacity={0.25 + (k % 3 === 0 ? 0.3 : 0)} transform="rotate(-18 760 400)" />
            <circle cx={760 + Math.cos(a) * rx} cy={400 + Math.sin(a) * rx * 0.62} r={3 + r() * 6} fill={k % 2 ? SKY : '#ffffff'} opacity="0.85" transform="rotate(-18 760 400)" />
          </g>
        )
      })}
      <circle cx="760" cy="400" r="46" fill={ROYAL} />
      <circle cx="760" cy="400" r="46" fill="none" stroke={SKY} strokeOpacity="0.6" strokeWidth="10" />
    </>
  ),
  contours: (_id, r) => (
    <>
      <rect width="1200" height="800" fill={GREY} />
      {Array.from({ length: 22 }).map((_, k) => {
        const cx = 700
        const cy = 380
        const base = 30 + k * 34
        const d =
          Array.from({ length: 49 })
            .map((_, s) => {
              const t = (s / 48) * Math.PI * 2
              const rr = base * (1 + 0.16 * Math.sin(3 * t + k * 0.35) + 0.08 * Math.cos(5 * t + r()))
              return `${s === 0 ? 'M' : 'L'}${(cx + Math.cos(t) * rr * 1.25).toFixed(1)},${(cy + Math.sin(t) * rr).toFixed(1)}`
            })
            .join(' ') + 'Z'
        return <path key={k} d={d} fill="none" stroke={k % 4 === 0 ? ROYAL : NAVY} strokeOpacity={k % 4 === 0 ? 0.85 : 0.22} strokeWidth={k % 4 === 0 ? 2 : 1} />
      })}
      <circle cx="700" cy="380" r="9" fill={ROYAL} />
    </>
  ),
  columns: (id, r) => (
    <>
      <defs>
        <linearGradient id={`${id}-col`} x1="0" x2="1">
          <stop offset="0" stopColor={NAVY} />
          <stop offset="0.5" stopColor="#0b2a63" />
          <stop offset="1" stopColor={NAVY} />
        </linearGradient>
        <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY} stopOpacity="0.55" />
          <stop offset="1" stopColor={SKY} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill={GREY} />
      {Array.from({ length: 8 }).map((_, k) => {
        const h = 260 + r() * 420
        return (
          <g key={k}>
            <rect x={70 + k * 140} y={800 - h} width="78" height={h} fill={`url(#${id}-col)`} />
            <rect x={70 + k * 140} y={800 - h} width="78" height="6" fill={k === 5 ? SKY : ROYAL} />
          </g>
        )
      })}
      <polygon points="760,0 900,0 1040,800 620,800" fill={`url(#${id}-shaft)`} opacity="0.5" />
    </>
  ),
  network: (id, r) => {
    const nodes = Array.from({ length: 34 }).map(() => [60 + r() * 1080, 60 + r() * 680] as const)
    const links: ReactElement[] = []
    nodes.forEach(([x1, y1], i) =>
      nodes.forEach(([x2, y2], j) => {
        if (j <= i) return
        const d = Math.hypot(x1 - x2, y1 - y2)
        if (d < 230)
          links.push(<line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={d < 140 ? SKY : ROYAL} strokeOpacity={d < 140 ? 0.55 : 0.3} />)
      }),
    )
    return (
      <>
        {darkBg(id)}
        {links}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 9 : 4} fill={i % 7 === 0 ? SKY : '#ffffff'} opacity={i % 7 === 0 ? 1 : 0.75} />
        ))}
      </>
    )
  },
  dunes: (id, r) => (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a3f86" />
          <stop offset="1" stopColor="#7cc8f0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill={`url(#${id}-sky)`} />
      <circle cx="300" cy="260" r="70" fill="#ffffff" opacity="0.85" />
      {Array.from({ length: 6 }).map((_, k) => {
        const y = 380 + k * 70
        const ph = r() * 6
        const d =
          `M0,${y} ` +
          Array.from({ length: 13 })
            .map((_, s) => `Q${s * 100 + 50},${y - 40 - Math.sin(s + ph) * 50} ${(s + 1) * 100},${y + Math.cos(s + ph) * 20}`)
            .join(' ') +
          ' L1200,800 L0,800Z'
        const shades = ['#0972cb', '#075aa3', '#05468a', '#04316a', '#021f4c', '#000f34']
        return <path key={k} d={d} fill={shades[k]} />
      })}
    </>
  ),
  prism: (_id, r) => (
    <>
      <rect width="1200" height="800" fill={GREY} />
      {Array.from({ length: 5 }).flatMap((_, row) =>
        Array.from({ length: 9 }).map((_, col) => {
          const x = col * 150 - (row % 2) * 75
          const y = row * 170
          const up = (row + col) % 2 === 0
          const pts = up ? `${x},${y + 170} ${x + 150},${y + 170} ${x + 75},${y}` : `${x},${y} ${x + 150},${y} ${x + 75},${y + 170}`
          const v = r()
          const fill = v > 0.82 ? ROYAL : v > 0.68 ? SKY : v > 0.4 ? NAVY : 'transparent'
          return <polygon key={`${row}-${col}`} points={pts} fill={fill} fillOpacity={fill === 'transparent' ? 0 : 0.9} stroke={NAVY} strokeOpacity="0.18" />
        }),
      )}
    </>
  ),
}

export const ARTWORK_PRESETS = Object.keys(PRESETS)

export function Artwork({ preset, className }: { preset: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const draw = PRESETS[preset] ?? PRESETS.waves
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className={cn('block h-full w-full', className)} role="img" aria-hidden="true">
      {draw(id, rng(preset))}
    </svg>
  )
}

/** Renders a real image URL, or an "art:<preset>" artwork. Fills its parent. */
export function Media({ src, alt = '', className }: { src: string; alt?: string; className?: string }) {
  if (src.startsWith('art:')) return <Artwork preset={src.slice(4)} className={className} />
  return <img src={src} alt={alt} loading="lazy" className={cn('h-full w-full object-cover', className)} />
}
