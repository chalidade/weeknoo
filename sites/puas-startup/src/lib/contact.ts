// Single source for every CTA on the page.
export const EMAIL = 'startup@puas.sa'
export const WA_NUMBER = '966591425388'
export const WA_DISPLAY = '+966 59 142 5388'

/** Gelombang 1 closes at the end of 25 Nov 2026, Riyadh time (UTC+3). */
export const DEADLINE = new Date('2026-11-25T23:59:59+03:00')

export const PROPOSAL_POINTS = [
  'Masalah apa yang mau diselesaikan',
  'Apa solusi yang ditawarkan',
  'Sejauh mana sudah terbukti',
  'Potensi scale-up-nya',
  'Berapa dana yang dibutuhkan',
  'Rencana bagi hasil dengan PUAS',
] as const

export const PROPOSAL_TEMPLATE = `Nama Startup / Ide:
Nama Founder & Co-founder / Investor:
Kontak (WhatsApp):

1. Masalah apa yang mau diselesaikan:

2. Apa solusi yang ditawarkan:

3. Sejauh mana sudah terbukti (traction, pengguna, pendapatan, pilot):

4. Potensi scale-up (Saudi & GCC):

5. Berapa dana yang dibutuhkan:

6. Rencana bagi hasil dengan PUAS:

(Lampirkan pitch deck / proposal bila ada — format bebas.)`

export const mailtoUrl = (subject = 'Proposal Startup — [Nama Startup]', body = PROPOSAL_TEMPLATE) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

export const waUrl = (
  text = 'Assalamualaikum PUAS, saya ingin mendaftar Program Kompetisi Ide & Startup (Fast Track). Nama startup saya: ',
) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
