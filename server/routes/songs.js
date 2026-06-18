const mongoose = require('mongoose')
const router = require('express').Router()
const Album = require('../models/Album')
const Song = require('../models/Song')
const User = require('../models/User')
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/authMiddleware')
const { deleteCloudinaryAsset, getUploadedFilePublicId, getUploadedFileUrl } = require('../config/cloudinary')
const { normalizeMediaUrl, withMediaFlags } = require('../utils/media')
const { escapeRegex, safeTrim } = require('../utils/validation')

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

const removeAlbumIfUnused = async (albumTitle) => {
  const normalizedTitle = safeTrim(albumTitle)
  if (!normalizedTitle) return null

  const hasSongs = await Song.exists({ album: normalizedTitle })
  if (hasSongs) return null

  const album = await Album.findOneAndDelete({ title: normalizedTitle })
  return album
}

const normalizeSongInput = (body = {}) => ({
  title: safeTrim(body.title),
  artist: safeTrim(body.artist),
  album: safeTrim(body.album),
  duration: safeTrim(body.duration),
  genre: safeTrim(body.genre),
  lyrics: safeTrim(body.lyrics),
  emoji: safeTrim(body.emoji) || '\uD83C\uDFB5',
  color: safeTrim(body.color) || 'linear-gradient(135deg, #333, #666)',
})

const getAlbumsWithCounts = async (req) => {
  const [storedAlbums, songs] = await Promise.all([
    Album.find({}).sort({ title: 1 }).lean(),
    Song.find({ album: { $ne: '' } }).select('album artist color emoji coverUrl').sort({ album: 1 }).lean(),
  ])

  const albumMap = new Map()

  storedAlbums.forEach((album) => {
    albumMap.set(album.title, {
      title: album.title,
      artist: album.artist || '',
      color: album.color || 'linear-gradient(135deg, #333, #666)',
      emoji: album.emoji || '\uD83C\uDFB5',
      coverUrl: normalizeMediaUrl(req, album.coverUrl),
      songCount: 0,
    })
  })

  songs.forEach((song) => {
    const title = safeTrim(song.album)
    if (!title) return

    if (!albumMap.has(title)) {
      albumMap.set(title, {
        title,
        artist: song.artist || '',
        color: song.color || 'linear-gradient(135deg, #333, #666)',
        emoji: song.emoji || '\uD83C\uDFB5',
        coverUrl: normalizeMediaUrl(req, song.coverUrl),
        songCount: 0,
      })
    }

    const album = albumMap.get(title)
    album.songCount += 1
    if (!album.artist && song.artist) album.artist = song.artist
    if (!album.coverUrl && song.coverUrl) album.coverUrl = normalizeMediaUrl(req, song.coverUrl)
    if (!album.color && song.color) album.color = song.color
    if (!album.emoji && song.emoji) album.emoji = song.emoji
  })

  return Array.from(albumMap.values()).sort((a, b) => a.title.localeCompare(b.title))
}

const syncAlbumRecord = async ({ title, artist, color, emoji, coverUrl, coverPublicId }) => {
  const normalizedTitle = safeTrim(title)
  if (!normalizedTitle) return null

  const existingAlbum = await Album.findOne({ title: normalizedTitle })
  const nextAlbum = existingAlbum || new Album({ title: normalizedTitle })

  if (!nextAlbum.artist && artist) nextAlbum.artist = safeTrim(artist)
  if (!nextAlbum.color && color) nextAlbum.color = color
  if (!nextAlbum.emoji && emoji) nextAlbum.emoji = emoji
  if (color && !existingAlbum) nextAlbum.color = color
  if (emoji && !existingAlbum) nextAlbum.emoji = emoji
  if (artist && !existingAlbum) nextAlbum.artist = safeTrim(artist)
  if (coverUrl) nextAlbum.coverUrl = coverUrl
  if (coverPublicId) nextAlbum.coverPublicId = coverPublicId

  await nextAlbum.save()
  return nextAlbum
}

router.get('/', async (req, res) => {
  try {
    const genre = safeTrim(req.query.genre)
    const search = safeTrim(req.query.search)
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '50', 10) || 50, 1), 100)
    const query = {}

    if (genre) query.genre = genre

    if (search) {
      const pattern = escapeRegex(search)
      query.$or = [
        { title: { $regex: pattern, $options: 'i' } },
        { artist: { $regex: pattern, $options: 'i' } },
        { album: { $regex: pattern, $options: 'i' } },
      ]
    }

    const songs = await Song.find(query).sort({ createdAt: -1 }).limit(limit).lean()
    res.json(songs.map((song) => withMediaFlags(req, song)))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load songs.' })
  }
})

router.get('/albums', async (req, res) => {
  try {
    const albums = await getAlbumsWithCounts(req)
    res.json(albums)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load albums.' })
  }
})

router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('likedSongs')
    if (!user) return res.status(404).json({ message: 'User not found.' })

    res.json(user.likedSongs.map((song) => withMediaFlags(req, song.toObject())))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load liked songs.' })
  }
})

router.post('/like/:id', authMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid song id.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ message: 'Song not found.' })

    const alreadyLiked = user.likedSongs.some((id) => id.toString() === req.params.id)
    user.likedSongs = alreadyLiked ? user.likedSongs.filter((id) => id.toString() !== req.params.id) : [...user.likedSongs, song._id]
    song.likes = Math.max(0, song.likes + (alreadyLiked ? -1 : 1))

    await Promise.all([user.save(), song.save()])

    res.json({ liked: !alreadyLiked, likedSongs: user.likedSongs })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to update liked songs.' })
  }
})

router.post('/albums', authMiddleware, upload.single('cover'), async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can create albums.' })

    const title = safeTrim(req.body.title)
    const artist = safeTrim(req.body.artist)
    if (!title) return res.status(400).json({ message: 'Album name is required.' })

    const [existingAlbum, existingSongs] = await Promise.all([Album.findOne({ title }), Song.exists({ album: title })])
    if (existingAlbum || existingSongs) return res.status(409).json({ message: 'Album already exists.' })

    const coverUrl = req.file ? getUploadedFileUrl(req.file) : ''
    const coverPublicId = req.file ? getUploadedFilePublicId(req.file) : ''

    const album = await Album.create({
      title,
      artist,
      color: safeTrim(req.body.color) || 'linear-gradient(135deg, #333, #666)',
      emoji: safeTrim(req.body.emoji) || '\uD83C\uDFB5',
      coverUrl,
      coverPublicId,
    })

    res.status(201).json({
      message: 'Album created successfully.',
      album: {
        title: album.title,
        artist: album.artist,
        color: album.color,
        emoji: album.emoji,
        coverUrl: normalizeMediaUrl(req, album.coverUrl),
        songCount: 0,
      },
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Album creation failed.' })
  }
})

router.post('/add', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can add songs.' })

    const payload = normalizeSongInput(req.body)
    if (!payload.title || !payload.artist) {
      return res.status(400).json({ message: 'Title and artist are required.' })
    }

    const song = await Song.create({
      ...payload,
      coverUrl: safeTrim(req.body.coverUrl),
      coverPublicId: safeTrim(req.body.coverPublicId),
      audioUrl: safeTrim(req.body.audioUrl),
      audioPublicId: safeTrim(req.body.audioPublicId),
      likes: Math.max(0, Number(req.body.likes) || 0),
    })

    await syncAlbumRecord({
      title: payload.album,
      artist: payload.artist,
      color: payload.color,
      emoji: payload.emoji,
      coverUrl: song.coverUrl,
      coverPublicId: song.coverPublicId,
    })

    res.status(201).json({ message: 'Song added successfully.', song: withMediaFlags(req, song.toObject()) })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Song creation failed.' })
  }
})

router.post(
  '/upload',
  authMiddleware,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can upload songs.' })

      const payload = normalizeSongInput(req.body)
      if (!payload.title || !payload.artist) {
        return res.status(400).json({ message: 'Title and artist are required.' })
      }

      const audioFile = req.files?.audio?.[0]
      const coverFile = req.files?.cover?.[0]
      if (!audioFile) return res.status(400).json({ message: 'Audio file is required.' })

      const existingAlbum = payload.album ? await Album.findOne({ title: payload.album }) : null
      const finalCoverUrl = coverFile ? getUploadedFileUrl(coverFile) : existingAlbum?.coverUrl || ''
      const finalCoverPublicId = coverFile ? getUploadedFilePublicId(coverFile) : existingAlbum?.coverPublicId || ''

      const song = await Song.create({
        ...payload,
        audioUrl: getUploadedFileUrl(audioFile),
        audioPublicId: getUploadedFilePublicId(audioFile),
        coverUrl: finalCoverUrl,
        coverPublicId: finalCoverPublicId,
      })

      await syncAlbumRecord({
        title: payload.album,
        artist: existingAlbum?.artist || payload.artist,
        color: existingAlbum?.color || payload.color,
        emoji: existingAlbum?.emoji || payload.emoji,
        coverUrl: finalCoverUrl,
        coverPublicId: finalCoverPublicId,
      })

      res.status(201).json({ message: 'Song uploaded successfully.', song: withMediaFlags(req, song.toObject()) })
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'Song upload failed.' })
    }
  }
)

router.put(
  '/:id/media',
  authMiddleware,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can update media.' })
      if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid song id.' })

      const song = await Song.findById(req.params.id)
      if (!song) return res.status(404).json({ message: 'Song not found.' })

      const audioFile = req.files?.audio?.[0]
      const coverFile = req.files?.cover?.[0]
      if (!audioFile && !coverFile) return res.status(400).json({ message: 'Please choose an audio or cover file.' })

      const oldAudioPublicId = song.audioPublicId
      const oldCoverPublicId = song.coverPublicId

      if (audioFile) {
        song.audioUrl = getUploadedFileUrl(audioFile)
        song.audioPublicId = getUploadedFilePublicId(audioFile)
      }

      if (coverFile) {
        const coverUrl = getUploadedFileUrl(coverFile)
        const coverPublicId = getUploadedFilePublicId(coverFile)

        song.coverUrl = coverUrl
        song.coverPublicId = coverPublicId
        await Song.updateMany({ album: song.album }, { $set: { coverUrl, coverPublicId } })
        await syncAlbumRecord({
          title: song.album,
          artist: song.artist,
          color: song.color,
          emoji: song.emoji,
          coverUrl,
          coverPublicId,
        })
      }

      await song.save()

      await Promise.all([
        audioFile ? deleteCloudinaryAsset(oldAudioPublicId) : Promise.resolve(),
        coverFile ? deleteCloudinaryAsset(oldCoverPublicId) : Promise.resolve(),
      ])

      res.json({ message: 'Song media updated successfully.', song: withMediaFlags(req, song.toObject()) })
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'Song media update failed.' })
    }
  }
)

router.post('/albums/:album/cover', authMiddleware, upload.single('cover'), async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can update album cover.' })

    const albumName = decodeURIComponent(req.params.album)
    if (!req.file) return res.status(400).json({ message: 'Cover image is required.' })

    const [existingAlbum, firstSong] = await Promise.all([Album.findOne({ title: albumName }), Song.findOne({ album: albumName })])
    if (!existingAlbum && !firstSong) return res.status(404).json({ message: 'Album not found.' })

    const coverUrl = getUploadedFileUrl(req.file)
    const coverPublicId = getUploadedFilePublicId(req.file)
    const oldCoverPublicId = existingAlbum?.coverPublicId || ''

    await Promise.all([
      Song.updateMany({ album: albumName }, { $set: { coverUrl, coverPublicId } }),
      Album.findOneAndUpdate(
        { title: albumName },
        {
          $set: {
            coverUrl,
            coverPublicId,
            artist: existingAlbum?.artist || firstSong?.artist || '',
            color: existingAlbum?.color || firstSong?.color || 'linear-gradient(135deg, #333, #666)',
            emoji: existingAlbum?.emoji || firstSong?.emoji || '\uD83C\uDFB5',
          },
          $setOnInsert: { title: albumName },
        },
        { upsert: true, new: true }
      ),
    ])

    if (oldCoverPublicId && oldCoverPublicId !== coverPublicId) {
      await deleteCloudinaryAsset(oldCoverPublicId)
    }

    res.json({ message: 'Album cover updated successfully.', album: albumName, coverUrl: normalizeMediaUrl(req, coverUrl) })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Album cover update failed.' })
  }
})

router.put('/albums/:album', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can rename albums.' })

    const currentAlbum = decodeURIComponent(req.params.album)
    const nextAlbum = safeTrim(req.body.album)
    if (!nextAlbum) return res.status(400).json({ message: 'New album name is required.' })

    if (currentAlbum !== nextAlbum) {
      const [duplicateAlbum, duplicateSongs] = await Promise.all([Album.findOne({ title: nextAlbum }), Song.exists({ album: nextAlbum })])
      if (duplicateAlbum || duplicateSongs) return res.status(409).json({ message: 'Album with this name already exists.' })
    }

    const [storedAlbum, firstSong] = await Promise.all([Album.findOne({ title: currentAlbum }), Song.findOne({ album: currentAlbum })])
    if (!storedAlbum && !firstSong) return res.status(404).json({ message: 'Album not found.' })

    await Promise.all([
      Song.updateMany({ album: currentAlbum }, { $set: { album: nextAlbum } }),
      Album.findOneAndUpdate(
        { title: currentAlbum },
        {
          $set: { title: nextAlbum },
          $setOnInsert: {
            artist: firstSong?.artist || '',
            color: firstSong?.color || 'linear-gradient(135deg, #333, #666)',
            emoji: firstSong?.emoji || '\uD83C\uDFB5',
            coverUrl: firstSong?.coverUrl || '',
            coverPublicId: firstSong?.coverPublicId || '',
          },
        },
        { new: true, upsert: true }
      ),
    ])

    res.json({ message: 'Album renamed successfully.', album: nextAlbum })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Album rename failed.' })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can update songs.' })
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid song id.' })

    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ message: 'Song not found.' })

    const previousAlbum = song.album
    const payload = normalizeSongInput(req.body)
    if (!payload.title || !payload.artist) {
      return res.status(400).json({ message: 'Title and artist are required.' })
    }

    song.title = payload.title
    song.artist = payload.artist
    song.album = payload.album
    song.duration = payload.duration
    song.genre = payload.genre
    song.lyrics = payload.lyrics
    song.emoji = payload.emoji
    song.color = payload.color

    await song.save()
    await syncAlbumRecord({
      title: song.album,
      artist: song.artist,
      color: song.color,
      emoji: song.emoji,
      coverUrl: song.coverUrl,
      coverPublicId: song.coverPublicId,
    })

    if (previousAlbum !== song.album) {
      const removedAlbum = await removeAlbumIfUnused(previousAlbum)
      if (removedAlbum?.coverPublicId) {
        await deleteCloudinaryAsset(removedAlbum.coverPublicId)
      }
    }

    res.json({ message: 'Song updated successfully.', song: withMediaFlags(req, song.toObject()) })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Song update failed.' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can delete songs.' })
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid song id.' })

    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ message: 'Song not found.' })

    const albumTitle = song.album
    const audioPublicId = song.audioPublicId
    const coverPublicId = song.coverPublicId

    await Song.deleteOne({ _id: req.params.id })
    await User.updateMany({}, { $pull: { likedSongs: req.params.id } })
    const removedAlbum = await removeAlbumIfUnused(albumTitle)

    await Promise.all([
      deleteCloudinaryAsset(audioPublicId),
      removedAlbum ? deleteCloudinaryAsset(removedAlbum.coverPublicId || coverPublicId) : Promise.resolve(),
    ])

    res.json({ message: 'Song deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Song deletion failed.' })
  }
})

module.exports = router
