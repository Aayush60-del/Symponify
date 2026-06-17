const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, default: '', trim: true },
    duration: { type: String, default: '' },
    genre: { type: String, default: '', trim: true },
    coverUrl: { type: String, default: '' },
    coverPublicId: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    audioPublicId: { type: String, default: '' },
    emoji: { type: String, default: '\uD83C\uDFB5' },
    color: { type: String, default: 'linear-gradient(135deg, #333, #666)' },
    likes: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    collection: 'Songs_col',
  }
)

module.exports = mongoose.model('Song', SongSchema)
