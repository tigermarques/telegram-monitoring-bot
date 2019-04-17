const Composer = require('telegraf/composer')
const Extra = require('telegraf/extra')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const xlsx = require('xlsx')
const workModel = require('../model/work')
const { enter, leave } = Stage

const fullRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{4})-(\d{2})-(\d{2})$/
const simpleRegex = /^(\d{4})-(\d{2})-(\d{2})$/

const prepareQuestion1 = async (work) => {
  const users = work.map(item => item.username).filter((value, index, self) => self.indexOf(value) === index)
  if (users.length > 1) {
    users.push('Todos')
  }

  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    users.map(item => m.callbackButton(item, item))), { columns: 4 })

  return {
    text: 'Escolhe o utilizador para o qual queres receber os logs',
    options: markup
  }
}

const scene = new Scene('get-user-logs')

scene.enter(async ctx => {
  const username = ctx.state.from
  const args = ctx.state.command.args

  let filter = null

  if (!args) {
    // they used /getuserlogs only
    filter = item => item
  } else if (fullRegex.test(args)) {
    // they used /getuserlogs date1 date2
    const groups = args.match(fullRegex)
    const date1 = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
    const date2 = new Date(Number(groups[4]), Number(groups[5]) - 1, Number(groups[6]), 23, 59, 59)
    filter = item => {
      return item.workDate >= date1 && item.date <= date2
    }
  } else if (simpleRegex.test(args)) {
    // they used /getuserlogs date1
    const groups = args.match(simpleRegex)
    const date1 = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
    filter = item => {
      return item.workDate.getTime() === date1.getTime()
    }
  }

  if (filter) {
    const allWork = await workModel.getAll()
    const filteredWork = allWork.filter(filter)

    if (filteredWork.length > 0) {
      const question = await prepareQuestion1(filteredWork)
      ctx.session.form = {
        currentStep: 'question1',
        data: {
          originator: username,
          work: filteredWork
        },
        allSteps: [{
          id: 'question1',
          text: question.text
        }]
      }
      ctx.reply(question.text, question.options)
    } else {
      ctx.reply('Não existem dados para mostrar')
    }
  } else {
    ctx.reply('Não percebi o comando')
  }
})

scene.leave((ctx) => {
  delete ctx.session.form
})

scene.command('cancel', leave())

scene.on('callback_query', async ctx => {
  switch (ctx.session.form.currentStep) {
    case 'question1':
      const answer = ctx.callbackQuery.data
      ctx.session.form.currentStep = 'answer1'
      ctx.session.form.allSteps.push({
        id: 'answer1',
        text: answer
      })
      ctx.answerCbQuery()

      const work = ctx.session.form.data.work

      const filteredWork = work.filter(item => answer === 'Todos' || item.username === answer)
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
          filename: `Work ${ctx.session.form.data.originator}.xlsx`
        })
      } else {
        ctx.reply('Não existem dados para mostrar')
      }
      break
    default:
      break
  }
})
scene.on('message', (ctx) => ctx.reply('Only text messages please'))

const bot = new Composer()

const stage = new Stage([scene])

bot.use(stage.middleware())
bot.command('getuserlogs', enter('get-user-logs'))

module.exports = bot
