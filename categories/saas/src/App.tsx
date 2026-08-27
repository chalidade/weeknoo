import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Logos } from '@/components/Logos'
import { Features } from '@/components/Features'
import { Pricing } from '@/components/Pricing'
import { Testimonials } from '@/components/Testimonials'
import { Faq } from '@/components/Faq'
import { Cta } from '@/components/Cta'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Logos />
      <Features />
      <Pricing />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
    </main>
  )
}
