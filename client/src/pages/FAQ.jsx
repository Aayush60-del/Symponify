import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants, listItemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent } from '@/components/ui/card'

export default function FAQ() {
  const prefersReducedMotion = useReducedMotion()
  const [openIdx, setOpenIdx] = useState(0)

  const faqs = [
    {
      q: 'Is Symponify really free?',
      a: 'Yes! Symponify is completely free forever. No credit card required, no hidden fees, no premium tiers. We believe music should be accessible to everyone.'
    },
    {
      q: 'How do I create an account?',
      a: 'Click "Sign Up" on the login page, enter your email and password, and you\'re ready to go! You can also explore as a guest without creating an account.'
    },
    {
      q: 'Can I upload my own music?',
      a: 'If you\'re an admin or curator, you can upload music to expand our library. Regular users can create playlists with existing songs.'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes! We use industry-standard JWT authentication, encrypted passwords, and secure MongoDB storage. Your data is yours and always private.'
    },
    {
      q: 'How many songs can I like?',
      a: 'Unlimited! Like as many songs as you want. Your liked songs sync across all your devices.'
    },
    {
      q: 'Can I create playlists?',
      a: 'Yes! You can create unlimited custom playlists, add songs to them, and share them with friends (coming soon).'
    },
    {
      q: 'What formats does Symponify support?',
      a: 'We primarily support MP3 and other common audio formats. Audio quality is optimized for smooth streaming and minimal bandwidth usage.'
    },
    {
      q: 'How do I report a bug or suggest a feature?',
      a: 'Visit our GitHub repository to open an issue. We actively review and respond to community feedback.'
    },
    {
      q: 'Is there a mobile app?',
      a: 'Currently, Symponify is a web app that works great on mobile browsers. Native iOS and Android apps are on our roadmap for late 2026.'
    },
    {
      q: 'Can I download songs for offline listening?',
      a: 'Offline mode is planned for a future release. For now, you can stream music whenever you have an internet connection.'
    }
  ]

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-[var(--text-2)]">Find answers to common questions</p>
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={{
            animate: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {faqs.map((faq, idx) => (
            <motion.div key={idx} variants={prefersReducedMotion ? {} : listItemVariants}>
              <Card
                className="bg-[var(--surface-2)] border-[var(--line)] cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold pr-4 text-left">{faq.q}</h3>
                    <span className="text-accent text-xl flex-shrink-0">
                      {openIdx === idx ? '−' : '+'}
                    </span>
                  </div>

                  <AnimatePresence>
                    {openIdx === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-[var(--text-2)] mt-4 pt-4 border-t border-[var(--line)]">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/20"
        >
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-[var(--text-2)]">
            Feel free to contact us or visit our GitHub discussions for more help.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
