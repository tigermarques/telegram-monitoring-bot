const Telegraf = require('telegraf')
const session = require('telegraf/session')
const commandParts = require('telegraf-command-parts')
const commands = require('./commands')
const adminCommands = require('./adminCommands')
const middleware = require('./middleware')
const scheduler = require('./scheduler')

class Bot {
  constructor (token = process.env.TELEGRAM_API_TOKEN, options = {}) {
    this.bot = new Telegraf(token, options)

    // this stores the commands in ctx.state.command, with the following properties
    // text '/start@yourbot Hello world!'
    // command 'start'
    // bot 'yourbot'
    // args 'Hello world!'
    // splitArgs ['Hello', 'world!']
    this.bot.use(session())
    this.bot.use(commandParts())
    this.bot.use(middleware.filterScope(middleware.checkUsername, { exclude: ['start', 'help'] }))
    this.bot.use(middleware.filterScope(middleware.checkRegister(false), { include: ['register', 'registeradmin'] }))
    this.bot.use(middleware.filterScope(middleware.checkRegister(true),
      { include: ['unregister', 'sendmessage', 'log', 'getlogs', 'missing'] }))
    this.bot.use(middleware.filterScope(middleware.checkAdmin(true), { include: ['sendmessage', 'changesettings'] }))

    this.bot.use(commands.log)
    this.bot.use(adminCommands.changesettings)
    this.bot.use(adminCommands.sendmessage)
    this.bot.use(commands.getlogs)
    this.bot.start(commands.help)
    this.bot.help(commands.help)
    this.bot.command('register', commands.register)
    this.bot.command('registeradmin', commands.registeradmin)
    this.bot.command('unregister', commands.unregister)
    this.bot.command('missing', commands.missing)
  }

  start () {
    scheduler.start(this.bot)
    return this.bot.startPolling()
  }

  stop () {
    return this.bot.stop()
  }
}

/* const start = async (options = {}) => {
  const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN, options)

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
    { include: ['unregister', 'sendmessage', 'log', 'getlogs', 'missing'] }))
  bot.use(middleware.filterScope(middleware.checkAdmin(true), { include: ['sendmessage', 'changesettings'] }))

  bot.use(commands.log)
  bot.use(adminCommands.changesettings)
  bot.use(adminCommands.sendmessage)
  bot.use(commands.getlogs)
  bot.start(commands.help)
  bot.help(commands.help)
  bot.command('register', commands.register)
  bot.command('registeradmin', commands.registeradmin)
  bot.command('unregister', commands.unregister)
  bot.command('missing', commands.missing)

  bot.startPolling()

  scheduler.start(bot)

  return bot
}

const stop = async bot => {
  bot.stopPolling()
} */

module.exports = Bot
