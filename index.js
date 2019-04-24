process.env.NTBA_FIX_319 = 1
process.env.NTBA_FIX_350 = 1

const Bot = require('./src/bot')
const db = require('./src/utils/db')

const botInstance = new Bot()

db.connect()
  .then(() => botInstance.start())
  .then(() => {
    console.log('Running...')
  }).catch(e => {
    console.log('Error...', e)
  })
