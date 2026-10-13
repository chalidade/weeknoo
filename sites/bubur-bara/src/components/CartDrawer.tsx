import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  History,
  ImageUp,
  MessageCircle,
  Minus,
  Plus,
  Receipt,
  ShoppingBag,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { cart, formatRupiah, isOpenNow, OUTLETS, useCart, waLink, type CartLine, type Outlet } from '@/lib/bara'
import { db, type Order } from '@/lib/db'

type Step = 'keranjang' | 'data' | 'bayar' | 'selesai' | 'riwayat'

/** Orders for a later date close at 17:00 the day before. */
const CUTOFF_HOUR = 17

const pad = (n: number) => String(n).padStart(2, '0')
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function earliestScheduledDate(now = new Date()) {
  const d = new Date(now)
  d.setDate(d.getDate() + (now.getHours() >= CUTOFF_HOUR ? 2 : 1))
  return isoDate(d)
}

function timeSlots(outlet: Outlet) {
  const slots: string[] = []
  for (let h = outlet.open; h < outlet.close; h += 0.5) {
    slots.push(`${pad(Math.floor(h))}.${h % 1 ? '30' : '00'}`)
  }
  return slots
}

function longDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'BB-' + Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/** Downscale a photo to a small JPEG data URL so it fits comfortably in IndexedDB. */
function downscale(file: File, max = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.72))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gambar tidak bisa dibaca'))
    }
    img.src = url
  })
}

/**
 * A QR-looking placeholder seeded by the order code. It is NOT a scannable
 * QRIS — swap it for the outlet's static QRIS image before going live.
 */
function DemoQr({ seed }: { seed: string }) {
  const n = 25
  const cells = useMemo(() => {
    let h = 0
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
    const out: boolean[] = []
    for (let i = 0; i < n * n; i++) {
      h = (h * 1103515245 + 12345) >>> 0
      out.push(((h >>> 16) & 1) === 1)
    }
    return out
  }, [seed])
  const inFinder = (x: number, y: number) =>
    [
      [0, 0],
      [n - 7, 0],
      [0, n - 7],
    ].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)

  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="size-full" role="img" aria-label="Kode QRIS contoh">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="white" />
      {cells.map((on, i) => {
        const x = i % n
        const y = Math.floor(i / n)
        return on && !inFinder(x, y) ? <rect key={i} x={x} y={y} width={1} height={1} fill="black" /> : null
      })}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={7} height={7} fill="black" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="white" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="black" />
        </g>
      ))}
    </svg>
  )
}

function LineRow({ line, editable }: { line: CartLine; editable: boolean }) {
  return (
    <li className="flex gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-bold">{line.name}</p>
        {line.addons.length > 0 && (
          <p className="mt-0.5 text-xs text-muted-foreground">+ {line.addons.map((a) => a.name).join(', ')}</p>
        )}
        <p className="mt-1 text-sm font-semibold text-primary">{formatRupiah(line.unitPrice * line.qty)}</p>
      </div>
      {editable ? (
        <div className="flex h-9 items-center self-center rounded-xl border">
          <button type="button" aria-label="Kurangi" onClick={() => cart.setQty(line.key, line.qty - 1)} className="grid size-9 place-items-center">
            {line.qty === 1 ? <Trash2 className="size-3.5 text-destructive" /> : <Minus className="size-3.5" />}
          </button>
          <span className="w-5 text-center text-sm font-bold">{line.qty}</span>
          <button type="button" aria-label="Tambah" onClick={() => cart.setQty(line.key, line.qty + 1)} className="grid size-9 place-items-center">
            <Plus className="size-3.5" />
          </button>
        </div>
      ) : (
        <span className="self-center text-sm font-bold text-muted-foreground">×{line.qty}</span>
      )}
    </li>
  )
}

function waMessage(o: Order) {
  const when =
    o.mode === 'sekarang' ? 'Ambil hari ini (secepatnya)' : `⚠️ Pesanan terjadwal: ${longDate(o.pickupDate)}, jam ${o.pickupTime} WIB`
  return [
    `*PESANAN BUBUR BARA — ${o.code}*`,
    '',
    `Nama: ${o.customer}`,
    `No. HP: ${o.phone}`,
    `Gerai: ${o.outletName}`,
    when,
    '',
    ...o.lines.map(
      (l) => `• ${l.qty}× ${l.name}${l.addons.length ? ` (+ ${l.addons.join(', ')})` : ''} — ${formatRupiah(l.unitPrice * l.qty)}`,
    ),
    '',
    `*Total: ${formatRupiah(o.total)}*`,
    'Pembayaran: QRIS (bukti transfer saya kirim di chat ini)',
    o.note ? `Catatan: ${o.note}` : '',
    '',
    '_Mohon konfirmasi pesanan ini. Terima kasih!_ 🙏',
  ]
    .filter((l, i, arr) => l !== '' || arr[i - 1] !== '')
    .join('\n')
}

function ReceiptCard({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-dashed bg-background p-4 font-mono text-xs">
      <p className="text-center font-display text-base font-extrabold">BUBUR BARA</p>
      <p className="text-center text-muted-foreground">{order.outletName}</p>
      <div className="my-3 border-t border-dashed" />
      <p className="flex justify-between">
        <span>Kode</span>
        <span className="font-bold">{order.code}</span>
      </p>
      <p className="flex justify-between">
        <span>Nama</span>
        <span>{order.customer}</span>
      </p>
      <p className="flex justify-between gap-4">
        <span>Ambil</span>
        <span className="text-right">
          {order.mode === 'sekarang' ? 'Hari ini, secepatnya' : `${longDate(order.pickupDate)} · ${order.pickupTime}`}
        </span>
      </p>
      <div className="my-3 border-t border-dashed" />
      {order.lines.map((l, i) => (
        <div key={i} className="mb-1.5">
          <p className="flex justify-between gap-3">
            <span>
              {l.qty}× {l.name}
            </span>
            <span className="shrink-0">{formatRupiah(l.unitPrice * l.qty)}</span>
          </p>
          {l.addons.length > 0 && <p className="text-muted-foreground">  + {l.addons.join(', ')}</p>}
        </div>
      ))}
      <div className="my-3 border-t border-dashed" />
      <p className="flex justify-between text-sm font-bold">
        <span>TOTAL</span>
        <span>{formatRupiah(order.total)}</span>
      </p>
      <p className="mt-3 text-center text-muted-foreground">Tunjukkan struk ini saat mengambil pesanan.</p>
    </div>
  )
}

export function CartDrawer() {
  const { lines, open, count, total } = useCart()
  const [step, setStep] = useState<Step>('keranjang')
  const [outletId, setOutletId] = useState(OUTLETS[0].id)
  const [mode, setMode] = useState<'sekarang' | 'terjadwal'>('terjadwal')
  const [date, setDate] = useState(earliestScheduledDate)
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [proof, setProof] = useState('')
  const [error, setError] = useState('')
  const [code, setCode] = useState(makeCode)
  const [placed, setPlaced] = useState<Order | null>(null)
  const [history, setHistory] = useState<Order[]>([])

  const outlet = OUTLETS.find((o) => o.id === outletId) ?? OUTLETS[0]
  const canNow = isOpenNow(outlet)
  const slots = timeSlots(outlet)
  const minDate = earliestScheduledDate()

  useEffect(() => setError(''), [name, phone, date, time, mode, outletId])

  // A closed outlet cannot take a "today" order.
  useEffect(() => {
    if (!canNow && mode === 'sekarang') setMode('terjadwal')
  }, [canNow, mode])

  useEffect(() => {
    if (!slots.includes(time)) setTime(slots[0])
  }, [outletId])

  useEffect(() => {
    if (open && step === 'riwayat') {
      db.orders.orderBy('createdAt').reverse().limit(20).toArray().then(setHistory)
    }
  }, [open, step])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.close()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => {
    cart.close()
    if (step === 'selesai') {
      setStep('keranjang')
      setPlaced(null)
    }
  }

  const validateData = () => {
    if (!name.trim()) return 'Isi nama pemesan.'
    if (!/^(\+?62|0)8\d{7,12}$/.test(phone.replace(/[\s-]/g, ''))) return 'Nomor WhatsApp belum valid (contoh: 0812xxxxxxx).'
    if (mode === 'terjadwal') {
      if (!date || date < minDate)
        return new Date().getHours() >= CUTOFF_HOUR
          ? `Pesanan untuk besok sudah ditutup (batas jam ${CUTOFF_HOUR}.00 WIB). Paling awal: ${longDate(minDate)}.`
          : `Pesanan terjadwal paling lambat H-1 jam ${CUTOFF_HOUR}.00 WIB. Paling awal: ${longDate(minDate)}.`
      if (!time) return 'Pilih jam pengambilan.'
    }
    return ''
  }

  const onProof = async (file?: File) => {
    if (!file) return
    try {
      setProof(await downscale(file))
      setError('')
    } catch {
      setError('Foto tidak bisa dibaca, coba gambar lain.')
    }
  }

  const placeOrder = async () => {
    if (!proof) {
      setError('Unggah foto bukti transfer dulu.')
      return
    }
    const order: Omit<Order, 'id'> = {
      code,
      customer: name.trim(),
      phone: phone.trim(),
      outletName: outlet.name,
      mode,
      pickupDate: mode === 'terjadwal' ? date : isoDate(new Date()),
      pickupTime: mode === 'terjadwal' ? time : 'Secepatnya',
      note: note.trim(),
      lines: lines.map((l) => ({ name: l.name, qty: l.qty, unitPrice: l.unitPrice, addons: l.addons.map((a) => a.name) })),
      total,
      paymentProof: proof,
      createdAt: Date.now(),
    }
    // Open WhatsApp before awaiting anything: after an await the click no
    // longer counts as a user gesture and popup blockers swallow the tab.
    window.open(waLink(waMessage(order as Order)), '_blank', 'noopener')
    const id = await db.orders.add(order as Order)
    const saved = { ...order, id } as Order
    setPlaced(saved)
    cart.clear()
    setProof('')
    setNote('')
    setCode(makeCode())
    setStep('selesai')
  }

  const title: Record<Step, string> = {
    keranjang: 'Pesanan kamu',
    data: 'Detail pengambilan',
    bayar: 'Pembayaran QRIS',
    selesai: 'Pesanan terkirim',
    riwayat: 'Riwayat pesanan',
  }
  const back: Partial<Record<Step, Step>> = { data: 'keranjang', bayar: 'data', riwayat: 'keranjang' }

  return (
    <>
      {/* Mobile bottom bar — the drawer's entry point while browsing the menu */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            type="button"
            onClick={cart.open}
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="fixed inset-x-4 bottom-4 z-40 flex h-14 items-center justify-between rounded-2xl bg-primary px-5 font-bold text-primary-foreground shadow-2xl sm:hidden"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-5" /> {count} item
            </span>
            <span>{formatRupiah(total)} →</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex justify-end bg-foreground/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={title[step]}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-dvh w-full max-w-md flex-col bg-card shadow-2xl"
            >
              <header className="flex items-center gap-2 border-b px-4 py-3">
                {back[step] ? (
                  <button type="button" aria-label="Kembali" onClick={() => { setError(''); setStep(back[step]!) }} className="grid size-9 place-items-center rounded-lg hover:bg-muted">
                    <ArrowLeft className="size-4" />
                  </button>
                ) : (
                  <span className="grid size-9 place-items-center text-primary">
                    <ShoppingBag className="size-5" />
                  </span>
                )}
                <h2 className="flex-1 font-display text-lg font-extrabold">{title[step]}</h2>
                {step === 'keranjang' && (
                  <button type="button" onClick={() => setStep('riwayat')} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-muted-foreground hover:bg-muted">
                    <History className="size-4" /> Riwayat
                  </button>
                )}
                <button type="button" aria-label="Tutup" onClick={close} className="grid size-9 place-items-center rounded-lg hover:bg-muted">
                  <X className="size-4" />
                </button>
              </header>

              {step !== 'selesai' && step !== 'riwayat' && (
                <ol className="flex gap-1.5 px-4 pt-3" aria-label="Langkah">
                  {(['keranjang', 'data', 'bayar'] as const).map((s, i) => (
                    <li key={s} className={cn('h-1.5 flex-1 rounded-full', ['keranjang', 'data', 'bayar'].indexOf(step) >= i ? 'bg-primary' : 'bg-muted')} />
                  ))}
                </ol>
              )}

              <div key={step} className="flex-1 overflow-y-auto px-4 py-3">
                {step === 'keranjang' &&
                  (lines.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <ShoppingBag className="size-12 text-muted-foreground/40" />
                      <p className="mt-3 font-bold">Keranjang masih kosong</p>
                      <p className="text-sm text-muted-foreground">Pilih menu favoritmu terlebih dahulu.</p>
                      <a href="#menu" onClick={close} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                        Lihat menu
                      </a>
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {lines.map((l) => (
                        <LineRow key={l.key} line={l} editable />
                      ))}
                    </ul>
                  ))}

                {step === 'data' && (
                  <div className="space-y-5 pb-2">
                    <fieldset>
                      <legend className="text-sm font-bold">Ambil di gerai</legend>
                      <div className="mt-2 grid gap-2">
                        {OUTLETS.map((o) => (
                          <label key={o.id} className={cn('flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm', o.id === outletId && 'border-primary bg-primary/5')}>
                            <input type="radio" name="outlet" className="mt-1 accent-[var(--color-primary)]" checked={o.id === outletId} onChange={() => setOutletId(o.id)} />
                            <span>
                              <span className="block font-bold">{o.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {o.hours} · {isOpenNow(o) ? 'buka sekarang' : 'sedang tutup'}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="text-sm font-bold">Waktu pengambilan</legend>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={!canNow}
                          onClick={() => setMode('sekarang')}
                          className={cn('flex flex-col items-start rounded-xl border p-3 text-left text-sm disabled:opacity-45', mode === 'sekarang' && 'border-primary bg-primary/5')}
                        >
                          <Zap className="size-4 text-primary" />
                          <span className="mt-1 font-bold">Hari ini</span>
                          <span className="text-xs text-muted-foreground">{canNow ? 'Siap ± 15 menit' : 'Gerai sedang tutup'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode('terjadwal')}
                          className={cn('flex flex-col items-start rounded-xl border p-3 text-left text-sm', mode === 'terjadwal' && 'border-primary bg-primary/5')}
                        >
                          <CalendarClock className="size-4 text-primary" />
                          <span className="mt-1 font-bold">Terjadwal</span>
                          <span className="text-xs text-muted-foreground">H-1, maks. jam {CUTOFF_HOUR}.00</span>
                        </button>
                      </div>
                      {mode === 'terjadwal' && (
                        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                          <label className="text-xs font-semibold text-muted-foreground">
                            Tanggal
                            <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground" />
                          </label>
                          <label className="text-xs font-semibold text-muted-foreground">
                            Jam
                            <select value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground">
                              {slots.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      )}
                    </fieldset>

                    <div className="grid gap-3">
                      <label className="text-sm font-bold">
                        Nama pemesan
                        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-1 h-11 w-full rounded-xl border bg-background px-3 font-normal" />
                      </label>
                      <label className="text-sm font-bold">
                        Nomor WhatsApp
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="0812xxxxxxx" className="mt-1 h-11 w-full rounded-xl border bg-background px-3 font-normal" />
                      </label>
                      <label className="text-sm font-bold">
                        Catatan <span className="font-normal text-muted-foreground">(opsional)</span>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Mis. kuah dipisah, tanpa seledri" className="mt-1 w-full rounded-xl border bg-background px-3 py-2 font-normal" />
                      </label>
                    </div>
                  </div>
                )}

                {step === 'bayar' && (
                  <div className="space-y-5 pb-2">
                    <div className="rounded-2xl border bg-background p-4 text-center">
                      <p className="text-sm text-muted-foreground">Total yang harus dibayar</p>
                      <p className="font-display text-3xl font-black text-primary">{formatRupiah(total)}</p>
                      <div className="mx-auto mt-4 size-48 rounded-xl border bg-white p-2">
                        <DemoQr seed={code + total} />
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Scan dengan m-banking atau e-wallet apa pun. <br />
                        <span className="font-semibold">QRIS contoh — ganti dengan QRIS resmi gerai.</span>
                      </p>
                    </div>

                    <label className="block cursor-pointer">
                      <span className="text-sm font-bold">Bukti transfer</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => onProof(e.target.files?.[0])} />
                      {proof ? (
                        <span className="mt-2 flex items-center gap-3 rounded-xl border border-primary bg-primary/5 p-2">
                          <img src={proof} alt="Bukti transfer" className="size-16 rounded-lg object-cover" />
                          <span className="text-sm">
                            <span className="flex items-center gap-1.5 font-bold text-primary">
                              <CheckCircle2 className="size-4" /> Bukti terunggah
                            </span>
                            <span className="text-xs text-muted-foreground">Ketuk untuk ganti foto</span>
                          </span>
                        </span>
                      ) : (
                        <span className="mt-2 flex flex-col items-center rounded-xl border-2 border-dashed p-6 text-center text-sm text-muted-foreground hover:bg-muted">
                          <ImageUp className="size-7" />
                          <span className="mt-2 font-semibold">Ketuk untuk pilih / foto bukti transfer</span>
                        </span>
                      )}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Setelah dikirim, WhatsApp terbuka dengan rincian pesanan. Lampirkan foto bukti transfer di chat itu
                      agar gerai bisa mengonfirmasi.
                    </p>
                  </div>
                )}

                {step === 'selesai' && placed && (
                  <div className="space-y-4 pb-2">
                    <div className="flex flex-col items-center text-center">
                      <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="size-8" />
                      </span>
                      <p className="mt-3 font-display text-xl font-extrabold">Terima kasih, {placed.customer}!</p>
                      <p className="text-sm text-muted-foreground">Pesananmu tersimpan di perangkat ini dan siap dikirim ke gerai.</p>
                    </div>
                    <ReceiptCard order={placed} />
                  </div>
                )}

                {step === 'riwayat' &&
                  (history.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <Receipt className="size-12 text-muted-foreground/40" />
                      <p className="mt-3 font-bold">Belum ada pesanan</p>
                      <p className="text-sm text-muted-foreground">Pesanan dari perangkat ini akan muncul di sini.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {history.map((o) => (
                        <li key={o.id}>
                          <details className="group rounded-2xl border bg-background">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
                              <span>
                                <span className="block font-mono text-sm font-bold">{o.code}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(o.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} · {o.outletName}
                                </span>
                              </span>
                              <span className="text-sm font-bold text-primary">{formatRupiah(o.total)}</span>
                            </summary>
                            <div className="space-y-3 px-3 pb-3">
                              <ReceiptCard order={o} />
                              <a href={waLink(waMessage(o))} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-bold hover:bg-muted">
                                <MessageCircle className="size-4" /> Kirim ulang via WhatsApp
                              </a>
                            </div>
                          </details>
                        </li>
                      ))}
                    </ul>
                  ))}
              </div>

              {error && <p className="mx-4 mb-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</p>}

              {step === 'keranjang' && lines.length > 0 && (
                <footer className="border-t p-4">
                  <p className="mb-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({count} item)</span>
                    <span className="font-display text-lg font-extrabold">{formatRupiah(total)}</span>
                  </p>
                  <button type="button" onClick={() => setStep('data')} className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                    Lanjut ke detail pengambilan
                  </button>
                </footer>
              )}
              {step === 'data' && (
                <footer className="border-t p-4">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = validateData()
                      setError(msg)
                      if (!msg) setStep('bayar')
                    }}
                    className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    Lanjut ke pembayaran QRIS
                  </button>
                </footer>
              )}
              {step === 'bayar' && (
                <footer className="border-t p-4">
                  <button type="button" onClick={placeOrder} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                    <MessageCircle className="size-5" /> Kirim pesanan via WhatsApp
                  </button>
                </footer>
              )}
              {step === 'selesai' && placed && (
                <footer className="grid gap-2 border-t p-4">
                  <a href={waLink(waMessage(placed))} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground">
                    <MessageCircle className="size-5" /> Buka WhatsApp lagi
                  </a>
                  <button type="button" onClick={close} className="h-11 rounded-xl border text-sm font-bold hover:bg-muted">
                    Selesai
                  </button>
                </footer>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
