require('dotenv').config()

const mongoose = require('mongoose')
const Album = require('./models/Album')
const Song = require('./models/Song')

const songs = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    genre: 'Pop',
    emoji: '\uD83C\uDFB8',
    color: 'linear-gradient(135deg, #ff5c35, #f0a500)',
    coverUrl: '/songs/After%20Hours/cover.jpg',
    audioUrl: '/songs/Blinding%20lights/audio.mp3',
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
    genre: 'Pop',
    emoji: '\uD83C\uDFA4',
    color: 'linear-gradient(135deg, #1a3c5e, #4a90d9)',
    coverUrl: '/songs/Future%20Nostalgia/cover.jpg',
    audioUrl: '/songs/Levitating/audio.mp3',
  },
  {
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: '3:20',
    genre: 'Pop',
    emoji: '\u2728',
    color: 'linear-gradient(135deg, #7b2d8b, #c77dff)',
    coverUrl: '/songs/Midnights/cover.jpg',
    audioUrl: '/songs/AntiHero/audio.mp3',
  },
  {
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: '2:54',
    genre: 'Pop',
    emoji: '\uD83C\uDF49',
    color: 'linear-gradient(135deg, #2d6a4f, #74c69d)',
    coverUrl: '/songs/Fine%20Line/cover.jpg',
    audioUrl: '/songs/Watermelon%20Sugar/audio.mp3',
  },
]

const albums = [
  {
    title: 'After Hours',
    artist: 'The Weeknd',
    emoji: '\uD83C\uDFB8',
    color: 'linear-gradient(135deg, #ff5c35, #f0a500)',
    coverUrl: '/songs/After%20Hours/cover.jpg',
  },
  {
    title: 'Future Nostalgia',
    artist: 'Dua Lipa',
    emoji: '\uD83C\uDFA4',
    color: 'linear-gradient(135deg, #1a3c5e, #4a90d9)',
    coverUrl: '/songs/Future%20Nostalgia/cover.jpg',
  },
  {
    title: 'Midnights',
    artist: 'Taylor Swift',
    emoji: '\u2728',
    color: 'linear-gradient(135deg, #7b2d8b, #c77dff)',
    coverUrl: '/songs/Midnights/cover.jpg',
  },
  {
    title: 'Fine Line',
    artist: 'Harry Styles',
    emoji: '\uD83C\uDF49',
    color: 'linear-gradient(135deg, #2d6a4f, #74c69d)',
    coverUrl: '/songs/Fine%20Line/cover.jpg',
  },
]

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Promise.all([Song.deleteMany({}), Album.deleteMany({})])
    await Promise.all([Song.insertMany(songs), Album.insertMany(albums)])
    console.log('Seeded songs and albums successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
