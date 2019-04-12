const fs = require('fs')
const path = require('path')

const getReleasesFromFile = () => {
  const filePath = path.resolve(__dirname, 'releases.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const getAll = () => {
  const releases = getReleasesFromFile()
  return releases
}

module.exports = {
  getAll
}
