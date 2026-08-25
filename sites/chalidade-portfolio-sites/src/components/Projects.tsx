import { motion } from 'motion/react'
import { inView, fadeUp } from '@/lib/motion'
import { SectionHeading } from '@/components/SectionHeading'

type Project = {
  client: string
  sector: string
  period: string
  description: string
  stack: string[]
}

const projects: Project[] = [
  {
    client: 'PT Jasa Marga (Persero) Tbk.',
    sector: 'Toll road operations',
    period: 'May — Dec 2019',
    description:
      'Operational dashboard and reporting system for the Ngawi–Kertosono–Kediri toll road: centralised real-time vehicle tracking, granular telemetry (speed, travel history) for proactive management, and a streamlined emergency reporting flow for swift incident response.',
    stack: ['PHP', 'JavaScript', 'Server-side'],
  },
  {
    client: 'PT Pertamina (Persero)',
    sector: 'Energy',
    period: 'Sep — Nov 2019',
    description:
      "Custom web application for Pertamina's Surabaya Fuel Oil Terminal, streamlining detailed activity reporting and real-time monitoring to give management visibility into complex operations.",
    stack: ['PHP', 'JavaScript', 'CSS', 'HTML'],
  },
  {
    client: 'SDN Pakis V Surabaya',
    sector: 'Education',
    period: 'Aug — Dec 2019',
    description:
      'Full-featured School Management System combining an Information Management System, a detailed Academic Management System and a Quality Management System covering documents, assets and audits.',
    stack: ['PHP', 'JavaScript', 'CSS', 'Server-side'],
  },
  {
    client: 'PT Semen Gresik (Persero) Tbk.',
    sector: 'Manufacturing',
    period: 'Jan — May 2019',
    description:
      'Specialised application improving the efficiency of safety inspections and accident reporting, giving safety officers streamlined tools that directly improved workplace safety compliance.',
    stack: ['PHP', 'JavaScript', 'CSS', 'HTML'],
  },
  {
    client: 'PT Pembangkitan Jawa Bali',
    sector: 'Power generation',
    period: 'Jan — May 2019',
    description:
      'Safety inspection and accident reporting platform for operational areas, empowering safety officers with tools that contributed to improved workplace safety management and compliance.',
    stack: ['JavaScript', 'PHP', 'HTML', 'CSS'],
  },
  {
    client: 'Politeknik Perkapalan Negeri Surabaya',
    sector: 'Healthcare · Education',
    period: 'Dec 2018 — Apr 2019',
    description:
      'Web-based Polyclinic Management System optimising healthcare administration and patient engagement — efficient patient and drug data collection, self-diagnosis for patients, and student health monitoring.',
    stack: ['PHP', 'JavaScript', 'CSS', 'HTML'],
  },
  {
    client: 'CV. Axlindoo',
    sector: 'Retail',
    period: 'Nov — Dec 2018',
    description:
      'Business management and online presence platform designed around product discovery — variant browsing, detailed information and seamless purchasing — with tooling for strategic promotion and sales management.',
    stack: ['PHP', 'JavaScript', 'CSS', 'Server-side'],
  },
  {
    client: 'PT Sumito Teknik',
    sector: 'Safety services',
    period: 'Oct — Nov 2018',
    description:
      'Custom web application streamlining technical examination and testing services, improving client service delivery and internal workflow management.',
    stack: ['PHP', 'JavaScript', 'HTML', 'CSS'],
  },
]

export function Projects() {
  return (
    <motion.section id="projects" {...inView} className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          index="03"
          title="Selected projects"
          lede="Client work delivered as a freelance full-stack developer, 2018 — 2019."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
          {projects.map((project) => (
            <motion.article
              key={project.client}
              variants={fadeUp}
              className="group flex flex-col bg-background p-6 transition-colors hover:bg-secondary/40 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold tracking-tight">{project.client}</h3>
                <span className="shrink-0 text-xs text-muted-foreground">{project.period}</span>
              </div>

              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-brand-ink">
                {project.sector}
              </p>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
