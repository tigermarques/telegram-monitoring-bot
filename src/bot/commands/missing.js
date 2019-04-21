const Extra = require('telegraf/extra')
const workModel = require('../../model/work')

const command = async ctx => {
  const username = ctx.state.from
  const missingRecords = await workModel.getMissing(username, true)

  if (missingRecords.length > 0) {
    ctx.reply([
      'Tens as seguintes horas em falta:',
      missingRecords.map(item => `${item.date.toISOString().split('T')[0]} - ${item.missingHours} hora(s)`).join('\n'),
      '',
      'Por favor usa o commando /getlogs para verificares o que já registaste, e o comando /log para registar o que tens em falta'
    ].join('\n'), Extra.HTML())
  } else {
    ctx.reply('Não existem horas em falta 👍')
  }
}

module.exports = command
