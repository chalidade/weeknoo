import { motion } from 'motion/react'
import {
  BookOpen,
  Clapperboard,
  Cpu,
  FlaskConical,
  Landmark,
  Palette,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

type Kategori = {
  nama: string
  deskripsi: string
  jumlah: string
  icon: typeof Cpu
}

const KATEGORI: Kategori[] = [
  {
    nama: 'Teknologi',
    deskripsi: 'Internet, perangkat, dan dampaknya pada keseharian.',
    jumlah: '42 artikel',
    icon: Cpu,
  },
  {
    nama: 'Budaya',
    deskripsi: 'Tradisi, bahasa, dan ruang publik yang terus berubah.',
    jumlah: '38 artikel',
    icon: Landmark,
  },
  {
    nama: 'Desain',
    deskripsi: 'Estetika visual, kriya, dan desain keseharian.',
    jumlah: '21 artikel',
    icon: Palette,
  },
  {
    nama: 'Sains',
    deskripsi: 'Riset dan temuan yang dijelaskan dengan bahasa manusia.',
    jumlah: '17 artikel',
    icon: FlaskConical,
  },
  {
    nama: 'Film & Musik',
    deskripsi: 'Layar, panggung, dan telinga generasi streaming.',
    jumlah: '26 artikel',
    icon: Clapperboard,
  },
  {
    nama: 'Buku',
    deskripsi: 'Ulasan dan catatan baca dari rak redaksi.',
    jumlah: '19 artikel',
    icon: BookOpen,
  },
]

export function Categories() {
  return (
    <section id="kategori" className="border-t bg-muted/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="mb-3 text-xs font-medium tracking-[0.2em] text-primary uppercase"
        >
          Rubrik
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mb-12 font-display text-3xl font-medium tracking-tight sm:text-4xl"
        >
          Jelajahi Berdasarkan Kategori
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KATEGORI.map((kategori) => (
            <motion.a
              key={kategori.nama}
              variants={fadeUp}
              href="#artikel"
              className="group rounded-xl border bg-card p-6 shadow-xs transition-colors hover:border-primary/40"
            >
              <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <kategori.icon className="size-5" />
              </span>
              <h3 className="font-display text-xl font-medium transition-colors group-hover:text-primary">
                {kategori.nama}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{kategori.deskripsi}</p>
              <p className="mt-4 text-xs font-medium tracking-wide text-primary uppercase">
                {kategori.jumlah}
              </p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
