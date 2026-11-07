import { motion } from 'motion/react'

export function PullQuote({ text, author, title }: { text: string; author?: string; title?: string }) {
  return (
    <motion.blockquote
      className="print-avoid relative my-16 border-y border-navy/80 py-12 text-center md:-mx-16"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      <span aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-6xl leading-none font-semibold text-royal">
        “
      </span>
      <p className="mx-auto max-w-2xl text-2xl leading-[1.35] font-medium tracking-[-0.015em] text-navy md:text-[1.875rem]">{text}</p>
      {author && (
        <footer className="mt-6 text-sm">
          <span className="font-semibold text-ink">{author}</span>
          {title && <span className="block text-muted-foreground sm:inline"> — {title}</span>}
        </footer>
      )}
    </motion.blockquote>
  )
}
