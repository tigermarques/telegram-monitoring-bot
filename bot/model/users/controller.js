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

module.exports = {
  getAll,
  getByUsername,
  create,
  remove
}
