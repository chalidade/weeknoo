import { motion } from 'motion/react'
import {
  BookOpenCheck,
  Calculator,
  Code2,
  Languages,
  PenTool,
  Target,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

type Program = {
  nama: string
  deskripsi: string
  jenjang: string
  jadwal: string
  biaya: string
  icon: typeof Calculator
}

const PROGRAMS: Program[] = [
  {
    nama: 'Matematika SD–SMA',
    deskripsi: 'Penguatan konsep dan latihan soal bertingkat sesuai kurikulum sekolah.',
    jenjang: 'SD, SMP, SMA',
    jadwal: '2x seminggu · 90 menit',
    biaya: 'Rp400.000/bulan',
    icon: Calculator,
  },
  {
    nama: 'Bahasa Inggris',
    deskripsi: 'Percakapan aktif, tata bahasa, dan persiapan tes dengan pendekatan komunikatif.',
    jenjang: 'Semua usia',
    jadwal: '2x seminggu · 90 menit',
    biaya: 'Rp450.000/bulan',
    icon: Languages,
  },
  {
    nama: 'Coding untuk Anak',
    deskripsi: 'Logika pemrograman lewat proyek game dan animasi sederhana yang seru.',
    jenjang: 'Usia 8–15 tahun',
    jadwal: '1x seminggu · 120 menit',
    biaya: 'Rp550.000/bulan',
    icon: Code2,
  },
  {
    nama: 'Desain Grafis',
    deskripsi: 'Dasar desain, tipografi, dan portofolio pertama untuk remaja dan pemula.',
    jenjang: 'SMP ke atas',
    jadwal: '1x seminggu · 120 menit',
    biaya: 'Rp600.000/bulan',
    icon: PenTool,
  },
  {
    nama: 'Persiapan UTBK',
    deskripsi: 'Kelas intensif dengan tryout mingguan dan pembahasan strategi per subtes.',
    jenjang: 'Kelas 12 & gap year',
    jadwal: '3x seminggu · 120 menit',
    biaya: 'Rp750.000/bulan',
    icon: Target,
  },
  {
    nama: 'Calistung Ceria',
    deskripsi: 'Membaca, menulis, dan berhitung untuk usia dini dengan metode bermain.',
    jenjang: 'Usia 5–7 tahun',
    jadwal: '2x seminggu · 60 menit',
    biaya: 'Rp350.000/bulan',
    icon: BookOpenCheck,
  },
]

export function Programs() {
  return (
    <section id="program" className="border-t bg-muted/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p variants={fadeUp} className="mb-3 text-sm font-bold tracking-wide text-primary uppercase">
          Program Kursus
        </motion.p>
        <motion.div variants={fadeUp} className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pilih Kelas yang Pas
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Semua biaya sudah termasuk modul, laporan perkembangan bulanan, dan
            akses kelas pengganti.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => (
            <motion.article
              key={program.nama}
              variants={fadeUp}
              className="flex flex-col rounded-3xl border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
            >
              <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <program.icon className="size-6" />
              </span>
              <h3 className="font-display text-xl font-extrabold">{program.nama}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground text-pretty">
                {program.deskripsi}
              </p>
              <dl className="mt-5 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Jenjang</dt>
                  <dd className="font-semibold">{program.jenjang}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Jadwal</dt>
                  <dd className="font-semibold">{program.jadwal}</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-center justify-between border-t pt-5">
                <p className="font-display text-lg font-extrabold text-primary">{program.biaya}</p>
                <a
                  href="#pendaftaran"
                  className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'rounded-full font-bold')}
                >
                  Daftar
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
