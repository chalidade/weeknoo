import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Gallery } from '@/components/Gallery'
import { About } from '@/components/About'
import { Packages } from '@/components/Packages'
import { Testimonials } from '@/components/Testimonials'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Gallery />
      <About />
      <Packages />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
