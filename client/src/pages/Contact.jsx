import { motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function Contact() {
  const prefersReducedMotion = useReducedMotion()

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for reaching out! We\'ll get back to you soon.')
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-[var(--text-2)]">We'd love to hear from you</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>📧 Email</CardTitle>
            </CardHeader>
            <CardContent>
              <a href="mailto:hello@symponify.com" className="text-accent hover:underline">
                hello@symponify.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>💬 Discord</CardTitle>
            </CardHeader>
            <CardContent>
              <a href="#" className="text-accent hover:underline">
                Join our community
              </a>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>🐙 GitHub</CardTitle>
            </CardHeader>
            <CardContent>
              <a href="https://github.com/symponify" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @symponify
              </a>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We typically respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea placeholder="Tell us more..." rows={5} required />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
