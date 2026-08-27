import { motion } from 'motion/react'

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

type Teacher = {
  nama: string
  inisial: string
  bidang: string
  pengalaman: string
  gradient: string
}

const TEACHERS: Teacher[] = [
  {
    nama: 'Ratna Puspita, S.Pd.',
    inisial: 'RP',
    bidang: 'Matematika',
    pengalaman: '9 tahun mengajar, pembina olimpiade tingkat kota',
    gradient: 'from-primary/30 via-accent to-muted',
  },
  {
    nama: 'Dimas Anggara, S.S.',
    inisial: 'DA',
    bidang: 'Bahasa Inggris',
    pengalaman: 'Sertifikasi pengajaran internasional, 7 tahun mengajar',
    gradient: 'from-accent via-primary/20 to-muted',
  },
  {
    nama: 'Sekar Larasati, S.Kom.',
    inisial: 'SL',
    bidang: 'Coding Anak',
    pengalaman: 'Mantan pengembang aplikasi, 5 tahun mengajar anak',
    gradient: 'from-muted via-accent to-primary/30',
  },
  {
    nama: 'Yoga Pratama, S.Ds.',
    inisial: 'YP',
    bidang: 'Desain Grafis',
    pengalaman: 'Praktisi studio desain, pembimbing portofolio remaja',
    gradient: 'from-primary/20 via-muted to-accent',
  },
]

export function Teachers() {
  return (
    <section id="pengajar" className="border-t bg-muted/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p variants={fadeUp} className="mb-3 text-sm font-bold tracking-wide text-primary uppercase">
          Tim Pengajar
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mb-12 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Diajar oleh yang Ahli di Bidangnya
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEACHERS.map((teacher) => (
            <motion.article
              key={teacher.nama}
              variants={fadeUp}
              className="rounded-3xl border bg-card p-6 text-center shadow-xs"
            >
              <div
                className={`mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br ${teacher.gradient}`}
              >
                <span className="font-display text-xl font-extrabold text-primary">
                  {teacher.inisial}
                </span>
              </div>
              <h3 className="font-display font-extrabold">{teacher.nama}</h3>
              <p className="mt-1 text-sm font-bold text-primary">{teacher.bidang}</p>
              <p className="mt-2 text-xs text-muted-foreground text-pretty">{teacher.pengalaman}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
