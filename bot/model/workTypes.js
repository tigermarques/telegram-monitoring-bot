const fs = require('fs')
const path = require('path')

const getWorkTypesFromFile = () => {
  const filePath = path.resolve(__dirname, 'workTypes.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const getAll = () => {
  const workTypes = getWorkTypesFromFile()
  return workTypes
}

module.exports = {
  getAll
}
