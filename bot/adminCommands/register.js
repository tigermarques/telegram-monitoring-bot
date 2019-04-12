const usersModel = require('../model/users')

const registerCommand = bot => {
  bot.onText(/\/registerAdmin (.+)/, (msg, match) => {
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
          const password = match[1]
          if (password === 'test_password') {
            usersModel.create(username, chatId, true)
            bot.sendMessage(chatId, `Successfully registered user ${username}`)
          } else {
            bot.sendMessage(chatId, 'Wrong password')
          }
        } catch (e) {
          bot.sendMessage(chatId, `Found an error registering user ${username}`)
        }
      }
    }
  })
}

module.exports = registerCommand
