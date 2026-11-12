import { motion, type Variants } from 'motion/react'
import { ArrowRight, Building2, IdCard, Network, Scale, Sparkles } from 'lucide-react'
import { DEADLINE, mailtoUrl, waUrl } from '@/lib/contact'
import { useCountdown } from '@/lib/useCountdown'
import { WhatsAppIcon } from '@/components/icons'
import { Skyline } from '@/components/Skyline'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const ORBIT = [
  { icon: Building2, label: 'Perusahaan resmi', pos: 'left-0 top-[12%]' },
  { icon: IdCard, label: 'Iqama 2 orang', pos: 'right-0 top-[28%]' },
  { icon: Scale, label: 'Legal & lisensi', pos: 'left-0 bottom-[24%]' },
  { icon: Network, label: 'Partner lokal', pos: 'right-0 bottom-[8%]' },
]

function Countdown() {
  const t = useCountdown(DEADLINE)
  const cells = [
    { v: t.days, l: 'Hari' },
    { v: t.hours, l: 'Jam' },
    { v: t.minutes, l: 'Menit' },
    { v: t.seconds, l: 'Detik' },
  ]
  if (t.done)
    return (
      <p className="font-mono text-sm text-primary">
        Gelombang 1 sudah ditutup — pendaftaran Gelombang 2 dibuka Jan–Feb 2027.
      </p>
    )
  return (
    <div className="grid max-w-sm grid-cols-4 gap-2" role="timer" aria-label="Sisa waktu pendaftaran Gelombang 1">
      {cells.map((c) => (
        <div key={c.l} className="glass ring-gold min-w-0 rounded-2xl px-1 py-2 text-center">
          <div className="font-display text-2xl font-bold tabular-nums">{String(c.v).padStart(2, '0')}</div>
          <div className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{c.l}</div>
        </div>
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-40 sm:pt-40 sm:pb-52 lg:pb-60">
      {/* backdrop */}
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_30%,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[38rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(251_180_74/0.22),transparent)] blur-2xl" />
      <div className="absolute top-1/3 -right-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(20_120_105/0.45),transparent)] blur-3xl" />

      <div className="absolute inset-x-0 bottom-0 -z-10">
        <Skyline className="h-44 sm:h-56 lg:h-64" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={container} initial="hidden" animate="show" className="min-w-0">
          <motion.a
            variants={fadeUp}
            href="#jadwal"
            className="glass inline-flex max-w-full items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 text-xs whitespace-nowrap sm:text-sm"
          >
            <span className="bg-gold rounded-full px-2.5 py-0.5 font-semibold text-primary-foreground">Gelombang 1</span>
            <span className="text-muted-foreground">Deadline<span className="hidden sm:inline"> proposal</span></span>
            <span className="font-semibold text-foreground">25 Nov 2026</span>
            <ArrowRight className="size-3.5 text-primary" />
          </motion.a>

          <motion.h1
            variants={fadeUp}
            className="font-display mt-6 text-[2.4rem] leading-[1.05] text-balance font-bold tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            Punya ide startup?
            <br />
            <span className="text-gold">Bawa ke Saudi Arabia.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Program kurasi & pendampingan PUAS untuk mengubah ide bisnis dan startup Indonesia menjadi{' '}
            <strong className="font-semibold text-foreground">perusahaan resmi di Saudi Arabia</strong> — sekaligus
            mendapatkan izin tinggal (Iqama) jalur startup untuk{' '}
            <strong className="font-semibold text-foreground">2 orang</strong> (Founder & Co-founder/Investor).
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={mailtoUrl()}
              className="group bg-gold inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold whitespace-nowrap text-primary-foreground shadow-xl shadow-gold-1/25 transition-transform hover:scale-[1.03]"
            >
              Daftar via Email
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold whitespace-nowrap transition-colors hover:border-primary/50"
            >
              <WhatsAppIcon className="size-5 shrink-0 text-[#25D366]" />
              Fast Track via WhatsApp
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Pendaftaran Gelombang 1 ditutup dalam
            </p>
            <Countdown />
          </motion.div>
        </motion.div>

        {/* Orbital visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[26rem]"
          aria-hidden="true"
        >
          <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-primary/25" />
          <div className="absolute inset-[12%] animate-spin-slower rounded-full border border-primary/15">
            <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-gold-1 shadow-[0_0_20px_4px_rgb(251_180_74/0.6)]" />
          </div>
          <div className="absolute inset-[26%] rounded-full bg-[radial-gradient(closest-side,rgb(251_180_74/0.35),transparent)] blur-xl" />
          <div className="absolute inset-[26%] flex items-center justify-center">
            <motion.img
              src={`${import.meta.env.BASE_URL}puas-mark.png`}
              alt=""
              className="size-full object-contain drop-shadow-[0_20px_50px_rgb(0_0_0/0.6)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          {ORBIT.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
              className={`glass ring-gold absolute ${o.pos} flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-[11px] font-medium whitespace-nowrap shadow-xl shadow-black/30 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm`}
            >
              <span className="bg-gold flex size-6 shrink-0 items-center justify-center rounded-lg text-primary-foreground sm:size-7">
                <o.icon className="size-3.5 sm:size-4" />
              </span>
              {o.label}
            </motion.div>
          ))}
          <div className="glass absolute top-[-2%] right-[22%] flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] tracking-widest text-primary uppercase">
            <Sparkles className="size-3" /> ID → SA
          </div>
        </motion.div>
      </div>
    </section>
  )
}
