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

const WorkType = mongoose.model('work-type', workTypeSchema)

module.exports = WorkType
