import { useEffect, useState } from 'react'

// Hash routing keeps deep links working on GitHub Pages sub-paths.
//   #/                     home
//   #/series/<slug>        home filtered to one series
//   #/article/<id>         single article
//   #/saved                saved library
export type Route =
  | { name: 'home'; series?: string }
  | { name: 'article'; id: string }
  | { name: 'saved' }

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'article' && parts[1]) return { name: 'article', id: parts[1] }
  if (parts[0] === 'saved') return { name: 'saved' }
  if (parts[0] === 'series' && parts[1]) return { name: 'home', series: parts[1] }
  return { name: 'home' }
}

export const hrefFor = {
  home: () => '#/',
  series: (slug: string) => `#/series/${slug}`,
  article: (id: string) => `#/article/${id}`,
  saved: () => '#/saved',
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function articleUrl(id: string) {
  const { origin, pathname } = window.location
  return `${origin}${pathname}${hrefFor.article(id)}`
}
