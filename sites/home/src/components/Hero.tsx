import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUp, Sparkles, ShieldCheck } from 'lucide-react'

const REPO = 'https://github.com/chalidade/weeknoo'

const EXAMPLES = [
  { label: 'Landing coffee shop', prompt: 'Buatkan site baru "kopi-senja": landing page coffee shop dengan hero, menu unggulan, testimoni, jam buka, dan lokasi. Nuansa hangat, foto-foto besar.' },
  { label: 'Al-Qur’an app', prompt: 'Buatkan site baru "quran-app": aplikasi baca Al-Qur’an memakai library @/lib/api — daftar surah, halaman baca per surah dengan terjemahan, tafsir, dan asbabun nuzul per ayat.' },
  { label: 'Portfolio fotografer', prompt: 'Buatkan site baru "foto-folio": portfolio fotografer dengan galeri grid masonry, halaman tentang, dan kontak. Gelap, elegan, fokus ke foto.' },
  { label: 'Dashboard wilayah', prompt: 'Buatkan site baru "peta-wilayah": explorer wilayah Indonesia memakai @/lib/api — dropdown berantai provinsi → kabupaten/kota → kecamatan → kelurahan.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6 } },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

function issueUrl(prompt: string) {
  const firstLine = prompt.trim().split('\n')[0]
  const title = firstLine.length > 60 ? `${firstLine.slice(0, 57)}…` : firstLine
  const body = `${prompt.trim()}\n\n---\n_Prompt dari halaman utama weeknoo. Kerjakan di workspace ini mengikuti CLAUDE.md, lalu commit & push supaya CI mem-publish hasilnya._`
  const params = new URLSearchParams({ title, body, labels: 'prompt' })
  return `${REPO}/issues/new?${params.toString()}`
}

export function Hero() {
  const [prompt, setPrompt] = useState('')

  const submit = () => {
    if (!prompt.trim()) return
    window.open(issueUrl(prompt), '_blank', 'noopener')
  }

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="animate-glow absolute top-[-18rem] left-1/2 -z-10 size-[44rem] rounded-full bg-[radial-gradient(circle,var(--accent),transparent_65%)] opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute top-[-8rem] left-1/2 -z-10 h-[22rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--primary),transparent_70%)] opacity-25 blur-3xl"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-36 pb-16 text-center sm:pt-44"
      >
        <motion.a
          variants={fadeUp}
          href="#cara-kerja"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border bg-card/60 py-1 pr-4 pl-1 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            <Sparkles className="size-3" />
            Baru
          </span>
          Web, APK &amp; WordPress dari satu prompt
        </motion.a>

        <motion.h1
          variants={fadeUp}
          className="text-5xl leading-[1.02] font-semibold tracking-tighter text-balance sm:text-7xl"
        >
          Tulis prompt.{' '}
          <span className="font-display font-normal tracking-normal text-primary italic">
            Website-nya
          </span>{' '}
          jadi.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
        >
          Ceritakan apa yang ingin kamu buat — Claude yang membangun, GitHub Actions
          yang mem-publish. Tanpa buka terminal.
        </motion.p>

        {/* 1px gradient ring: the wrapper paints the gradient, the card covers all but its padding */}
        <motion.div
          variants={fadeUp}
          className="mt-10 w-full rounded-[1.4rem] bg-gradient-to-b from-primary/60 via-accent/30 to-border p-px shadow-[0_20px_80px_-20px_var(--accent)]"
        >
          <div className="rounded-[calc(1.4rem-1px)] bg-card text-left">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
              }}
              rows={3}
              placeholder="Buatkan landing page untuk kedai kopi dengan menu dan lokasi…"
              className="w-full resize-none bg-transparent px-5 pt-5 text-base outline-none placeholder:text-muted-foreground/60"
            />
            <div className="flex items-center justify-between gap-4 px-4 pb-4">
              <span className="font-mono text-[11px] text-muted-foreground/70">
                prompt → issue → claude → pages
                <span className="hidden sm:inline"> · ctrl+enter</span>
              </span>
              <button
                onClick={submit}
                disabled={!prompt.trim()}
                aria-label="Kirim prompt"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_-4px_var(--primary)] transition-all hover:scale-105 disabled:scale-100 disabled:opacity-30 disabled:shadow-none"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setPrompt(ex.prompt)}
              className="rounded-full border bg-card/40 px-3.5 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {ex.label}
            </button>
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground/70"
        >
          <ShieldCheck className="size-3.5" />
          Hanya prompt dari pemilik repo yang dieksekusi.
        </motion.p>
      </motion.div>
    </section>
  )
}
