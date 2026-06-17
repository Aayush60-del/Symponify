import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useViewport from '../hooks/useViewport'
import CoverArt from './CoverArt'
import { useReducedMotion } from '../lib/animation-utils'

const Icon = ({ name, size = 20, style: extraStyle }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...extraStyle }}>{name}</span>
)

export default function AlbumCard({ album, onSelect, active = false, onOpen }) {
  const navigate = useNavigate()
  const { isMobile, isWide } = useViewport()
  const prefersReducedMotion = useReducedMotion()

  const handleClick = () => {
    if (onSelect) {
      onSelect(album)
      return
    }

    if (onOpen) {
      onOpen(album)
      return
    }

    navigate(`/home/search?q=${encodeURIComponent(album.title)}`)
  }

  const hoverVariants = prefersReducedMotion ? {} : {
    hover: {
      y: -6,
      scale: 1.02,
      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <motion.button
      type="button"
      style={{
        ...styles.card,
        opacity: active ? 1 : 0.96,
        padding: isMobile ? '10px' : '14px',
        gap: isWide ? '0.5rem' : styles.card.gap,
        background: active ? 'var(--surface-elevated)' : 'var(--card-bg)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--line)',
        borderRadius: '24px',
        boxShadow: active ? '0 16px 34px rgba(255, 85, 0, 0.18)' : 'var(--shadow-soft)',
      }}
      onClick={handleClick}
      whileHover="hover"
      variants={hoverVariants}
      initial="initial"
    >
      <div style={styles.artContainer}>
        <CoverArt
          src={album.coverUrl}
          alt={`${album.title} cover`}
          containerStyle={{
            ...styles.art,
            background: album.coverUrl ? 'var(--surface-2)' : album.color || 'linear-gradient(135deg, #333, #666)',
            outline: active ? '3px solid var(--accent)' : 'none',
            fontSize: isMobile ? '34px' : isWide ? '46px' : styles.art.fontSize,
          }}
          imgStyle={styles.image}
          fallback={album.emoji || <Icon name="music_note" size={32} />}
        />
        <motion.div 
          style={styles.playOverlay}
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.2 } }
          }}
        >
          <div style={styles.playButton}>
            <Icon name="play_arrow" size={28} />
          </div>
        </motion.div>
      </div>
      <div style={styles.title}>{album.title}</div>
      <div style={styles.artist}>{album.artist || 'Symponify Radio'}</div>
    </motion.button>
  )
}

const styles = {
  card: {
    width: '100%',
    minWidth: 0,
    textAlign: 'left',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  art: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '20px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '42px',
    marginBottom: '12px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    position: 'relative',
  },
  artContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '20px',
    display: 'grid',
    placeItems: 'center',
    zIndex: 2,
  },
  playButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'var(--accent-gradient)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 8px 24px rgba(255, 122, 0, 0.36)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    lineHeight: 1.3,
  },
  artist: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    lineHeight: 1.4,
  },
}
