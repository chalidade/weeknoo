import { motion } from 'motion/react'
import { Star } from 'lucide-react'

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

type Testimoni = {
  kutipan: string
  nama: string
  peran: string
}

const TESTIMONI: Testimoni[] = [
  {
    kutipan:
      'Nilai matematika anak saya naik dari 68 ke 88 dalam satu semester. Yang paling saya suka, dia sekarang mengerjakan PR tanpa disuruh.',
    nama: 'Ibu Handayani',
    peran: 'Orang tua siswa SMP',
  },
  {
    kutipan:
      'Kelas coding-nya seru banget. Aku sudah bikin dua game sendiri dan ditunjukkan waktu pentas karya di sekolah.',
    nama: 'Raffa, 11 tahun',
    peran: 'Siswa Coding untuk Anak',
  },
  {
    kutipan:
      'Tryout mingguan dan pembahasannya sangat membantu. Alhamdulillah lolos ke kampus pilihan pertama lewat jalur UTBK.',
    nama: 'Nadia',
    peran: 'Alumni kelas Persiapan UTBK',
  },
]

export function Testimonials() {
  return (
    <section id="testimoni" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p variants={fadeUp} className="mb-3 text-sm font-bold tracking-wide text-primary uppercase">
          Testimoni
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mb-12 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Kata Mereka yang Sudah Bergabung
        </motion.h2>

        <div className="grid gap-6 lg:grid-cols-3">
          {TESTIMONI.map((item) => (
            <motion.figure
              key={item.nama}
              variants={fadeUp}
              className="flex flex-col rounded-3xl border bg-card p-6 shadow-xs"
            >
              <div className="mb-4 flex gap-1 text-primary" aria-label="Nilai 5 dari 5 bintang">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm text-foreground text-pretty">
                &ldquo;{item.kutipan}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t pt-4">
                <p className="font-display font-extrabold">{item.nama}</p>
                <p className="text-xs text-muted-foreground">{item.peran}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
