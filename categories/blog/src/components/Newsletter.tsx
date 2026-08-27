import { motion } from 'motion/react'
import { MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

export function Newsletter() {
  return (
    <section id="newsletter" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="relative overflow-hidden rounded-2xl border bg-card px-6 py-14 text-center shadow-xs sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,theme(colors.primary/8%),transparent)]"
          />
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground"
          >
            <MailOpen className="size-6" />
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl"
          >
            Surat Mingguan __SITE_NAME__
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-lg text-muted-foreground text-pretty"
          >
            Satu email setiap Jumat pagi: tiga tulisan pilihan, satu rekomendasi baca,
            tanpa iklan. Berhenti berlangganan kapan saja.
          </motion.p>
          <motion.form
            variants={fadeUp}
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Alamat email
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="nama@email.com"
              className="h-10 flex-1 rounded-md border bg-background px-4 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <Button type="submit" size="lg">
              Berlangganan
            </Button>
          </motion.form>
          <motion.p variants={fadeUp} className="mt-4 text-xs text-muted-foreground">
            Sudah dibaca 8.200+ pelanggan setiap minggunya.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
