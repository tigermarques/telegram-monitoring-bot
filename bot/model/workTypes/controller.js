const WorkType = require('./model')

const getAll = () => {
  return WorkType.find().exec()
}

module.exports = {
  getAll
}
