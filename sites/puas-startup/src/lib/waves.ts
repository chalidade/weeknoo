// Registration waves. Wave 1 has an exact closing date; the poster gives
// wave 2 only as "Jan – Feb 2027", so it is treated as those two full months.

/** Gelombang 1 closes at the end of 25 Nov 2026, Riyadh time (UTC+3). */
export const DEADLINE = new Date('2026-11-25T23:59:59+03:00')

export const WAVE2_OPENS = new Date('2027-01-01T00:00:00+03:00')
export const WAVE2_CLOSES = new Date('2027-02-28T23:59:59+03:00')

/** Where "now" falls: wave 1 open, between waves, wave 2 open, or all closed. */
export type Phase = 'wave1' | 'between' | 'wave2' | 'closed'

export function phaseAt(now: number): Phase {
  if (now <= DEADLINE.getTime()) return 'wave1'
  if (now < WAVE2_OPENS.getTime()) return 'between'
  if (now <= WAVE2_CLOSES.getTime()) return 'wave2'
  return 'closed'
}

/** "4 hari lagi", "13 jam lagi", "25 menit lagi" — the largest unit left. */
export function timeLeft(now: number, target: Date) {
  const ms = Math.max(0, target.getTime() - now)
  const days = Math.floor(ms / 86_400_000)
  if (days > 0) return `${days} hari lagi`
  const hours = Math.floor(ms / 3_600_000)
  if (hours > 0) return `${hours} jam lagi`
  return `${Math.max(1, Math.floor(ms / 60_000))} menit lagi`
}
