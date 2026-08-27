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

type Photo = {
  title: string
  category: string
  className: string
}

const PHOTOS: Photo[] = [
  {
    title: 'Sesi golden hour di tepi danau',
    category: 'Prewedding',
    className: 'aspect-[3/4] bg-gradient-to-br from-muted via-secondary to-accent',
  },
  {
    title: 'Tukar cincin di pelaminan',
    category: 'Akad',
    className: 'aspect-square bg-gradient-to-tr from-accent via-muted to-primary/15',
  },
  {
    title: 'Tawa keluarga di pelukan pertama',
    category: 'Resepsi',
    className: 'aspect-[4/5] bg-gradient-to-bl from-secondary via-accent to-muted',
  },
  {
    title: 'Potret hitam-putih sang pengantin',
    category: 'Potret',
    className: 'aspect-[3/4] bg-gradient-to-b from-primary/15 via-muted to-secondary',
  },
  {
    title: 'Detail buket dan cincin',
    category: 'Detail',
    className: 'aspect-square bg-gradient-to-br from-secondary via-muted to-accent',
  },
  {
    title: 'Tarian pertama di bawah lampu',
    category: 'Resepsi',
    className: 'aspect-[4/5] bg-gradient-to-tl from-muted via-accent to-primary/10',
  },
  {
    title: 'Potret keluarga tiga generasi',
    category: 'Keluarga',
    className: 'aspect-[3/4] bg-gradient-to-tr from-accent via-secondary to-muted',
  },
  {
    title: 'Siluet pasangan senja hari',
    category: 'Prewedding',
    className: 'aspect-square bg-gradient-to-br from-muted via-primary/10 to-secondary',
  },
  {
    title: 'Doa restu orang tua',
    category: 'Akad',
    className: 'aspect-[4/5] bg-gradient-to-b from-secondary via-accent to-muted',
  },
]

export function Gallery() {
  return (
    <section id="gallery" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
        >
          Galeri
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display mt-4 max-w-2xl text-3xl font-light tracking-tight sm:text-5xl"
        >
          Potongan cerita dari balik lensa
        </motion.h2>

        <div className="mt-12 columns-2 gap-4 sm:columns-3">
          {PHOTOS.map((photo) => (
            <motion.figure
              key={photo.title}
              variants={fadeUp}
              className="group mb-4 break-inside-avoid"
            >
              <div
                className={`w-full rounded-lg border transition-opacity group-hover:opacity-90 ${photo.className}`}
              />
              <figcaption className="mt-2.5">
                <p className="text-[11px] tracking-widest text-muted-foreground uppercase">
                  {photo.category}
                </p>
                <p className="mt-0.5 text-sm font-medium">{photo.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
