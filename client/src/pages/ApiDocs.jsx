import { motion } from 'framer-motion'
import { pageVariants, listItemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ApiDocs() {
  const prefersReducedMotion = useReducedMotion()

  const endpoints = [
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate user and get JWT token'
    },
    {
      method: 'POST',
      path: '/api/auth/register',
      description: 'Create a new user account'
    },
    {
      method: 'GET',
      path: '/api/songs',
      description: 'Get all available songs'
    },
    {
      method: 'GET',
      path: '/api/songs/search',
      description: 'Search songs by title, artist, or album'
    },
    {
      method: 'GET',
      path: '/api/songs/liked',
      description: 'Get user\'s liked songs'
    },
    {
      method: 'POST',
      path: '/api/songs/like/:id',
      description: 'Like a song'
    },
    {
      method: 'POST',
      path: '/api/playlists',
      description: 'Create a new playlist'
    },
    {
      method: 'GET',
      path: '/api/playlists',
      description: 'Get user\'s playlists'
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">API Documentation</h1>
          <p className="text-xl text-[var(--text-2)]">Build with Symponify</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-6 rounded-lg bg-blue-500/10 border border-blue-500/20"
        >
          <h2 className="text-lg font-semibold mb-2">Base URL</h2>
          <code className="text-sm font-mono">https://api.symponify.com/api</code>
        </motion.div>

        <motion.div className="space-y-4" variants={{ animate: { transition: { staggerChildren: 0.05 } } }}>
          {endpoints.map((endpoint, idx) => (
            <motion.div key={idx} variants={prefersReducedMotion ? {} : listItemVariants}>
              <Card className="bg-[var(--surface-2)] border-[var(--line)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm">{endpoint.path}</code>
                    </div>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
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
          <h2 className="text-2xl font-bold mb-4">Full Documentation</h2>
          <p className="text-[var(--text-2)] mb-4">
            For complete API documentation, authentication details, and code examples:
          </p>
          <a href="https://github.com/symponify/docs" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Visit our GitHub documentation →
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}
