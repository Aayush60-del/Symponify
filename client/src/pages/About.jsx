import { motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function About() {
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Symponify</h1>
          <p className="text-xl text-[var(--text-2)]">A music platform for the future</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-12"
        >
          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-[var(--text-2)] space-y-4">
              <p>
                At Symponify, we believe that music is a universal language that brings people together. 
                Our mission is to create a platform where music discovery, curation, and sharing are 
                accessible to everyone, without paywalls, ads, or unnecessary complexity.
              </p>
              <p>
                We're built on open-source principles and community-driven development. Every feature we add 
                is guided by user feedback and our core values: simplicity, accessibility, and quality.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-[var(--text-2)] space-y-4">
              <p>
                Symponify started as a passion project by a team of music enthusiasts and developers who 
                wanted to build something better. We noticed that existing music platforms were either too 
                complicated, too expensive, or focused on the wrong things.
              </p>
              <p>
                So we decided to build Symponify: a beautiful, minimal music streaming platform that puts 
                the user experience first. Built with React, Express, MongoDB, and hosted in the cloud, 
                Symponify represents our commitment to modern web technology and user-centric design.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-2)] border-[var(--line)]">
            <CardHeader>
              <CardTitle className="text-2xl">Our Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">🎯 Simplicity</h3>
                  <p className="text-[var(--text-2)]">We keep things simple and intuitive</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">♿ Accessibility</h3>
                  <p className="text-[var(--text-2)]">Music should be for everyone</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🌐 Open Source</h3>
                  <p className="text-[var(--text-2)]">Community-driven development</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">✨ Quality</h3>
                  <p className="text-[var(--text-2)]">Excellence in everything we do</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
