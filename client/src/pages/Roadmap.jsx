import { motion } from 'framer-motion'
import { pageVariants, listItemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Roadmap() {
  const prefersReducedMotion = useReducedMotion()

  const phases = [
    {
      quarter: 'Q3 2026',
      status: 'Planned',
      items: [
        'Social features (sharing, following)',
        'Collaborative playlists',
        'User profiles and discovery',
        'Recommendation engine'
      ]
    },
    {
      quarter: 'Q4 2026',
      status: 'Planned',
      items: [
        'Podcast integration',
        'Audio visualization options',
        'Advanced equalizer',
        'Offline mode (Premium)'
      ]
    },
    {
      quarter: 'Q1 2027',
      status: 'Concept',
      items: [
        'Mobile native apps (iOS/Android)',
        'Voice control integration',
        'Smart recommendations using AI',
        'Community content moderation'
      ]
    },
    {
      quarter: 'Q2 2027',
      status: 'Concept',
      items: [
        'Spatial audio support',
        'Live streaming events',
        'Artist collaboration tools',
        'Advanced analytics for curators'
      ]
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return 'bg-blue-500/20 text-blue-200'
      case 'Concept': return 'bg-purple-500/20 text-purple-200'
      default: return 'bg-accent/20 text-accent'
    }
  }

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Roadmap</h1>
          <p className="text-xl text-[var(--text-2)]">Exciting features coming to Symponify</p>
        </motion.div>

        <motion.div className="space-y-6" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
          {phases.map((phase, idx) => (
            <motion.div key={idx} variants={prefersReducedMotion ? {} : listItemVariants}>
              <Card className="bg-[var(--surface-2)] border-[var(--line)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{phase.quarter}</CardTitle>
                    <Badge className={getStatusColor(phase.status)}>{phase.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-accent">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/20"
        >
          <h2 className="text-2xl font-bold mb-4">Have feedback?</h2>
          <p className="text-[var(--text-2)]">
            We'd love to hear your ideas! Visit our GitHub repository to suggest features or report issues.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
