const addEchoCommand = require('./echo')
const addRegisterCommand = require('./register')
const addLogCommand = require('./log')

module.exports = bot => {
  addEchoCommand(bot)
  addRegisterCommand(bot)
  addLogCommand(bot)
}
