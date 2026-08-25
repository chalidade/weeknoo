import { motion } from 'motion/react'
import { inView, fadeUp } from '@/lib/motion'
import { SectionHeading } from '@/components/SectionHeading'

const groups = [
  {
    title: 'Front-end',
    items: ['React.js', 'Next.js', 'Redux', 'TypeScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Bootstrap'],
  },
  {
    title: 'Back-end',
    items: ['Node.js', 'PHP', 'Laravel', 'Lumen', 'REST API', 'GraphQL'],
  },
  {
    title: 'Tools & DevOps',
    items: ['Git', 'GitHub Actions', 'Docker', 'Jira', 'Postman', 'Vercel', 'Netlify'],
  },
  {
    title: 'Engineering practice',
    items: ['API integration', 'Unit testing (Jest)', 'Agile/Scrum', 'Performance optimisation'],
  },
  {
    title: 'Team & project leadership',
    items: [
      'Agile/Scrum leadership',
      'Sprint planning',
      'Mentoring & coaching',
      'Cross-functional collaboration',
      'Remote team management',
      'Task delegation',
    ],
  },
]

export function Skills() {
  return (
    <motion.section id="skills" {...inView} className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          index="04"
          title="Skills"
          lede="Full-stack range, with depth on the front end and the API layer between."
        />

        <div className="mt-14 space-y-px overflow-hidden rounded-sm border border-border bg-border">
          {groups.map((group) => (
            <motion.div
              key={group.title}
              variants={fadeUp}
              className="grid gap-4 bg-background p-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8 sm:p-8"
            >
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-sm border border-border px-3 py-1.5 text-sm transition-colors hover:border-brand hover:text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
