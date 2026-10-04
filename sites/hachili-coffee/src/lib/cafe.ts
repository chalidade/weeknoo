// Contact details shared by every section — one edit updates the whole page.
export const CAFE = {
  name: 'Ha.Chi.Li Coffee',
  tagline: '#ngopidirumahlebah',
  address: 'Jl. Sidoagung No. 177, Candirenggo, Singosari, Kab. Malang 65153',
  addressShort: 'Jl. Sidoagung No. 177, Singosari, Malang',
  phone: '0812-3286-8046',
  instagram: '@ha.chi.li',
  instagramUrl: 'https://www.instagram.com/ha.chi.li/',
  mapsUrl: 'https://share.google/l2f8VBtL5EmAap3in',
  mapsEmbed:
    'https://www.google.com/maps?q=Ha.Chi.Li+Coffee,+Jl.+Sidoagung+No.177,+Candirenggo,+Singosari,+Malang&output=embed',
  rating: 4.6,
  reviews: '300+',
  priceRange: 'Rp10rb – Rp69rb',
  hours: 'Selasa – Minggu · 14.00 – 23.00 WIB',
} as const

export function waLink(text = 'Halo Ha.Chi.Li, saya mau tanya menu & reservasi 🐝') {
  return `https://wa.me/6281232868046?text=${encodeURIComponent(text)}`
}

/** Public-folder asset that still resolves when the site is served under a sub-path. */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}
