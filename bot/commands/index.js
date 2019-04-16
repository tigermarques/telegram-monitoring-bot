const addEchoCommand = require('./echo')
const addRegisterCommand = require('./register')
const addLogCommand = require('./log')
const addGetLogsCommand = require('./getLogs')
const addUnregisterCommand = require('./unregister')

module.exports = bot => {
  addEchoCommand(bot)
  addRegisterCommand(bot)
  addLogCommand(bot)
  addGetLogsCommand(bot)
  addUnregisterCommand(bot)
}
