const mongoose = require('mongoose')
const Mockgoose = require('mockgoose').Mockgoose
const TelegramServer = require('telegram-test-api')
require('dotenv').config()
const Bot = require('../../../src/bot')
const db = require('../../../src/utils/db')
const { expect } = require('chai')

const mockStorage = new Mockgoose(mongoose)

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Telegram bot test', () => {
  const serverConfig = { port: 9001 }
  const token = process.env.TELEGRAM_API_TOKEN
  let server, client, botInstance

  before(async () => {
    await mockStorage.prepareStorage()
    await db.connect()
  })

  beforeEach(async () => {
    server = new TelegramServer(serverConfig)
    await mockStorage.helper.reset()
    await server.start()
    client = server.getClient(token, { timeout: 5000 })
    botInstance = new Bot(token, { telegram: { apiRoot: server.ApiURL } })
    botInstance.start()
  })

  afterEach(async () => {
    await botInstance.stop()
    // waiting is not actually needed, but prevents a few logs of failed HTTP calls
    await sleep(50)
    await server.stop()
  })

  it('should return start content', async () => {
    const command = client.makeCommand('/start')
    const res = await client.sendCommand(command)
    expect(res.ok).to.eql(true)
    const updates = await client.getUpdates()
    expect(updates.ok).to.eql(true)
    expect(updates.result).to.have.length(1)
  })
})
