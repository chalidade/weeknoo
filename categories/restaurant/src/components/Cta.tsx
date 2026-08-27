import { motion } from 'motion/react'
import { CalendarCheck } from 'lucide-react'
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

const inputClass =
  'h-10 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50'

export function Cta() {
  return (
    <section id="reservasi" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.div
          variants={fadeUp}
          className="grid overflow-hidden rounded-3xl border bg-card shadow-sm lg:grid-cols-2"
        >
          <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-primary/15 via-accent to-muted p-8 sm:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <CalendarCheck className="size-3.5 text-primary" />
              Reservasi Meja
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Rayakan momen keluarga di meja terbaik kami
            </h2>
            <p className="text-muted-foreground text-pretty">
              Kirim permintaan reservasi dan tim kami akan menghubungi Anda melalui
              WhatsApp untuk konfirmasi. Untuk rombongan di atas 20 orang, tersedia
              ruang privat tanpa biaya tambahan.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid gap-4 p-8 sm:grid-cols-2 sm:p-12"
          >
            <div className="sm:col-span-2">
              <label htmlFor="nama" className="mb-1.5 block text-sm font-medium">
                Nama lengkap
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                placeholder="Nama Anda"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="telepon" className="mb-1.5 block text-sm font-medium">
                No. WhatsApp
              </label>
              <input
                id="telepon"
                name="telepon"
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="tamu" className="mb-1.5 block text-sm font-medium">
                Jumlah tamu
              </label>
              <select id="tamu" name="tamu" className={inputClass}>
                <option>2 orang</option>
                <option>4 orang</option>
                <option>6 orang</option>
                <option>10+ orang (rombongan)</option>
              </select>
            </div>
            <div>
              <label htmlFor="tanggal" className="mb-1.5 block text-sm font-medium">
                Tanggal
              </label>
              <input id="tanggal" name="tanggal" type="date" className={inputClass} />
            </div>
            <div>
              <label htmlFor="jam" className="mb-1.5 block text-sm font-medium">
                Jam kedatangan
              </label>
              <input id="jam" name="jam" type="time" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="catatan" className="mb-1.5 block text-sm font-medium">
                Catatan (opsional)
              </label>
              <textarea
                id="catatan"
                name="catatan"
                rows={3}
                placeholder="Misal: kursi bayi, perayaan ulang tahun…"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full">
                Kirim Permintaan Reservasi
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </section>
  )
}
