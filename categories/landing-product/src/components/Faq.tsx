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
    question: 'Apakah gelang ini kompatibel dengan ponsel saya?',
    answer:
      'Ya, selama ponselmu menjalankan Android 9 ke atas atau iOS 14 ke atas dan mendukung Bluetooth 5.0. Aplikasi pendampingnya gratis di Play Store dan App Store.',
  },
  {
    question: 'Berapa lama baterainya bertahan?',
    answer:
      'Pemakaian normal (pemantauan 24 jam + notifikasi) bertahan hingga 14 hari. Dengan mode olahraga GPS aktif setiap hari, sekitar 7 hari. Pengisian penuh dari nol hanya butuh 90 menit.',
  },
  {
    question: 'Apakah datanya akurat untuk keperluan medis?',
    answer:
      'Gelang ini adalah perangkat gaya hidup, bukan alat diagnosis medis. Akurasinya sangat baik untuk memantau tren harian, namun untuk keputusan medis tetap konsultasikan dengan dokter.',
  },
  {
    question: 'Bagaimana kebijakan garansi dan pengembaliannya?',
    answer:
      'Setiap unit bergaransi resmi 12 bulan untuk cacat produksi. Jika kamu berubah pikiran, produk bisa dikembalikan dalam 14 hari sejak diterima selama kondisi lengkap dan tidak rusak.',
  },
  {
    question: 'Apakah ada biaya langganan aplikasi?',
    answer:
      'Tidak ada. Semua fitur aplikasi — analisis tidur, riwayat tanpa batas, dan pembaruan fitur baru — gratis selamanya untuk pemilik gelang.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-24">
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
            Pertanyaan yang sering ditanyakan
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
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-medium"
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
