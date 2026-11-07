// Data model for Birds — mirrors the implementation plan.

export interface Contributor {
  fullName: string
  role: 'author' | 'editor' | 'expert'
  title: string
  company: string
  /** Image URL, or "" to render a monogram portrait. */
  photoUrl: string
  linkedinUrl: string
  personalBio: string
  companyBio: string
  companyUrl: string
}

export type Category =
  | 'Workforce Intelligence'
  | 'Practitioners Perspective'
  | 'Leading with Heart'
  | 'L&D Around the World'
  | 'Mind in Motion'
  | 'Impact Generation'
  | 'Competency Unlock'

export type ChartType = 'bar' | 'column' | 'line' | 'pie'

export interface ChartDatum {
  label: string
  value: number
  benchmark?: number
  color?: string
}

export interface ChartSpec {
  type: ChartType
  title: string
  subtitle?: string
  data: ChartDatum[]
  source: string
  /** Appended to values, e.g. "%" or " pts". */
  unit?: string
  valueLabel?: string
  benchmarkLabel?: string
}

export interface CarouselItem {
  /** Image URL or an "art:<preset>" artwork id. */
  imageUrl: string
  caption: string
  attribution?: string
  /** When set the slide is a quote card instead of a photo. */
  quote?: string
}

export interface ContentSection {
  heading?: string
  paragraphs: string[]
  pullQuote?: { text: string; author?: string; title?: string }
  chartIndex?: number
  showCarousel?: boolean
  actionTable?: { caption?: string; columns: string[]; rows: string[][] }
  figure?: { imageUrl: string; caption: string; credit?: string }
}

export interface Article {
  id: string
  title: string
  subtitle: string
  category: Category
  /** Extra kicker text shown after the category, e.g. "GCC & SEA Report". */
  series?: string
  accessType: 'free' | 'member'
  heroType: 'image' | 'video'
  /** Image URL or an "art:<preset>" artwork id (see components/Artwork). */
  featuredImage: string
  heroVideoUrl?: string
  author: Contributor
  interviewedExperts: Contributor[]
  publishedAt: string
  readTime: string
  keyTakeaways: string[]
  charts?: ChartSpec[]
  carouselItems?: CarouselItem[]
  contentSections: ContentSection[]
  featured?: boolean
}
