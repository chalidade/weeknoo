import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Posts } from '@/components/Posts'
import { Categories } from '@/components/Categories'
import { Newsletter } from '@/components/Newsletter'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Posts />
      <Categories />
      <Newsletter />
      <Footer />
    </main>
  )
}
