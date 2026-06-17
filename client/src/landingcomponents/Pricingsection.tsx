import { useState, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Listener', price: { monthly: 0, annual: 0 },
    desc: 'Perfect for exploring Symponify and enjoying the public catalog.',
    badge: null,
    features: ['Guest or logged-in access', 'Full catalog playback', 'Smart search & filters', 'Liked songs collection', 'Mobile-friendly player'],
    cta: 'Start free', highlight: false,
  },
  {
    name: 'Creator', price: { monthly: 9, annual: 7 },
    desc: 'For teams who curate catalogs and keep listener experiences polished.',
    badge: 'Most popular',
    features: ['Everything in Listener', 'Curated library management', 'Cloud-powered media delivery', 'Album & metadata controls', 'Admin dashboard access', 'Priority support'],
    cta: 'Start 14-day trial', highlight: true,
  },
  {
    name: 'Label', price: { monthly: 29, annual: 24 },
    desc: 'For labels and groups that manage large, high-quality music collections.',
    badge: null,
    features: ['Everything in Creator', 'Unlimited team members', 'Catalog workflow tools', 'Advanced analytics', 'Custom domain', 'Dedicated support'],
    cta: 'Contact sales', highlight: false,
  },
]

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.9])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section id="pricing" ref={sectionRef} className="py-28 px-4 relative overflow-hidden">
      {/* Scroll zoom background */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div style={{ width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,92,53,0.06) 0%, transparent 70%)' }} />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={titleInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.15em] mb-4 px-4 py-1.5 rounded-full"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Simple, honest pricing.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-3 p-1.5 rounded-full"
            style={{ background: 'var(--surface-3)' }}
          >
            {['Monthly', 'Annual'].map((label) => (
              <motion.button
                key={label}
                onClick={() => setAnnual(label === 'Annual')}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 relative"
                style={{ color: (label === 'Annual') === annual ? 'var(--text)' : 'var(--text-3)' }}
                whileTap={{ scale: 0.96 }}
              >
                {(label === 'Annual') === annual && (
                  <motion.div
                    layoutId="toggleBg"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'white', boxShadow: 'var(--shadow)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {label}
                  {label === 'Annual' && <span className="text-[10px] font-bold ml-1" style={{ color: 'var(--accent)' }}>-20%</span>}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60, scale: 0.88 }}
              animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative rounded-[28px] p-7 flex flex-col"
              style={{
                background: plan.highlight
                  ? 'linear-gradient(160deg, #1f1635 0%, #4b265a 50%, #2c0e0a 100%)'
                  : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                border: plan.highlight ? 'none' : '1px solid var(--line)',
                boxShadow: plan.highlight ? '0 32px 80px rgba(255,92,53,0.2)' : 'none',
                color: plan.highlight ? 'white' : 'var(--text)',
              }}
            >
              {plan.badge && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={titleInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: i * 0.12 + 0.3, type: 'spring', stiffness: 300 }}
                >
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold border-0 whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white' }}
                  >
                    {plan.badge}
                  </Badge>
                </motion.div>
              )}

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm mb-6" style={{ color: plan.highlight ? 'rgba(255,255,255,0.65)' : 'var(--text-2)' }}>
                {plan.desc}
              </p>

              <motion.div
                className="mb-8"
                key={`${annual}-${plan.name}`}
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span style={{ fontFamily: 'var(--serif)', fontSize: '3rem', lineHeight: 1, fontWeight: 700 }}>
                  ${annual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="text-sm ml-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.5)' : 'var(--text-3)' }}>
                  /mo
                </span>
              </motion.div>

              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f, fi) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -16 }}
                    animate={titleInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.12 + fi * 0.06, duration: 0.4 }}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <CheckIcon />
                    <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'var(--text-2)' }}>{f}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div className="mt-auto" whileTap={{ scale: 0.97 }}>
                <Button
                  className="w-full rounded-full font-bold text-sm h-12"
                  style={plan.highlight
                    ? { background: 'white', color: '#1f1635', border: 'none' }
                    : { background: 'transparent', color: 'var(--text)', border: '1.5px solid var(--line)' }}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}