const Composer = require('telegraf/composer')
const Extra = require('telegraf/extra')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const releasesModel = require('../model/releases')
const workTypesModel = require('../model/workTypes')
const workModel = require('../model/work')
const { enter, leave } = Stage

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const prepareQuestion1 = async () => {
  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    months.map((item, i) => m.callbackButton(item, i)), { columns: 4 }))

  return {
    text: [
      'Começa por escolher a data para o registo',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: markup
  }
}

const prepareQuestion2 = async (monthChosen) => {
  const days = new Date(2019, monthChosen + 1, 0).getDate()

  const markup = Extra.HTML().markup(m => {
    const arr = []
    for (let i = 1; i <= days; i++) {
      arr.push(m.callbackButton(i, i))
    }
    return m.inlineKeyboard(arr, { columns: 6 })
  })

  return {
    text: 'Começa por escolher a data para o registo',
    options: markup
  }
}

const prepareQuestion3 = async () => {
  const onGoingReleases = await releasesModel.getAll()

  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    onGoingReleases.map(item => m.callbackButton(item.name, item.name)), { columns: 3 }))

  return {
    text: 'Em que Release vais registar estas horas?',
    options: markup
  }
}

const prepareQuestion4 = async () => {
  const existingWorkTypes = await workTypesModel.getAll()

  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    existingWorkTypes.map(item => m.callbackButton(item.name, item.name)), { columns: 1 }))

  return {
    text: 'Qual o tipo de trabalho desenvolvido?',
    options: markup
  }
}

const prepareQuestion5 = async () => {
  const markup = Extra.HTML().markup(m => {
    const arr = []
    for (let i = 1; i <= 8; i++) {
      arr.push(m.callbackButton(i, i))
    }
    return m.inlineKeyboard(arr, { columns: 4 })
  })

  return {
    text: 'Quantas horas pretendes registar?',
    options: markup
  }
}

const scene = new Scene('log-work')

scene.enter(async ctx => {
  const username = ctx.state.from
  const question = await prepareQuestion1()
  ctx.session.form = {
    previousStep: null,
    currentStep: 'question1',
    data: {
      originator: username
    },
    allSteps: [{
      id: 'question1',
      text: question.text
    }]
  }
  ctx.reply(question.text, question.options)
})

scene.leave((ctx) => {
  delete ctx.session.form
})

scene.command('cancel', ctx => {
  ctx.reply('Comando cancelado')
  leave()(ctx)
})

scene.on('callback_query', async ctx => {
  let question, answer
  console.log(ctx.callbackQuery.data)
  console.log(ctx.session.form)
  switch (ctx.session.form.currentStep) {
    case 'question1':
      if (ctx.session.form.previousStep === null) {
        answer = ctx.callbackQuery.data
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'answer1'
        ctx.session.form.allSteps.push({
          id: 'answer1',
          text: answer
        })
        ctx.answerCbQuery()
        question = await prepareQuestion2(answer)
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'question2'
        ctx.session.form.allSteps.push({
          id: 'question2',
          text: question.text
        })
        ctx.reply(question.text, question.options)
      } else {
        ctx.answerCbQuery('Já respondeste a essa pergunta')
      }
      break
    case 'question2':
      if (ctx.session.form.previousStep === 'answer1') {
        answer = ctx.callbackQuery.data
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'answer2'
        ctx.session.form.allSteps.push({
          id: 'answer2',
          text: answer
        })
        ctx.answerCbQuery()
        question = await prepareQuestion3()
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'question3'
        ctx.session.form.allSteps.push({
          id: 'question3',
          text: question.text
        })
        ctx.reply(question.text, question.options)
      } else {
        ctx.answerCbQuery('Já respondeste a essa pergunta')
      }
      break
    case 'question3':
      if (ctx.session.form.previousStep === 'answer2') {
        answer = ctx.callbackQuery.data
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'answer3'
        ctx.session.form.allSteps.push({
          id: 'answer3',
          text: answer
        })
        ctx.answerCbQuery()
        question = await prepareQuestion4()
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'question4'
        ctx.session.form.allSteps.push({
          id: 'question4',
          text: question.text
        })
        ctx.reply(question.text, question.options)
      } else {
        ctx.answerCbQuery('Já respondeste a essa pergunta')
      }
      break
    case 'question4':
      if (ctx.session.form.previousStep === 'answer3') {
        answer = ctx.callbackQuery.data
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'answer4'
        ctx.session.form.allSteps.push({
          id: 'answer4',
          text: answer
        })
        ctx.answerCbQuery()
        question = await prepareQuestion5()
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'question5'
        ctx.session.form.allSteps.push({
          id: 'question5',
          text: question.text
        })
        ctx.reply(question.text, question.options)
      } else {
        ctx.answerCbQuery('Já respondeste a essa pergunta')
      }
      break
    case 'question5':
      if (ctx.session.form.previousStep === 'answer4') {
        answer = ctx.callbackQuery.data
        ctx.session.form.previousStep = ctx.session.form.currentStep
        ctx.session.form.currentStep = 'answer5'
        ctx.session.form.allSteps.push({
          id: 'answer5',
          text: answer
        })
        ctx.answerCbQuery()
        const month = Number(ctx.session.form.allSteps.find(item => item.id === 'answer1').text)
        const day = Number(ctx.session.form.allSteps.find(item => item.id === 'answer2').text)
        const release = ctx.session.form.allSteps.find(item => item.id === 'answer3').text
        const workType = ctx.session.form.allSteps.find(item => item.id === 'answer4').text
        const hours = Number(ctx.session.form.allSteps.find(item => item.id === 'answer5').text)
        const newWork = await workModel.add(ctx.session.form.data.originator, month, day, release, workType, hours)
        ctx.reply(`O teu registo foi efectuado com sucesso. Obrigado!
  Data: ${newWork.workDate.toISOString().split('T')[0]}
  Release: ${newWork.release}
  Tipo de Trabalho: ${newWork.workType}
  Nº Horas: ${newWork.hours}`)
        leave()(ctx)
      } else {
        ctx.answerCbQuery('Já respondeste a essa pergunta')
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
bot.command('log', enter('log-work'))

module.exports = bot
