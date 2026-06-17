import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'
import { listItemVariants, hoverYVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import CoverArt from './CoverArt'

const Icon = ({ name, size = 18, style: extraStyle, fill = false }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0", ...extraStyle }}>{name}</span>
)

export default function SongRow({ song, index, onPlay }) {
  const navigate = useNavigate()
  const { currentTrack, isLiked, isPlaying, playSong, toggleLike } = usePlayer()
  const { isXs, isMobile, isTabletOrBelow } = useViewport()
  const prefersReducedMotion = useReducedMotion()
  const active = currentTrack?._id === song._id
  const liked = isLiked(song._id)
  const rowStyle = {
    ...styles.row,
    background: active ? 'var(--accent-soft)' : 'var(--row-bg)',
    borderColor: active ? 'rgba(255, 122, 0, 0.28)' : 'var(--line)',
    boxShadow: active ? '0 12px 28px rgba(255, 85, 0, 0.12)' : 'var(--shadow-soft)',
    gridTemplateColumns: isMobile ? 'auto minmax(0, 1fr) auto' : isTabletOrBelow ? '32px 52px minmax(0, 1fr) 72px 40px 40px' : styles.row.gridTemplateColumns,
    gridTemplateRows: isMobile ? 'auto auto' : 'auto',
    gap: isMobile ? '10px 12px' : styles.row.gap,
    alignItems: isMobile ? 'flex-start' : styles.row.alignItems,
    padding: isXs ? '10px' : isMobile ? '12px' : styles.row.padding,
    minWidth: 0,
  }

  const itemVariants = prefersReducedMotion
    ? { hidden: {}, visible: {}, hover: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
        hover: { y: -2, backgroundColor: 'var(--row-hover)', transition: { duration: 0.2 } },
      }

  return (
    <motion.div
      style={rowStyle}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={!prefersReducedMotion ? 'hover' : undefined}
      onClick={() => (onPlay ? onPlay(song) : playSong(song))}
    >
      {!isMobile ? <div style={styles.index}>{active && isPlaying ? <Icon name="volume_up" size={16} /> : String(index).padStart(2, '0')}</div> : null}
      <CoverArt
        src={song.coverUrl}
        alt={`${song.title} cover`}
        containerStyle={{ ...styles.cover, background: song.coverUrl ? 'var(--surface-2)' : song.color || 'var(--surface-2)', gridRow: isMobile ? '1 / span 2' : 'auto' }}
        imgStyle={styles.coverImage}
        fallback={song.emoji || <Icon name="play_arrow" size={24} />}
      />
      <div style={{ ...styles.info, gridColumn: isMobile ? '2 / 3' : 'auto' }}>
        <div style={{ ...styles.title, color: active ? 'var(--accent)' : 'var(--text)' }}>{song.title}</div>
        <div style={{ ...styles.sub, whiteSpace: isMobile ? 'normal' : styles.sub.whiteSpace }}>{song.subtitle || `${song.artist} - ${song.duration || '3:20'}`}</div>
      </div>
      <div style={{ ...styles.meta, gridColumn: isMobile ? '2 / 3' : 'auto', justifySelf: isMobile ? 'start' : styles.meta.justifySelf }}>
        {song.duration || song.genre || '3:20'}
      </div>
      <motion.button
        type="button"
        style={{ ...styles.iconButton, color: 'var(--text-3)', gridColumn: isMobile ? '3 / 4' : 'auto', gridRow: isMobile ? '2 / 3' : 'auto', justifySelf: isMobile ? 'end' : 'auto' }}
        aria-label={`View Lyrics for ${song.title}`}
        whileHover={!prefersReducedMotion ? { scale: 1.15, color: 'var(--accent)' } : undefined}
        whileTap={!prefersReducedMotion ? { scale: 0.92 } : undefined}
        onClick={(event) => {
          event.stopPropagation()
          if (!active) playSong(song)
          navigate('/home/lyrics')
        }}
      >
        <Icon name="headphones" size={20} />
      </motion.button>
      <motion.button
        type="button"
        style={{ ...styles.iconButton, color: liked ? '#c9184a' : 'var(--text-3)', gridColumn: isMobile ? '3 / 4' : 'auto', gridRow: isMobile ? '1 / 2' : 'auto', justifySelf: isMobile ? 'end' : 'auto' }}
        aria-label={`Like ${song.title}`}
        whileHover={!prefersReducedMotion ? { scale: 1.15 } : undefined}
        whileTap={!prefersReducedMotion ? { scale: 0.92 } : undefined}
        onClick={(event) => {
          event.stopPropagation()
          toggleLike(song)
        }}
      >
        <Icon name="favorite" fill={liked} size={20} />
      </motion.button>
    </motion.div>
  )
}

const styles = {
  row: {
    display: 'grid',
    gridTemplateColumns: '40px 52px minmax(0, 1fr) 90px 40px 40px',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 14px',
    borderRadius: '18px',
    border: '1px solid var(--line)',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
  },
  index: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--text-3)',
    display: 'grid',
    placeItems: 'center',
  },
  cover: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '18px',
    color: '#fff',
    overflow: 'hidden',
    flexShrink: 0,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  info: {
    minWidth: 0,
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
  },
  sub: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
  },
  meta: {
    justifySelf: 'end',
    fontSize: '12px',
    color: 'var(--text-2)',
    minWidth: 0,
  },
  iconButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'transparent',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    transition: 'color 0.2s ease',
  },
}
