import { motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Pricing() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Pricing</h1>
          <p className="text-xl text-[var(--text-2)]">Forever free. No credit card required.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <CardHeader className="text-center">
              <Badge className="w-fit mx-auto mb-4 bg-accent">Free Forever</Badge>
              <CardTitle className="text-4xl">$0/month</CardTitle>
              <CardDescription className="text-lg mt-2">No hidden fees. No trials. No credit card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Unlimited music streaming</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Create and manage playlists</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Like and favorite tracks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Advanced search filters</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Cloud sync across devices</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Beautiful, distraction-free UI</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Dark mode support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Admin upload capabilities (for curators)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-6">Why is Symponify free?</h2>
          <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">
            Symponify is built on the philosophy that great music experiences should be accessible to everyone. 
            We believe in open-source software and community-driven development. Enjoy unlimited music without 
            ads, paywalls, or limitations.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
