import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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

type FaqItem = { question: string; answer: string }

const FAQS: FaqItem[] = [
  {
    question: 'Apakah ada masa uji coba gratis?',
    answer:
      'Ya. Semua paket bisa dicoba gratis 14 hari dengan fitur penuh, tanpa kartu kredit. Setelahnya kamu bebas memilih paket atau berhenti tanpa biaya apa pun.',
  },
  {
    question: 'Apakah data keuangan saya aman?',
    answer:
      'Data dienkripsi saat transit (TLS 1.3) dan saat tersimpan (AES-256), berjalan di pusat data dengan sertifikasi ISO 27001. Kami tidak pernah menjual atau membagikan data bisnismu.',
  },
  {
    question: 'Bisakah saya pindah dari spreadsheet atau aplikasi lain?',
    answer:
      'Bisa. Tersedia impor CSV/Excel untuk kontak, produk, dan saldo awal. Untuk paket Growth ke atas, tim onboarding kami membantu migrasi datamu sampai selesai tanpa biaya tambahan.',
  },
  {
    question: 'Bagaimana jika jumlah faktur saya melebihi batas paket?',
    answer:
      'Kami memberi tahu sebelum batas tercapai, dan kamu bisa naik paket kapan saja — perhitungan biayanya prorata, hanya membayar selisih sisa bulan berjalan.',
  },
  {
    question: 'Apakah cocok untuk akuntan yang memegang banyak klien?',
    answer:
      'Sangat cocok. Satu akun akuntan bisa terhubung ke banyak entitas klien di paket Scale, lengkap dengan akses terpisah per klien dan laporan konsolidasi.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="border-t bg-card/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-3xl px-6"
      >
        <div className="text-center">
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-widest text-primary uppercase"
          >
            FAQ
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            Masih ragu? Ini jawabannya
          </motion.h2>
        </div>

        <motion.div variants={fadeUp} className="mt-12 flex flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question} className="rounded-xl border bg-card">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-semibold"
                >
                  {faq.question}
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                )}
              </div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
