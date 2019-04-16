const addRegisterCommand = require('./register')
const addSendMessageCommand = require('./sendMessage')

module.exports = bot => {
  addRegisterCommand(bot)
  addSendMessageCommand(bot)
}
