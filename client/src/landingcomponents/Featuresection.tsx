import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'

const features = [
  { icon: '🎧', title: 'Immersive Player', desc: 'Silky-smooth player with waveform viz, queue management and keyboard shortcuts — built for audiophiles.', tag: 'Core', color: 'linear-gradient(135deg, #ff5c35, #ff8c6a)' },
  { icon: '📚', title: 'Curated Library', desc: 'Browse a thoughtfully organized catalog with playlists, albums, and featured tracks that feel effortless to explore.', tag: 'Library', color: 'linear-gradient(135deg, #0f3554, #3f88c5)' },
  { icon: '🔍', title: 'Smart Search', desc: 'Find any song, album, or artist instantly. Filter by genre, album, or mood — always the right result.', tag: 'Discovery', color: 'linear-gradient(135deg, #4b2f18, #b67339)' },
  { icon: '❤️', title: 'Liked Songs', desc: 'Heart tracks you love. Your library stays in sync and waits for you on any device.', tag: 'Personal', color: 'linear-gradient(135deg, #190e2e, #7b2d8b)' },
  { icon: '🌐', title: 'Everywhere Access', desc: 'Listen on phone, tablet, or desktop. Your queue and favorites follow you across all devices.', tag: 'Sync', color: 'linear-gradient(135deg, #1a3a1a, #2e7d32)' },
  { icon: '⚡', title: 'Lightning Fast', desc: 'Stream without buffering. Instant playback and smooth navigation across the entire app.', tag: 'Speed', color: 'linear-gradient(135deg, #3a1a1a, #c62828)' },
]

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95])

  return (
    <section id="features" ref={sectionRef} className="py-28 px-4 relative overflow-hidden">
      {/* Scroll-zoom background blob */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div style={{ width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,165,0,0.06) 0%, transparent 70%)' }} />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={titleInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block text-xs font-bold uppercase tracking-[0.15em] mb-4 px-4 py-1.5 rounded-full"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            Everything you need
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4"
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Built for music lovers,{' '}
            <motion.em
              initial={{ opacity: 0, x: -20 }}
              animate={titleInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              by music lovers.
            </motion.em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-2)' }}
          >
            Every feature was designed to get out of the way and let you enjoy the music.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature: f, index: i }: { feature: typeof features[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.88, rotateY: -8 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, rotateY: 0 } : {}}
      transition={{ delay: i * 0.09, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02, rotateY: 2 }}
      whileTap={{ scale: 0.97 }}
      className="relative rounded-[28px] p-6 overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--line)',
        transformStyle: 'preserve-3d',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Shine sweep on hover */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '200%', opacity: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
        style={{ background: f.color }}
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {f.icon}
      </motion.div>

      <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
        style={{ background: 'var(--surface-3)', color: 'var(--text-3)' }}>
        {f.tag}
      </span>

      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{f.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{f.desc}</p>
    </motion.div>
  )
}