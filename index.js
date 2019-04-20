process.env.NTBA_FIX_319 = 1
process.env.NTBA_FIX_350 = 1

const bot = require('./src/bot')
const db = require('./src/utils/db')

db.connect()
  .then(() => bot.start())
  .then(() => {
    console.log('Running...')
  }).catch(e => {
    console.log('Error...', e)
  })
