import { motion } from 'motion/react'
import {
  FileText,
  Landmark,
  LineChart,
  Plug,
  ReceiptText,
  Users,
} from 'lucide-react'

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

type Feature = {
  icon: typeof FileText
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: 'Faktur profesional dalam detik',
    description:
      'Template faktur siap pakai dengan logo bisnismu, nomor otomatis, dan pengingat tagihan terjadwal ke pelanggan yang telat bayar.',
  },
  {
    icon: Landmark,
    title: 'Rekonsiliasi bank otomatis',
    description:
      'Hubungkan rekening bisnis dan biarkan sistem mencocokkan transaksi dengan faktur — pekerjaan berjam-jam selesai dalam menit.',
  },
  {
    icon: LineChart,
    title: 'Laporan real-time',
    description:
      'Laba rugi, arus kas, dan piutang selalu terbarui. Ekspor ke PDF atau spreadsheet untuk laporan bulanan ke manajemen.',
  },
  {
    icon: ReceiptText,
    title: 'Siap pajak Indonesia',
    description:
      'PPN 11%, faktur pajak, dan rekap bukti potong dihitung otomatis mengikuti regulasi terbaru. Tutup buku tanpa panik.',
  },
  {
    icon: Users,
    title: 'Kolaborasi multi-pengguna',
    description:
      'Ajak akuntan dan tim finance dengan peran akses berbeda. Setiap perubahan tercatat di riwayat audit yang tidak bisa dihapus.',
  },
  {
    icon: Plug,
    title: 'API & integrasi',
    description:
      'Sambungkan ke marketplace, POS kasir, dan aplikasi payroll lewat integrasi resmi atau REST API dengan dokumentasi lengkap.',
  },
]

export function Features() {
  return (
    <section id="fitur" className="py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="max-w-2xl">
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-widest text-primary uppercase"
          >
            Fitur
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            Semua urusan keuangan, satu tempat kerja
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Berhenti berpindah-pindah antara spreadsheet, email tagihan, dan
            mutasi bank. Semuanya sudah terhubung di sini.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group bg-card p-7 transition-colors hover:bg-accent/60"
            >
              <span className="flex size-10 items-center justify-center rounded-lg border bg-background text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
