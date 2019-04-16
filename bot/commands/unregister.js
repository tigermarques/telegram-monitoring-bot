const usersModel = require('../model/users')

const registerCommand = bot => {
  bot.onText(/^\/unregister$/, async (msg, match) => {
    const chatId = msg.chat.id
    const username = msg.from.username
    if (!username) {
      bot.sendMessage(chatId, 'Parece que não tens username. Para usar este comando, o teu utilizador tem de ter um username de Telegram')
    } else {
      const user = await usersModel.getByUsername(username)
      if (!user) {
        bot.sendMessage(chatId, 'Para realizar este comando tens de estar registado no bot')
      } else {
        try {
          await usersModel.remove(username)
          bot.sendMessage(chatId, `Utilizador ${username} removido com sucesso`)
        } catch (e) {
          bot.sendMessage(chatId, `Foi encontrado um erro na remoção do utilizador ${username}. O erro foi  '${e.message}'`)
        }
      }
    }
  })
}

module.exports = registerCommand
