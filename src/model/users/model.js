const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    chatId: {
      type: Number,
      required: true,
      unique: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    holidays: [Date],
    officialHolidays: [Date],
    trainings: [Date]
  },
  { timestamps: true }
)

const User = mongoose.model('user', userSchema)

module.exports = User
