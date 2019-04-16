const Release = require('./model')

const getAll = () => {
  return Release.find().exec()
}

module.exports = {
  getAll
}
