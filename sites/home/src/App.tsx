import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Stack } from '@/components/Stack'
import { Sites } from '@/components/Sites'
import { HowItWorks } from '@/components/HowItWorks'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Stack />
        <Sites />
        <HowItWorks />
        <Footer />
      </main>
    </>
  )
}

export default App
