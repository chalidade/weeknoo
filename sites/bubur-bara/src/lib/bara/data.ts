// Bubur Bara's catalogue: menu, outlets and contact. The menu section, the
// cart drawer and the outlet section all read from here so a price or an
// outlet changes in one place.
import {
  Beef,
  Coffee,
  CookingPot,
  CupSoda,
  Drumstick,
  Egg,
  Flame,
  GlassWater,
  Soup,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

/** WhatsApp number orders are sent to — international format, no "+". Replace with the real one. */
export const WA_NUMBER = '6280000000000'

export type Category = 'bubur' | 'wonton' | 'topping' | 'minuman'

export const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'Semua Menu' },
  { id: 'bubur', label: 'Bubur Bakar' },
  { id: 'wonton', label: 'Wonton & Dim Sum' },
  { id: 'topping', label: 'Topping' },
  { id: 'minuman', label: 'Minuman' },
]

export type MenuItem = {
  id: string
  category: Category
  name: string
  price: number
  description: string
  /** what is in the bowl — shown in the detail sheet */
  contents: string
  icon: LucideIcon
  /** hue (0–360) of the dish's placeholder visual */
  hue: number
  bestSeller?: boolean
  /** 0 = not spicy, up to 3 chillies */
  spicy?: number
}

export const MENU: MenuItem[] = [
  {
    id: 'bb-polos',
    category: 'bubur',
    name: 'Bubur Bakar Polos',
    price: 10_000,
    description: 'Bubur nasi gurih dibakar di claypot sampai pinggirnya berkerak harum.',
    contents: 'Bubur, kaldu ayam, bawang goreng.',
    icon: CookingPot,
    hue: 70,
  },
  {
    id: 'bb-ori-ayam',
    category: 'bubur',
    name: 'Bubur Bakar Ori Ayam',
    price: 12_000,
    description: 'Klasiknya kami: suwiran ayam, jagung manis, sayur, dan keripik renyah.',
    contents: 'Bubur, ayam suwir, jagung, sayur, keripik.',
    icon: Drumstick,
    hue: 60,
    bestSeller: true,
  },
  {
    id: 'bb-ori-sapi',
    category: 'bubur',
    name: 'Bubur Bakar Ori Sapi',
    price: 15_000,
    description: 'Potongan daging sapi empuk di atas bubur bakar yang masih mendidih.',
    contents: 'Bubur, daging sapi, jagung, sayur, keripik.',
    icon: Beef,
    hue: 35,
  },
  {
    id: 'bb-ori-campur',
    category: 'bubur',
    name: 'Bubur Bakar Ori Campur',
    price: 18_000,
    description: 'Ayam dan sapi sekaligus, untuk pagi yang butuh tenaga ekstra.',
    contents: 'Bubur, ayam suwir, daging sapi, jagung, sayur, keripik.',
    icon: CookingPot,
    hue: 45,
  },
  {
    id: 'bb-laksa-ayam',
    category: 'bubur',
    name: 'Bubur Bakar Kuah Laksa Ayam',
    price: 14_000,
    description: 'Disiram kuah laksa santan berempah yang hangat sampai ke perut.',
    contents: 'Bubur, kuah laksa, ayam suwir, jagung, sayur, keripik.',
    icon: Soup,
    hue: 50,
    bestSeller: true,
    spicy: 1,
  },
  {
    id: 'bb-laksa-sapi',
    category: 'bubur',
    name: 'Bubur Bakar Kuah Laksa Sapi',
    price: 16_000,
    description: 'Kuah laksa kental berpadu daging sapi, aroma serai dan daun jeruknya nendang.',
    contents: 'Bubur, kuah laksa, daging sapi, jagung, sayur, keripik.',
    icon: Soup,
    hue: 40,
    spicy: 1,
  },
  {
    id: 'bb-kuning-ayam',
    category: 'bubur',
    name: 'Bubur Bakar Kuah Kuning Ayam',
    price: 14_000,
    description: 'Kuah kuning kunyit yang ringan dan wangi, cocok untuk sarapan keluarga.',
    contents: 'Bubur, kuah kuning, ayam suwir, jagung, sayur, keripik.',
    icon: Soup,
    hue: 85,
  },
  {
    id: 'bb-kuning-sapi',
    category: 'bubur',
    name: 'Bubur Bakar Kuah Kuning Sapi',
    price: 16_000,
    description: 'Kuah kuning gurih dengan potongan sapi yang lembut.',
    contents: 'Bubur, kuah kuning, daging sapi, jagung, sayur, keripik.',
    icon: Soup,
    hue: 80,
  },
  {
    id: 'bb-semur-ayam',
    category: 'bubur',
    name: 'Bubur Bakar Semur Ayam + Telur',
    price: 16_000,
    description: 'Kuah semur manis-gurih meresap ke bubur, lengkap dengan telur utuh.',
    contents: 'Bubur, kuah semur, ayam, telur, jagung, sayur, keripik.',
    icon: Egg,
    hue: 30,
    bestSeller: true,
  },
  {
    id: 'bb-semur-sapi',
    category: 'bubur',
    name: 'Bubur Bakar Semur Sapi + Telur',
    price: 18_000,
    description: 'Semur sapi yang dimasak lama, telur utuh, dan bubur yang berkerak.',
    contents: 'Bubur, kuah semur, daging sapi, telur, jagung, sayur, keripik.',
    icon: Egg,
    hue: 25,
  },
  {
    id: 'wt-kuah',
    category: 'wonton',
    name: 'Wonton Kuah (isi 5)',
    price: 13_000,
    description: 'Pangsit ayam dalam kuah kaldu bening yang hangat dan menenangkan.',
    contents: '5 pangsit ayam, kuah kaldu, sawi, daun bawang.',
    icon: Soup,
    hue: 95,
  },
  {
    id: 'wt-chili',
    category: 'wonton',
    name: 'Wonton Chili Oil (isi 5)',
    price: 14_000,
    description: 'Pangsit ayam bermandikan minyak cabai racikan sendiri. Pedas, gurih, nagih.',
    contents: '5 pangsit ayam, chili oil, cuka hitam, wijen.',
    icon: Flame,
    hue: 20,
    bestSeller: true,
    spicy: 3,
  },
  {
    id: 'ds-siomay',
    category: 'wonton',
    name: 'Dim Sum Siomay Ayam (isi 4)',
    price: 13_000,
    description: 'Siomay ayam kukus yang juicy, disajikan dengan saus sambal.',
    contents: '4 siomay ayam, saus sambal.',
    icon: Wheat,
    hue: 75,
  },
  {
    id: 'tp-telur',
    category: 'topping',
    name: 'Telur Kampung Rebus',
    price: 5_000,
    description: 'Telur ayam kampung rebus, kaya protein.',
    contents: '1 butir telur ayam kampung.',
    icon: Egg,
    hue: 65,
  },
  {
    id: 'tp-ayam',
    category: 'topping',
    name: 'Ekstra Ayam Suwir',
    price: 3_000,
    description: 'Tambahan suwiran ayam berbumbu.',
    contents: 'Ayam suwir.',
    icon: Drumstick,
    hue: 55,
  },
  {
    id: 'tp-sapi',
    category: 'topping',
    name: 'Ekstra Daging Sapi',
    price: 5_000,
    description: 'Tambahan potongan daging sapi empuk.',
    contents: 'Daging sapi.',
    icon: Beef,
    hue: 30,
  },
  {
    id: 'tp-sate',
    category: 'topping',
    name: 'Sate Usus / Ati Ampela',
    price: 3_000,
    description: 'Satu tusuk sate bacem, teman wajib bubur.',
    contents: '1 tusuk sate.',
    icon: Flame,
    hue: 35,
  },
  {
    id: 'tp-kerupuk',
    category: 'topping',
    name: 'Kerupuk Bawang',
    price: 3_000,
    description: 'Kerupuk bawang renyah gurih.',
    contents: '1 bungkus kerupuk.',
    icon: Wheat,
    hue: 85,
  },
  {
    id: 'mn-teh',
    category: 'minuman',
    name: 'Teh Hangat',
    price: 4_000,
    description: 'Teh melati hangat, manis atau tawar.',
    contents: 'Teh melati, gula (opsional).',
    icon: CupSoda,
    hue: 40,
  },
  {
    id: 'mn-kopi',
    category: 'minuman',
    name: 'Kopi Tubruk Nusantara',
    price: 5_000,
    description: 'Kopi hitam tubruk dari biji pilihan, diseduh panas.',
    contents: 'Kopi bubuk, air panas, gula (opsional).',
    icon: Coffee,
    hue: 30,
  },
  {
    id: 'mn-jeruk',
    category: 'minuman',
    name: 'Jeruk Hangat',
    price: 6_000,
    description: 'Perasan jeruk segar, hangat atau dingin.',
    contents: 'Jeruk peras, gula.',
    icon: CupSoda,
    hue: 70,
  },
  {
    id: 'mn-air',
    category: 'minuman',
    name: 'Air Mineral',
    price: 3_000,
    description: 'Air mineral botol 600 ml.',
    contents: '1 botol 600 ml.',
    icon: GlassWater,
    hue: 220,
  },
]

/** Toppings that can be added to a bowl from its detail sheet. */
export const ADDONS = MENU.filter((m) => m.category === 'topping')

export type Outlet = {
  id: string
  name: string
  format: string
  address: string
  hours: string
  /** opening/closing hour, 24h — drives the "buka sekarang" badge */
  open: number
  close: number
}

export const OUTLETS: Outlet[] = [
  {
    id: 'taman-kota',
    name: 'Gerai Taman Kota',
    format: 'Motor tiga roda',
    address: 'Sisi utara Taman Kota, depan gerbang jogging track',
    hours: '05.30 – 09.30 WIB',
    open: 5.5,
    close: 9.5,
  },
  {
    id: 'stasiun',
    name: 'Gerai Stasiun',
    format: 'Booth modular',
    address: 'Area komersial pintu timur stasiun, sebelah loket ojek online',
    hours: '06.00 – 10.00 WIB',
    open: 6,
    close: 10,
  },
  {
    id: 'bara-house',
    name: 'Bara House',
    format: 'Restoran dine-in',
    address: 'Ruko Pasar Pagi Blok B, lantai dasar — ada area parkir & AC',
    hours: '06.00 – 14.00 WIB',
    open: 6,
    close: 14,
  },
]

export const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

export const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`

export function isOpenNow(outlet: Outlet, now = new Date()) {
  const h = now.getHours() + now.getMinutes() / 60
  return h >= outlet.open && h < outlet.close
}
