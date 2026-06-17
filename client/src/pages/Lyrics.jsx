import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext'
import { mockLyrics } from '../lib/mockLyrics'
import CoverArt from '../components/CoverArt'

export default function Lyrics() {
  const { currentTrack, isPlaying, progress } = usePlayer()
  const scrollRef = useRef(null)
  
  // Find current active lyric line
  const activeLineIndex = mockLyrics.reduce((acc, lyric, index) => {
    if (progress >= lyric.time) return index
    return acc
  }, 0)

  useEffect(() => {
    // Scroll active line into view smoothly
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [activeLineIndex])

  if (!currentTrack) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>Play a song to see synced lyrics!</div>
      </div>
    )
  }

  return (
    <div style={styles.container} className="scrollbar-hidden">
      {/* Blurred background cover art */}
      <div style={styles.bgWrapper}>
        <img src={currentTrack.coverUrl} alt="Background" style={styles.bgImage} />
        <div style={styles.bgOverlay} />
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <CoverArt
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            containerStyle={styles.cover}
            imgStyle={styles.coverImage}
            fallback={currentTrack.emoji}
          />
          <div style={styles.info}>
            <h1 style={styles.title}>{currentTrack.title}</h1>
            <p style={styles.artist}>{currentTrack.artist}</p>
          </div>
        </div>

        <div style={styles.lyricsContainer} ref={scrollRef} className="scrollbar-hidden">
          {mockLyrics.map((lyric, index) => {
            const isActive = index === activeLineIndex
            const isPassed = index < activeLineIndex

            return (
              <motion.div
                key={index}
                data-active={isActive}
                style={{
                  ...styles.line,
                  color: isActive ? '#fff' : isPassed ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  fontWeight: isActive ? 800 : 700,
                }}
                animate={{
                  color: isActive ? '#fff' : isPassed ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                  scale: isActive ? 1.05 : 1,
                  filter: isActive ? 'blur(0px)' : 'blur(1px)'
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {lyric.text}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '24px',
    background: '#1a1a18',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '20px',
    fontWeight: 700,
  },
  bgWrapper: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    overflow: 'hidden',
    borderRadius: '24px',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(60px) saturate(2)',
    transform: 'scale(1.2)',
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '40px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '40px',
  },
  cover: {
    width: '100px',
    height: '100px',
    borderRadius: '20px',
    flexShrink: 0,
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    display: 'grid',
    placeItems: 'center',
    fontSize: '32px',
    background: 'var(--surface-2)'
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: '8px',
  },
  artist: {
    fontSize: '20px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
  },
  lyricsContainer: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '50vh',
    scrollBehavior: 'smooth',
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)',
  },
  line: {
    fontSize: 'clamp(24px, 4vw, 42px)',
    lineHeight: 1.4,
    marginBottom: '24px',
    transformOrigin: 'left center',
    cursor: 'pointer',
    width: 'fit-content',
  }
}
