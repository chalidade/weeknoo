import { motion } from 'motion/react'
import { Code2 } from 'lucide-react'

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

const TOOLS: string[] = [
  'Figma',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Motion',
  'Node.js',
]

export function About() {
  return (
    <section id="about" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="relative">
          <div className="aspect-[4/5] w-full max-w-md rounded-2xl border bg-gradient-to-br from-primary/30 via-muted to-accent" />
          <div className="absolute -right-2 -bottom-2 flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm sm:-right-4 sm:-bottom-4">
            <Code2 className="size-5 text-primary" />
            <span className="text-sm font-medium">Desain × Kode</span>
          </div>
        </motion.div>

        <div>
          <motion.p
            variants={fadeUp}
            className="text-sm font-medium tracking-widest text-primary uppercase"
          >
            Tentang Saya
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Satu orang, dua bahasa: visual dan logika
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-muted-foreground">
            Berangkat dari desain grafis lalu jatuh cinta pada kode, saya
            terbiasa mengerjakan produk dari dua sisi sekaligus. Artinya tidak
            ada yang hilang di antara mockup dan implementasi — apa yang
            disepakati di Figma adalah apa yang tampil di browser.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Tujuh tahun terakhir saya bekerja bersama startup tahap awal hingga
            perusahaan skala nasional, membangun design system, aplikasi web,
            dan situs pemasaran yang cepat serta mudah dirawat.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <p className="text-sm font-medium">Perkakas sehari-hari</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
