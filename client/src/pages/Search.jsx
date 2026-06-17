import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { songsService, albumsService } from '../lib/services'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import AlbumCard from '../components/AlbumCard'
import SongRow from '../components/SongRow'
import Loader from '../components/Loader'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const genrePills = ['All', 'Pop', 'Jazz', 'Electronic', 'Chill']

const styles = {
  page: {
    padding: '24px',
    overflowY: 'auto',
    height: '100%',
    minWidth: 0,
  },
  top: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '18px',
    marginBottom: '28px',
  },
  searchBox: {
    padding: '18px 22px',
    borderRadius: '24px',
    background: 'var(--surface)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow)',
  },
  searchInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text)',
    fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)',
    fontWeight: 700,
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '18px',
  },
  pill: {
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  topResult: {
    borderRadius: '28px',
    padding: '24px',
    background: 'linear-gradient(140deg, #15122b, #382757 60%, #ff5c35)',
    color: '#fff',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBadge: {
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.74)',
    fontWeight: 700,
  },
  topResultButton: {
    background: 'transparent',
    color: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
    fontWeight: 800,
    marginBottom: '14px',
  },
  albumGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))',
    gap: '18px',
    marginBottom: '30px',
  },
  empty: {
    padding: '24px',
    borderRadius: '22px',
    background: 'var(--card-bg)',
    border: '1px solid var(--line)',
    color: 'var(--text-2)',
  },
}

export default function Search() {
  const { playSong } = usePlayer()
  const { error: showError } = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { isXs, isMobile, isTabletOrBelow, isCompact, isWide } = useViewport()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('q') || '')
  const [genre, setGenre] = useState(() => searchParams.get('genre') || 'All')
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setSearch(searchParams.get('q') || '')
    setGenre(searchParams.get('genre') || 'All')
  }, [searchParams])

  useEffect(() => {
    let ignore = false

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [songsData, albumsData] = await Promise.all([
          songsService.searchSongs(search, genre),
          albumsService.getAll(),
        ])
        if (ignore) return
        setSongs(songsData || [])
        setAlbums(albumsData || [])
      } catch (err) {
        if (ignore) return
        const errorMsg = 'Search is unavailable right now.'
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
  }, [genre, search, showError])

  const topResult = useMemo(() => songs[0], [songs])
  const visibleAlbums = useMemo(() => {
    if (!albums.length) return []
    if (genre === 'All' && !search.trim()) return albums

    const songAlbumTitles = new Set(songs.map((song) => song.album?.trim()).filter(Boolean))
    return albums.filter((album) => {
      if (songAlbumTitles.has(album.title)) return true
      if (!search.trim()) return false

      const query = search.trim().toLowerCase()
      return album.title.toLowerCase().includes(query) || (album.artist || '').toLowerCase().includes(query)
    })
  }, [albums, genre, search, songs])

  const updateSearch = (value) => {
    setSearch(value)
    const nextParams = new URLSearchParams(searchParams)

    if (value.trim()) {
      nextParams.set('q', value.trim())
    } else {
      nextParams.delete('q')
    }

    setSearchParams(nextParams, { replace: true })
  }

  const updateGenre = (value) => {
    setGenre(value)
    const nextParams = new URLSearchParams(searchParams)

    if (value !== 'All') {
      nextParams.set('genre', value)
    } else {
      nextParams.delete('genre')
    }

    setSearchParams(nextParams, { replace: true })
  }

  const pageVariantsWithAccessibility = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : pageVariants

  return (
    <motion.div
      style={{ ...styles.page, padding: isXs ? '12px' : isMobile ? '14px' : isTabletOrBelow ? '18px' : styles.page.padding, width: '100%', maxWidth: isWide ? '1500px' : '100%', marginInline: 'auto' }}
      className="scrollbar-hidden"
      variants={pageVariantsWithAccessibility}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div style={{ ...styles.top, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : styles.top.gridTemplateColumns, gap: isMobile ? '12px' : styles.top.gap }}>
        <section style={{ ...styles.searchBox, padding: isMobile ? '16px' : styles.searchBox.padding }}>
          <input
            style={{ ...styles.searchInput, fontSize: isXs ? '18px' : isMobile ? '20px' : styles.searchInput.fontSize }}
            placeholder="Search for songs, albums, artists"
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
          />
          <div style={styles.pillRow}>
            {genrePills.map((item) => (
              <button
                key={item}
                type="button"
                style={{
                  ...styles.pill,
                  background: genre === item ? 'var(--active-bg)' : 'var(--surface-2)',
                  color: genre === item ? 'var(--active-text)' : 'var(--text-2)',
                  border: genre === item ? '1px solid rgba(255, 122, 0, 0.26)' : '1px solid var(--line)',
                }}
                onClick={() => updateGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...styles.topResult, minHeight: isMobile ? '180px' : styles.topResult.minHeight, padding: isMobile ? '20px' : styles.topResult.padding }}>
          <span style={styles.topBadge}>Top result</span>
          {topResult ? (
            <button type="button" style={styles.topResultButton} onClick={() => playSong(topResult, songs)}>
              <div style={{ fontSize: isMobile ? '40px' : '48px', marginBottom: '12px' }}>{topResult.emoji || 'Music'}</div>
              <h2 style={{ fontSize: isMobile ? '26px' : '32px', marginBottom: '8px', wordBreak: 'break-word' }}>{topResult.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)' }}>
                {topResult.artist} | {topResult.album || 'Single'}
              </p>
            </button>
          ) : (
            <div>
              <h2 style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '8px' }}>{loading ? 'Loading...' : 'Start typing'}</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)' }}>
                {loading ? 'Fetching songs and albums for you.' : 'Search your library or discover what matches your mood.'}
              </p>
            </div>
          )}
        </section>
      </div>

      <section>
        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '18px' : styles.sectionTitle.fontSize }}>Albums</h2>
        {loading ? (
          <Loader />
        ) : visibleAlbums.length ? (
          <div style={{ ...styles.albumGrid, gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '132px' : isWide ? '180px' : '144px'}, 1fr))` }}>
            {visibleAlbums.map((album, index) => (
              <AlbumCard key={`${album.title}-${index}`} album={album} />
            ))}
          </div>
        ) : (
          <div style={styles.empty}>{error ? error : 'No albums matched your current search.'}</div>
        )}
      </section>

      <section>
        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '18px' : styles.sectionTitle.fontSize }}>Songs</h2>
        {error ? (
          <div style={styles.empty}>{error}</div>
        ) : songs.length ? (
          songs.map((song, index) => (
            <SongRow key={`${song.title}-${index}`} song={song} index={index + 1} onPlay={(selectedSong) => playSong(selectedSong, songs)} />
          ))
        ) : (
          <div style={styles.empty}>{loading ? 'Loading songs...' : 'No songs matched your search.'}</div>
        )}
      </section>
    </motion.div>
  )
}
