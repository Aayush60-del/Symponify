import { useEffect, useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'
import CoverArt from './CoverArt'

const Icon = ({ name, size = 20, style: extraStyle, fill = false }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0", ...extraStyle }}>{name}</span>
)

const formatSeconds = (value) => {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const styles = {
  bar: {
    gridColumn: '2 / 3',
    display: 'grid',
    gridTemplateColumns: '260px minmax(0, 1fr) 180px',
    alignItems: 'center',
    gap: '20px',
    padding: '18px 24px',
    borderRadius: '28px',
    background: 'var(--player-bg)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow)',
    backdropFilter: 'blur(12px)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
    flexWrap: 'wrap',
  },
  cover: {
    width: '58px',
    height: '58px',
    borderRadius: '18px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '22px',
    color: '#fff',
    flexShrink: 0,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
  },
  artist: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
  },
  iconButton: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--text-2)',
    flexShrink: 0,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
    width: '100%',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  play: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: 'var(--accent-gradient)',
    color: '#fff',
    cursor: 'pointer',
  },
  progressRow: {
    display: 'grid',
    gridTemplateColumns: '40px minmax(0, 1fr) 40px',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  time: {
    fontSize: '11px',
    fontFamily: 'var(--mono)',
    color: 'var(--text-3)',
  },
  progressRange: {
    '--progress': '0%',
    width: '100%',
    height: '12px',
    borderRadius: '999px',
    outline: 'none',
    background: 'linear-gradient(to right, var(--accent) 0%, var(--accent-2) var(--progress), var(--surface-3) var(--progress), var(--surface-3) 100%)',
    cursor: 'pointer',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  volume: {
    width: '110px',
    minWidth: 0,
    '--volume': '70%',
  },
}

export default function PlayerBar() {
  const { isCompact, isMobile, isTabletOrBelow } = useViewport()
  const {
    currentTrack,
    isPlaying,
    liked,
    shuffle,
    repeatMode,
    progress,
    progressPercent,
    duration,
    durationLabel,
    playbackError,
    seek,
    volume,
    setVolume,
    toggleLike,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeatMode,
  } = usePlayer()
  const [isDragging, setIsDragging] = useState(false)
  const [dragPercent, setDragPercent] = useState(0)
  const track = currentTrack || {
    title: 'Pick a song',
    artist: 'Symponify',
    duration: '0:00',
    emoji: null,
    color: 'linear-gradient(135deg, #ff5c35, #f0a500)',
  }
  const activeProgressPercent = isDragging ? dragPercent : progressPercent
  const activeProgressTime = isDragging ? (dragPercent / 100) * duration : progress

  useEffect(() => {
    if (!isDragging) {
      setDragPercent(progressPercent)
    }
  }, [isDragging, progressPercent])

  const handleSeekInput = (event) => {
    setIsDragging(true)
    setDragPercent(Number(event.target.value))
  }

  const handleSeekCommit = (event) => {
    const nextPercent = Number(event.target.value)
    setDragPercent(nextPercent)
    setIsDragging(false)
    if (!duration) return
    seek((nextPercent / 100) * duration)
  }

  const computedStyles = {
    bar: {
      ...styles.bar,
      gridColumn: isCompact ? 'auto' : styles.bar.gridColumn,
      position: isCompact ? 'fixed' : 'relative',
      left: isCompact ? '12px' : 'auto',
      right: isCompact ? '12px' : 'auto',
      bottom: isCompact ? '12px' : 'auto',
      width: isCompact ? 'calc(100vw - 24px)' : 'auto',
      zIndex: isCompact ? 45 : 'auto',
      display: isCompact ? 'flex' : 'grid',
      flexDirection: isCompact ? 'column' : undefined,
      gridTemplateColumns: isCompact ? undefined : styles.bar.gridTemplateColumns,
      gap: isCompact ? (isMobile ? '8px' : '12px') : styles.bar.gap,
      padding: isMobile ? '10px' : isTabletOrBelow ? '16px' : styles.bar.padding,
      borderRadius: isMobile ? '16px' : isTabletOrBelow ? '22px' : styles.bar.borderRadius,
      alignItems: isCompact ? 'stretch' : styles.bar.alignItems,
      minWidth: 0,
      boxSizing: 'border-box',
    },
    left: {
      ...styles.left,
      justifyContent: isTabletOrBelow ? 'space-between' : 'flex-start',
      gap: isMobile ? '10px' : isTabletOrBelow ? '12px' : styles.left.gap,
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      minWidth: 0,
    },
    center: {
      ...styles.center,
      alignItems: 'stretch',
      width: '100%',
      minWidth: 0,
    },
    controls: {
      ...styles.controls,
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: isMobile ? '8px' : styles.controls.gap,
    },
    progressRow: {
      ...styles.progressRow,
      gridTemplateColumns: isTabletOrBelow ? '44px minmax(0, 1fr) 44px' : styles.progressRow.gridTemplateColumns,
      gap: isMobile ? '6px' : isTabletOrBelow ? '8px' : styles.progressRow.gap,
    },
    progressRange: {
      ...styles.progressRange,
      '--progress': `${activeProgressPercent}%`,
    },
    right: {
      ...styles.right,
      justifyContent: isCompact ? 'space-between' : styles.right.justifyContent,
      width: isCompact ? '100%' : 'auto',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      minWidth: 0,
      gap: isMobile ? '8px' : styles.right.gap,
    },
    leftMeta: {
      minWidth: 0,
      flex: 1,
    },
    volume: {
      ...styles.volume,
      '--volume': `${volume}%`,
      width: isMobile ? '100%' : isTabletOrBelow ? '100%' : styles.volume.width,
      flex: isCompact ? 1 : 'unset',
    },
  }

  return (
    <footer style={computedStyles.bar}>
      <div style={computedStyles.left}>
        <CoverArt
          src={track.coverUrl}
          alt={`${track.title} cover`}
          containerStyle={{
            ...styles.cover,
            width: isMobile ? '42px' : styles.cover.width,
            height: isMobile ? '42px' : styles.cover.height,
            borderRadius: isMobile ? '12px' : styles.cover.borderRadius,
            background: track.coverUrl ? 'var(--surface-2)' : track.color || 'linear-gradient(135deg, #ff5c35, #f0a500)',
          }}
          imgStyle={styles.coverImage}
          fallback={track.emoji || <Icon name="play_arrow" size={isMobile ? 20 : 24} />}
        />
        <div style={computedStyles.leftMeta}>
          <div style={{ ...styles.title, fontSize: isMobile ? '13px' : styles.title.fontSize }}>{track.title}</div>
          <div style={{ ...styles.artist, marginTop: isMobile ? '2px' : styles.artist.marginTop }}>{track.artist}</div>
          {playbackError ? <div style={{ ...styles.artist, color: '#c54d2b' }}>{playbackError}</div> : null}
        </div>
        <button style={{ ...styles.iconButton, width: isMobile ? '34px' : styles.iconButton.width, height: isMobile ? '34px' : styles.iconButton.height, color: liked ? '#c9184a' : 'var(--text-2)' }} onClick={() => toggleLike(track)} aria-label="Like current track">
          <Icon name="favorite" fill={liked} />
        </button>
      </div>

      <div style={computedStyles.center}>
        <div style={computedStyles.controls}>
          <button style={{ ...styles.iconButton, width: isMobile ? '32px' : styles.iconButton.width, height: isMobile ? '32px' : styles.iconButton.height, color: shuffle ? 'var(--accent)' : styles.iconButton.color }} aria-label="Shuffle" onClick={toggleShuffle}>
            <Icon name="shuffle" />
          </button>
          <button style={{ ...styles.iconButton, width: isMobile ? '32px' : styles.iconButton.width, height: isMobile ? '32px' : styles.iconButton.height }} aria-label="Previous track" onClick={playPrevious}>
            <Icon name="skip_previous" />
          </button>
          <button style={{ ...styles.play, width: isMobile ? '40px' : styles.play.width, height: isMobile ? '40px' : styles.play.height }} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Icon name="pause" size={isMobile ? 20 : 24} /> : <Icon name="play_arrow" size={isMobile ? 20 : 24} />}
          </button>
          <button style={{ ...styles.iconButton, width: isMobile ? '32px' : styles.iconButton.width, height: isMobile ? '32px' : styles.iconButton.height }} aria-label="Next track" onClick={playNext}>
            <Icon name="skip_next" />
          </button>
          <button
            style={{ ...styles.iconButton, width: isMobile ? '32px' : styles.iconButton.width, height: isMobile ? '32px' : styles.iconButton.height, color: repeatMode === 'off' ? styles.iconButton.color : 'var(--accent)' }}
            aria-label={`Repeat mode ${repeatMode}`}
            onClick={cycleRepeatMode}
          >
            <Icon name="repeat" />
          </button>
        </div>
        <div style={computedStyles.progressRow}>
          <span style={{ ...styles.time, fontSize: isMobile ? '10px' : styles.time.fontSize }}>{formatSeconds(activeProgressTime)}</span>
          <input
            className="player-progress"
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={activeProgressPercent}
            style={computedStyles.progressRange}
            onInput={handleSeekInput}
            onChange={handleSeekCommit}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            aria-label="Song progress"
          />
          <span style={{ ...styles.time, fontSize: isMobile ? '10px' : styles.time.fontSize }}>{durationLabel || track.duration || formatSeconds(duration)}</span>
        </div>
      </div>

      <div style={computedStyles.right}>
        <Icon name="volume_up" size={isMobile ? 18 : 20} style={{ flexShrink: 0, color: 'var(--text-2)' }} />
        <input className="player-volume" type="range" min="0" max="100" value={volume} style={computedStyles.volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" />
      </div>
    </footer>
  )
}
