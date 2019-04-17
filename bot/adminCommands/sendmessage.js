const Composer = require('telegraf/composer')
const Extra = require('telegraf/extra')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const usersModel = require('../model/users')
const { enter, leave } = Stage

const prepareQuestion1 = async (username) => {
  const allUsers = await usersModel.getAll()
  const allButMe = allUsers.filter(item => item.username !== username)
  if (allButMe.length > 1) {
    allButMe.push({
      username: 'Todos'
    })
  }
  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    allButMe.map(item => m.callbackButton(item.username, item.username)), { columns: 4 }))

  return {
    text: [
      'Escolhe o utilizador para o qual queres enviar uma mensagem',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: markup
  }
}

const prepareQuestion2 = async (username) => {
  return {
    text: `Por favor escreve a mensagem a enviar para "${username}"`
  }
}

const scene = new Scene('send-message')

scene.enter(async ctx => {
  const username = ctx.state.from
  const question = await prepareQuestion1(username)
  ctx.session.form = {
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

scene.on('text', async ctx => {
  switch (ctx.session.form.currentStep) {
    case 'question1':
      // do nothing here because we are expecting text
      break
    case 'question2':
      const answer = ctx.message.text
      ctx.session.form.currentStep = 'answer2'
      ctx.session.form.allSteps.push({
        id: 'answer2',
        text: answer
      })

      const usernameToSend = ctx.session.form.allSteps.find(item => item.id === 'answer1').text
      const textToSend = answer
      const originator = ctx.session.form.data.originator

      if (usernameToSend === 'Todos') {
        const allUsers = await usersModel.getAll()
        const allButMe = allUsers.filter(item => item.username !== originator)

        allButMe.forEach(item => {
          ctx.telegram.sendMessage(item.chatId, `O utilizador ${originator} disse o seguinte:\n${textToSend}`)
        })
      } else {
        const userToSend = await usersModel.getByUsername(usernameToSend)

        ctx.telegram.sendMessage(userToSend.chatId, `O utilizador ${originator} disse o seguinte:\n${textToSend}`)
      }
      ctx.reply('Mensagem enviada com sucesso')
      leave()(ctx)
      break
    default:
      break
  }
})

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
      const question = await prepareQuestion2(answer)
      ctx.session.form.currentStep = 'question2'
      ctx.session.form.allSteps.push({
        id: 'question2',
        text: question.text
      })
      ctx.reply(question.text, question.options)
      break
    case 'question2':
      // do nothing here because we are expecting text
      break
    default:
      break
  }
})
scene.on('message', (ctx) => ctx.reply('Only text messages please'))

const bot = new Composer()

const stage = new Stage([scene])

bot.use(stage.middleware())
bot.command('sendmessage', enter('send-message'))

module.exports = bot
