const Composer = require('telegraf/composer')
const Extra = require('telegraf/extra')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const shortid = require('shortid')
const helper = require('./helper')
const { enter, leave } = Stage

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

const simpleRegex = /^(\d{4})-(\d{2})-(\d{2})$/

const prepareQuestion1 = async (formId) => {
  const question = await helper.getQuestion1()

  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    question.options.map(item => m.callbackButton(item.name, `month:${formId}:${item.value}`)), { columns: 4 }))

  return {
    text: question.text,
    options: markup
  }
}

const prepareQuestion2 = async (formId, monthChosen) => {
  const question = await helper.getQuestion2(monthChosen)

  const firstWeekDay = new Date(2019, monthChosen, 1, 0, 0, 0).getDay()
  for (let i = 0; i < firstWeekDay; i++) {
    question.options.unshift({
      name: ' ',
      value: -1
    })
  }

  const newItemsNeeded = (7 - (question.options.length % 7)) % 7
  for (let i = 0; i < newItemsNeeded; i++) {
    question.options.push({
      name: ' ',
      value: -1
    })
  }

  const markup = Extra.HTML().markup(m => {
    const arr = weekDays.map(item => m.callbackButton(item, `day:${formId}:${item}`))
      .concat(question.options.map(item => m.callbackButton(item.name, `day:${formId}:${item.value}`)))

    return m.inlineKeyboard(arr, { columns: 7 })
  })

  return {
    text: question.text,
    options: markup
  }
}

const prepareQuestion3 = async (formId) => {
  const question = await helper.getQuestion3()
  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    question.options.map(item => m.callbackButton(item.name, `release:${formId}:${item.value}`)), { columns: 3 }))

  return {
    text: question.text,
    options: markup
  }
}

const prepareQuestion4 = async (formId) => {
  const question = await helper.getQuestion4()
  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    question.options.map(item => m.callbackButton(item.name, `workType:${formId}:${item.value}`)), { columns: 1 }))

  return {
    text: question.text,
    options: markup
  }
}

const prepareQuestion5 = async (formId) => {
  const question = await helper.getQuestion5()
  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    question.options.map(item => m.callbackButton(item.name, `hours:${formId}:${item.value}`)), { columns: 4 }))

  return {
    text: question.text,
    options: markup
  }
}

const scene = new Scene('log-work')

scene.enter(async ctx => {
  const username = ctx.state.from
  const args = ctx.state.command.args
  const formId = shortid.generate()
  if (simpleRegex.test(args) || args === 'today') {
    let currentDate
    if (args === 'today') {
      currentDate = new Date(Date.now())
    } else {
      const groups = args.match(simpleRegex)
      currentDate = new Date(Number(groups[1]), Number(groups[2]) - 1, Number(groups[3]), 0, 0, 0)
    }
    const question1 = await prepareQuestion1(formId)
    const answer1 = currentDate.getMonth().toString()
    const question2 = await prepareQuestion2(formId, answer1)
    const answer2 = currentDate.getDate().toString()
    const question3 = await prepareQuestion3(formId)
    const message = {
      id: 'question3',
      text: question3.text
    }
    ctx.session.form = {
      formId: formId,
      currentStep: 'question3',
      data: {
        originator: username
      },
      allSteps: [{
        id: 'question1',
        text: question1.text
      }, {
        id: 'answer1',
        text: answer1
      }, {
        id: 'question2',
        text: question2.text
      }, {
        id: 'answer2',
        text: answer2
      }, message]
    }
    const res = await ctx.reply(question3.text, question3.options)
    message.messageId = res.message_id
  } else {
    const question = await prepareQuestion1(formId)
    const message = {
      id: 'question1',
      text: question.text
    }
    ctx.session.form = {
      formId: formId,
      currentStep: 'question1',
      data: {
        originator: username
      },
      allSteps: [message]
    }
    const res = await ctx.reply(question.text, question.options)
    message.messageId = res.message_id
  }
})

scene.leave((ctx) => {
  delete ctx.session.form
})

scene.command('cancel', ctx => {
  ctx.reply('Comando cancelado')
  ctx.deleteMessage(ctx.session.form.allSteps[ctx.session.form.allSteps.length - 1].messageId)
  leave()(ctx)
})

scene.action(/^month:(.+):(.+)$/, async (ctx, next) => {
  const formId = ctx.match[1]
  const answer = ctx.match[2]
  if (formId === ctx.session.form.formId && ctx.session.form.currentStep === 'question1') {
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
    const question = await prepareQuestion2(formId, Number(answer))
    ctx.session.form.currentStep = 'question2'
    const newQuestion = {
      id: 'question2',
      text: question.text
    }
    ctx.session.form.allSteps.push(newQuestion)
    const res = await ctx.reply(question.text, question.options)
    newQuestion.messageId = res.message_id
  }
})

scene.action(/^day:(.+):(.+)$/, async (ctx, next) => {
  const formId = ctx.match[1]
  const answer = ctx.match[2]
  if (formId === ctx.session.form.formId && ctx.session.form.currentStep === 'question2') {
    ctx.answerCbQuery()
    if (answer !== '-1' && weekDays.indexOf(answer) === -1) {
      const previousQuestion = ctx.session.form.allSteps.find(item => item.id === 'question2')
      if (previousQuestion && previousQuestion.messageId) {
        ctx.deleteMessage(previousQuestion.messageId)
      }
      ctx.session.form.currentStep = 'answer2'
      ctx.session.form.allSteps.push({
        id: 'answer2',
        text: answer
      })
      const question = await prepareQuestion3(formId)
      ctx.session.form.currentStep = 'question3'
      const newQuestion = {
        id: 'question3',
        text: question.text
      }
      ctx.session.form.allSteps.push(newQuestion)
      const res = await ctx.reply(question.text, question.options)
      newQuestion.messageId = res.message_id
    }
  }
})

scene.action(/^release:(.+):(.+)$/, async (ctx, next) => {
  const formId = ctx.match[1]
  const answer = ctx.match[2]
  if (formId === ctx.session.form.formId && ctx.session.form.currentStep === 'question3') {
    ctx.answerCbQuery()
    const previousQuestion = ctx.session.form.allSteps.find(item => item.id === 'question3')
    if (previousQuestion && previousQuestion.messageId) {
      ctx.deleteMessage(previousQuestion.messageId)
    }
    ctx.session.form.currentStep = 'answer3'
    ctx.session.form.allSteps.push({
      id: 'answer3',
      text: answer
    })
    const question = await prepareQuestion4(formId)
    ctx.session.form.currentStep = 'question4'
    const newQuestion = {
      id: 'question4',
      text: question.text
    }
    ctx.session.form.allSteps.push(newQuestion)
    const res = await ctx.reply(question.text, question.options)
    newQuestion.messageId = res.message_id
  }
})

scene.action(/^workType:(.+):(.+)$/, async (ctx, next) => {
  const formId = ctx.match[1]
  const answer = ctx.match[2]
  if (formId === ctx.session.form.formId && ctx.session.form.currentStep === 'question4') {
    ctx.answerCbQuery()
    const previousQuestion = ctx.session.form.allSteps.find(item => item.id === 'question4')
    if (previousQuestion && previousQuestion.messageId) {
      ctx.deleteMessage(previousQuestion.messageId)
    }
    ctx.session.form.currentStep = 'answer4'
    ctx.session.form.allSteps.push({
      id: 'answer4',
      text: answer
    })
    const question = await prepareQuestion5(formId)
    ctx.session.form.currentStep = 'question5'
    const newQuestion = {
      id: 'question5',
      text: question.text
    }
    ctx.session.form.allSteps.push(newQuestion)
    const res = await ctx.reply(question.text, question.options)
    newQuestion.messageId = res.message_id
  }
})

scene.action(/^hours:(.+):(.+)$/, async (ctx, next) => {
  const formId = ctx.match[1]
  const answer = ctx.match[2]
  if (formId === ctx.session.form.formId && ctx.session.form.currentStep === 'question5') {
    ctx.answerCbQuery()
    const previousQuestion = ctx.session.form.allSteps.find(item => item.id === 'question5')
    if (previousQuestion && previousQuestion.messageId) {
      ctx.deleteMessage(previousQuestion.messageId)
    }
    ctx.session.form.currentStep = 'answer5'
    ctx.session.form.allSteps.push({
      id: 'answer5',
      text: answer
    })
    const month = ctx.session.form.allSteps.find(item => item.id === 'answer1').text
    const day = ctx.session.form.allSteps.find(item => item.id === 'answer2').text
    const release = ctx.session.form.allSteps.find(item => item.id === 'answer3').text
    const workType = ctx.session.form.allSteps.find(item => item.id === 'answer4').text
    const hours = ctx.session.form.allSteps.find(item => item.id === 'answer5').text
    const newWork = await helper.handleAllAnswers(ctx.session.form.data.originator, month, day, release, workType, hours)
    ctx.reply(`O teu registo foi efectuado com sucesso. Obrigado!
Data: ${newWork.workDate.toISOString().split('T')[0]}
Release: ${newWork.release}
Tipo de Trabalho: ${newWork.workType}
Nº Horas: ${newWork.hours}`)
    leave()(ctx)
  }
})

scene.on('message', (ctx) => ctx.reply('Este comando já está a correr\nPodes cancelar o registo usando /cancel'))

const bot = new Composer()
const stage = new Stage([scene])
bot.use(stage.middleware())
bot.command('log', enter('log-work'))

module.exports = bot
