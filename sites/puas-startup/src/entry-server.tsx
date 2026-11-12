import { renderToString } from 'react-dom/server'
import App from './App'

/** Build-time prerender: the vite.config prerender plugin injects this into #root. */
export function render() {
  return renderToString(<App />)
}
