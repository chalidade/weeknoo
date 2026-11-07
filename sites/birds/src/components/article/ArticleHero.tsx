import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import type { Article } from '@/data/types'
import { Media } from '@/components/Artwork'

const asset = (p: string) => (/^https?:|^\//.test(p) ? p : import.meta.env.BASE_URL + p)

export function ArticleHero({ article }: { article: Article }) {
  const video = article.heroType === 'video' && article.heroVideoUrl
  return (
    <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-navy md:h-[72vh]">
      <motion.div className="absolute inset-0" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
        {video ? <HeroVideo src={asset(article.heroVideoUrl!)} poster={article.featuredImage} /> : <Media src={article.featuredImage} alt="" />}
      </motion.div>
      {/* gradient scrim keeps the overlaid header legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/10 to-navy/40" />
    </section>
  )
}

function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) {
      ref.current?.pause()
      setPlaying(false)
    }
  }, [reduced])

  const togglePlay = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }
  const toggleMute = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const btn = 'flex size-11 items-center justify-center rounded-full border border-white/40 bg-navy/40 text-white backdrop-blur transition hover:border-white hover:bg-navy/70'

  return (
    <>
      {/* artwork shows until the first video frame paints */}
      <div className="absolute inset-0">
        <Media src={poster} />
      </div>
      <video ref={ref} className="absolute inset-0 h-full w-full object-cover object-[77%_50%]" src={src} autoPlay={!reduced} muted loop playsInline preload="metadata" aria-label="Ambient background video" />
      <div className="absolute right-5 bottom-5 z-10 flex gap-2 lg:right-10 lg:bottom-8">
        <button onClick={togglePlay} className={btn} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4 translate-x-px" fill="currentColor" />}
        </button>
        <button onClick={toggleMute} className={btn} aria-label={muted ? 'Unmute video' : 'Mute video'}>
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>
    </>
  )
}
