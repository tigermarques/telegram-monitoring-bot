const Composer = require('telegraf/composer')
const Extra = require('telegraf/extra')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const xlsx = require('xlsx')
const workModel = require('../../model/work')
const { enter, leave } = Stage

const fullRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{4})-(\d{2})-(\d{2})$/
const simpleRegex = /^(\d{4})-(\d{2})-(\d{2})$/

const sendWork = async (ctx, username, work) => {
  const filteredWork = work.filter(item => username === 'Todos' || item.username === username)
  if (filteredWork.length > 0) {
    const mappedWork = filteredWork.map(item => {
      return {
        'Acrónimo': item.username,
        'Release': item.release,
        'Tipo Trabalho': item.workType,
        'Data': item.workDate.toISOString().split('T')[0],
        '% Alocação': Number(item.hours) / 8,
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
    leave()(ctx)
  } else {
    ctx.reply('Não existem dados para mostrar')
    leave()(ctx)
  }
}

const prepareQuestion1 = async (work) => {
  const users = work.map(item => item.username).filter((value, index, self) => self.indexOf(value) === index)
  if (users.length > 1) {
    users.push('Todos')
  }

  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    users.map(item => m.callbackButton(item, item)), { columns: 4 }))

  return {
    text: [
      'Escolhe o utilizador para o qual queres receber os logs',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: markup
  }
}

const scene = new Scene('get-logs')

scene.enter(async ctx => {
  const username = ctx.state.from
  const args = ctx.state.command.args

  let filter = null

  if (!args) {
    // they used /getlogs only
    filter = item => item
  } else if (fullRegex.test(args)) {
    // they used /getlogs date1 date2
    const groups = args.match(fullRegex)
    const date1 = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
    const date2 = new Date(Number(groups[4]), Number(groups[5]) - 1, Number(groups[6]), 23, 59, 59)
    filter = item => {
      return item.workDate >= date1 && item.workDate <= date2
    }
  } else if (simpleRegex.test(args)) {
    // they used /getlogs date1
    const groups = args.match(simpleRegex)
    const date1 = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
    filter = item => {
      return item.workDate.getTime() === date1.getTime()
    }
  }

  if (filter) {
    const allWork = await workModel.getAll()
    const filteredWork = allWork.filter(filter)

    if (ctx.state.isAdmin) {
      if (filteredWork.length > 0) {
        const question = await prepareQuestion1(filteredWork)
        const message = {
          id: 'question1',
          text: question.text
        }
        ctx.session.form = {
          currentStep: 'question1',
          data: {
            originator: username,
            work: filteredWork
          },
          allSteps: [message]
        }
        const res = await ctx.reply(question.text, question.options)
        message.messageId = res.message_id
      } else {
        ctx.reply('Não existem dados para mostrar')
        leave()(ctx)
      }
    } else {
      sendWork(ctx, ctx.state.from, filteredWork)
    }
  } else {
    ctx.reply('Não percebi o comando')
    leave()(ctx)
  }
})

scene.leave((ctx) => {
  delete ctx.session.form
})

scene.command('cancel', ctx => {
  ctx.reply('Comando cancelado')
  leave()(ctx)
})

scene.on('callback_query', async ctx => {
  switch (ctx.session.form.currentStep) {
    case 'question1':
      const answer = ctx.callbackQuery.data
      ctx.answerCbQuery()
      const previousQuestion = ctx.session.form.allSteps.find(item => item.id === 'question1')
      if (previousQuestion && previousQuestion.messageId) {
        ctx.deleteMessage(previousQuestion.messageId)
      }
      ctx.session.form.currentStep = 'answer1'
      ctx.session.form.allSteps.push({
        id: 'answer1',
        text: answer
      })

      const work = ctx.session.form.data.work

      sendWork(ctx, answer, work)
      break
    default:
      break
  }
})
scene.on('message', (ctx) => ctx.reply('Only text messages please'))

const bot = new Composer()

const stage = new Stage([scene])

bot.use(stage.middleware())
bot.command('getlogs', enter('get-logs'))

module.exports = bot
