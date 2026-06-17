import { motion } from 'framer-motion'
import { pageVariants, listItemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Blog() {
  const prefersReducedMotion = useReducedMotion()

  const posts = [
    {
      title: 'Announcing Symponify v1.0',
      date: 'June 8, 2026',
      category: 'Release',
      excerpt: 'After months of development, we\'re proud to announce the official launch of Symponify. A free, open-source music streaming platform.'
    },
    {
      title: 'The Tech Stack Behind Symponify',
      date: 'May 25, 2026',
      category: 'Technology',
      excerpt: 'Learn about the modern web technologies that power Symponify: React, Express, MongoDB, and Framer Motion.'
    },
    {
      title: 'Why Open Source Matters',
      date: 'May 10, 2026',
      category: 'Philosophy',
      excerpt: 'Exploring why we believe in open-source software and how it benefits the music community.'
    },
    {
      title: 'Building a Responsive UI for Music Lovers',
      date: 'April 28, 2026',
      category: 'Design',
      excerpt: 'How we designed Symponify\'s interface to be beautiful, intuitive, and accessible to everyone.'
    }
  ]

  const getCategoryColor = (cat) => {
    const colors = {
      Release: 'bg-green-500/20 text-green-200',
      Technology: 'bg-blue-500/20 text-blue-200',
      Philosophy: 'bg-purple-500/20 text-purple-200',
      Design: 'bg-pink-500/20 text-pink-200'
    }
    return colors[cat] || 'bg-accent/20 text-accent'
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-[var(--text-2)]">Stories, updates, and insights</p>
        </motion.div>

        <motion.div className="space-y-6" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
          {posts.map((post, idx) => (
            <motion.div key={idx} variants={prefersReducedMotion ? {} : listItemVariants}>
              <Card className="bg-[var(--surface-2)] border-[var(--line)] hover:bg-white/10 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-[var(--text-2)] mt-4">📅 {post.date}</div>
                </CardHeader>
                <CardContent>
                  <a href="#" className="text-accent hover:underline text-sm font-semibold">
                    Read more →
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
