import { motion } from 'motion/react'
import { CalendarCheck, Mail, MapPin } from 'lucide-react'
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
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
        >
          Kontak
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display mt-4 text-3xl font-light tracking-tight sm:text-5xl"
        >
          Ceritakan hari besar Anda
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Isi tanggal dan lokasi acara — saya akan mengabari ketersediaan beserta
          rekomendasi paket dalam satu hari kerja.
        </motion.p>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 rounded-2xl border bg-card/50 p-6 text-left sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
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
              <label htmlFor="contact-date" className="text-sm font-medium">
                Tanggal acara
              </label>
              <input
                id="contact-date"
                type="date"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contact-city" className="text-sm font-medium">
                Kota / lokasi
              </label>
              <input
                id="contact-city"
                type="text"
                placeholder="Misal: Bandung"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="contact-message" className="text-sm font-medium">
                Cerita singkat acara Anda
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Jenis acara, perkiraan jumlah tamu, dan paket yang diminati…"
                className="rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
            <CalendarCheck />
            Cek Ketersediaan
          </Button>
        </motion.form>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-8"
        >
          <span className="inline-flex items-center gap-2">
            <Mail className="size-4" /> halo@studiofoto.id
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4" /> Berbasis di Jakarta, siap ke seluruh Indonesia
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
