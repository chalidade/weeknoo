import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, ChefHat, Factory, MessageCircle, Smartphone, TriangleAlert, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRupiah, waLink } from '@/lib/bara'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

type Package = {
  id: string
  name: string
  investment: number
  /** monthly crew, gas, fuel, rent, POS */
  opex: number
  defaultPortions: number
}

const PACKAGES: Package[] = [
  { id: 'motor', name: 'Motor Tiga Roda', investment: 35_000_000, opex: 6_000_000, defaultPortions: 120 },
  { id: 'booth', name: 'Booth Modular', investment: 60_000_000, opex: 9_000_000, defaultPortions: 160 },
  { id: 'house', name: 'Bara House', investment: 250_000_000, opex: 32_000_000, defaultPortions: 450 },
]

/** Food cost as a share of revenue. */
const COGS = 0.45
/** Partner's share of net profit; the brand runs operations for the rest. */
const PARTNER_SHARE = 0.35

const PILLARS = [
  { icon: Factory, title: 'Dapur pusat', body: 'Kuah & bumbu induk diracik terpusat, dikirim vakum.' },
  { icon: Truck, title: 'Rantai pasok', body: 'Bahan segar dikirim terjadwal ke setiap gerai.' },
  { icon: ChefHat, title: 'Crew terlatih', body: 'SOP sederhana, tidak perlu koki khusus.' },
  { icon: Smartphone, title: 'POS cloud', body: 'Omzet terpantau real-time dari ponsel mitra.' },
]

const ROADMAP = [
  { phase: 'Fase 1', title: 'Validasi', body: 'Uji rasa, SOP, dan unit economics di gerai motor pertama.' },
  { phase: 'Fase 2', title: 'Klaster kota', body: 'Booth & tenda di titik sarapan padat dalam satu kota.' },
  { phase: 'Fase 3', title: 'Bara House', body: 'Restoran sarapan keluarga pertama dengan pick-up window.' },
  { phase: 'Fase 4', title: 'Regional', body: 'Ekspansi ke kota-kota besar dengan dapur pusat kedua.' },
]

const juta = (n: number) => `${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`

function Slider(props: {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-background/70">{props.label}</span>
        <span className="font-display text-lg font-extrabold">{props.display}</span>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--color-accent)]"
      />
    </label>
  )
}

export function Partnership() {
  const [pkgId, setPkgId] = useState(PACKAGES[0].id)
  const pkg = PACKAGES.find((p) => p.id === pkgId) ?? PACKAGES[0]
  const [portions, setPortions] = useState(pkg.defaultPortions)
  const [ticket, setTicket] = useState(17_000)
  const [days, setDays] = useState(26)

  const pickPackage = (p: Package) => {
    setPkgId(p.id)
    setPortions(p.defaultPortions)
  }

  const sim = useMemo(() => {
    const revenue = portions * ticket * days
    const net = revenue * (1 - COGS) - pkg.opex
    const partner = Math.max(0, net * PARTNER_SHARE)
    const payback = partner > 0 ? pkg.investment / partner : Infinity
    const chart = Array.from({ length: 13 }, (_, m) => ({
      bulan: m === 0 ? 'Awal' : `B${m}`,
      kembali: Math.round((partner * m) / 1_000_000),
    }))
    return { revenue, net, partner, payback, chart }
  }, [portions, ticket, days, pkg])

  return (
    <section id="kemitraan" className="scroll-mt-16 bg-foreground py-20 text-background sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.p variants={fadeUp} className="text-sm font-bold tracking-wide text-accent uppercase">
          Kemitraan
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-2 max-w-3xl font-display text-4xl font-black tracking-tight sm:text-5xl">
          Ubah kebiasaan sarapan jadi <span className="text-accent">bisnis yang berjalan sendiri</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-background/70">
          Permintaan sarapan hangat tidak pernah musiman. Masalah usaha kuliner tradisional biasanya bukan pembeli,
          tapi skala: rasa berubah saat koki berganti, bahan sulit dijaga, dan pencatatan masih manual. Kemitraan
          pasif Bubur Bara menyelesaikan itu — operasional harian dikelola tim pusat, mitra memantau hasilnya.
        </motion.p>

        <motion.ul variants={fadeUp} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-2xl border border-background/10 bg-background/5 p-5">
              <Icon className="size-6 text-accent" />
              <p className="mt-3 font-bold">{title}</p>
              <p className="mt-1 text-sm text-background/65">{body}</p>
            </li>
          ))}
        </motion.ul>

        {/* Profit simulator */}
        <motion.div variants={fadeUp} className="mt-12 grid gap-6 rounded-3xl border border-background/10 bg-background/5 p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="flex items-center gap-2 font-display text-2xl font-extrabold">
              <BarChart3 className="size-6 text-accent" /> Simulasi bagi hasil
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {PACKAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickPackage(p)}
                  className={cn(
                    'rounded-xl border px-2 py-2.5 text-xs font-bold transition sm:text-sm',
                    p.id === pkgId ? 'border-accent bg-accent text-accent-foreground' : 'border-background/15 hover:bg-background/10',
                  )}
                >
                  {p.name}
                  <span className="mt-0.5 block font-normal opacity-75">{juta(p.investment)}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-5">
              <Slider label="Porsi per hari" value={portions} min={40} max={700} step={10} display={`${portions}`} onChange={setPortions} />
              <Slider label="Rata-rata per struk" value={ticket} min={10_000} max={30_000} step={500} display={formatRupiah(ticket)} onChange={setTicket} />
              <Slider label="Hari buka per bulan" value={days} min={15} max={30} step={1} display={`${days} hari`} onChange={setDays} />
            </div>
            <p className="mt-6 text-xs text-background/50">
              Asumsi: HPP {COGS * 100}% dari omzet, biaya operasional {juta(pkg.opex)}/bulan, bagian mitra{' '}
              {PARTNER_SHARE * 100}% dari laba bersih.
            </p>
          </div>

          <div className="flex flex-col">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { k: 'Omzet / bln', v: juta(sim.revenue) },
                { k: 'Laba bersih', v: juta(Math.max(0, sim.net)) },
                { k: 'Bagian mitra', v: juta(sim.partner) },
                { k: 'Balik modal', v: Number.isFinite(sim.payback) ? `${sim.payback.toLocaleString('id-ID', { maximumFractionDigits: 1 })} bln` : '—' },
              ].map((s) => (
                <div key={s.k} className="rounded-xl bg-background/10 p-3">
                  <dt className="text-[11px] text-background/60">{s.k}</dt>
                  <dd className="font-display text-lg font-extrabold">{s.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 h-56 min-h-56 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sim.chart} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="kembali" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="bulan" stroke="currentColor" strokeOpacity={0.5} tick={{ fontSize: 11, fill: 'currentColor' }} />
                  <YAxis stroke="currentColor" strokeOpacity={0.5} tick={{ fontSize: 11, fill: 'currentColor' }} unit=" jt" />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-card)', color: 'var(--color-card-foreground)', borderRadius: 12, border: 'none' }}
                    formatter={(v) => [`Rp ${v} jt`, 'Akumulasi bagian mitra']}
                  />
                  <ReferenceLine
                    y={pkg.investment / 1_000_000}
                    stroke="var(--color-primary)"
                    strokeDasharray="4 4"
                    label={{ value: 'Modal', fill: 'currentColor', fontSize: 11, position: 'insideTopLeft' }}
                  />
                  <Area type="monotone" dataKey="kembali" stroke="var(--color-accent)" strokeWidth={2.5} fill="url(#kembali)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 flex gap-2 text-xs text-background/50">
              <TriangleAlert className="size-4 shrink-0" />
              Angka di atas hanya simulasi. Cuaca, lokasi, dan faktor operasional memengaruhi penjualan, sehingga
              tidak ada jaminan hasil.
            </p>
          </div>
        </motion.div>

        <motion.ol variants={fadeUp} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((r, i) => (
            <li key={r.phase} className="relative rounded-2xl border border-background/10 p-5">
              <span className="font-display text-5xl font-black text-background/10">0{i + 1}</span>
              <p className="mt-1 text-xs font-bold text-accent uppercase">{r.phase}</p>
              <p className="font-display text-lg font-extrabold">{r.title}</p>
              <p className="mt-1 text-sm text-background/65">{r.body}</p>
            </li>
          ))}
        </motion.ol>

        <motion.div variants={fadeUp} className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-display text-2xl font-extrabold">Tertarik jadi mitra?</p>
            <p className="mt-1 text-sm opacity-80">Ngobrol dulu dengan tim kami — gratis, tanpa komitmen.</p>
          </div>
          <a
            href={waLink('Halo tim Bubur Bara, saya tertarik diskusi kemitraan.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-background px-6 font-bold text-foreground shadow-lg transition hover:bg-background/90"
          >
            <MessageCircle className="size-5" /> Konsultasi via WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
