import { motion } from 'motion/react'
import { inView, fadeUp } from '@/lib/motion'
import { SectionHeading } from '@/components/SectionHeading'

const metrics = [
  { value: '35%', label: 'Faster page loads', note: 'Performance work at The KPI Institute' },
  { value: '80%', label: 'Better on-time delivery', note: 'Leading front-end with Agile' },
  { value: '70%', label: 'Developer efficiency gain', note: 'Reusable component library' },
  { value: '60%', label: 'Lower development cost', note: 'Modular architecture at PT EDI' },
]

export function About() {
  return (
    <motion.section id="about" {...inView} className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          index="01"
          title="About"
          lede="I build web applications that stay fast as they grow — and I do it from anywhere."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <motion.div variants={fadeUp} className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              I'm a senior front-end developer specialising in{' '}
              <strong className="font-medium text-foreground">React.js, Next.js and TypeScript</strong>,
              with deep experience in API integration, UI/UX optimisation and
              full-stack delivery using Laravel, Lumen and Node.js.
            </p>
            <p>
              Over five years I've delivered for clients across three continents —
              an EdTech platform in Australia, non-profit sites in Hong Kong, and
              port logistics systems in Indonesia — consistently working remote and
              often leading the front-end.
            </p>
            <p>
              I lead remote teams, mentor junior developers and run Agile
              practices that produce measurable outcomes, not just shipped tickets.
            </p>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2"
          >
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-background p-6">
                <dt className="text-3xl font-semibold tracking-tighter text-brand-ink">
                  {metric.value}
                </dt>
                <dd className="mt-2">
                  <div className="text-sm font-medium">{metric.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{metric.note}</div>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </motion.section>
  )
}
