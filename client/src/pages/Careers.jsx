import { motion } from 'framer-motion'
import { pageVariants, listItemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Careers() {
  const prefersReducedMotion = useReducedMotion()

  const positions = [
    {
      title: 'Full Stack Developer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Help us build the future of music streaming with React, Node.js, and MongoDB'
    },
    {
      title: 'Product Manager',
      type: 'Full-time',
      location: 'Remote',
      description: 'Shape the direction of Symponify and drive user-centric feature development'
    },
    {
      title: 'UX/UI Designer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Create beautiful, intuitive interfaces for our music platform'
    },
    {
      title: 'DevOps Engineer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Build and maintain our cloud infrastructure and deployment pipelines'
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl text-[var(--text-2)]">Build the future of music with us</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-8 rounded-lg bg-accent/10 border border-accent/20"
        >
          <h2 className="text-2xl font-bold mb-4">Why Symponify?</h2>
          <ul className="space-y-2 text-[var(--text-2)]">
            <li>✨ Open-source and community-driven</li>
            <li>✨ Work on a product used by music lovers worldwide</li>
            <li>✨ Remote-first, flexible culture</li>
            <li>✨ Competitive compensation and benefits</li>
            <li>✨ Continuous learning opportunities</li>
          </ul>
        </motion.div>

        <motion.div className="space-y-6" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
          {positions.map((pos, idx) => (
            <motion.div key={idx} variants={prefersReducedMotion ? {} : listItemVariants}>
              <Card className="bg-[var(--surface-2)] border-[var(--line)] hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{pos.title}</CardTitle>
                      <CardDescription>{pos.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{pos.type}</Badge>
                  </div>
                  <div className="mt-4 text-sm text-[var(--text-2)]">📍 {pos.location}</div>
                </CardHeader>
                <CardContent>
                  <a href="#" className="text-accent hover:underline text-sm font-semibold">
                    View details and apply →
                  </a>
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
          <h2 className="text-2xl font-bold mb-4">Don't see a fit?</h2>
          <p className="text-[var(--text-2)] mb-4">
            We're always interested in talented people. Feel free to reach out with your background and interests.
          </p>
          <a href="/contact" className="text-accent hover:underline font-semibold">
            Get in touch →
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}
