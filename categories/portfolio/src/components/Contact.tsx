import { motion } from 'motion/react'
import { Clock, Mail, MapPin } from 'lucide-react'
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

export function Contact() {
  return (
    <section id="contact" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="text-sm font-medium tracking-widest text-primary uppercase"
          >
            Kontak
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Punya ide proyek? Mari kita obrolkan
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-md text-muted-foreground">
            Ceritakan kebutuhan Anda — desain, pengembangan, atau keduanya. Saya
            akan membalas dengan perkiraan lingkup dan jadwal kerja.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-8 space-y-4">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-10 items-center justify-center rounded-lg border bg-card">
                <Mail className="size-4 text-primary" />
              </span>
              halo@studio-desain.id
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-10 items-center justify-center rounded-lg border bg-card">
                <MapPin className="size-4 text-primary" />
              </span>
              Jakarta, Indonesia — kerja remote
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-10 items-center justify-center rounded-lg border bg-card">
                <Clock className="size-4 text-primary" />
              </span>
              Balasan dalam 1×24 jam kerja
            </li>
          </motion.ul>
        </div>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl border bg-card p-6 sm:p-8"
        >
          <div className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="contact-name" className="text-sm font-medium">
                Nama
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Nama Anda"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="nama@email.com"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contact-message" className="text-sm font-medium">
                Ceritakan proyek Anda
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder="Lingkup, target waktu, dan referensi jika ada…"
                className="rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <Button type="submit" size="lg">
              Kirim Pesan
            </Button>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}
