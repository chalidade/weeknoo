import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Programs } from '@/components/Programs'
import { WhyUs } from '@/components/WhyUs'
import { Teachers } from '@/components/Teachers'
import { Testimonials } from '@/components/Testimonials'
import { Admission } from '@/components/Admission'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Programs />
      <WhyUs />
      <Teachers />
      <Testimonials />
      <Admission />
      <Footer />
    </main>
  )
}
