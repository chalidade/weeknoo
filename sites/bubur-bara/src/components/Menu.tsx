import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Flame, Minus, Plus, Search, SearchX, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ADDONS,
  CATEGORIES,
  cart,
  formatRupiah,
  MENU,
  type CartAddon,
  type Category,
  type MenuItem,
} from '@/lib/bara'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

/** Placeholder dish visual: a tinted plate with the dish's icon. */
function DishArt({ item, className }: { item: MenuItem; className?: string }) {
  const Icon = item.icon
  return (
    <div
      className={cn('relative grid place-items-center overflow-hidden', className)}
      style={{
        background: `radial-gradient(circle at 50% 45%, oklch(0.97 0.03 ${item.hue}), oklch(0.86 0.09 ${item.hue}) 55%, oklch(0.62 0.14 ${item.hue}))`,
      }}
    >
      <div className="absolute size-[62%] rounded-full bg-white/35 ring-8 ring-white/20" />
      <Icon className="relative size-1/3 text-[oklch(0.35_0.08_30)] drop-shadow" strokeWidth={1.6} />
    </div>
  )
}

function Chillies({ level }: { level?: number }) {
  if (!level) return null
  return (
    <span className="inline-flex items-center gap-0.5 text-primary" aria-label={`Level pedas ${level}`}>
      {Array.from({ length: level }, (_, i) => (
        <Flame key={i} className="size-3.5 fill-current" />
      ))}
    </span>
  )
}

function DetailSheet({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const [qty, setQty] = useState(1)
  const [picked, setPicked] = useState<string[]>([])
  const canAddTopping = item.category === 'bubur' || item.category === 'wonton'
  const addons: CartAddon[] = ADDONS.filter((a) => picked.includes(a.id)).map((a) => ({
    id: a.id,
    name: a.name,
    price: a.price,
  }))
  const unit = item.price + addons.reduce((s, a) => s + a.price, 0)

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/50 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
      >
        <div className="relative">
          <DishArt item={item} className="aspect-[16/9]" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-card/90 shadow"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl leading-tight font-extrabold">{item.name}</h3>
            <p className="shrink-0 font-display text-xl font-extrabold text-primary">{formatRupiah(item.price)}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
            <span className="font-bold text-foreground">Isi:</span> {item.contents}
          </p>

          {canAddTopping && (
            <div className="mt-5">
              <p className="text-sm font-bold">Tambah topping</p>
              <div className="mt-2 grid gap-2">
                {ADDONS.map((a) => {
                  const on = picked.includes(a.id)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggle(a.id)}
                      aria-pressed={on}
                      className={cn(
                        'flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition',
                        on ? 'border-primary bg-primary/5' : 'hover:bg-muted',
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'grid size-5 place-items-center rounded-md border',
                            on && 'border-primary bg-primary text-primary-foreground',
                          )}
                        >
                          {on && <Plus className="size-3 rotate-45" />}
                        </span>
                        {a.name}
                      </span>
                      <span className="font-semibold text-muted-foreground">+{formatRupiah(a.price)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t p-4 sm:p-5">
          <div className="flex items-center rounded-xl border">
            <button
              type="button"
              aria-label="Kurangi"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-11 place-items-center"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-6 text-center font-bold">{qty}</span>
            <button type="button" aria-label="Tambah" onClick={() => setQty((q) => q + 1)} className="grid size-11 place-items-center">
              <Plus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              cart.add(item, addons, qty)
              onClose()
            }}
            className="flex h-11 flex-1 items-center justify-between rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            <span>Tambah ke pesanan</span>
            <span>{formatRupiah(unit * qty)}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Menu() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState<MenuItem | null>(null)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MENU.filter(
      (m) =>
        (category === 'all' || m.category === category) &&
        (!q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)),
    )
  }, [category, query])

  const quickAdd = (item: MenuItem) => {
    cart.add(item)
    setJustAdded(item.id)
    window.setTimeout(() => setJustAdded((id) => (id === item.id ? null : id)), 1200)
  }

  return (
    <section id="menu" className="scroll-mt-16 bg-card/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <motion.p variants={fadeUp} className="text-sm font-bold tracking-wide text-primary uppercase">
              Menu sarapan
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-2 font-display text-4xl font-black tracking-tight sm:text-5xl">
              Pilih yang bikin semangat pagi
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 max-w-xl text-muted-foreground">
              Semua bubur dibakar per porsi di claypot. Ketuk menu untuk menambah topping.
            </motion.p>
          </div>
          <motion.label variants={fadeUp} className="relative block w-full lg:w-72">
            <span className="sr-only">Cari menu</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari laksa, wonton, kopi…"
              className="h-11 w-full rounded-xl border bg-background pr-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </motion.label>
        </motion.div>

        <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition',
                category === c.id
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background text-muted-foreground hover:text-foreground',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed py-16 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <p className="mt-3 font-bold">Menu tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">Coba kata kunci lain atau pilih “Semua Menu”.</p>
          </div>
        ) : (
          <motion.ul layout className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-background shadow-xs transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <button type="button" onClick={() => setDetail(item)} className="relative text-left">
                    <DishArt item={item} className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105" />
                    {item.bestSeller && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-extrabold text-accent-foreground shadow">
                        <Sparkles className="size-3" /> Terlaris
                      </span>
                    )}
                  </button>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <button type="button" onClick={() => setDetail(item)} className="text-left">
                      <h3 className="line-clamp-2 text-sm leading-snug font-bold sm:text-base">{item.name}</h3>
                    </button>
                    <p className="mt-1 line-clamp-2 hidden text-xs text-muted-foreground sm:block">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <div>
                        <p className="font-display font-extrabold text-primary">{formatRupiah(item.price)}</p>
                        <Chillies level={item.spicy} />
                      </div>
                      <button
                        type="button"
                        onClick={() => quickAdd(item)}
                        aria-label={`Tambah ${item.name}`}
                        className={cn(
                          'grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground transition',
                          justAdded === item.id ? 'scale-110 bg-accent text-accent-foreground' : 'bg-primary hover:bg-primary/90',
                        )}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <AnimatePresence>{detail && <DetailSheet item={detail} onClose={() => setDetail(null)} />}</AnimatePresence>
    </section>
  )
}
