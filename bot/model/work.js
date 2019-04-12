const fs = require('fs')
const path = require('path')

const getWorkFromFile = () => {
  const filePath = path.resolve(__dirname, 'work.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const writeWorkToFile = (users) => {
  const filePath = path.resolve(__dirname, 'work.json')
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
}

const getAll = () => {
  const work = getWorkFromFile()
  return work
}

const add = (username, month, day, release, workType, hours) => {
  const work = getWorkFromFile()
  work.push({
    username,
    month,
    day,
    release,
    workType,
    hours
  })
  writeWorkToFile(work)
}

module.exports = {
  getAll,
  add
}
