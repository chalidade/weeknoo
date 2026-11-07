import { AppProvider } from '@/lib/app-context'
import { useRoute } from '@/lib/router'
import { TransparentNav } from '@/components/layout/TransparentNav'
import { Footer } from '@/components/layout/Footer'
import { HomeView } from '@/components/home/HomeView'
import { ArticleView } from '@/components/article/ArticleView'
import { SavedView } from '@/components/SavedView'
import { AuthDialog } from '@/components/shared/AuthDialog'
import { ShareDialog } from '@/components/shared/ShareDialog'
import { SearchOverlay } from '@/components/shared/SearchOverlay'
import { Toasts } from '@/components/shared/Toasts'

function Shell() {
  const route = useRoute()
  // The nav overlays a dark hero on the home marquee and on article heroes.
  const overlay = (route.name === 'home' && !route.series) || route.name === 'article'

  return (
    <>
      <TransparentNav route={route} overlay={overlay} />
      <main className="min-h-screen">
        {route.name === 'home' && <HomeView key={route.series ?? 'home'} series={route.series} />}
        {route.name === 'article' && <ArticleView key={route.id} id={route.id} />}
        {route.name === 'saved' && <SavedView />}
      </main>
      <Footer />
      <SearchOverlay />
      <AuthDialog />
      <ShareDialog />
      <Toasts />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
