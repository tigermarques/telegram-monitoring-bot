const Extra = require('telegraf/extra')
const workModel = require('../model/work')

const startDateToCheck = new Date(Date.UTC(2019, 3, 15, 0, 0, 0))

const getDates = function (startDate, endDate) {
  const dates = []
  let currentDate = startDate
  const addDays = function (days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }
  while (currentDate <= endDate) {
    dates.push(currentDate)
    currentDate = addDays.call(currentDate, 1)
  }
  return dates
}

const command = async ctx => {
  const username = ctx.state.from
  const dates = getDates(startDateToCheck, new Date(Date.now()))
  const allWork = await workModel.getAll()
  const missingRecords = []

  dates.forEach(date => {
    const workHours = allWork.filter(item => {
      return item.username === username && item.workDate.getTime() === date.getTime()
    }).reduce((prev, item) => prev + item.hours, 0)

    if (workHours < 8) {
      missingRecords.push({
        date: date,
        missingHours: 8 - workHours
      })
    }
  })

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
