import type { Variants } from 'motion/react'

/**
 * House animation: a `container` staggering `fadeUp` children. Shared so every
 * section moves identically — retiming the page is a one-file edit.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

/** Standard reveal for sections below the fold. */
export const inView = {
  variants: container,
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-80px' },
} as const
