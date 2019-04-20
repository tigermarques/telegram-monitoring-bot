const mongoose = require('mongoose')

module.exports = {
  connect: (url = process.env.MONGODB_URL, opts = {}) => {
    return mongoose.connect(
      url,
      { ...opts, useNewUrlParser: true }
    )
  }
}
