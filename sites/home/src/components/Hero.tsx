import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUp, Asterisk } from 'lucide-react'

const REPO = 'https://github.com/chalidade/weeknoo'

const EXAMPLES = [
  { label: 'Landing coffee shop', prompt: 'Buatkan site baru "kopi-senja": landing page coffee shop dengan hero, menu unggulan, testimoni, jam buka, dan lokasi. Nuansa hangat, foto-foto besar.' },
  { label: 'Al-Qur’an app', prompt: 'Buatkan site baru "quran-app": aplikasi baca Al-Qur’an memakai library @/lib/api — daftar surah, halaman baca per surah dengan terjemahan, tafsir, dan asbabun nuzul per ayat.' },
  { label: 'Portfolio fotografer', prompt: 'Buatkan site baru "foto-folio": portfolio fotografer dengan galeri grid masonry, halaman tentang, dan kontak. Gelap, elegan, fokus ke foto.' },
  { label: 'Dashboard wilayah', prompt: 'Buatkan site baru "peta-wilayah": explorer wilayah Indonesia memakai @/lib/api — dropdown berantai provinsi → kabupaten/kota → kecamatan → kelurahan.' },
]

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
    <section className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_40%_at_50%_0%,theme(colors.primary/10%),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-16 text-center sm:pt-32"
      >
        <motion.div
          variants={fadeUp}
          className="mb-8 inline-flex items-center gap-1.5 text-lg font-medium tracking-tight"
        >
          <Asterisk className="size-5 text-primary" />
          weeknoo
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl leading-[1.05] text-balance sm:text-7xl"
        >
          Bangun sesuatu yang luar biasa.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
        >
          Tulis apa yang ingin kamu buat — promptmu terkirim ke workspace, Claude
          yang membangun, CI yang mem-publish.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 w-full rounded-2xl border bg-card text-left shadow-lg shadow-black/20"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
            }}
            rows={3}
            placeholder="Jelaskan website yang ingin kamu buat…"
            className="w-full resize-none bg-transparent px-5 pt-4 text-base outline-none placeholder:text-muted-foreground/70"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-xs text-muted-foreground/70">
              Prompt → GitHub Issue → Claude · Ctrl+Enter untuk kirim
            </span>
            <button
              onClick={submit}
              disabled={!prompt.trim()}
              aria-label="Kirim prompt"
              className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground/70 uppercase">
            Atau mulai dari salah satu ini
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setPrompt(ex.prompt)}
                className="rounded-lg border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
