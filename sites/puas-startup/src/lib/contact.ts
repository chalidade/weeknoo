// Single source for every contact link and for the pitch a founder sends.
export const EMAIL = 'startup@puas.sa'
export const WA_NUMBER = '966591425388'
export const WA_DISPLAY = '+966 59 142 5388'

/** The six things every proposal has to answer, in the order PUAS asks them. */
export const QUESTIONS = [
  {
    short: 'Masalah',
    ask: 'Masalah apa yang mau kamu selesaikan?',
    hint: 'Siapa yang mengalaminya, seberapa besar, dan kenapa penting di pasar Saudi atau GCC.',
    label: 'Masalah apa yang mau diselesaikan',
  },
  {
    short: 'Solusi',
    ask: 'Apa solusi yang kamu tawarkan?',
    hint: 'Produk atau layananmu, dan apa bedanya dari yang sudah ada.',
    label: 'Apa solusi yang ditawarkan',
  },
  {
    short: 'Bukti',
    ask: 'Sejauh mana sudah terbukti?',
    hint: 'Prototipe, pilot, jumlah pengguna, pendapatan, atau mitra. Bukti sekecil apa pun dihitung.',
    label: 'Sejauh mana sudah terbukti',
  },
  {
    short: 'Scale-up',
    ask: 'Seberapa besar potensi scale-up-nya?',
    hint: 'Kota lain di Saudi, negara GCC lain, atau segmen baru yang bisa kamu masuki.',
    label: 'Potensi scale-up-nya',
  },
  {
    short: 'Dana',
    ask: 'Berapa dana yang kamu butuhkan?',
    hint: 'Angka yang realistis dan garis besar penggunaannya.',
    label: 'Berapa dana yang dibutuhkan',
  },
  {
    short: 'Bagi hasil',
    ask: 'Bagaimana rencana bagi hasil dengan PUAS?',
    hint: 'Skema kerja sama atau bagi hasil yang kamu usulkan.',
    label: 'Rencana bagi hasil dengan PUAS',
  },
] as const

export interface Pitch {
  startup: string
  founders: string
  wa: string
  /** One answer per entry of QUESTIONS. */
  answers: string[]
}

export const EMPTY_PITCH: Pitch = {
  startup: '',
  founders: '',
  wa: '',
  answers: QUESTIONS.map(() => ''),
}

/** The plain-text proposal, as it lands in the email body. */
export function pitchText(p: Pitch = EMPTY_PITCH) {
  const head = [
    `Nama startup / ide: ${p.startup.trim()}`,
    `Founder & co-founder / investor: ${p.founders.trim()}`,
    `WhatsApp: ${p.wa.trim()}`,
  ]
  const body = QUESTIONS.map((q, i) => `${i + 1}. ${q.label}:\n${(p.answers[i] ?? '').trim()}`)
  return [...head, '', ...body.flatMap((b) => [b, ''])].join('\n').trimEnd()
}

export const pitchSubject = (p: Pitch = EMPTY_PITCH) =>
  `Proposal Startup — ${p.startup.trim() || '[Nama Startup]'}`

export const mailtoUrl = (subject = pitchSubject(), body = pitchText()) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

export const waUrl = (
  text = 'Halo PUAS, saya mau ikut Program Kompetisi Ide & Startup lewat jalur Fast Track. Nama startup saya: ',
) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
