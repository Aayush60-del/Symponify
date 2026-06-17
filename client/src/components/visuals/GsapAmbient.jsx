import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '../../lib/animation-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function GsapAmbient({ variant = 'app' }) {
  const rootRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (prefersReducedMotion) return undefined

      const root = rootRef.current
      if (!root) return undefined

      const orbs = gsap.utils.toArray(root.querySelectorAll('.ambient-orb'))
      const rings = gsap.utils.toArray(root.querySelectorAll('.ambient-ring'))
      const beams = gsap.utils.toArray(root.querySelectorAll('.ambient-beam'))

      gsap.set(orbs, { transformOrigin: '50% 50%' })
      gsap.to(orbs, {
        x: (index) => [36, -42, 28][index % 3],
        y: (index) => [-28, 46, 32][index % 3],
        scale: (index) => [1.12, 0.92, 1.08][index % 3],
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.45,
      })

      gsap.to(rings, {
        rotate: 360,
        duration: 26,
        repeat: -1,
        ease: 'none',
        stagger: 5,
      })

      gsap.to(beams, {
        backgroundPosition: '180px 0px',
        duration: 9,
        repeat: -1,
        ease: 'none',
      })

      gsap.to(root.querySelector('.ambient-grid'), {
        backgroundPosition: '96px -96px',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      const revealItems = gsap.utils.toArray(document.querySelectorAll('.gsap-reveal'))
      if (revealItems.length) {
        gsap.from(revealItems, {
          y: 38,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: revealItems[0],
            start: 'top 78%',
          },
        })
      }

      return undefined
    },
    { dependencies: [prefersReducedMotion] }
  )

  return (
    <div ref={rootRef} className={`gsap-ambient gsap-ambient-${variant}`} aria-hidden="true">
      <span className="ambient-grid" />
      <span className="ambient-beam ambient-beam-a" />
      <span className="ambient-beam ambient-beam-b" />
      <span className="ambient-orb ambient-orb-a" />
      <span className="ambient-orb ambient-orb-b" />
      <span className="ambient-orb ambient-orb-c" />
      <span className="ambient-ring ambient-ring-a" />
      <span className="ambient-ring ambient-ring-b" />
    </div>
  )
}
