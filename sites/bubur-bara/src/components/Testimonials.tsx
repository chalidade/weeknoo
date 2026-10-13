import { motion } from 'motion/react'
import { Quote, Star } from 'lucide-react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

type Review = { name: string; role: string; text: string }

const REVIEWS: Review[] = [
  {
    name: 'Rina',
    role: 'Karyawan swasta',
    text: 'Buburnya smoky karena dibakar di claypot, telurnya leleh pas diaduk. Pesan dari kantor, sampai gerai tinggal ambil.',
  },
  {
    name: 'Dimas',
    role: 'Mahasiswa',
    text: 'Wonton chili oil-nya juara, pedas gurih bikin nagih. Harganya ramah kantong banget buat sarapan tiap hari.',
  },
  {
    name: 'Bu Sari',
    role: 'Ibu dua anak',
    text: 'Anak-anak suka yang kuah kuning, saya yang laksa. Porsinya pas dan kuahnya hangat di perut.',
  },
  {
    name: 'Fajar',
    role: 'Ojek online',
    text: 'Gerai motornya sudah buka subuh. Antre pagi ramai tapi cepat, nggak sampai lima menit.',
  },
  {
    name: 'Laras',
    role: 'Guru SD',
    text: 'Semurnya meresap sampai ke dalam bubur. Sering pesan terjadwal H-1 buat sarapan rapat sekolah.',
  },
  {
    name: 'Yoga',
    role: 'Pekerja shift malam',
    text: 'Pulang kerja langsung mampir. Kopi tubruk plus bubur bakar sapi itu kombinasi paling pas.',
  },
]

export function Testimonials() {
  return (
    <section aria-labelledby="ulasan-title" className="bg-foreground py-20 text-background sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.p variants={fadeUp} className="text-sm font-bold tracking-wide text-accent uppercase">
            Kata pelanggan
          </motion.p>
          <motion.h2
            id="ulasan-title"
            variants={fadeUp}
            className="mt-2 max-w-2xl font-display text-4xl font-black tracking-tight sm:text-5xl"
          >
            Antrean pagi yang selalu kembali lagi
          </motion.h2>

          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {REVIEWS.map((r) => (
              <motion.figure
                key={r.name}
                variants={fadeUp}
                className="mb-4 break-inside-avoid rounded-2xl border border-background/10 bg-background/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="size-5 text-background/25" />
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-background/85">“{r.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                    {r.name.replace('Bu ', '')[0]}
                  </span>
                  <span className="text-sm">
                    <span className="block font-bold">{r.name}</span>
                    <span className="text-background/60">{r.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
