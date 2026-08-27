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
  role: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Dulu tutup buku bulanan makan waktu tiga hari penuh. Sekarang rekonsiliasi selesai otomatis dan saya tinggal review satu jam saja.',
    name: 'Rendra P.',
    role: 'Finance Lead, distributor FMCG',
    initials: 'RP',
  },
  {
    quote:
      'Piutang macet turun drastis sejak pengingat tagihan berjalan sendiri. Pelanggan bayar lebih cepat tanpa kami harus menagih manual.',
    name: 'Sekar W.',
    role: 'Pemilik studio desain',
    initials: 'SW',
  },
  {
    quote:
      'Integrasi marketplace-nya juara. Penjualan dari tiga toko online masuk ke satu laporan, lengkap dengan biaya dan komisinya.',
    name: 'Yoga A.',
    role: 'COO, brand fashion lokal',
    initials: 'YA',
  },
]

export function Testimonials() {
  return (
    <section id="testimoni" className="py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="text-center">
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-widest text-primary uppercase"
          >
            Testimoni
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            Tim keuangan yang sudah pindah ke sini
          </motion.h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <motion.figure
              key={testimonial.name}
              variants={fadeUp}
              className="flex flex-col rounded-xl border bg-card p-7"
            >
              <Quote className="size-6 text-primary" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {testimonial.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
