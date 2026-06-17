import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { songsService, albumsService } from '../lib/services'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import AlbumCard from '../components/AlbumCard'
import FeaturedCard from '../components/FeaturedCard'
import SongRow from '../components/SongRow'
import Loader from '../components/Loader'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const Icon = ({ name, size = 20, style: extraStyle }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...extraStyle }}>{name}</span>
)

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const featuredItems = [
  {
    title: 'Midnight Echoes',
    description: 'The definitive collection of synth-wave and deep house for late evening focus.',
    badge: 'TRENDING NOW',
    background: 'linear-gradient(140deg, #190e2e, #43316b 60%, #ff5c35)',
    large: true,
  },
  {
    title: 'Summer Stage',
    description: 'Experience the front row with bright live sessions.',
    background: 'linear-gradient(140deg, #0f3554, #3f88c5)',
    genre: 'Pop',
  },
  {
    title: 'Acoustic Sessions',
    description: 'Unplugged textures with soft percussive warmth.',
    background: 'linear-gradient(140deg, #4b2f18, #b67339)',
    genre: 'Chill',
  },
]

const styles = {
  page: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    height: '100%',
    minWidth: 0,
  },
  section: {
    marginBottom: '34px',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 800,
  },
  sectionAction: {
    fontSize: '13px',
    color: 'var(--text-3)',
    background: 'transparent',
    cursor: 'pointer',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.25fr) minmax(220px, 0.75fr)',
    gap: '14px',
  },
  featureSide: {
    display: 'grid',
    gap: '14px',
  },
  albumRow: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '16px',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    minWidth: 0,
  },
  carouselWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--surface-glass-strong)',
    border: '1px solid var(--line)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: 'var(--shadow-soft)',
    color: 'var(--text)',
  },
  helper: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginBottom: '14px',
  },
  empty: {
    padding: '24px',
    borderRadius: '22px',
    background: 'var(--card-bg)',
    border: '1px solid var(--line)',
    color: 'var(--text-2)',
  },
  hero: {
    borderRadius: '32px',
    padding: 'clamp(20px, 4vw, 34px)',
    marginBottom: '30px',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.15fr) minmax(220px, 0.85fr)',
    gap: '18px',
    alignItems: 'center',
  },
  heroEyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 12px',
    borderRadius: '999px',
    color: 'var(--accent)',
    background: 'var(--accent-soft)',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '14px',
  },
  heroTitle: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(2.2rem, 5vw, 4.6rem)',
    lineHeight: 0.96,
    letterSpacing: '-0.04em',
    marginBottom: '14px',
  },
  heroCopy: {
    color: 'var(--text-2)',
    maxWidth: '58ch',
    fontSize: 'clamp(0.98rem, 1.7vw, 1.12rem)',
    lineHeight: 1.7,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '10px',
    marginTop: '22px',
  },
  stat: {
    borderRadius: '18px',
    padding: '14px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 900,
    lineHeight: 1,
  },
  statLabel: {
    marginTop: '8px',
    fontSize: '12px',
    color: 'var(--text-3)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  visualDeck: {
    minHeight: '220px',
    borderRadius: '28px',
    background: 'linear-gradient(145deg, #1b102e, #2c254b 54%, #ff5c35)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 26px 70px rgba(31, 23, 9, 0.18)',
  },
}

export default function Home() {
  const navigate = useNavigate()
  const { playSong, currentTrack } = usePlayer()
  const { error: showError } = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { isXs, isMobile, isTabletOrBelow, isCompact, isWide } = useViewport()
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const carouselRef = useRef(null)

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = isMobile ? 200 : 400
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

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
        setSongs(songsData)
        setAlbums(albumsData)
      } catch (err) {
        if (ignore) return
        const errorMsg = 'Failed to load songs and albums. Please try again.'
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

  const playFeaturedMix = () => {
    if (!songs.length) return
    playSong(songs[0], songs)
  }

  const visibleSongs = useMemo(() => {
    if (!selectedAlbum) return songs
    return songs.filter((song) => song.album === selectedAlbum)
  }, [selectedAlbum, songs])

  const topGenre = useMemo(() => {
    const counts = songs.reduce((acc, song) => {
      const genre = song.genre || 'Mixed'
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts).sort((a, b) => b[1] - a[1])?.[0]?.[0] || 'Mixed'
  }, [songs])

  const heroStats = [
    { value: songs.length || '—', label: 'Tracks' },
    { value: albums.length || '—', label: 'Albums' },
    { value: topGenre, label: 'Top mood' },
  ]

  const handleAlbumSelect = (album) => {
    setSelectedAlbum((prev) => (prev === album.title ? '' : album.title))
  }

  const openFeaturedCollection = (item) => {
    const params = new URLSearchParams()
    if (item.genre) {
      params.set('genre', item.genre)
    }

    navigate(`/home/search${params.toString() ? `?${params.toString()}` : ''}`)
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
      <section className="premium-hero-card gsap-reveal" style={{ ...styles.hero, flexShrink: 0 }}>
        <div style={{ ...styles.heroGrid, gridTemplateColumns: isTabletOrBelow ? 'minmax(0, 1fr)' : styles.heroGrid.gridTemplateColumns }}>
          <div>
            <span style={styles.heroEyebrow}>
              <Icon name="graphic_eq" size={16} /> Live soundspace
            </span>
            <h1 style={styles.heroTitle}>{getGreeting()}, ready for a better mix?</h1>
            <p style={styles.heroCopy}>
              Explore a polished music dashboard with smooth playback, curated albums, responsive visuals, and a cleaner premium interface powered by Framer Motion + GSAP.
            </p>
            <div style={{ ...styles.statGrid, gridTemplateColumns: isMobile ? '1fr' : styles.statGrid.gridTemplateColumns }}>
              {heroStats.map((stat) => (
                <div key={stat.label} className="stat-pill" style={styles.stat}>
                  <div style={{ ...styles.statValue, color: stat.label === 'Top mood' ? 'var(--accent)' : 'var(--text)' }}>{stat.value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.visualDeck}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 22% 18%, rgba(255,255,255,0.35), transparent 20%), radial-gradient(circle at 80% 24%, rgba(240,165,0,0.35), transparent 22%)' }} />
            <div className="vinyl-spin" style={{ position: 'absolute', width: 170, height: 170, borderRadius: '50%', left: '50%', top: '50%', translate: '-50% -50%', background: 'repeating-radial-gradient(circle, #141118 0 8px, #242033 8px 12px)', boxShadow: '0 24px 80px rgba(0,0,0,0.38)' }}>
              <div style={{ position: 'absolute', inset: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', border: '8px solid rgba(255,255,255,0.22)' }} />
            </div>
            <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, padding: 16, borderRadius: 22, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(14px)', color: '#fff' }}>
              <div style={{ fontWeight: 900, fontSize: 15 }}>Now playing</div>
              <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 13, marginTop: 4 }}>{currentTrack?.title || songs[0]?.title || 'Choose your first track'}</div>
              <div style={{ display: 'flex', gap: 4, height: 34, alignItems: 'end', marginTop: 12 }}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <span key={i} className="waveform-bar" style={{ '--dur': `${0.7 + (i % 7) * 0.08}s`, '--delay': `${i * 0.025}s`, width: 4, height: `${8 + ((i * 7) % 24)}px`, borderRadius: 999, background: 'rgba(255,255,255,0.75)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gsap-reveal" style={{ ...styles.section, flexShrink: 0 }}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '8px' : styles.sectionHead.gap }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Featured</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/home/search')}>
            See all
          </button>
        </div>

        <div style={{ ...styles.featureGrid, gridTemplateColumns: isTabletOrBelow ? 'minmax(0, 1fr)' : styles.featureGrid.gridTemplateColumns, gap: isMobile ? '12px' : styles.featureGrid.gap }}>
          <FeaturedCard item={featuredItems[0]} onAction={playFeaturedMix} />
          <div style={{ ...styles.featureSide, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : undefined }}>
            {featuredItems.slice(1).map((item) => (
              <FeaturedCard key={item.title} item={item} onAction={() => openFeaturedCollection(item)} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...styles.section, flexShrink: 0 }}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Recommended for You</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/home/library')}>
            Fresh picks
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : albums.length ? (
          <>
            <p style={styles.helper}>
              {selectedAlbum ? `${selectedAlbum} selected. Click again to clear the filter.` : 'Select an album to view its songs below.'}
            </p>
            <div style={styles.carouselWrap}>
              {!isMobile && (
                <button
                  style={{ ...styles.scrollButton, left: '-20px' }}
                  onClick={() => scrollCarousel('left')}
                  aria-label="Scroll left"
                >
                  <Icon name="chevron_left" size={24} />
                </button>
              )}
              <div
                ref={carouselRef}
                className="scrollbar-hidden"
                style={styles.albumRow}
              >
                {albums.map((album, index) => (
                  <div key={`${album.title}-${index}`} style={{ flex: `0 0 ${isMobile ? '132px' : isWide ? '180px' : '144px'}`, scrollSnapAlign: 'start' }}>
                    <AlbumCard
                      album={album}
                      active={selectedAlbum === album.title}
                      onSelect={handleAlbumSelect}
                    />
                  </div>
                ))}
              </div>
              {!isMobile && (
                <button
                  style={{ ...styles.scrollButton, right: '-20px' }}
                  onClick={() => scrollCarousel('right')}
                  aria-label="Scroll right"
                >
                  <Icon name="chevron_right" size={24} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={styles.empty}>No recommended albums are available yet. Upload songs to start seeing albums here.</div>
        )}
      </section>

      <section style={{ ...styles.section, display: 'flex', flexDirection: 'column', flex: 1, minHeight: isMobile ? 'auto' : '40vh', marginBottom: 0 }}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center', flexShrink: 0, gap: isMobile ? '8px' : styles.sectionHead.gap }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Your Library</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/home/liked')}>
            Recently played
          </button>
        </div>

        <div className="scrollbar-hidden" style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '4px' }}>
          {error ? (
            <div style={styles.empty}>{error}</div>
          ) : visibleSongs.length ? (
            visibleSongs.map((song, index) => (
              <SongRow key={song._id || `${song.title}-${index}`} song={song} index={index + 1} onPlay={(selectedSong) => playSong(selectedSong, visibleSongs)} />
            ))
          ) : (
            <div style={styles.empty}>
              {selectedAlbum ? 'No songs were found for this album yet.' : 'Your library is empty right now. Upload songs from the Add Song page to fill this list.'}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
