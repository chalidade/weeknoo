import { motion } from 'motion/react'
import { Aperture } from 'lucide-react'

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

type Stat = { value: string; label: string }

const STATS: Stat[] = [
  { value: '120+', label: 'Pernikahan didokumentasikan' },
  { value: '9', label: 'Tahun memotret' },
  { value: '14', label: 'Kota di Indonesia' },
]

export function About() {
  return (
    <section id="about" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="relative order-last lg:order-first">
          <div className="flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-2xl border bg-gradient-to-br from-muted via-secondary to-accent">
            <Aperture className="size-14 text-muted-foreground/50" />
          </div>
        </motion.div>

        <div>
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
          >
            Di Balik Lensa
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-4 text-3xl font-light tracking-tight sm:text-5xl"
          >
            Memotret rasa, bukan sekadar pose
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-muted-foreground">
            Sembilan tahun lalu saya memotret pernikahan pertama — sejak itu saya
            percaya foto terbaik lahir saat orang lupa sedang difoto. Pendekatan
            saya tenang dan tidak mengarahkan berlebihan: hadir lebih awal,
            mengamati, lalu menangkap momen apa adanya.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Setiap paket sudah termasuk kurasi dan olah warna khas monokrom-hangat,
            dengan hasil akhir yang siap cetak maupun dibagikan. Untuk luar kota,
            saya terbiasa bekerja dengan tim ringkas dua orang.
          </motion.p>

          <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-3 gap-6 border-t pt-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="font-display text-2xl font-light sm:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  )
}
