import { motion } from 'motion/react'
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
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

type ContactInfo = { icon: typeof MapPin; label: string; value: string }

const INFO: ContactInfo[] = [
  {
    icon: MapPin,
    label: 'Alamat outlet',
    value: 'Jl. Melati Raya No. 12, dekat pasar kecamatan',
  },
  {
    icon: Clock,
    label: 'Jam operasional',
    value: 'Setiap hari 07.00–21.00 WIB',
  },
  {
    icon: Phone,
    label: 'Telepon / WhatsApp',
    value: '0812-3456-7890',
  },
]

const AREAS: string[] = [
  'Perumahan Griya Asri',
  'Komplek Bumi Indah',
  'Sekitar kampus',
  'Kawasan pasar lama',
  'Radius 5 km dari outlet',
]

export function Contact() {
  return (
    <section id="kontak" className="border-t bg-muted/40">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:py-24 lg:grid-cols-2"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Kontak
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Jemput cucianmu hari ini
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-md text-muted-foreground text-pretty">
            Chat kami lewat WhatsApp atau tinggalkan pesan — kurir kami jemput
            di hari yang sama untuk pesanan sebelum pukul 15.00.
          </motion.p>

          <div className="mt-8 space-y-5">
            {INFO.map((item) => (
              <motion.div key={item.label} variants={fadeUp} className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-8">
            <p className="text-sm font-medium">Area antar-jemput</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AREAS.map((area) => (
                <span
                  key={area}
                  className="rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => e.preventDefault()}
          className="h-fit rounded-2xl border bg-card p-6 shadow-xs sm:p-8"
        >
          <p className="font-display text-xl font-semibold">Kirim pesan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Kami balas secepatnya di jam operasional.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="nama" className="text-sm font-medium">
                Nama
              </label>
              <input
                id="nama"
                type="text"
                placeholder="Nama kamu"
                className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div>
              <label htmlFor="wa" className="text-sm font-medium">
                Nomor WhatsApp
              </label>
              <input
                id="wa"
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div>
              <label htmlFor="pesan" className="text-sm font-medium">
                Pesan
              </label>
              <textarea
                id="pesan"
                rows={4}
                placeholder="Contoh: mau laundry kiloan 5 kg, tolong jemput sore ini"
                className="mt-1.5 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full rounded-full">
            <MessageCircle />
            Kirim & lanjut ke WhatsApp
          </Button>
        </motion.form>
      </motion.div>
    </section>
  )
}
