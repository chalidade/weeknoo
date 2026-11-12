import { m, type Variants } from 'motion/react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const STEPS = [
  { t: 'Siapkan proposal', d: 'Format bebas, jawab 6 poin utama secara singkat.' },
  { t: 'Kirim ke email', d: 'startup@puas.sa — sebelum 25 Nov 2026 untuk Gelombang 1.' },
  { t: 'Kurasi PUAS', d: 'Tim PUAS menilai proposal yang masuk.' },
  { t: 'Pengumuman', d: 'Pemenang Gelombang 1 diumumkan Desember 2026.' },
  { t: 'Berdiri di Saudi', d: 'Pendampingan pendirian perusahaan & proses Iqama 2 orang.' },
]

export function Process() {
  return (
    <section id="alur" className="relative scroll-mt-24 py-20 sm:py-28">
      <m.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <m.p variants={fadeUp} className="text-center font-mono text-xs tracking-[0.25em] text-primary uppercase">
          Alur program
        </m.p>
        <m.h2 variants={fadeUp} className="font-display mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-5xl">
          Lima langkah <span className="text-gold">menuju Riyadh.</span>
        </m.h2>

        <ol className="relative mt-16 grid gap-8 md:grid-cols-5 md:gap-4">
          <div className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <m.li key={s.t} variants={fadeUp} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="font-display relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background text-lg font-bold text-primary shadow-[0_0_0_6px_var(--background)]">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </m.li>
          ))}
        </ol>
      </m.div>
    </section>
  )
}
