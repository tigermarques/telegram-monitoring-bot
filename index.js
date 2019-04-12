process.env.NTBA_FIX_319 = 1

require('./bot')

/* const usersModel = require('./model/users')
const releasesModel = require('./model/releases')
const workTypesModel = require('./model/workTypes')
const workModel = require('./model/work')

const logCache = {} */

/* const handleMonthResponse = function (chatId, firstMessageId, username, month) {
  logCache[username].month = month

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{
        text: '1',
        callback_data: `log,day,${firstMessageId},1`
      }, {
        text: '2',
        callback_data: `log,day,${firstMessageId},2`
      }, {
        text: '3',
        callback_data: `log,day,${firstMessageId},3`
      }, {
        text: '4',
        callback_data: `log,day,${firstMessageId},4`
      }, {
        text: '5',
        callback_data: `log,day,${firstMessageId},5`
      }, {
        text: '6',
        callback_data: `log,day,${firstMessageId},6`
      }], [{
        text: '7',
        callback_data: `log,day,${firstMessageId},7`
      }, {
        text: '8',
        callback_data: `log,day,${firstMessageId},8`
      }, {
        text: '9',
        callback_data: `log,day,${firstMessageId},9`
      }, {
        text: '10',
        callback_data: `log,day,${firstMessageId},10`
      }, {
        text: '11',
        callback_data: `log,day,${firstMessageId},11`
      }, {
        text: '12',
        callback_data: `log,day,${firstMessageId},12`
      }], [{
        text: '13',
        callback_data: `log,day,${firstMessageId},13`
      }, {
        text: '14',
        callback_data: `log,day,${firstMessageId},14`
      }, {
        text: '15',
        callback_data: `log,day,${firstMessageId},15`
      }, {
        text: '16',
        callback_data: `log,day,${firstMessageId},16`
      }, {
        text: '17',
        callback_data: `log,day,${firstMessageId},17`
      }, {
        text: '18',
        callback_data: `log,day,${firstMessageId},18`
      }], [{
        text: '19',
        callback_data: `log,day,${firstMessageId},19`
      }, {
        text: '20',
        callback_data: `log,day,${firstMessageId},20`
      }, {
        text: '21',
        callback_data: `log,day,${firstMessageId},21`
      }, {
        text: '22',
        callback_data: `log,day,${firstMessageId},22`
      }, {
        text: '23',
        callback_data: `log,day,${firstMessageId},23`
      }, {
        text: '24',
        callback_data: `log,day,${firstMessageId},24`
      }], [{
        text: '25',
        callback_data: `log,day,${firstMessageId},25`
      }, {
        text: '26',
        callback_data: `log,day,${firstMessageId},26`
      }, {
        text: '27',
        callback_data: `log,day,${firstMessageId},27`
      }, {
        text: '28',
        callback_data: `log,day,${firstMessageId},28`
      }, {
        text: '29',
        callback_data: `log,day,${firstMessageId},29`
      }, {
        text: '30',
        callback_data: `log,day,${firstMessageId},30`
      }], [{
        text: '31',
        callback_data: `log,day,${firstMessageId},31`
      } ]]
    }
  }

  bot.sendMessage(chatId, 'Please choose the day', options)
}

const handleDayResponse = function (chatId, firstMessageId, username, day) {
  logCache[username].day = day

  const onGoingReleases = releases.getAll()

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: []
    }
  }

  const mappedReleases = onGoingReleases.map(rel => {
    return [{
      text: rel,
      callback_data: `log,release,${firstMessageId},${rel}`
    }]
  })

  options.reply_markup.inline_keyboard = mappedReleases

  bot.sendMessage(chatId, 'Please choose the release', options)
}

const handleWorkResponse = function (chatId, firstMessageId, username, work) {
  logCache[username].workType = work

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{
        text: '1',
        callback_data: `log,hours,${firstMessageId},1`
      }, {
        text: '2',
        callback_data: `log,hours,${firstMessageId},2`
      }, {
        text: '3',
        callback_data: `log,hours,${firstMessageId},3`
      }, {
        text: '4',
        callback_data: `log,hours,${firstMessageId},4`
      }], [{
        text: '5',
        callback_data: `log,hours,${firstMessageId},5`
      }, {
        text: '6',
        callback_data: `log,hours,${firstMessageId},6`
      }, {
        text: '7',
        callback_data: `log,hours,${firstMessageId},7`
      }, {
        text: '8',
        callback_data: `log,hours,${firstMessageId},8`
      }]]
    }
  }

  bot.sendMessage(chatId, 'Please choose the number of hours', options)
}

const handleReleaseResponse = function (chatId, firstMessageId, username, release) {
  logCache[username].release = release

  const existingWorkTypes = workTypes.getAll()

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: []
    }
  }

  const mappedTypes = existingWorkTypes.map(type => {
    return [{
      text: type,
      callback_data: `log,work,${firstMessageId},${type}`
    }]
  })

  options.reply_markup.inline_keyboard = mappedTypes

  bot.sendMessage(chatId, 'Please choose the type of work', options)
}

const handleHoursResponse = function (chatId, firstMessageId, username, hours) {
  logCache[username].hours = hours

  bot.deleteMessage(chatId, firstMessageId)
  work.add(username, logCache[username].month, logCache[username].day, logCache[username].release, logCache[username].workType, logCache[username].hours)
  bot.sendMessage(chatId, `Your selection was ${logCache[username].month}, ${logCache[username].day}, ${logCache[username].release}, ${logCache[username].workType}, ${logCache[username].hours}`)
}

bot.onText(/^\/log$/, (msg, match) => {
  const username = msg.from.username
  const chatId = msg.chat.id
  if (!username) {
    bot.sendMessage(chatId, 'Your user does not have a username. Please set a username and try again.')
  } else {
    const user = users.getByUsername(username)
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

bot.on('callback_query', function (data) {
  const regex = /^(log),(month|day|hours|release|work),(\d*),(.*)$/
  if (regex.test(data.data)) {
    const groups = data.data.match(regex)

    const firstMessageId = groups[3]
    let username = ''
    for (let user in logCache) {
      if (logCache[user] && logCache[user].firstMessageId.toString() === firstMessageId) {
        username = logCache[user].username
      }
    }

    switch (groups[2]) {
      case 'month':
        bot.answerCallbackQuery(data.id)
        bot.deleteMessage(data.message.chat.id, data.message.message_id)
        handleMonthResponse(data.message.chat.id, firstMessageId, username, groups[4])
        break
      case 'day':
        bot.answerCallbackQuery(data.id)
        bot.deleteMessage(data.message.chat.id, data.message.message_id)
        handleDayResponse(data.message.chat.id, firstMessageId, username, groups[4])
        break
      case 'hours':
        bot.answerCallbackQuery(data.id)
        bot.deleteMessage(data.message.chat.id, data.message.message_id)
        handleHoursResponse(data.message.chat.id, firstMessageId, username, groups[4])
        break
      case 'release':
        bot.answerCallbackQuery(data.id)
        bot.deleteMessage(data.message.chat.id, data.message.message_id)
        handleReleaseResponse(data.message.chat.id, firstMessageId, username, groups[4])
        break
      case 'work':
        bot.answerCallbackQuery(data.id)
        bot.deleteMessage(data.message.chat.id, data.message.message_id)
        handleWorkResponse(data.message.chat.id, firstMessageId, username, groups[4])
        break
    }
  }
}) */
