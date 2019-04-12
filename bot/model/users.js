const fs = require('fs')
const path = require('path')

const getUsersFromFile = () => {
  const filePath = path.resolve(__dirname, 'users.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const writeUsersToFile = (users) => {
  const filePath = path.resolve(__dirname, 'users.json')
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
}

const getAll = () => {
  const users = getUsersFromFile()
  return users
}

const getByUsername = (username) => {
  const users = getUsersFromFile()
  const user = users.find(item => item.username === username)
  return user
}

const create = (username, chatId, isAdmin) => {
  const user = getByUsername(username)
  if (user) {
    throw new Error(`User with username ${username} already exists`)
  }
  const users = getUsersFromFile()
  users.push({
    username,
    chatId,
    isAdmin
  })
  writeUsersToFile(users)
}

module.exports = {
  getAll,
  getByUsername,
  create
}
