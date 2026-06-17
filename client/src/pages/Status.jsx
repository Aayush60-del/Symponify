import { motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Status() {
  const prefersReducedMotion = useReducedMotion()

  const services = [
    { name: 'API Server', status: 'Operational', uptime: '99.9%' },
    { name: 'Streaming', status: 'Operational', uptime: '99.8%' },
    { name: 'Database', status: 'Operational', uptime: '99.95%' },
    { name: 'Authentication', status: 'Operational', uptime: '100%' },
    { name: 'File Storage', status: 'Operational', uptime: '99.9%' }
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Service Status</h1>
          <p className="text-xl text-[var(--text-2)]">Current system status and uptime</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-6 rounded-lg bg-green-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            <span className="text-lg font-semibold">All Systems Operational</span>
          </div>
        </motion.div>

        <motion.div className="space-y-4">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * idx }}
            >
              <Card className="bg-[var(--surface-2)] border-[var(--line)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{service.name}</CardTitle>
                    <Badge className="bg-green-500/20 text-green-200">
                      ● {service.status}
                    </Badge>
                  </div>
                  <CardDescription>Uptime: {service.uptime}</CardDescription>
                </CardHeader>
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
          <h2 className="text-2xl font-bold mb-4">Status Updates</h2>
          <p className="text-[var(--text-2)] mb-4">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          <p className="text-[var(--text-2)]">
            For scheduled maintenance and incidents, check our status page or follow us on social media.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
