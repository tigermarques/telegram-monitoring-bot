const usersModel = require('../model/users')
const Interaction = require('../utils/interaction')

const prepareQuestion1 = async (username) => {
  const allUsers = await usersModel.getAll()
  const allButMe = allUsers.filter(item => item.username !== username)
  const keyboard = allButMe.map(user => {
    return [{
      text: user.username,
      callback_data: user.username
    }]
  })
  return {
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    },
    text: 'Escolhe o utilizador para o qual queres enviar uma mensagem'
  }
}

const prepareQuestion2 = async (username) => {
  return {
    text: `Por favor escreve a mensagem a enviar para o ${username}`
  }
}

const registerCommand = bot => {
  bot.onText(/^\/sendMessage$/, async (msg, match) => {
    const chatId = msg.chat.id
    const username = msg.from.username

    if (!username) {
      bot.sendMessage(chatId, 'Parece que não tens username. Para usar este comando, o teu utilizador tem de ter um username de Telegram')
    } else {
      const user = await usersModel.getByUsername(username)
      if (!user) {
        bot.sendMessage(chatId, 'Parece que ainda não te registaste. Usa o comando /register para te registares no bot')
      } else if (!user.isAdmin) {
        bot.sendMessage(chatId, 'Não tens privilégios para utilizar este comando')
      } else {
        const interaction = Interaction.create(bot, chatId)

        if (interaction) {
          try {
            const question1 = await prepareQuestion1(username)
            const reply1 = await interaction.send(question1.text, question1.options)

            const question2 = await prepareQuestion2(reply1.data)
            const reply2 = await interaction.send(question2.text, question2.options)

            interaction.end()

            const userToSend = await usersModel.getByUsername(reply1.data)
            const textToSend = reply2.text

            bot.sendMessage(userToSend.chatId, `O utilizador ${username} disse o seguinte:
${textToSend}`)
          } catch (error) {
            console.log(error)
          }
        } else {
          bot.sendMessage(chatId, 'O commando já está a correr. As mensagens vão ser apagadas em 5 segundos')
            .then(message => {
              setTimeout(() => {
                bot.deleteMessage(chatId, message.message_id)
                bot.deleteMessage(chatId, msg.message_id)
              }, 5000)
            })
            .catch(error => {
              interaction.end()
              console.log(error)
            })
        }
      }
    }
  })
}

module.exports = registerCommand
