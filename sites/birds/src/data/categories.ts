import type { Category } from './types'

export interface SeriesInfo {
  name: Category
  slug: string
  group: 'Workforce Intelligence' | 'Human Leadership' | 'Mind & Impact'
  description: string
}

export const SERIES: SeriesInfo[] = [
  {
    name: 'Workforce Intelligence',
    slug: 'workforce-intelligence',
    group: 'Workforce Intelligence',
    description:
      'Data-led analysis of skills, labour markets and workforce strategy across the GCC, Southeast Asia and global benchmarks.',
  },
  {
    name: 'Practitioners Perspective',
    slug: 'practitioners-perspective',
    group: 'Human Leadership',
    description:
      'Field-tested lessons from the people who design, run and fix capability programmes inside large organisations.',
  },
  {
    name: 'Leading with Heart',
    slug: 'leading-with-heart',
    group: 'Human Leadership',
    description:
      'How empathy, trust and psychological safety translate into measurable performance at the top of the house.',
  },
  {
    name: 'L&D Around the World',
    slug: 'ld-around-the-world',
    group: 'Human Leadership',
    description:
      'Learning and development models worth borrowing — from Riyadh and Dubai to Jakarta, Singapore and beyond.',
  },
  {
    name: 'Mind in Motion',
    slug: 'mind-in-motion',
    group: 'Mind & Impact',
    description:
      'Cognitive science for executives: attention, decision quality, and the mental load of constant change.',
  },
  {
    name: 'Impact Generation',
    slug: 'impact-generation',
    group: 'Mind & Impact',
    description:
      'Proving value: how leading organisations measure the return on people, learning and ESG investment.',
  },
  {
    name: 'Competency Unlock',
    slug: 'competency-unlock',
    group: 'Mind & Impact',
    description:
      'Practical playbooks and action tables that turn capability frameworks into everyday behaviour.',
  },
]

export const seriesBySlug = (slug: string) => SERIES.find((s) => s.slug === slug)
export const seriesByName = (name: Category) => SERIES.find((s) => s.name === name)!

export const NAV_GROUPS = [
  { label: 'Human Leadership', items: SERIES.filter((s) => s.group === 'Human Leadership') },
  { label: 'Mind & Impact', items: SERIES.filter((s) => s.group === 'Mind & Impact') },
]
