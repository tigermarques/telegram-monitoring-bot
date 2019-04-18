const Telegraf = require('telegraf')
const session = require('telegraf/session')
const commandParts = require('telegraf-command-parts')
const db = require('./utils/db')
const commands = require('./commands')
const adminCommands = require('./adminCommands')
const middleware = require('./middleware')

const start = async () => {
  await db.connect()
  const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN)

  // this stores the commands in ctx.state.command, with the following properties
  // text '/start@yourbot Hello world!'
  // command 'start'
  // bot 'yourbot'
  // args 'Hello world!'
  // splitArgs ['Hello', 'world!']
  bot.use(session())
  bot.use(commandParts())
  bot.use(middleware.filterScope(middleware.checkUsername, { exclude: ['start', 'help'] }))
  bot.use(middleware.filterScope(middleware.checkRegister(false), { include: ['register', 'registeradmin'] }))
  bot.use(middleware.filterScope(middleware.checkRegister(true),
    { include: ['unregister', 'sendmessage', 'log', 'getlogs', 'getuserlogs', 'missing'] }))
  bot.use(middleware.filterScope(middleware.checkAdmin(true), { include: ['sendmessage', 'getuserlogs', 'changesettings'] }))

  bot.start(commands.help)
  bot.help(commands.help)
  bot.command('register', commands.register)
  bot.command('registeradmin', commands.registeradmin)
  bot.command('unregister', commands.unregister)
  bot.command('getlogs', commands.getlogs)
  bot.command('missing', commands.missing)
  bot.use(commands.log)
  bot.use(adminCommands.changesettings)
  bot.use(adminCommands.sendmessage)
  bot.use(adminCommands.getuserlogs)

  bot.launch()

  return bot
}

module.exports = {
  start
}
