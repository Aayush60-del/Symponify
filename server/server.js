const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')

const path = require('path')
const app = express()
connectDB()
app.set('trust proxy', 1)


const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'DENY')
  next()
})

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS blocked for this origin'))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' }))

app.get('/', (_req, res) => {
  res.send('Symponify Backend Running')
})

// Serve local media fallback for development: /songs/* -> server/public/songs/*
app.use('/songs', express.static(path.join(__dirname, 'public', 'songs')))

// All media is now served via Cloudinary URLs stored in MongoDB
// No local file serving is performed


app.get('/api/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/songs', require('./routes/songs'))
app.use('/api/playlists', require('./routes/playlists'))
app.use('/api/feedback', require('./routes/feedback'))

app.use((err, _req, res, _next) => {
  console.error(err)
  const status = err.status || err.statusCode || (err.name === 'MulterError' ? 400 : 500)
  res.status(status).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Symponify server running on port ${PORT}`)
})
