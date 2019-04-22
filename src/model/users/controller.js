const User = require('./model')

const getAll = () => {
  return User.find().exec()
}

const getByUsername = (username) => {
  return User.findOne({ username }).exec()
}

const create = (username, chatId, isAdmin) => {
  const newUser = new User({
    username,
    chatId,
    isAdmin
  })
  return newUser.save()
}

const remove = (username) => {
  return User.deleteOne({ username }).exec()
}

const updateVacation = async (username, newHolidays) => {
  const user = await User.findOne({ username }).exec()
  user.holidays = newHolidays
  return user.save()
}

const updateOfficialHolidays = async (username, newHolidays) => {
  const user = await User.findOne({ username }).exec()
  user.officialHolidays = newHolidays
  return user.save()
}

const updateTraining = async (username, newTraining) => {
  const user = await User.findOne({ username }).exec()
  user.trainings = newTraining
  return user.save()
}

const updateAbsences = async (username, newAbsences) => {
  const user = await User.findOne({ username }).exec()
  user.absences = newAbsences
  return user.save()
}

module.exports = {
  getAll,
  getByUsername,
  create,
  remove,
  updateAbsences,
  updateOfficialHolidays,
  updateVacation,
  updateTraining
}
