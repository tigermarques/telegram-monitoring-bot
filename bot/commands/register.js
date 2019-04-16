const usersModel = require('../model/users')

const registerCommand = bot => {
  bot.onText(/^\/register$/, async (msg, match) => {
    const chatId = msg.chat.id
    const username = msg.from.username
    if (!username) {
      bot.sendMessage(chatId, 'Parece que não tens username. Para usar este comando, o teu utilizador tem de ter um username de Telegram')
    } else {
      const user = await usersModel.getByUsername(username)
      if (user) {
        bot.sendMessage(chatId, 'Já estás registado no bot')
      } else {
        try {
          await usersModel.create(username, chatId, false)
          bot.sendMessage(chatId, `Utilizador ${username} registado com sucesso`)
        } catch (e) {
          bot.sendMessage(chatId, `Foi encontrado um erro no registo do utilizador ${username}. O erro foi  '${e.message}'`)
        }
      }
    }
  })
}

module.exports = registerCommand
