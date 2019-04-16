const mongoose = require('mongoose')

const workSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    release: {
      type: String,
      required: true
    },
    workType: {
      type: String,
      required: true
    },
    workDate: {
      type: Date,
      required: true
    },
    hours: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    }
  },
  { timestamps: true }
)

const Work = mongoose.model('work', workSchema)

module.exports = Work
