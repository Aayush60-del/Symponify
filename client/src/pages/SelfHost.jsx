import { motion } from 'framer-motion'
import { pageVariants, listItemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SelfHost() {
  const prefersReducedMotion = useReducedMotion()

  const steps = [
    {
      num: 1,
      title: 'Prerequisites',
      items: [
        'Node.js 16+ and npm',
        'MongoDB Atlas account or local MongoDB',
        'Cloudinary account (for media uploads)',
        'Git for cloning the repository'
      ]
    },
    {
      num: 2,
      title: 'Clone & Setup',
      items: [
        'git clone https://github.com/symponify/symponify.git',
        'cd symponify',
        'npm install in both client/ and server/ directories'
      ]
    },
    {
      num: 3,
      title: 'Environment Configuration',
      items: [
        'Copy .env.example to .env in server/ directory',
        'Add your MongoDB URI, JWT secret, and Cloudinary credentials',
        'Configure VITE_API_BASE_URL in client/ if needed'
      ]
    },
    {
      num: 4,
      title: 'Run Locally',
      items: [
        'Backend: npm run dev (from server/)',
        'Frontend: npm run dev (from client/)',
        'Access at http://localhost:5174'
      ]
    },
    {
      num: 5,
      title: 'Deploy to Cloud',
      items: [
        'Frontend: Deploy to Vercel or Netlify',
        'Backend: Deploy to Render, Railway, or Heroku',
        'Configure environment variables on your hosting platform'
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Self-Host Guide</h1>
          <p className="text-xl text-[var(--text-2)]">Run Symponify on your own infrastructure</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-6 rounded-lg bg-blue-500/10 border border-blue-500/20"
        >
          <h2 className="text-lg font-semibold mb-2">📚 Full Documentation</h2>
          <p className="text-[var(--text-2)] mb-4">
            For detailed step-by-step instructions and troubleshooting:
          </p>
          <a
            href="https://github.com/symponify/symponify/wiki/Self-Hosting"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-semibold"
          >
            Visit the Self-Hosting Wiki →
          </a>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {steps.map((step) => (
            <motion.div key={step.num} variants={prefersReducedMotion ? {} : listItemVariants}>
              <Card className="bg-[var(--surface-2)] border-[var(--line)]">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      {step.num}
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-accent mt-1">→</span>
                        <code className="bg-black/30 px-2 py-1 rounded text-sm">{item}</code>
                      </li>
                    ))}
                  </ul>
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
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-[var(--text-2)]">
            If you encounter any issues, check our GitHub discussions or open an issue on the repository.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
