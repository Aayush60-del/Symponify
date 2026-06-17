import { motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CookiePolicy() {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Cookie Policy</h1>
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
              <CardTitle>What are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              Cookies are small text files stored on your device that help us remember you and improve your experience. 
              Symponify uses both session and persistent cookies.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>Essential Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>These cookies are necessary for the platform to function:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>auth_token:</strong> Stores your JWT authentication token</li>
                <li><strong>user_preferences:</strong> Saves your UI preferences (dark mode, theme)</li>
                <li><strong>session_id:</strong> Maintains your session</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>Analytics Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>We may use analytics tools to understand how you use Symponify:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Pages visited</li>
                <li>Time spent on each page</li>
                <li>Features used</li>
              </ul>
              <p>This data helps us improve the service.</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>Managing Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--text-2)]">
              <p>You can control cookies through your browser settings:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Allow all cookies</li>
                <li>Block all cookies (may break functionality)</li>
                <li>Block third-party cookies only</li>
              </ul>
              <p className="mt-3">Note: Disabling essential cookies may affect your ability to use Symponify.</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              We do not use third-party advertising or tracking cookies. If we integrate third-party services in the future, 
              we will update this policy and notify you.
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>Questions?</CardTitle>
            </CardHeader>
            <CardContent className="text-[var(--text-2)]">
              If you have questions about our cookie policy, please contact us at privacy@symponify.com
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
