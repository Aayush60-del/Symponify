const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    isAdmin: { type: Boolean, default: false },
    likedSongs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'User_col',
  }
)

UserSchema.pre('save', async function savePassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

module.exports = mongoose.model('User', UserSchema)
