import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* soft radial glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.primary/8%),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center sm:py-36"
      >
        <motion.a
          variants={fadeUp}
          href="#"
          className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs transition-colors hover:text-foreground"
        >
          <Sparkles className="size-3.5 text-primary" />
          Introducing __SITE_NAME__
        </motion.a>

        <motion.h1
          variants={fadeUp}
          className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
        >
          Build something people love
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
        >
          A production-ready starter with React, Tailwind, shadcn/ui and Motion —
          ready to shape into your next website.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" className="group">
            Get started
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
