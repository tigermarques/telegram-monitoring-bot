const xlsx = require('xlsx')
const workModel = require('../../model/work')

const fullRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{4})-(\d{2})-(\d{2})$/
const simpleRegex = /^(\d{4})-(\d{2})-(\d{2})$/

const command = async ctx => {
  const username = ctx.state.from
  const args = ctx.state.command.args
  let filter = null

  if (!args) {
    // they used /getLogs only
    filter = item => item.username === username
  } else if (fullRegex.test(args)) {
    // they used /getLogs date1 date2
    const groups = args.match(fullRegex)
    const date1 = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
    const date2 = new Date(Number(groups[4]), Number(groups[5]) - 1, Number(groups[6]), 23, 59, 59)
    filter = item => {
      return item.username === username &&
        item.workDate >= date1 && item.workDate <= date2
    }
  } else if (simpleRegex.test(args)) {
    // they used /getLogs date1
    const groups = args.match(simpleRegex)
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

      ctx.replyWithDocument({
        source: wbout,
        filename: `Work ${username}.xlsx`
      })
    } else {
      ctx.reply('Não existem dados para mostrar')
    }
  } else {
    ctx.reply('Não percebi o comando')
  }
}

module.exports = command
