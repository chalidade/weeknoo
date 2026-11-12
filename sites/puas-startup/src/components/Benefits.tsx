import { motion, type Variants } from 'motion/react'
import { Building2, IdCard, Network, Scale } from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const BENEFITS = [
  {
    icon: Building2,
    title: 'Dirikan perusahaan resmi di Saudi',
    body: 'Ide dan startup Anda dikurasi lalu didampingi sampai berdiri sebagai entitas bisnis resmi di Kerajaan Saudi Arabia.',
    span: 'md:col-span-2',
  },
  {
    icon: IdCard,
    title: 'Iqama jalur startup untuk 2 orang',
    body: 'Izin tinggal untuk Founder dan Co-founder/Investor, diproses bersama pendirian perusahaan.',
    span: '',
  },
  {
    icon: Scale,
    title: 'Pendampingan legal, lisensi & operasional',
    body: 'Tidak perlu meraba-raba regulasi sendiri — tim PUAS mendampingi dari perizinan hingga operasional awal.',
    span: '',
  },
  {
    icon: Network,
    title: 'Akses ekosistem bisnis & partner lokal',
    body: 'Terhubung dengan jaringan bisnis dan mitra lokal di Saudi untuk mempercepat masuk pasar Saudi & GCC.',
    span: 'md:col-span-2',
  },
]

const TAGS = ['Startup', 'Ekspansi Bisnis', 'Teknologi', 'Layanan', 'Model Bisnis Baru', 'Pasar Saudi', 'GCC', 'Iqama', 'Legal & Lisensi', 'Pendanaan']

export function Benefits() {
  return (
    <section id="program" className="relative scroll-mt-24 py-20 sm:py-28">
      {/* marquee */}
      <div className="relative mb-20 overflow-hidden border-y border-border bg-white/[0.02] py-4 [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...TAGS, ...TAGS].map((t, i) => (
            <span key={i} className="font-display flex items-center gap-10 text-lg font-semibold text-muted-foreground/70">
              {t}
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.25em] text-primary uppercase">
          Yang Anda dapatkan
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-display mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
          Dari ide di Indonesia, menjadi <span className="text-gold">perusahaan di Saudi.</span>
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <motion.article
              key={b.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`glass ring-gold group relative overflow-hidden rounded-3xl p-6 sm:p-7 ${b.span}`}
            >
              <div className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(251_180_74/0.18),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <span className="bg-gold flex size-12 items-center justify-center rounded-2xl text-primary-foreground shadow-lg shadow-gold-1/20">
                  <b.icon className="size-6" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="font-display mt-8 text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">{b.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
