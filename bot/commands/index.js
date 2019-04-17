const getlogs = require('./getlogs')
const help = require('./help')
const log = require('./log')
const missing = require('./missing')
const register = require('./register')
const registeradmin = require('./registeradmin')
const unregister = require('./unregister')

module.exports = {
  getlogs,
  help,
  log,
  missing,
  register,
  registeradmin,
  start: help,
  unregister
}
