import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

const links = [
  { label: 'Features', path: '/features' },
  { label: 'How it works', path: '#how-it-works' },
  { label: 'FAQ', path: '/faq' },
  { label: 'About', path: '/about' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className="w-full max-w-6xl flex items-center justify-between px-6 py-4 rounded-full transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            border: scrolled ? '1px solid var(--line)' : '1px solid rgba(255,255,255,0.5)',
            boxShadow: scrolled ? '0 8px 32px rgba(31, 23, 9, 0.08)' : 'none',
          }}
        >
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center glow-pulse"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            >
              <WaveIcon />
            </span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: 'var(--text)' }}>
              Symponify
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <li key={link.label}>
                {link.path.startsWith('#') ? (
                  <a
                    href={link.path}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-black/5"
                    style={{ color: 'var(--text-2)' }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    onClick={() => navigate(link.path)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-black/5"
                    style={{ color: 'var(--text-2)' }}
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200 hover:bg-black/5"
              style={{ color: 'var(--text-2)' }}
            >
              Log in
            </button>
            <Button
              onClick={() => navigate('/login')}
              className="rounded-full px-5 text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, var(--accent), #e04a25)', border: 'none' }}
            >
              Try free
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-0.5 w-5 rounded-full"
                style={{ background: 'var(--text)' }}
                animate={
                  mobileOpen
                    ? i === 1
                      ? { opacity: 0 }
                      : i === 0
                      ? { rotate: 45, y: 8 }
                      : { rotate: -45, y: -8 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.25 }}
              />
            ))}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-24 left-4 right-4 z-40 rounded-3xl p-6 flex flex-col gap-4"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow)',
            }}
          >
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.path.startsWith('#')) {
                    // For hash links, scroll to element
                    const el = document.querySelector(link.path)
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    navigate(link.path)
                  }
                  setMobileOpen(false)
                }}
                className="text-lg font-semibold py-1 text-left w-full"
                style={{ color: 'var(--text)' }}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate('/login')
                  setMobileOpen(false)
                }}
                className="text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200 hover:bg-black/5"
                style={{ color: 'var(--text-2)', textAlign: 'left' }}
              >
                Log in
              </button>
              <Button
                onClick={() => {
                  navigate('/login')
                  setMobileOpen(false)
                }}
                className="rounded-full w-full text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, var(--accent), #e04a25)' }}
              >
                Try free
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function WaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 8 Q3 4 5 8 Q7 12 9 8 Q11 4 13 8 Q15 12 15 8"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}