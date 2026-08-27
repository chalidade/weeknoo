import { motion } from 'motion/react'
import {
  BadgeCheck,
  ClipboardList,
  Laptop,
  RefreshCw,
  TrendingUp,
  Users,
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

type Keunggulan = {
  judul: string
  deskripsi: string
  icon: typeof Users
}

const KEUNGGULAN: Keunggulan[] = [
  {
    judul: 'Kelas Kecil',
    deskripsi: 'Maksimal 10 siswa per kelas agar setiap anak benar-benar diperhatikan.',
    icon: Users,
  },
  {
    judul: 'Pengajar Bersertifikat',
    deskripsi: 'Seluruh pengajar lulus seleksi mikro-teaching dan pelatihan metode belajar.',
    icon: BadgeCheck,
  },
  {
    judul: 'Kurikulum Terstruktur',
    deskripsi: 'Silabus jelas per pertemuan, selaras dengan kurikulum sekolah nasional.',
    icon: ClipboardList,
  },
  {
    judul: 'Laporan Perkembangan',
    deskripsi: 'Orang tua menerima rapor bulanan berisi capaian dan rekomendasi belajar.',
    icon: TrendingUp,
  },
  {
    judul: 'Online & Offline',
    deskripsi: 'Kelas tatap muka di studio belajar atau daring interaktif dari rumah.',
    icon: Laptop,
  },
  {
    judul: 'Garansi Mengulang',
    deskripsi: 'Belum mencapai target belajar? Ulang modul yang sama tanpa biaya tambahan.',
    icon: RefreshCw,
  },
]

export function WhyUs() {
  return (
    <section id="keunggulan" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p variants={fadeUp} className="mb-3 text-sm font-bold tracking-wide text-primary uppercase">
          Kenapa Kami
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mb-4 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
        >
          Dirancang agar Anak Betah Belajar
        </motion.h2>
        <motion.p variants={fadeUp} className="mb-12 max-w-2xl text-muted-foreground text-pretty">
          Kami percaya nilai naik adalah efek samping dari proses belajar yang
          nyaman, terukur, dan konsisten.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KEUNGGULAN.map((item) => (
            <motion.div
              key={item.judul}
              variants={fadeUp}
              className="rounded-3xl border bg-card p-6 shadow-xs"
            >
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="size-5.5" />
              </span>
              <h3 className="font-display text-lg font-extrabold">{item.judul}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground text-pretty">{item.deskripsi}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
