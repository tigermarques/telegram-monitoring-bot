/* const TelegramServer = require('telegram-test-api')
require('dotenv').config()
const bot = require('../../../bot')

describe.only('Telegram bot test', () => {
  let serverConfig = { port: 9001, host: '127.0.0.1' }
  const token = process.env.TELEGRAM_API_TOKEN
  let server
  let client
  beforeEach(() => {
    server = new TelegramServer(serverConfig)
    return server.start().then(() => {
      client = server.getClient(token, { timeout: 5000 })
      return bot.start({
        telegram: {
          apiRoot: server.ApiURL
        }
      }).then(botInstance => {
        botInstance.command('start', ctx => {
          console.log(JSON.stringify(ctx, null, 2))
          ctx.reply('Hi')
        })
      })
    })
  })

  afterEach(function () {
    return server.stop()
  })

  it('should return help content', async () => {
    const message = client.makeMessage('/start')
    await client.sendMessage(message)
    const updates = await client.getUpdates()
    console.log(`Client received messages: ${JSON.stringify(updates.result)}`)
    if (updates.result.length !== 1) {
      throw new Error('updates queue should contain one message!')
    }
  })
}) */
