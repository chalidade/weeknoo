import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Benefits } from '@/components/Benefits'
import { Prizes } from '@/components/Prizes'
import { Timeline } from '@/components/Timeline'
import { Eligibility } from '@/components/Eligibility'
import { Proposal } from '@/components/Proposal'
import { Faq } from '@/components/Faq'
import { Cta } from '@/components/Cta'
import { Footer } from '@/components/Footer'
import { StickyContact } from '@/components/StickyContact'

// Sections follow the poster's order, top to bottom.
export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Benefits />
      <Prizes />
      <Timeline />
      <Eligibility />
      <Proposal />
      <Faq />
      <Cta />
      <Footer />
      <StickyContact />
    </main>
  )
}
