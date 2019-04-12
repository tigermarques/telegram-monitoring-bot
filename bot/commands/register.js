const usersModel = require('../model/users')

const registerCommand = bot => {
  bot.onText(/^\/register$/, (msg, match) => {
    const chatId = msg.chat.id
    const username = msg.from.username
    if (!username) {
      bot.sendMessage(chatId, 'Your user does not have a username. Please set a username and try again.')
    } else {
      const user = usersModel.getByUsername(username)
      if (user) {
        bot.sendMessage(chatId, 'Your user is already registered.')
      } else {
        try {
          usersModel.create(username, chatId, false)
          bot.sendMessage(chatId, `Successfully registered user ${username}`)
        } catch (e) {
          bot.sendMessage(chatId, `Found an error registering user ${username}: ${e.message}`)
        }
      }
    }
  })
}

module.exports = registerCommand
