const usersModel = require('../model/users')

const logCache = {}

const registerCommand = bot => {
  bot.onText(/^\/log$/, (msg, match) => {
    const username = msg.from.username
    const chatId = msg.chat.id
    if (!username) {
      bot.sendMessage(chatId, 'Your user does not have a username. Please set a username and try again.')
    } else {
      const user = usersModel.getByUsername(username)
      if (!user) {
        bot.sendMessage(chatId, 'Please register using the /register command before running this command')
      } else {
        // clear past logs
        delete logCache[username]

        logCache[username] = {
          username: username
        }

        return bot.sendMessage(chatId, 'Let\'s start with the date').then(result => {
          const firstMessageId = result.message_id

          logCache[username].firstMessageId = firstMessageId

          const options = {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[{
                text: 'January',
                callback_data: `log,month,${firstMessageId},January`
              }, {
                text: 'February',
                callback_data: `log,month,${firstMessageId},February`
              }, {
                text: 'March',
                callback_data: `log,month,${firstMessageId},March`
              }, {
                text: 'April',
                callback_data: `log,month,${firstMessageId},April`
              }], [{
                text: 'May',
                callback_data: `log,month,${firstMessageId},May`
              }, {
                text: 'June',
                callback_data: `log,month,${firstMessageId},June`
              }, {
                text: 'July',
                callback_data: `log,month,${firstMessageId},July`
              }, {
                text: 'August',
                callback_data: `log,month,${firstMessageId},August`
              }], [{
                text: 'September',
                callback_data: `log,month,${firstMessageId},September`
              }, {
                text: 'October',
                callback_data: `log,month,${firstMessageId},October`
              }, {
                text: 'November',
                callback_data: `log,month,${firstMessageId},November`
              }, {
                text: 'December',
                callback_data: `log,month,${firstMessageId},December`
              }]]
            }
          }

          bot.sendMessage(chatId, 'Please choose the month', options)
        })
      }
    }
  })
}

module.exports = registerCommand
