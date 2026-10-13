import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Highlights } from '@/components/Highlights'
import { Menu } from '@/components/Menu'
import { Testimonials } from '@/components/Testimonials'
import { Concept } from '@/components/Concept'
import { Outlets } from '@/components/Outlets'
import { Partnership } from '@/components/Partnership'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Highlights />
      <Menu />
      <Testimonials />
      <Concept />
      <Outlets />
      <Partnership />
      <Footer />
      <CartDrawer />
    </main>
  )
}
