import { motion } from 'motion/react'
import { CalendarCheck, ClipboardPen, FlaskConical } from 'lucide-react'
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

type Langkah = {
  judul: string
  deskripsi: string
  icon: typeof ClipboardPen
}

const LANGKAH: Langkah[] = [
  {
    judul: '1. Isi Formulir',
    deskripsi: 'Lengkapi data singkat calon siswa dan program yang diminati.',
    icon: ClipboardPen,
  },
  {
    judul: '2. Tes Penempatan',
    deskripsi: 'Tes gratis 30 menit untuk menentukan level kelas yang tepat.',
    icon: FlaskConical,
  },
  {
    judul: '3. Mulai Kelas',
    deskripsi: 'Pilih jadwal, lakukan pembayaran, dan langsung ikut kelas pertama.',
    icon: CalendarCheck,
  },
]

const inputClass =
  'h-10 w-full rounded-xl border bg-background px-4 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50'

export function Admission() {
  return (
    <section id="pendaftaran" className="border-t bg-muted/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-start"
      >
        <div>
          <motion.p variants={fadeUp} className="mb-3 text-sm font-bold tracking-wide text-primary uppercase">
            Pendaftaran
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-4 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            Tiga Langkah Menuju Kelas Pertama
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 max-w-lg text-muted-foreground text-pretty">
            Biaya pendaftaran Rp100.000 sudah termasuk tes penempatan dan modul
            pertemuan pertama. Kuota tiap kelas terbatas.
          </motion.p>

          <div className="space-y-6">
            {LANGKAH.map((langkah) => (
              <motion.div key={langkah.judul} variants={fadeUp} className="flex gap-4">
                <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <langkah.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display font-extrabold">{langkah.judul}</h3>
                  <p className="mt-1 text-sm text-muted-foreground text-pretty">{langkah.deskripsi}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => e.preventDefault()}
          className="rounded-3xl border bg-card p-6 shadow-xs sm:p-8"
        >
          <h3 className="font-display text-xl font-extrabold">Formulir Pendaftaran</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tim kami menghubungi Anda maksimal 1x24 jam kerja.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="adm-nama" className="mb-1.5 block text-sm font-bold">
                Nama calon siswa
              </label>
              <input id="adm-nama" type="text" required placeholder="Nama lengkap" className={inputClass} />
            </div>
            <div>
              <label htmlFor="adm-wa" className="mb-1.5 block text-sm font-bold">
                Nomor WhatsApp orang tua
              </label>
              <input id="adm-wa" type="tel" required placeholder="08xx-xxxx-xxxx" className={inputClass} />
            </div>
            <div>
              <label htmlFor="adm-program" className="mb-1.5 block text-sm font-bold">
                Program yang diminati
              </label>
              <select id="adm-program" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Pilih program
                </option>
                <option>Matematika SD–SMA</option>
                <option>Bahasa Inggris</option>
                <option>Coding untuk Anak</option>
                <option>Desain Grafis</option>
                <option>Persiapan UTBK</option>
                <option>Calistung Ceria</option>
              </select>
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full font-bold">
              Kirim &amp; Jadwalkan Tes Penempatan
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Dengan mengirim formulir, Anda menyetujui dihubungi via WhatsApp.
            </p>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}
