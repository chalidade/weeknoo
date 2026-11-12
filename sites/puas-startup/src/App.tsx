import { LazyMotion, domAnimation } from 'motion/react'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Benefits } from '@/components/Benefits'
import { Proposal } from '@/components/Proposal'
import { Prizes } from '@/components/Prizes'
import { Timeline } from '@/components/Timeline'
import { Eligibility } from '@/components/Eligibility'
import { Process } from '@/components/Process'
import { Faq } from '@/components/Faq'
import { Cta } from '@/components/Cta'
import { Footer } from '@/components/Footer'
import { StickyContact } from '@/components/StickyContact'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
    <main className="min-h-screen overflow-x-clip">
      <Navbar />
      <Hero />
      <Benefits />
      <Proposal />
      <Prizes />
      <Timeline />
      <Eligibility />
      <Process />
      <Faq />
      <Cta />
      <Footer />
      <StickyContact />
    </main>
    </LazyMotion>
  )
}
