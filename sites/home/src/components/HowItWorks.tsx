import { motion } from 'motion/react'
import { PenLine, GitPullRequest, Rocket } from 'lucide-react'

const STEPS = [
  {
    icon: PenLine,
    title: '1 · Tulis prompt',
    text: 'Jelaskan website yang kamu mau di kotak di atas, lalu kirim — promptmu menjadi GitHub Issue di repo weeknoo.',
  },
  {
    icon: GitPullRequest,
    title: '2 · Claude mengerjakan',
    text: 'Claude membaca issue-nya, membangun site di workspace mengikuti CLAUDE.md, lalu commit hasilnya.',
  },
  {
    icon: Rocket,
    title: '3 · CI mem-publish',
    text: 'Begitu di-push, GitHub Actions mem-build web + APK dan menerbitkan site barunya di weeknoo.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function HowItWorks() {
  return (
    <section className="border-t">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto max-w-4xl px-6 py-16"
      >
        <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl">
          Cara kerjanya
        </motion.h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <motion.div key={step.title} variants={fadeUp}>
              <step.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
