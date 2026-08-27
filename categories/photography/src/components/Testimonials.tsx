import { motion } from 'motion/react'
import { Quote } from 'lucide-react'

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

type Testimonial = {
  quote: string
  name: string
  event: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Kami hampir tidak sadar sedang difoto, tapi hasilnya menangkap semua momen penting — bahkan yang kami sendiri lewatkan di hari itu.',
    name: 'Nadia & Fajar',
    event: 'Pernikahan di Bandung',
  },
  {
    quote:
      'Sneak peek datang keesokan paginya dan langsung membuat satu keluarga menangis haru. Kurasinya luar biasa rapi.',
    name: 'Laras & Dimas',
    event: 'Intimate wedding di Yogyakarta',
  },
  {
    quote:
      'Sesi keluarga tiga generasi yang tadinya kami takutkan ribet ternyata santai dan menyenangkan. Fotonya kini tergantung di ruang tamu.',
    name: 'Keluarga Hartono',
    event: 'Sesi potret keluarga',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t bg-background py-20 sm:py-24">
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
          Testimoni
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display mt-4 max-w-2xl text-3xl font-light tracking-tight sm:text-5xl"
        >
          Dari pasangan dan keluarga
        </motion.h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <motion.figure
              key={testimonial.name}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border bg-card/50 p-8"
            >
              <Quote className="size-5 text-muted-foreground" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t pt-5">
                <p className="text-sm font-medium">{testimonial.name}</p>
                <p className="mt-0.5 text-xs tracking-widest text-muted-foreground uppercase">
                  {testimonial.event}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
