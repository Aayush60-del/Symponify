import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const testimonials = [
  { quote: "The player is genuinely beautiful. I switched from Spotify just to use Symponify's UI for my local collection.", name: 'Aisha K.', role: 'Music producer, Mumbai', initials: 'AK', color: 'linear-gradient(135deg, #ff5c35, #ff8c6a)' },
  { quote: "Finding the right song is effortless. The catalog feels polished and easy to explore every time.", name: 'Rohan M.', role: 'Indie band vocalist, Delhi', initials: 'RM', color: 'linear-gradient(135deg, #0f3554, #3f88c5)' },
  { quote: "Finally a streaming app that doesn't fight my workflow. The search and library features are exactly right.", name: 'Priya T.', role: 'Podcast editor, Bangalore', initials: 'PT', color: 'linear-gradient(135deg, #4b2f18, #b67339)' },
  { quote: "Guest access was huge for us — we demo our music catalog without forcing sign-ups. Love the waveform visualizer.", name: 'Carlos V.', role: 'DJ, Goa', initials: 'CV', color: 'linear-gradient(135deg, #190e2e, #7b2d8b)' },
  { quote: "The listener experience is clean, curated, and fast — exactly what our audience wanted.", name: 'Neha S.', role: 'Label manager, Pune', initials: 'NS', color: 'linear-gradient(135deg, #1a3a1a, #2e7d32)' },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  // Horizontal scroll drift for the card columns
  const col1Y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const col2Y = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const col3Y = useTransform(scrollYProgress, [0, 1], [80, -80])

  // Split into 3 columns for masonry feel
  const col1 = testimonials.filter((_, i) => i % 3 === 0)
  const col2 = testimonials.filter((_, i) => i % 3 === 1)
  const col3 = testimonials.filter((_, i) => i % 3 === 2)

  return (
    <section id="testimonials" ref={sectionRef} className="py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.15em] mb-4 px-4 py-1.5 rounded-full"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            Loved by listeners
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Real people. Real music.{' '}
            <em>Real love.</em>
          </motion.h2>
        </div>

        {/* Parallax 3-column masonry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          <motion.div style={{ y: col1Y }} className="flex flex-col gap-5">
            {col1.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 0.1} />)}
          </motion.div>
          <motion.div style={{ y: col2Y }} className="flex flex-col gap-5 sm:mt-10">
            {col2.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 0.1 + 0.05} />)}
          </motion.div>
          <motion.div style={{ y: col3Y }} className="flex flex-col gap-5">
            {col3.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 0.1 + 0.1} />)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ t, delay }: { t: typeof testimonials[0], delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02, boxShadow: '0 24px 60px rgba(31,23,9,0.12)' }}
      className="rounded-[24px] p-6"
      style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid var(--line)', cursor: 'pointer' }}
    >
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, j) => (
          <motion.svg
            key={j}
            width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-2)"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + j * 0.06, type: 'spring', stiffness: 300 }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </motion.svg>
        ))}
      </div>
      <blockquote className="text-base leading-relaxed mb-5" style={{ color: 'var(--text)', fontStyle: 'italic' }}>
        "{t.quote}"
      </blockquote>
      <div className="flex items-center gap-3">
        <motion.div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: t.color }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {t.initials}
        </motion.div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>{t.role}</p>
        </div>
      </div>
    </motion.div>
  )
}