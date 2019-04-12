const TelegramBot = require('node-telegram-bot-api')
const addCommands = require('./commands')
const addAdminCommands = require('./adminCommands')

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true })

addCommands(bot)
addAdminCommands(bot)

module.exports = bot
