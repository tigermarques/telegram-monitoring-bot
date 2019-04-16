const workModel = require('../model/work')
const xlsx = require('xlsx')

const fullRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{4})-(\d{2})-(\d{2})$/
const simpleRegex = /^(\d{4})-(\d{2})-(\d{2})$/

const registerCommand = bot => {
  bot.onText(/^\/getlogs$|^\/getlogs\s+(.+)$/, async (msg, match) => {
    const chatId = msg.chat.id
    const username = msg.from.username

    let filter = null
    if (!match[1]) {
      // they used /getLogs only
      filter = item => item.username === username
    } else if (fullRegex.test(match[1])) {
      // they used /getLogs date1 date2
      const groups = match[1].match(fullRegex)
      const date1 = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
      const date2 = new Date(Number(groups[4]), Number(groups[5]) - 1, Number(groups[6]), 23, 59, 59)
      filter = item => {
        return item.username === username &&
          item.workDate >= date1 && item.date <= date2
      }
    } else if (simpleRegex.test(match[1])) {
      // they used /getLogs date1
      const groups = match[1].match(simpleRegex)
      const date1 = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
      filter = item => {
        return item.username === username &&
          item.workDate.getTime() === date1.getTime()
      }
    }

    if (filter) {
      const allWork = await workModel.getAll()
      const filteredWork = allWork.filter(filter)

      if (filteredWork.length > 0) {
        const mappedWork = filteredWork.map(item => {
          return {
            'Acrónimo': item.username,
            'Release': item.release,
            'Tipo Trabalho': item.workType,
            'Data': item.workDate.toISOString().split('T')[0],
            '% Alocação': 100 * (Number(item.hours) / 8),
            'Nº Horas': item.hours
          }
        })

        const wb = xlsx.utils.book_new()
        const wbs = xlsx.utils.json_to_sheet(mappedWork)
        xlsx.utils.book_append_sheet(wb, wbs, 'Sheet 1')

        const wbout = xlsx.write(wb, {
          bookType: 'xlsx',
          type: 'buffer'
        })

        bot.sendDocument(chatId, wbout, {}, {
          filename: `Work ${username}.xlsx`,
          encoding: 'utf8'
        })
      } else {
        bot.sendMessage(chatId, 'Não existem registos para apresentar')
      }
    } else {
      bot.sendMessage(chatId, 'Não percebi o comando')
    }
  })
}

module.exports = registerCommand
