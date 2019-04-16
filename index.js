process.env.NTBA_FIX_319 = 1
process.env.NTBA_FIX_350 = 1

const bot = require('./bot')

bot.start().then(() => {
  console.log('Running...')
}).catch(e => {
  console.log('Error...', e)
})
