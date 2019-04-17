const echo = require('./echo')
const getlogs = require('./getlogs')
const help = require('./help')
const log = require('./log')
const register = require('./register')
const registeradmin = require('./registeradmin')
const unregister = require('./unregister')

module.exports = {
  echo,
  getlogs,
  help,
  log,
  register,
  registeradmin,
  start: help,
  unregister
}
