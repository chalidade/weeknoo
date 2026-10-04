import { motion } from 'motion/react'
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Bee, Logo } from '@/components/Logo'
import { CAFE, asset } from '@/lib/cafe'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

export function Hero() {
  return (
    <section id="beranda" className="relative isolate -mt-16 overflow-hidden pt-16">
      <div aria-hidden className="honeycomb absolute inset-0 -z-10 text-primary/[0.07]" />
      <div
        aria-hidden
        className="absolute -top-40 -right-40 -z-10 size-[42rem] rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -left-32 -z-10 size-[30rem] rounded-full bg-accent/30 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-10 pb-20 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-28">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.a
            variants={fadeUp}
            href="#ulasan"
            className="inline-flex items-center gap-2 rounded-full border bg-card/80 py-1.5 pr-4 pl-1.5 text-sm shadow-xs backdrop-blur"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 font-semibold text-primary-foreground">
              <Star className="size-3.5 fill-current" />
              {CAFE.rating}
            </span>
            <span className="text-muted-foreground">
              dari <b className="text-foreground">{CAFE.reviews}</b> ulasan Google
            </span>
          </motion.a>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Ngopi di{' '}
            <span className="relative inline-block text-primary">
              Rumah Lebah
              <Bee className="absolute -top-5 -right-7 size-9 rotate-12 sm:-right-9" />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Cafe hits di Singosari dengan suasana sarang madu — indoor yang adem
            buat kerja, outdoor luas dengan bean bag buat nongkrong. Kopi,
            mocktail, milkshake, sampai nasi bebek, semua mulai{' '}
            <b className="text-foreground">Rp10 ribuan</b>.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <a
              href="#menu"
              className={cn(buttonVariants({ size: 'lg' }), 'h-12 rounded-full px-7 text-base')}
            >
              Lihat Menu
              <ArrowRight />
            </a>
            <a
              href="#lokasi"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'h-12 rounded-full bg-card/70 px-7 text-base',
              )}
            >
              <MapPin />
              Rute ke Cafe
            </a>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-10 grid max-w-lg grid-cols-3 divide-x rounded-2xl border bg-card/70 py-4 text-center backdrop-blur"
          >
            {[
              ['70+', 'menu'],
              [CAFE.rating.toString(), 'rating'],
              ['10rb', 'harga mulai'],
            ].map(([value, label]) => (
              <div key={label} className="px-2">
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                  {value}
                </dd>
                <dd className="text-xs text-muted-foreground sm:text-sm">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Visual: honeycomb photo cluster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
        >
          <div
            className="absolute inset-[6%] bg-primary"
            style={{ clipPath: HEX }}
          >
            <div className="honeycomb absolute inset-0 text-primary-foreground/15" />
            <Logo className="absolute top-[12%] right-[16%] size-16 text-primary-foreground/90" />
          </div>
          <div
            className="absolute top-[2%] left-[8%] w-[52%] overflow-hidden shadow-2xl"
            style={{ clipPath: HEX, aspectRatio: '0.866' }}
          >
            <img
              src={asset('img/new-drinks.jpg')}
              alt="Avocado Coffee, Avocado Caramel dan Berry Bang Bang"
              className="size-full object-cover"
            />
          </div>
          <div
            className="absolute top-[24%] right-[2%] w-[46%] overflow-hidden shadow-2xl"
            style={{ clipPath: HEX, aspectRatio: '0.866' }}
          >
            <img
              src={asset('img/makan-malam.jpg')}
              alt="Nasi Beef Teriyaki, Soft Tofu dan Milkshake Strawberry"
              className="size-full object-cover"
            />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[10%] left-0 flex items-center gap-3 rounded-2xl border bg-card/95 p-3 pr-5 shadow-xl backdrop-blur sm:left-[-4%]"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-accent">
              <Bee className="size-7" />
            </span>
            <span>
              <span className="block text-xs text-muted-foreground">Favorit lebah</span>
              <span className="block font-display font-bold">Melia Frappe · 28K</span>
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[2%] bottom-[2%] flex items-center gap-2 rounded-2xl border bg-card/95 px-4 py-3 shadow-xl backdrop-blur"
          >
            <Clock className="size-4 text-primary" />
            <span className="text-sm font-medium">Buka sampai 23.00</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
