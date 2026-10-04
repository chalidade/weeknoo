import { Logo } from '@/components/Logo'

const WORDS = [
  'Melia Frappe',
  'Kopi Gula Aren',
  'Sunset & Sea',
  'Creamy Mango Day',
  'Milkshake Lotus',
  'Nasi Bebek Nusantara',
  'Thai Tea Cheese',
  'Pizza Premium',
  'Cromboloni',
  'Ice Dirty Matcha Cloud',
]

export function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <section aria-label="Menu populer" className="relative -rotate-1 overflow-hidden bg-primary py-4 text-primary-foreground">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-8 motion-reduce:animate-none">
        {row.map((word, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {word}
            <Logo className="size-7 text-primary-foreground/70" />
          </span>
        ))}
      </div>
      <style>{'@keyframes marquee{to{transform:translateX(-50%)}}'}</style>
    </section>
  )
}
