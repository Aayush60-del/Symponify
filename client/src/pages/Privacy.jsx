import { motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Privacy() {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-[var(--text-2)]">Last updated: June 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none space-y-6"
        >
          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>We collect information you provide directly, such as:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Email address and password for account creation</li>
                <li>Preferences and listening history</li>
                <li>Content you create (playlists, likes)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide and improve our service</li>
                <li>Send important account-related notifications</li>
                <li>Personalize your experience</li>
                <li>Ensure platform security</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>3. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              We implement industry-standard security measures to protect your data. Passwords are encrypted using bcrypt, 
              and all communications use HTTPS. However, no system is 100% secure.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>4. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>MongoDB Atlas for data storage</li>
                <li>Cloudinary for media hosting</li>
              </ul>
              <p>These services have their own privacy policies.</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>5. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt-out of communications</li>
              </ul>
              <p>Contact us at privacy@symponify.com to exercise these rights.</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>6. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              If you have questions about this policy, please contact us at privacy@symponify.com
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
