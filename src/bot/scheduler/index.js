const schedule = require('node-schedule')
const Extra = require('telegraf/extra')
const userModel = require('../../model/users')
const workModel = require('../../model/work')

module.exports = {
  start: (bot) => {
    if (process.env.NODE_ENV === 'production') {
      schedule.scheduleJob('0 10 ? * 1-5', async () => {
        const users = await userModel.getAll()

        for (let i = 0; i < users.length; i++) {
          const user = users[i]
          const missingRecords = await workModel.getMissing(user.username, false)

          if (missingRecords.length > 0) {
            if (user.username === 'jgmarques') {
              bot.telegram.sendMessage(user.chatId, [
                'Tens as seguintes horas em falta:',
                missingRecords.map(item => `${item.date.toISOString().split('T')[0]} - ${item.missingHours} hora(s)`).join('\n'),
                '',
                'Por favor usa o commando /getlogs para verificares o que já registaste, e o comando /log para registar o que tens em falta',
                '',
                'Esta é uma mensagem gerada automaticamente'
              ].join('\n'), Extra.HTML())
            }
          }
        }
      })
    }
  }
}
