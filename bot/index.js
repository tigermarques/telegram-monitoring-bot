const TelegramBot = require('node-telegram-bot-api')
const addCommands = require('./commands')
const addAdminCommands = require('./adminCommands')
const db = require('./utils/db')
const InteractionManager = require('./utils/InteractionManager')

const start = async () => {
  await db.connect()
  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true })

  InteractionManager.setup(bot)
  addCommands(bot)
  addAdminCommands(bot)

  bot.on('polling_error', error => {
    console.log(error)
  })

  return bot
}

module.exports = {
  start
}
