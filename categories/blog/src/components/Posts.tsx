import { motion } from 'motion/react'
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'

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

type Post = {
  judul: string
  kategori: string
  tanggal: string
  waktuBaca: string
  ringkasan: string
  penulis: string
  gradient: string
}

const POSTS: Post[] = [
  {
    judul: 'Arsip Digital Naskah Kuno: Perlombaan Melawan Waktu',
    kategori: 'Budaya',
    tanggal: '21 Agu 2026',
    waktuBaca: '9 menit',
    ringkasan:
      'Ribuan naskah lontar dan manuskrip Nusantara mulai dipindai relawan. Tapi siapa yang menjaga servernya sepuluh tahun lagi?',
    penulis: 'Tim Redaksi',
    gradient: 'from-primary/25 via-muted to-accent',
  },
  {
    judul: 'Mengapa Aplikasi Super Mulai Ditinggalkan Anak Muda',
    kategori: 'Teknologi',
    tanggal: '19 Agu 2026',
    waktuBaca: '7 menit',
    ringkasan:
      'Survei kecil-kecilan kami di tiga kampus menemukan pola yang sama: aplikasi tunggal yang ringan kembali dicari.',
    penulis: 'Kolom Analisis',
    gradient: 'from-accent via-muted to-primary/20',
  },
  {
    judul: 'Sinema Daerah dan Layar Ponsel: Distribusi Tanpa Bioskop',
    kategori: 'Film',
    tanggal: '16 Agu 2026',
    waktuBaca: '11 menit',
    ringkasan:
      'Film pendek berbahasa daerah menemukan penontonnya lewat kanal video vertikal — lengkap dengan takarir gotong royong.',
    penulis: 'Tim Redaksi',
    gradient: 'from-muted via-accent to-primary/25',
  },
  {
    judul: 'Kecerdasan Buatan di Ruang Kelas: Antara Bantuan dan Ketergantungan',
    kategori: 'Teknologi',
    tanggal: '13 Agu 2026',
    waktuBaca: '10 menit',
    ringkasan:
      'Guru-guru mulai merumuskan etika penggunaan AI untuk tugas sekolah. Kami menghimpun praktik baik dari lima sekolah.',
    penulis: 'Kolom Pendidikan',
    gradient: 'from-primary/20 via-accent to-muted',
  },
  {
    judul: 'Batik Generatif: Ketika Algoritma Bertemu Canting',
    kategori: 'Desain',
    tanggal: '10 Agu 2026',
    waktuBaca: '8 menit',
    ringkasan:
      'Perajin muda memakai pola generatif sebagai sketsa awal, lalu menyelesaikannya dengan tangan. Hasilnya mengejutkan kurator.',
    penulis: 'Tim Redaksi',
    gradient: 'from-accent via-primary/15 to-muted',
  },
  {
    judul: 'Podcast Sejarah Lokal dan Kebangkitan Cerita Lisan',
    kategori: 'Budaya',
    tanggal: '7 Agu 2026',
    waktuBaca: '6 menit',
    ringkasan:
      'Dari kisah pelabuhan tua hingga legenda kampung, mikrofon murah menghidupkan kembali tradisi bertutur.',
    penulis: 'Kontributor',
    gradient: 'from-muted via-primary/20 to-accent',
  },
]

export function Posts() {
  return (
    <section id="artikel" className="border-t bg-background py-20 sm:py-24">
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
          Arsip Terbaru
        </motion.p>
        <motion.div variants={fadeUp} className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Tulisan Terbaru
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Esai, reportase, dan analisis di persimpangan teknologi dan budaya —
            terbit setiap Selasa dan Jumat.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <motion.article key={post.judul} variants={fadeUp} className="group flex flex-col">
              <div
                className={`mb-5 aspect-[16/10] rounded-xl border bg-gradient-to-br ${post.gradient}`}
              />
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-accent-foreground">
                  {post.kategori}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3" /> {post.tanggal}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="size-3" /> {post.waktuBaca}
                </span>
              </div>
              <h3 className="font-display text-xl leading-snug font-medium text-balance">
                <a href="#artikel" className="transition-colors group-hover:text-primary">
                  {post.judul}
                </a>
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground text-pretty">{post.ringkasan}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {post.penulis}
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
