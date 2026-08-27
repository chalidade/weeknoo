import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Works } from '@/components/Works'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Testimonials } from '@/components/Testimonials'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Works />
      <About />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
