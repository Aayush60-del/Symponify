const mongoose = require('mongoose')
const router = require('express').Router()
const Playlist = require('../models/Playlist')
const Song = require('../models/Song')
const authMiddleware = require('../middleware/authMiddleware')
const { withMediaFlags } = require('../utils/media')
const { safeTrim } = require('../utils/validation')

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

const formatPlaylist = (req, playlist) => ({
  ...playlist.toObject(),
  songs: playlist.songs.map((song) => withMediaFlags(req, song.toObject ? song.toObject() : song)),
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate('songs').sort({ createdAt: -1 })
    res.json(playlists.map((playlist) => formatPlaylist(req, playlist)))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load playlists.' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const name = safeTrim(req.body.name)
    const songs = Array.isArray(req.body.songs) ? req.body.songs.filter(isValidObjectId) : []

    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required.' })
    }

    const existing = await Playlist.findOne({ user: req.user.id, name })
    if (existing) {
      return res.status(409).json({ message: 'Playlist already exists.' })
    }

    const playlist = await Playlist.create({ name, songs, user: req.user.id })
    await playlist.populate('songs')
    res.status(201).json(formatPlaylist(req, playlist))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to create playlist.' })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid playlist id.' })
    }

    const name = safeTrim(req.body.name)
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required.' })
    }

    const duplicate = await Playlist.findOne({ _id: { $ne: req.params.id }, user: req.user.id, name })
    if (duplicate) {
      return res.status(409).json({ message: 'Playlist already exists.' })
    }

    const playlist = await Playlist.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { name }, { new: true }).populate('songs')
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' })
    }

    res.json(formatPlaylist(req, playlist))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to rename playlist.' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid playlist id.' })
    }

    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' })
    }

    res.json({ message: 'Playlist deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to delete playlist.' })
  }
})

router.post('/:id/songs', authMiddleware, async (req, res) => {
  try {
    const songId = req.body.songId
    if (!isValidObjectId(req.params.id) || !isValidObjectId(songId)) {
      return res.status(400).json({ message: 'Valid playlist and song ids are required.' })
    }

    const [playlist, song] = await Promise.all([
      Playlist.findOne({ _id: req.params.id, user: req.user.id }),
      Song.findById(songId),
    ])

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' })
    }

    if (!song) {
      return res.status(404).json({ message: 'Song not found.' })
    }

    if (!playlist.songs.some((item) => item.toString() === songId)) {
      playlist.songs.push(songId)
      await playlist.save()
    }

    await playlist.populate('songs')
    res.json(formatPlaylist(req, playlist))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to add song to playlist.' })
  }
})

router.delete('/:id/songs/:songId', authMiddleware, async (req, res) => {
  try {
    const { id, songId } = req.params
    if (!isValidObjectId(id) || !isValidObjectId(songId)) {
      return res.status(400).json({ message: 'Valid playlist and song ids are required.' })
    }

    const playlist = await Playlist.findOne({ _id: id, user: req.user.id })
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' })
    }

    playlist.songs = playlist.songs.filter((item) => item.toString() !== songId)
    await playlist.save()
    await playlist.populate('songs')

    res.json(formatPlaylist(req, playlist))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to remove song from playlist.' })
  }
})

module.exports = router
