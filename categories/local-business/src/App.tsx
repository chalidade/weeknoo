import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { WhyUs } from '@/components/WhyUs'
import { Gallery } from '@/components/Gallery'
import { Testimonials } from '@/components/Testimonials'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
