import { useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { Check, Copy, HandCoins, Lightbulb, Rocket, Send, ShieldCheck, Target, TrendingUp } from 'lucide-react'
import { EMAIL, PROPOSAL_TEMPLATE, mailtoUrl } from '@/lib/contact'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const POINTS = [
  { icon: Target, q: 'Masalah apa yang mau diselesaikan?', hint: 'Siapa yang mengalami masalahnya, seberapa besar, dan kenapa penting di pasar Saudi/GCC.' },
  { icon: Lightbulb, q: 'Apa solusi yang ditawarkan?', hint: 'Produk/layanan Anda dan apa yang membuatnya berbeda dari yang sudah ada.' },
  { icon: ShieldCheck, q: 'Sejauh mana sudah terbukti?', hint: 'Prototipe, pilot, jumlah pengguna, pendapatan, atau mitra — bukti sekecil apa pun dihitung.' },
  { icon: TrendingUp, q: 'Potensi scale-up-nya?', hint: 'Seberapa luas bisa tumbuh: kota lain di Saudi, negara GCC, segmen baru.' },
  { icon: HandCoins, q: 'Berapa dana yang dibutuhkan?', hint: 'Angka yang realistis dan rencana penggunaannya secara garis besar.' },
  { icon: Rocket, q: 'Rencana bagi hasil dengan PUAS?', hint: 'Usulan skema kerja sama/bagi hasil yang Anda tawarkan kepada PUAS.' },
]

export function Proposal() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROPOSAL_TEMPLATE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = mailtoUrl()
    }
  }

  return (
    <section id="proposal" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="absolute top-20 left-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(20_120_105/0.35),transparent)] blur-3xl" />
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.25em] text-primary uppercase">
              Cara mendaftar
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Format bebas. <span className="text-gold">Singkat, tapi menjawab 6 hal ini.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl text-muted-foreground">
              Boleh pitch deck, dokumen, atau langsung di badan email — yang penting dalam waktu singkat reviewer
              bisa memahami keenam poin berikut.
            </motion.p>

            <ol className="mt-10 grid gap-3 sm:grid-cols-2">
              {POINTS.map((p, i) => (
                <motion.li
                  key={p.q}
                  variants={fadeUp}
                  className="glass group relative overflow-hidden rounded-2xl p-5 transition-colors hover:border-primary/40"
                >
                  <span className="font-display pointer-events-none absolute -right-2 -bottom-6 text-7xl font-extrabold text-white/[0.03] transition-colors group-hover:text-primary/10">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <p.icon className="size-4.5" />
                    </span>
                    <h3 className="font-semibold leading-snug">{p.q}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.hint}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Email composer preview */}
          <motion.div variants={fadeUp} className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass ring-gold overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">Pesan baru</span>
              </div>
              <dl className="divide-y divide-border text-sm">
                <div className="flex gap-3 px-5 py-3">
                  <dt className="w-14 text-muted-foreground">Kepada</dt>
                  <dd className="font-medium text-primary">{EMAIL}</dd>
                </div>
                <div className="flex gap-3 px-5 py-3">
                  <dt className="w-14 text-muted-foreground">Subjek</dt>
                  <dd className="font-medium">Proposal Startup — [Nama Startup]</dd>
                </div>
              </dl>
              <pre className="max-h-72 overflow-auto border-t border-border px-5 py-4 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {PROPOSAL_TEMPLATE}
              </pre>
              <div className="grid gap-2 border-t border-border p-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/5"
                >
                  {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
                  {copied ? 'Template tersalin' : 'Salin template'}
                </button>
                <a
                  href={mailtoUrl()}
                  className="bg-gold inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  <Send className="size-4" /> Buka di email
                </a>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Tombol “Buka di email” membuka aplikasi email Anda dengan template sudah terisi.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
