import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Loader from '../components/Loader'
import { useToast } from '../context/ToastContext'
import { songsService, albumsService } from '../lib/services'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import AlbumCard from '../components/AlbumCard'
import useViewport from '../hooks/useViewport'

const tabs = ['Albums', 'Artists', 'Podcasts']

const podcastItems = [
  { title: 'Studio Notes', artist: 'Creative Talk', emoji: 'Mic', color: 'linear-gradient(135deg, #372248, #7c4dff)' },
  { title: 'Slow Mornings', artist: 'Daily Rituals', emoji: 'Coffee', color: 'linear-gradient(135deg, #67412c, #d88c52)' },
  { title: 'After Midnight', artist: 'Night Stories', emoji: 'Moon', color: 'linear-gradient(135deg, #0b132b, #1c2541)' },
]

const styles = {
  page: {
    padding: '28px',
    overflowY: 'auto',
    height: '100%',
  },
  tabs: {
    display: 'inline-flex',
    gap: '10px',
    padding: '8px',
    borderRadius: '999px',
    background: 'var(--surface)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow)',
    marginBottom: '24px',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  tab: {
    padding: '10px 16px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 700,
    background: 'transparent',
  },
  hero: {
    borderRadius: '32px',
    padding: '28px',
    background: 'linear-gradient(135deg, rgba(255,92,53,0.12), rgba(240,165,0,0.2))',
    marginBottom: '24px',
    border: '1px solid rgba(255, 92, 53, 0.12)',
  },
  heading: {
    fontFamily: 'var(--serif)',
    fontSize: '38px',
    marginBottom: '8px',
  },
  copy: {
    color: 'var(--text-2)',
    maxWidth: '52ch',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))',
    gap: '20px',
  },
  empty: {
    padding: '24px',
    borderRadius: '22px',
    background: 'var(--card-bg)',
    border: '1px solid var(--line)',
    color: 'var(--text-2)',
  },
}

export default function Library() {
  const { error: showError } = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { isMobile, isTabletOrBelow, isWide } = useViewport()
  const [activeTab, setActiveTab] = useState('Albums')
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [songsData, albumsData] = await Promise.all([
          songsService.getAll({ limit: 100 }),
          albumsService.getAll(),
        ])
        if (ignore) return
        setSongs(songsData || [])
        setAlbums(albumsData || [])
      } catch (err) {
        if (ignore) return
        const errorMsg = 'Library data is unavailable right now.'
        setSongs([])
        setAlbums([])
        setError(errorMsg)
        showError(errorMsg)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [showError])

  const artistItems = useMemo(() => {
    const artistMap = new Map()

    songs.forEach((song) => {
      const key = song.artist?.trim()
      if (!key || artistMap.has(key)) return

      artistMap.set(key, {
        title: key,
        artist: 'Artist Collection',
        emoji: song.emoji || 'Artist',
        color: song.color || 'linear-gradient(135deg, #6536d6, #b35fff)',
        coverUrl: song.coverUrl || '',
      })
    })

    return Array.from(artistMap.values()).sort((a, b) => a.title.localeCompare(b.title))
  }, [songs])

  const items = useMemo(() => {
    if (activeTab === 'Albums') return albums
    if (activeTab === 'Artists') return artistItems
    return podcastItems
  }, [activeTab, albums, artistItems])

  const pageVariantsWithAccessibility = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : pageVariants

  return (
    <motion.div
      style={{ ...styles.page, padding: isMobile ? '16px' : isTabletOrBelow ? '20px' : styles.page.padding, width: '100%', maxWidth: isWide ? '1500px' : '100%', marginInline: 'auto' }}
      className="scrollbar-hidden"
      variants={pageVariantsWithAccessibility}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            style={{
              ...styles.tab,
              background: activeTab === tab ? 'var(--active-bg)' : 'transparent',
              color: activeTab === tab ? 'var(--active-text)' : 'var(--text-2)',
              border: activeTab === tab ? '1px solid rgba(255, 122, 0, 0.26)' : '1px solid transparent',
              width: isMobile ? '100%' : 'auto',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section style={{ ...styles.hero, padding: isMobile ? '20px' : styles.hero.padding, borderRadius: isMobile ? '24px' : styles.hero.borderRadius }}>
        <h1 style={{ ...styles.heading, fontSize: isMobile ? '28px' : styles.heading.fontSize }}>Your {activeTab.toLowerCase()}</h1>
        <p style={styles.copy}>
          Everything you have saved lives here. Flip between albums, artists, and podcasts without losing the calm, editorial feel of the space.
        </p>
      </section>

      {loading ? (
        <Loader />
      ) : error ? (
        <div style={styles.empty}>{error}</div>
      ) : items.length ? (
        <div style={{ ...styles.grid, gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '132px' : isWide ? '180px' : '144px'}, 1fr))` }}>
          {items.map((item, index) => (
            <AlbumCard key={`${item.title}-${index}`} album={item} />
          ))}
        </div>
      ) : (
        <div style={styles.empty}>No data is available for this section yet.</div>
      )}
    </motion.div>
  )
}
