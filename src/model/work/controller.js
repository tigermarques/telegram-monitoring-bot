const Work = require('./model')

const getAll = () => {
  return Work.find().exec()
}

const add = (username, month, day, release, workType, hours) => {
  const date = Date.UTC(2019, month, day, 0, 0, 0)
  const newUser = new Work({
    username,
    release,
    workType,
    workDate: date,
    hours
  })
  return newUser.save()
}

module.exports = {
  getAll,
  add
}
