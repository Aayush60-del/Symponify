import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Jump in instantly',
    desc: 'Create a free account or browse as a guest with zero friction. Start listening immediately without waiting.',
    detail: 'No credit card, no paywall — just a polished onboarding flow that keeps people engaged.',
    color: 'linear-gradient(135deg, var(--accent), #e04a25)',
  },
  {
    num: '02',
    title: 'Browse curated playlists',
    desc: 'Explore a hand-picked music catalog designed for discovery and mood-based listening.',
    detail: 'Content is organized so listeners can find the right track without friction.',
    color: 'linear-gradient(135deg, #0f3554, #3f88c5)',
  },
  {
    num: '03',
    title: 'Discover your music',
    desc: 'Search by track, album, artist, or mood and find the perfect song in seconds.',
    detail: 'Smart filters and curated recommendations make your catalog feel premium.',
    color: 'linear-gradient(135deg, #4b2f18, #b67339)',
  },
  {
    num: '04',
    title: 'Enjoy anytime',
    desc: 'A beautiful player, persistent queue, and library tools keep users coming back.',
    detail: 'Playback flows across the app, so your landing page feels like a complete music experience.',
    color: 'linear-gradient(135deg, #7b2d8b, #190e2e)',
  },
]

export default function HowItWorks() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' })

  return (
    <section id="how-it-works" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-10 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,92,53,0.12) 0%, transparent 70%)' }} />
        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(240,165,0,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={titleRef} className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            The flow
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 mx-auto max-w-3xl text-4xl font-semibold leading-tight"
            style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}
          >
            How Symponify brings a listener-first music experience to every screen.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-5 text-base leading-relaxed text-[var(--text-2)] max-w-2xl mx-auto"
          >
            Four simple steps guide listeners from discovery to playback with a premium interface and fast, polished interactions.
          </motion.p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[32px] border border-[rgba(26,26,24,0.08)] bg-white/85 p-8 shadow-[0_24px_60px_rgba(31,23,9,0.08)]"
            >
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-20" style={{ background: step.color }} />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white" style={{ background: step.color }}>
                  {step.num}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Step {step.num}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-[var(--text)]">{step.title}</h3>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-[var(--text-2)]">{step.desc}</p>
              <p className="mt-4 text-sm text-[var(--text-3)]">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
