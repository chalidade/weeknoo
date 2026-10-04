import { motion } from 'motion/react'
import { Armchair, Baby, Cake, Laptop, PartyPopper, Trees } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'

type Spot = { title: string; desc: string; icon: LucideIcon; wide?: boolean; hi?: boolean }

const SPOTS: Spot[] = [
  {
    title: 'Konsep rumah lebah',
    desc: 'Pola sarang madu di setiap sudut — dari logo, dinding, sampai buku menu. Spot foto yang bikin feed Instagram makin manis.',
    icon: PartyPopper,
    wide: true,
    hi: true,
  },
  {
    title: 'Indoor adem buat kerja',
    desc: 'Suasana cozy dan tenang, pas untuk nugas atau WFC sambil ngopi.',
    icon: Laptop,
  },
  {
    title: 'Outdoor luas',
    desc: 'Area terbuka yang lapang untuk nongkrong santai bareng teman.',
    icon: Trees,
  },
  {
    title: 'Bean bag & kursi santai',
    desc: 'Pilih mau duduk tegak atau tenggelam di bean bag — bebas.',
    icon: Armchair,
  },
  {
    title: 'Mini playground',
    desc: 'Ada pojok bermain anak, jadi ayah-bunda bisa ngopi dengan tenang.',
    icon: Baby,
  },
  {
    title: 'Bisa untuk acara',
    desc: 'Gathering, reuni, meeting, ulang tahun, hingga wedding — tempatnya muat.',
    icon: Cake,
    wide: true,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Suasana() {
  return (
    <section id="suasana" className="scroll-mt-16 py-24 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto max-w-6xl px-5 sm:px-6"
      >
        <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
          Suasana
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Satu sarang, banyak cara menikmatinya
        </motion.h2>

        <div className="mt-12 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPOTS.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className={cn(
                'relative flex flex-col overflow-hidden rounded-[1.75rem] border p-6',
                s.wide && 'sm:col-span-2',
                s.hi ? 'border-transparent bg-primary text-primary-foreground' : 'bg-card',
              )}
            >
              {s.hi && (
                <>
                  <div aria-hidden className="honeycomb absolute inset-0 text-primary-foreground/10" />
                  <Logo className="absolute -right-4 -bottom-6 size-40 text-primary-foreground/20" />
                </>
              )}
              <span
                className={cn(
                  'relative grid size-12 place-items-center rounded-2xl',
                  s.hi ? 'bg-primary-foreground/20' : 'bg-secondary text-primary',
                )}
              >
                <s.icon className="size-6" />
              </span>
              <h3 className="relative mt-auto pt-8 font-display text-2xl font-bold">{s.title}</h3>
              <p className={cn('relative mt-2 text-sm leading-relaxed', s.hi ? 'text-primary-foreground/85' : 'text-muted-foreground')}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
