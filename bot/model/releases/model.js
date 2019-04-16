const mongoose = require('mongoose')

const workTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
)

const Release = mongoose.model('release', workTypeSchema)

module.exports = Release
