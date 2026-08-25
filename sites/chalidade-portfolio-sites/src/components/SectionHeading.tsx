import { motion } from 'motion/react'
import { fadeUp } from '@/lib/motion'

type Props = {
  /** Two-digit index shown in the accent colour, e.g. "01". */
  index: string
  title: string
  lede?: string
}

/**
 * Shared heading for every content section, so the page reads as one system.
 * Restyling all section headers is an edit here, not in eight files.
 */
export function SectionHeading({ index, title, lede }: Props) {
  return (
    <div className="max-w-2xl">
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
      >
        <span className="text-brand-ink">{index}</span>
        <span className="h-px w-8 bg-border" aria-hidden />
        {title}
      </motion.div>

      {lede && (
        <motion.p
          variants={fadeUp}
          className="mt-5 text-2xl font-medium tracking-tight text-balance sm:text-3xl"
        >
          {lede}
        </motion.p>
      )}
    </div>
  )
}
