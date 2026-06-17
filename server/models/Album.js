const mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    artist: { type: String, default: '', trim: true },
    color: { type: String, default: 'linear-gradient(135deg, #333, #666)' },
    emoji: { type: String, default: '\uD83C\uDFB5' },
    coverUrl: { type: String, default: '' },
    coverPublicId: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'Albums_col',
  }
)

module.exports = mongoose.model('Album', AlbumSchema)
