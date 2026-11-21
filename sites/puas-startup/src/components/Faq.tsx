import { Plus } from 'lucide-react'
import { EMAIL, WA_DISPLAY, waUrl } from '@/lib/contact'
import { WhatsAppIcon } from '@/components/icons'

const FAQS = [
  {
    q: 'Apakah harus sudah punya perusahaan atau produk yang berjalan?',
    a: 'Tidak. Program ini terbuka untuk ide bisnis baru (startup), ekspansi bisnis Indonesia ke Saudi, dan solusi teknologi, layanan, atau model bisnis untuk pasar Saudi & GCC. Jelaskan saja sejauh mana idemu sudah terbukti.',
  },
  {
    q: 'Proposalnya harus pakai format apa?',
    a: 'Format bebas: pitch deck, PDF, dokumen, atau langsung di badan email. Syaratnya, dalam waktu singkat menjawab enam hal: masalah, solusi, bukti, potensi scale-up, kebutuhan dana, dan rencana bagi hasil dengan PUAS.',
  },
  {
    q: 'Ke mana proposal dikirim, dan kapan batasnya?',
    a: `Kirim ke ${EMAIL}. Pendaftaran Gelombang 1 hingga 25 Nov 2026, dan pemenangnya diumumkan Des 2026.`,
  },
  {
    q: 'Apa yang didapat pemenang?',
    a: 'Peringkat 1–3 free of cost, peringkat 4–5 SAR 20,000 only. Keduanya termasuk pendampingan pendirian perusahaan dan proses izin tinggal (Iqama) untuk 2 orang.',
  },
  {
    q: 'Iqama diberikan untuk siapa?',
    a: 'Untuk 2 orang: Founder dan Co-founder atau Investor, lewat jalur startup.',
  },
  {
    q: 'Bagaimana kalau terlewat Gelombang 1?',
    a: 'Masih ada Gelombang 2. Pendaftarannya Jan – Feb 2027, dan pemenangnya diumumkan Mar 2027.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="wrap scroll-mt-20">
      <h2 className="h-group group-head">Yang sering ditanyakan</h2>
      <div className="bento">
        <div className="tile tile-white col-span-2 py-2 sm:py-3 lg:col-span-8">
          {FAQS.map((f, i) => (
            <details key={f.q} name="faq" open={i === 0} className="group border-b border-border last:border-b-0">
              <summary className="flex items-start justify-between gap-4 py-4 text-[1.0625rem] leading-snug font-bold sm:py-5 sm:text-lg">
                {f.q}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mist group-open:bg-amber">
                  <Plus className="faq-plus size-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-2xl pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="tile tile-emerald col-span-2 flex flex-col justify-between gap-8 lg:col-span-4">
          <div>
            <h3 className="h-tile">Belum terjawab?</h3>
            <p className="mt-2 leading-relaxed text-white/85">
              Tanya langsung lewat jalur Fast Track. Setelah itu, proposal tetap dikirim ke {EMAIL}.
            </p>
          </div>
          <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-wa w-full px-4">
            <WhatsAppIcon className="size-5 shrink-0" />
            {WA_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  )
}
