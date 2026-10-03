import { motion } from 'motion/react'
import { PenLine, Bot, Rocket } from 'lucide-react'

const STEPS = [
  {
    icon: PenLine,
    title: 'Tulis prompt',
    text: 'Jelaskan website yang kamu mau di kotak di atas, lalu kirim — promptmu menjadi GitHub Issue di repo weeknoo.',
    code: 'issue #12 · label: prompt',
  },
  {
    icon: Bot,
    title: 'Claude mengerjakan',
    text: 'Routine Claude membaca issue-nya, membangun site di workspace mengikuti CLAUDE.md, lalu commit hasilnya.',
    code: 'npm run new → npm run build ✓',
  },
  {
    icon: Rocket,
    title: 'CI mem-publish',
    text: 'Begitu di-push, GitHub Actions mem-build web + APK dan menerbitkan site barunya di GitHub Pages.',
    code: 'deploy-pages → /weeknoo/<site>/',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative scroll-mt-28 border-t">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="mx-auto max-w-5xl px-6 py-24"
      >
        <motion.p variants={fadeUp} className="font-mono text-xs tracking-widest text-primary uppercase">
          Alur
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          Cara{' '}
          <span className="font-display font-normal tracking-normal italic">kerjanya</span>
        </motion.h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border bg-card/60 p-6 transition-colors hover:border-primary/30"
            >
              <span
                aria-hidden
                className="absolute -top-4 right-3 font-display text-[7rem] leading-none text-foreground/[0.04] italic transition-colors group-hover:text-primary/10"
              >
                {i + 1}
              </span>
              <span className="inline-flex size-11 items-center justify-center rounded-2xl border bg-background">
                <step.icon className="size-5 text-primary" />
              </span>
              <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              <p className="mt-6 rounded-xl border bg-background/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                <span className="text-primary">$</span> {step.code}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
