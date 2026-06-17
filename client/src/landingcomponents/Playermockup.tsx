import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Waveform from './Waveform'

const SONGS = [
  { title: 'Midnight Echoes', artist: 'The Neon Dreams', album: 'Synthwave Vol. 3', duration: '3:42', color: 'linear-gradient(140deg, #190e2e, #43316b 60%, #ff5c35)' },
  { title: 'Summer Stage', artist: 'Priya & The Wave', album: 'Live at Horizon', duration: '4:15', color: 'linear-gradient(140deg, #0f3554, #3f88c5)' },
  { title: 'Acoustic Sessions', artist: 'Milo Adler', album: 'Unplugged', duration: '2:58', color: 'linear-gradient(140deg, #4b2f18, #b67339)' },
]

export default function PlayerMockup() {
  const [playing, setPlaying] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [progress, setProgress] = useState(34)
  const song = SONGS[currentIdx]

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.5)), 300)
    return () => clearInterval(t)
  }, [playing])

  const next = () => { setCurrentIdx((i) => (i + 1) % SONGS.length); setProgress(0) }
  const prev = () => { setCurrentIdx((i) => (i - 1 + SONGS.length) % SONGS.length); setProgress(0) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[32px] overflow-hidden select-none"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--line)',
        boxShadow: '0 32px 80px rgba(31,23,9,0.14)',
        maxWidth: 420,
        width: '100%',
      }}
    >
      {/* Album art area */}
      <div className="relative overflow-hidden" style={{ height: 220, background: song.color }}>
        {/* Vinyl record */}
        <motion.div
          className={playing ? 'vinyl-spin' : ''}
          style={{
            position: 'absolute',
            right: -30,
            top: '50%',
            translateY: '-50%',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, #1a1a18 20%, #2d2d2b 40%, #1a1a18 55%, #333 70%, #1a1a18 85%)',
            boxShadow: '0 0 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{
            position: 'absolute', inset: '50%', transform: 'translate(-50%, -50%)',
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          }} />
          <div style={{
            position: 'absolute', inset: '50%', transform: 'translate(-50%, -50%)',
            width: 12, height: 12, borderRadius: '50%', background: '#1a1a18'
          }} />
        </motion.div>

        {/* Song info overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}>
          <span className="mb-1 font-mono text-xs tracking-wider uppercase text-white/60">{song.album}</span>
          <h3 className="text-xl font-bold leading-tight text-white">{song.title}</h3>
          <p className="text-white/75 text-sm mt-0.5">{song.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-5">
        {/* Waveform */}
        <div className="mb-4">
          <Waveform barCount={40} height={48} playing={playing} color="var(--accent)" />
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
            {formatTime((progress / 100) * 222)}
          </span>
          <div
            className="relative flex-1 h-1 overflow-hidden rounded-full cursor-pointer"
            style={{ background: 'var(--surface-3)' }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', width: `${progress}%` }}
              transition={{ duration: 0 }}
            />
          </div>
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
            {song.duration}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button className="p-2 transition-colors rounded-full hover:bg-black/5" onClick={prev} aria-label="Previous">
            <SkipBackIcon />
          </button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setPlaying((v) => !v)}
            className="flex items-center justify-center text-white rounded-full w-14 h-14"
            style={{ background: 'linear-gradient(135deg, var(--accent), #e04a25)', boxShadow: '0 8px 24px rgba(255,92,53,0.4)' }}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </motion.button>

          <button className="p-2 transition-colors rounded-full hover:bg-black/5" onClick={next} aria-label="Next">
            <SkipForwardIcon />
          </button>
        </div>

        {/* Queue preview */}
        <div className="flex flex-col gap-2 pt-4 mt-4" style={{ borderTop: '1px solid var(--line)' }}>
          <p className="mb-1 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-3)' }}>Up next</p>
          {SONGS.filter((_, i) => i !== currentIdx).map((s, i) => (
            <div key={s.title} className="flex items-center gap-3 py-1">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl" style={{ background: s.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{s.title}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{s.artist}</p>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{s.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function PlayIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
}
function PauseIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
}
function SkipBackIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
}
function SkipForwardIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
}