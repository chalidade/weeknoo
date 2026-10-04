import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Bee } from '@/components/Logo'

type Item = {
  name: string
  desc: string
  price: number
  /** Ditandai lebah di buku menu — favorit pengunjung. */
  fav?: boolean
  /** Kartu oranye di buku menu — menu andalan. */
  hi?: boolean
  temp?: 'hot/ice' | 'hot' | 'ice'
}

type Group = { id: string; label: string; note?: string; items: Item[] }

// Disalin dari buku menu Ha.Chi.Li (harga dalam ribuan rupiah).
const MENU: Group[] = [
  {
    id: 'coffee',
    label: 'Coffee',
    note: 'Extra flavour caramel / vanilla / rhum +6K untuk Latte & Cappuccino',
    items: [
      { name: 'Latte', desc: 'Espresso & steamed milk', price: 25, temp: 'hot/ice' },
      { name: 'Cappuccino', desc: 'Espresso, steamed milk & foam', price: 25, temp: 'hot/ice', hi: true },
      { name: 'Tubruk', desc: 'Indonesian traditional coffee', price: 12, temp: 'hot' },
      { name: 'Americano', desc: 'Pure coffee & water', price: 17, temp: 'hot/ice' },
      { name: 'Melia Frappe', desc: 'Coffee ice blended with caramel', price: 28, fav: true, hi: true },
      { name: 'Espresso', desc: 'Extract coffee', price: 12 },
      { name: 'Kopi Gula Aren', desc: 'Coffee with brown sugar', price: 27 },
      { name: 'Baileys', desc: 'Sweet, creamy & fermented sense', price: 26, fav: true, hi: true },
      { name: 'Ice Banaffee', desc: 'Ice banana with coffee & milk', price: 25 },
      { name: 'Ice Butterscotch', desc: 'Ice coffee milk with butter palm sugar', price: 28, fav: true, hi: true },
      { name: 'Ice Dirty Matcha Cloud', desc: 'Ice coffee with japanese matcha', price: 28 },
      { name: 'Coffee Hazelnut', desc: 'Coffee ice blended with hazelnut', price: 28, fav: true, hi: true },
      { name: 'Fruity Americano', desc: 'Americano with fresh sensational fruits', price: 25 },
    ],
  },
  {
    id: 'non-coffee',
    label: 'Basic & Choco',
    items: [
      { name: 'Chocolate', desc: 'Fresh milk with chocolate', price: 24, temp: 'hot/ice' },
      { name: 'Taro', desc: 'Fresh milk with taro', price: 23, temp: 'hot/ice' },
      { name: 'Japanese Matcha', desc: 'Fresh milk with matcha', price: 25, temp: 'hot/ice', hi: true },
      { name: 'Choco Cheese', desc: 'Ice chocolate with cream cheese', price: 27, fav: true, hi: true },
      { name: 'Choco Banana', desc: 'Ice chocolate with banana flavour', price: 27, hi: true },
      { name: 'Choco Hazelnut', desc: 'Ice chocolate with hazelnut flavour', price: 27 },
    ],
  },
  {
    id: 'tea',
    label: 'Tea',
    items: [
      { name: 'Lychee Tea', desc: 'Ice tea with lychee', price: 21, fav: true, hi: true },
      { name: 'Pineapple Tea', desc: 'Ice tea with pineapple', price: 21, hi: true },
      { name: 'Lemon Grass Tea', desc: 'Hot tea with lemon grass & lemon', price: 21 },
      { name: 'Thai Tea Cheese', desc: 'Ice thai tea with cream cheese', price: 26, hi: true },
      { name: 'Sweet Tea', desc: 'Original sweet tea', price: 12, temp: 'hot/ice' },
      { name: 'Plain Tea', desc: 'Original plain tea', price: 10, temp: 'hot/ice' },
      { name: 'Peach Tea', desc: 'Ice tea with peach flavor', price: 20 },
    ],
  },
  {
    id: 'mocktail',
    label: 'Mocktail & Creamy',
    items: [
      { name: 'Sunset & Sea', desc: 'Sparkling pomegranate & bluecurracao', price: 25, hi: true },
      { name: 'Kawah Ijen', desc: 'Bluecurracao & creamy coconut', price: 24 },
      { name: 'Fresh Tropical', desc: 'Sparkling tropical fruit', price: 23 },
      { name: 'Creamy Strawberry Day', desc: 'Strawberry, fresh milk & whipped cream', price: 27 },
      { name: 'Creamy Blueberry Day', desc: 'Blueberry, fresh milk & whipped cream', price: 27, hi: true },
      { name: 'Creamy Mango Day', desc: 'Mango fruits, fresh milk & whipped cream', price: 27, hi: true },
    ],
  },
  {
    id: 'milkshake',
    label: 'Milkshake',
    items: [
      { name: 'Milkshake Strawberry', desc: 'Fresh strawberry blended with fresh milk, topped with cream', price: 27, fav: true, hi: true },
      { name: 'Milkshake Oreo', desc: 'Fresh milk with oreo biscuits', price: 27, hi: true },
      { name: 'Milkshake Vanilla', desc: 'Fresh milk with vanilla taste & cream', price: 26, hi: true },
      { name: 'Milkshake Oreo Cheese', desc: 'Fresh milk with oreo biscuits and cream cheese', price: 29 },
      { name: 'Milkshake Lotus', desc: 'Fresh milk with lotus biscuits', price: 28, hi: true },
      { name: 'Milkshake Chocolate', desc: 'Fresh milk with chocolate taste & ice cream', price: 26 },
    ],
  },
  {
    id: 'main',
    label: 'Main Menu',
    items: [
      { name: 'Nasi Beef Teriyaki', desc: 'Rice, scrambled eggs & beef teriyaki', price: 37, fav: true, hi: true },
      { name: 'Nasi Kulit Daun Jeruk', desc: 'Lime leaves rice, fried cabbage, crispy chicken skin & chili', price: 31, fav: true, hi: true },
      { name: 'Sup Iga', desc: 'Clear beef ribs soup with vegetables, served with warm rice & crackers', price: 67, hi: true },
      { name: 'Nasi Goreng Kampung', desc: 'Fried rice, egg, vegetables, shrimp cracker', price: 31 },
      { name: 'Nasi Bebek Nusantara', desc: 'Lime leaves rice, fried duck with serundeng flakes, tofu & chili sauce', price: 39, hi: true },
      { name: 'Nasi Ayam Asam Manis', desc: 'Rice, chicken popcorn and sour & sweet sauce', price: 29 },
      { name: 'Nasi Bhuk Madura', desc: 'Nasi putih, usus, paru, daging sapi, sayur rebung, emping belinjo dan sambal', price: 33, hi: true },
      { name: 'Tahu Campur Malang', desc: 'Meat, lento, lettuce, rice noodles, beef broth, petis, sambal & prawn crackers', price: 33, hi: true },
      { name: 'Japanese Ramen', desc: 'Ramen soup with nori, naruto, corn, smoked beef & chili oil', price: 32, hi: true },
      { name: 'Sup Buntut', desc: 'Clear beef oxtail with vegetables, served with warm rice & crackers', price: 69, hi: true },
      { name: 'Spaghetti Carbonara', desc: 'Spaghetti with beef bacon with creamy sauce and cheese', price: 30 },
      { name: 'Mac & Cheese', desc: 'Macaroni & creamy cheese with beef bacon', price: 30 },
      { name: 'Cwi Mie Ayam Malang', desc: "The authentic Malang's heritage chicken noodle & chicken wonton with clear soup", price: 29 },
      { name: 'Mie Daging Chili Oil', desc: 'Spicy noodle with beef & chicken wonton, served with clear soup', price: 33, hi: true },
      { name: 'Chicken Burgundy', desc: 'Chicken katsu with creamy cheese sauce, chips & salad', price: 35, hi: true },
      { name: 'Chicken Harland', desc: 'Sausage with teriyaki sauce, crispy enoki, french fries & salad', price: 35, hi: true },
      { name: 'Hawaii Chicken', desc: 'Chicken with sour sauce, crispy enoki, french fries & salad', price: 35, hi: true },
    ],
  },
  {
    id: 'pizza',
    label: 'Pizza & Pastry',
    items: [
      { name: 'Pizza Margherita', desc: 'Pizza, mozarella cheese & beef pepperoni', price: 40 },
      { name: 'Pizza Premium', desc: 'Pizza, smoked beef, beef cocktail, mushroom, mozarella cheese & beef pepperoni', price: 55, fav: true, hi: true },
      { name: 'Brownies On Ice', desc: 'Please select the flavour', price: 24 },
      { name: 'Cromboloni', desc: 'Please select the flavour', price: 24, fav: true, hi: true },
      { name: 'Croissant Pita', desc: 'Ribbon croissant with extra filling', price: 27 },
      { name: 'Burnt Cheese Cake', desc: 'Cheese cake', price: 28 },
    ],
  },
  {
    id: 'snack',
    label: 'Snack & Add On',
    items: [
      { name: 'Wonton Chili Oil', desc: 'Dumpling wonton served with chili oil', price: 24, fav: true, hi: true },
      { name: 'Mix Platter', desc: 'Mix french fries, chicken nugget & beef sausage with mayonais & chili sauce', price: 26, fav: true, hi: true },
      { name: 'French Fries', desc: 'BBQ / original flavour, with mayonais & chili sauce', price: 23 },
      { name: 'Soft Tofu', desc: 'Soft inside & crispy outside, with spicy soy sauce', price: 20 },
      { name: 'Regular Mineral', desc: 'Add on', price: 7 },
      { name: 'Large Mineral', desc: 'Add on', price: 9 },
      { name: 'Egg', desc: 'Add on', price: 8 },
      { name: 'Rice', desc: 'Add on', price: 8 },
    ],
  },
]

const ALL = 'semua-favorit'

export function Menu() {
  const [tab, setTab] = useState<string>(MENU[0].id)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const items = useMemo(() => {
    if (q) {
      return MENU.flatMap((g) =>
        g.items
          .filter((i) => `${i.name} ${i.desc}`.toLowerCase().includes(q))
          .map((i) => ({ ...i, group: g.label })),
      )
    }
    if (tab === ALL) {
      return MENU.flatMap((g) => g.items.filter((i) => i.fav).map((i) => ({ ...i, group: g.label })))
    }
    const g = MENU.find((x) => x.id === tab)!
    return g.items.map((i) => ({ ...i, group: g.label }))
  }, [q, tab])

  const note = !q && MENU.find((g) => g.id === tab)?.note

  return (
    <section id="menu" className="relative scroll-mt-16 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Menu Lengkap</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              70+ racikan dari dapur rumah lebah
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Tanda <Bee className="inline size-5 align-text-bottom" /> = favorit
              pengunjung, kartu oranye = menu andalan. Harga dalam ribuan rupiah.
            </p>
          </div>

          <label className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari menu… (mis. matcha)"
              className="h-12 w-full rounded-full border bg-card pr-10 pl-11 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            />
            {query && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => setQuery('')}
                className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>

        <div
          role="tablist"
          aria-label="Kategori menu"
          className={cn(
            'no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0',
            q && 'pointer-events-none opacity-40',
          )}
        >
          {[{ id: ALL, label: 'Favorit 🐝' }, ...MENU].map((g) => (
            <button
              key={g.id}
              role="tab"
              type="button"
              aria-selected={tab === g.id}
              onClick={() => setTab(g.id)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                tab === g.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        {note && <p className="mt-4 text-sm text-muted-foreground">✦ {note}</p>}

        <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.li
                layout
                key={item.group + item.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-3xl border p-5 transition-shadow hover:shadow-lg',
                  item.hi
                    ? 'border-transparent bg-primary text-primary-foreground'
                    : 'bg-card',
                )}
              >
                {item.hi && (
                  <div aria-hidden className="honeycomb absolute -top-6 -right-6 size-32 rotate-6 text-primary-foreground/15" />
                )}
                <div className="relative flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight font-bold">
                    {item.name}
                    {item.fav && <Bee className="ml-1.5 inline size-5 align-[-2px]" />}
                  </h3>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-3 py-1 font-display text-lg font-extrabold',
                      item.hi ? 'bg-primary-foreground text-primary' : 'bg-secondary text-primary',
                    )}
                  >
                    {item.price}K
                  </span>
                </div>
                <p
                  className={cn(
                    'relative mt-2 text-sm leading-relaxed',
                    item.hi ? 'text-primary-foreground/85' : 'text-muted-foreground',
                  )}
                >
                  {item.desc}
                </p>
                {(item.temp || q || tab === ALL) && (
                  <div className="relative mt-auto flex flex-wrap gap-1.5 pt-4 text-[11px] font-semibold tracking-wide uppercase">
                    {item.temp && (
                      <span className={cn('rounded-full px-2 py-0.5', item.hi ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground')}>
                        {item.temp}
                      </span>
                    )}
                    {(q || tab === ALL) && (
                      <span className={cn('rounded-full px-2 py-0.5', item.hi ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground')}>
                        {item.group}
                      </span>
                    )}
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {items.length === 0 && (
          <p className="mt-10 rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
            Belum ketemu “{query}”. Coba kata lain, atau tanya barista kami lewat WhatsApp 🐝
          </p>
        )}
      </div>
    </section>
  )
}
