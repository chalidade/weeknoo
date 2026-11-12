import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'Apakah harus sudah punya perusahaan atau produk yang berjalan?',
    a: 'Tidak harus. Program ini terbuka untuk ide bisnis baru (startup), ekspansi bisnis Indonesia ke Saudi, maupun solusi teknologi, layanan, atau model bisnis untuk pasar Saudi & GCC. Jelaskan saja sejauh mana ide Anda sudah terbukti.',
  },
  {
    q: 'Proposalnya harus pakai format apa?',
    a: 'Format bebas — pitch deck, PDF, dokumen, atau langsung di badan email. Syaratnya, dalam waktu singkat menjawab 6 hal: masalah, solusi, bukti, potensi scale-up, kebutuhan dana, dan rencana bagi hasil dengan PUAS.',
  },
  {
    q: 'Ke mana proposal dikirim dan kapan batasnya?',
    a: 'Kirim ke startup@puas.sa. Batas Gelombang 1 adalah 25 November 2026, dengan pengumuman pemenang pada Desember 2026.',
  },
  {
    q: 'Apa yang didapat pemenang?',
    a: 'Peringkat 1–3 mendapatkan pendampingan pendirian perusahaan dan proses Iqama untuk 2 orang secara gratis (free of cost). Peringkat 4–5 mendapatkan paket yang sama cukup dengan SAR 20,000.',
  },
  {
    q: 'Iqama diberikan untuk siapa saja?',
    a: 'Izin tinggal (Iqama) jalur startup diproses untuk 2 orang: Founder dan Co-founder atau Investor.',
  },
  {
    q: 'Bagaimana kalau terlewat Gelombang 1?',
    a: 'Masih ada Gelombang 2 dengan pendaftaran Januari – Februari 2027 dan pengumuman pemenang pada Maret 2027.',
  },
  {
    q: 'Saya ingin diskusi dulu atau mau jalur cepat?',
    a: 'Hubungi Fast Track via WhatsApp di +966 59 142 5388. Setelah itu, jangan lupa tetap kirimkan ide & proposal ke email startup@puas.sa.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-primary uppercase">FAQ</p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Pertanyaan yang <span className="text-gold">sering muncul.</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Belum terjawab? Tanyakan langsung lewat WhatsApp atau email — tim PUAS siap membantu.
          </p>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className={cn('glass rounded-2xl transition-colors', isOpen && 'border-primary/40')}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
                >
                  {f.q}
                  <Plus className={cn('size-5 shrink-0 text-primary transition-transform duration-300', isOpen && 'rotate-45')} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
