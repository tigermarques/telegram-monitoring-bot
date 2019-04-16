const usersModel = require('../model/users')
const releasesModel = require('../model/releases')
const workTypesModel = require('../model/workTypes')
const workModel = require('../model/work')
const Interaction = require('../utils/interaction')

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const prepareQuestion1 = async () => {
  const keyboard = []
  let row = null
  for (let i = 0; i < months.length; i++) {
    if (i % 4 === 0) {
      row = []
      keyboard.push(row)
    }
    row.push({
      text: months[i],
      callback_data: i
    })
  }
  return {
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    },
    text: 'Começa por escolher a data para o registo'
  }
}

const prepareQuestion2 = async (monthChosen) => {
  const days = new Date(2019, monthChosen + 1, 0).getDate()

  const keyboard = []
  let row = null
  for (let i = 0; i < days; i++) {
    if (i % 6 === 0) {
      row = []
      keyboard.push(row)
    }
    row.push({
      text: i + 1,
      callback_data: i + 1
    })
  }
  return {
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    },
    text: 'Começa por escolher a data para o registo'
  }
}

const prepareQuestion3 = async () => {
  const onGoingReleases = await releasesModel.getAll()

  const keyboard = onGoingReleases.map(rel => {
    return [{
      text: rel.name,
      callback_data: rel.name
    }]
  })

  return {
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    },
    text: 'Em que Release vais registar estas horas?'
  }
}

const prepareQuestion4 = async () => {
  const existingWorkTypes = await workTypesModel.getAll()

  const keyboard = existingWorkTypes.map(type => {
    return [{
      text: type.name,
      callback_data: type.name
    }]
  })

  return {
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    },
    text: 'Qual o tipo de trabalho desenvolvido?'
  }
}

const prepareQuestion5 = async () => {
  const keyboard = []
  let row = null
  for (let i = 0; i < 8; i++) {
    if (i % 4 === 0) {
      row = []
      keyboard.push(row)
    }
    row.push({
      text: i + 1,
      callback_data: i + 1
    })
  }
  return {
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    },
    text: 'Quantas horas pretendes registar?'
  }
}

const registerCommand = bot => {
  bot.onText(/^\/log$/, async (msg, match) => {
    const chatId = msg.chat.id
    const username = msg.from.username

    if (!username) {
      bot.sendMessage(chatId, 'Parece que não tens username. Para usar este comando, o teu utilizador tem de ter um username de Telegram')
    } else {
      const user = await usersModel.getByUsername(username)
      if (!user) {
        bot.sendMessage(chatId, 'Parece que ainda não te registaste. Usa o comando /register para te registares no bot')
      } else {
        const interaction = Interaction.create(bot, chatId)

        if (interaction) {
          try {
            const question1 = await prepareQuestion1()
            const reply1 = await interaction.send(question1.text, question1.options)

            const question2 = await prepareQuestion2(reply1.data)
            await interaction.send(question2.text, question2.options)

            const question3 = await prepareQuestion3()
            await interaction.send(question3.text, question3.options)

            const question4 = await prepareQuestion4()
            await interaction.send(question4.text, question4.options)

            const question5 = await prepareQuestion5()
            await interaction.send(question5.text, question5.options)

            const allMessages = interaction.end()

            if (allMessages.length === 10) {
              const replies = allMessages.filter(item => item.type === 'user_reply').map(item => item.data.data)
              const month = Number(replies[0])
              const day = Number(replies[1])
              const newWork = await workModel.add(username, month, day, replies[2], replies[3], Number(replies[4]))
              bot.sendMessage(chatId, `O teu registo foi efectuado com sucesso. Obrigado!
Data: ${newWork.workDate.toISOString().split('T')[0]}
Release: ${newWork.release}
Tipo de Trabalho: ${newWork.workType}
Nº Horas: ${newWork.hours}`)
            }
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
