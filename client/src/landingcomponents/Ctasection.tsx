import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Waveform from './Waveform'

export default function CtaSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInView = useInView(cardRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  // Big zoom-in effect on the CTA card
  const cardScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.7, 1, 1.04])
  const cardY = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const cardSpringScale = useSpring(cardScale, { stiffness: 80, damping: 20 })
  const cardSpringY = useSpring(cardY, { stiffness: 80, damping: 20 })

  const waveY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const orb1Scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.3, 0.8])
  const orb2Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 0.7, 1.1])

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto" ref={cardRef}>
        <motion.div
          className="relative overflow-hidden rounded-[40px] px-10 py-20 text-center"
          style={{
            background: 'linear-gradient(160deg, #1f1635 0%, #4b265a 50%, #3a0e0a 100%)',
            boxShadow: '0 40px 100px rgba(31,23,9,0.25)',
            scale: cardSpringScale,
            y: cardSpringY,
          }}
        >
          {/* Animated waveform bg */}
          <motion.div style={{ y: waveY }} className="absolute inset-0 opacity-20 flex items-end overflow-hidden pointer-events-none">
            <Waveform barCount={80} height={180} color="rgba(255,255,255,0.5)" playing />
          </motion.div>

          {/* Orb 1 */}
          <motion.div
            className="absolute -top-20 left-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,92,53,0.35) 0%, transparent 70%)', scale: orb1Scale, top: '-80px', left: '10%' }}
          />
          {/* Orb 2 */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(240,165,0,0.25) 0%, transparent 70%)', scale: orb2Scale, bottom: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%' }}
          />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={cardInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-sm font-bold uppercase tracking-[0.15em] mb-4"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Ready to listen?
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-white mb-6"
              style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Start streaming today.
              <br />
              <motion.em
                style={{ color: 'var(--accent)', fontStyle: 'italic' }}
                initial={{ opacity: 0, x: -30 }}
                animate={cardInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.55, duration: 0.6 }}
              >
                Free forever.
              </motion.em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={cardInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg mb-10 max-w-sm mx-auto"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              No credit card. No ads. Just your music, beautifully presented.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="rounded-full px-10 font-bold text-base text-white border-none"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #e04a25)', boxShadow: '0 8px 32px rgba(255,92,53,0.5)', height: '52px' }}
                >
                  Create free account
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    localStorage.setItem('guestAccess', 'true')
                    window.dispatchEvent(new Event('authchange'))
                    navigate('/')
                  }}
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 font-semibold text-base"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', height: '52px' }}
                >
                  Browse as guest →
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}