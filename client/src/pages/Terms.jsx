import { motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Terms() {
  const prefersReducedMotion = useReducedMotion()

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
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Terms of Service</h1>
          <p className="text-[var(--text-2)]">Last updated: June 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              By using Symponify, you agree to comply with these terms. If you do not agree, please do not use our service.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>2. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide accurate information when creating an account</li>
                <li>Keep your password confidential</li>
                <li>Use the service for lawful purposes only</li>
                <li>Not upload copyrighted content unless authorized</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>3. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              All content on Symponify is protected by copyright. You may not reproduce, distribute, or transmit 
              content without permission. User-generated content remains your property, but you grant us a license 
              to display and distribute it on our platform.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>4. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              Symponify is provided "as is" without warranties. We are not liable for any damages arising from your 
              use of the service, including lost data, business interruption, or consequential damages.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>5. Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              We may terminate your account if you violate these terms or engage in harmful behavior. You may delete 
              your account at any time through your account settings.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>6. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              We may update these terms at any time. Continued use of the service constitutes acceptance of changes.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>7. Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              For questions about these terms, contact us at legal@symponify.com
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
