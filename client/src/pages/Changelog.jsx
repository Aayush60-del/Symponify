import { motion } from 'framer-motion'
import { pageVariants, listItemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Changelog() {
  const prefersReducedMotion = useReducedMotion()

  const versions = [
    {
      version: 'v1.0.0',
      date: 'June 2026',
      badge: 'Latest',
      changes: [
        'Initial public release',
        'Core music streaming functionality',
        'User authentication system',
        'Playlist creation and management',
        'Like/favorite system',
        'Search and filtering',
        'Admin upload capabilities',
        'Dark mode support'
      ]
    },
    {
      version: 'v0.9.0',
      date: 'May 2026',
      badge: 'Beta',
      changes: [
        'Beta testing period',
        'Community feedback integration',
        'Performance optimizations',
        'UI/UX refinements',
        'Mobile responsive design'
      ]
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Changelog</h1>
          <p className="text-xl text-[var(--text-2)]">Track our progress and updates</p>
        </motion.div>

        <motion.div className="space-y-8" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
          {versions.map((v, idx) => (
            <motion.div key={idx} variants={prefersReducedMotion ? {} : listItemVariants}>
              <Card className="bg-[var(--surface-2)] border-[var(--line)]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">{v.version}</CardTitle>
                    <Badge variant="secondary">{v.badge}</Badge>
                  </div>
                  <CardDescription>{v.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {v.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-accent mt-1">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
