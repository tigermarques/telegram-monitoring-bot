const Composer = require('telegraf/composer')
const Extra = require('telegraf/extra')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const fetch = require('node-fetch')
const fileType = require('file-type')
const xlsx = require('xlsx')
const ExcelFileHandler = require('../../utils/excelFileHandler')
const workTypesModel = require('../../model/workTypes')
const releasesModel = require('../../model/releases')
const usersModel = require('../../model/users')
const { enter, leave } = Stage

const prepareQuestion1 = async () => {
  return {
    text: [
      'Por favor faz upload do ficheiro de configurações',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n')
  }
}

const prepareQuestion2 = async (optionalMessage) => {
  const options = [
    { name: 'Actualizar tipos de trabalho', value: 'workTypes' },
    { name: 'Actualizar releases', value: 'releases' },
    { name: 'Actualizar férias, formações, feriados e ausências', value: 'vacation' },
    { name: 'Terminar', value: 'finish' }
  ]

  const markup = Extra.HTML().markup(m => m.inlineKeyboard(
    options.map(item => m.callbackButton(item.name, item.value)), { columns: 1 }))

  const arr = [
    'Por favor escolhe a opção que pretendes',
    'A qualquer momento podes cancelar o registo usando /cancel'
  ]
  if (optionalMessage) {
    arr.unshift(optionalMessage)
  }
  return {
    text: arr.join('\n'),
    options: markup
  }
}

const scene = new Scene('change-settings')

scene.enter(async ctx => {
  const question = await prepareQuestion1()
  const questionStep = {
    id: 'question1',
    text: question.text
  }
  ctx.session.form = {
    currentStep: 'question1',
    allSteps: [questionStep]
  }
  const res = await ctx.reply(question.text, question.options)
  questionStep.messageId = res.message_id
})

scene.leave((ctx) => {
  delete ctx.session.form
})

scene.command('cancel', ctx => {
  ctx.reply('Comando cancelado')
  leave()(ctx)
})

scene.on('document', async ctx => {
  const fileLink = await ctx.telegram.getFileLink(ctx.message.document.file_id)

  // get file buffer from telegram
  const file = await fetch(fileLink).then(res => res.buffer())
  const type = fileType.fromBuffer(file)

  ctx.deleteMessage(ctx.session.form.allSteps.find(item => item.id === 'question1').messageId)
  ctx.session.form.currentStep = 'answer1'
  const newAnswer = {
    id: 'answer1',
    message_id: ctx.message.message_id,
    file: file
  }
  ctx.session.form.allSteps.push(newAnswer)

  if (type && (type.ext === 'xlsx' || type.ext === 'xlsm')) {
    const tempAnswer = await ctx.reply('A processar o ficheiro...')
    const workbook = xlsx.read(ctx.session.form.allSteps.find(item => item.id === 'answer1').file, { type: 'buffer' })
    ctx.deleteMessage(tempAnswer.message_id)
    ctx.deleteMessage(ctx.message.message_id)
    newAnswer.workbook = workbook
    const question = await prepareQuestion2()
    const questionStep = {
      id: 'question2',
      text: question.text
    }
    ctx.session.form.currentStep = 'question2'
    ctx.session.form.allSteps.push(questionStep)
    const res = await ctx.reply(question.text, question.options)
    questionStep.messageId = res.message_id
  } else {
    ctx.reply('Só se pode utilizar ficheiros xlsx')
    leave()(ctx)
  }
})

scene.on('callback_query', async ctx => {
  switch (ctx.session.form.currentStep) {
    case 'question1':
      // do nothing here because we are expecting text
      break
    case 'question2':
      const answer = ctx.callbackQuery.data
      let res, newQuestion, newQuestionStep
      const workbook = ctx.session.form.allSteps.find(item => item.id === 'answer1').workbook
      const excelModel = new ExcelFileHandler(workbook)
      switch (answer) {
        case 'workTypes':
          ctx.deleteMessage(ctx.session.form.allSteps.find(item => item.id === 'question2').messageId)
          ctx.answerCbQuery()

          // do stuff for work types
          const newWorkTypes = excelModel.getWorkTypes()
          workTypesModel.replaceAll(newWorkTypes)

          newQuestion = await prepareQuestion2('Tipos de trabalho actualizados')
          newQuestionStep = {
            id: 'question2',
            text: newQuestion.text
          }
          ctx.session.form.currentStep = 'question2'
          ctx.session.form.allSteps = ctx.session.form.allSteps.filter(item => item.id !== 'question2')
          ctx.session.form.allSteps.push(newQuestionStep)
          res = await ctx.reply(newQuestion.text, newQuestion.options)
          newQuestionStep.messageId = res.message_id
          break
        case 'releases':
          ctx.deleteMessage(ctx.session.form.allSteps.find(item => item.id === 'question2').messageId)
          ctx.answerCbQuery()

          // do stuff for work releases
          const newReleases = excelModel.getReleases()
          releasesModel.replaceAll(newReleases)

          newQuestion = await prepareQuestion2('Releases actualizadas')
          newQuestionStep = {
            id: 'question2',
            text: newQuestion.text
          }
          ctx.session.form.currentStep = 'question2'
          ctx.session.form.allSteps = ctx.session.form.allSteps.filter(item => item.id !== 'question2')
          ctx.session.form.allSteps.push(newQuestionStep)
          res = await ctx.reply(newQuestion.text, newQuestion.options)
          newQuestionStep.messageId = res.message_id
          break
        case 'vacation':
          ctx.deleteMessage(ctx.session.form.allSteps.find(item => item.id === 'question2').messageId)
          ctx.answerCbQuery()

          // do stuff for vacations
          const allUsers = await usersModel.getAll()
          for (let i = 0; i < allUsers.length; i++) {
            const newVacations = excelModel.getUserHolidays(allUsers[i].username)
            const newAbsences = excelModel.getAbsences(allUsers[i].username)
            let newOfficialHolidays = excelModel.getUserOfficialHolidays(allUsers[i].username)
            const newTraining = excelModel.getUserTraining(allUsers[i].username)
            const userStandbys = excelModel.getUserOfficialHolidayStandbys(allUsers[i].username)
            if (newOfficialHolidays) {
              newOfficialHolidays = newOfficialHolidays.filter(date => !userStandbys.find(standby => standby.getTime() === date.getTime()))
            }
            await usersModel.updateVacation(allUsers[i].username, newVacations || [])
            await usersModel.updateOfficialHolidays(allUsers[i].username, newOfficialHolidays || [])
            await usersModel.updateTraining(allUsers[i].username, newTraining || [])
            await usersModel.updateAbsences(allUsers[i].username, newAbsences || [])
          }

          newQuestion = await prepareQuestion2('Férias, formações, feriados e ausências actualizados')
          newQuestionStep = {
            id: 'question2',
            text: newQuestion.text
          }
          ctx.session.form.currentStep = 'question2'
          ctx.session.form.allSteps = ctx.session.form.allSteps.filter(item => item.id !== 'question2')
          ctx.session.form.allSteps.push(newQuestionStep)
          res = await ctx.reply(newQuestion.text, newQuestion.options)
          newQuestionStep.messageId = res.message_id
          break
        case 'finish':
          ctx.deleteMessage(ctx.session.form.allSteps.find(item => item.id === 'question2').messageId)
          ctx.answerCbQuery()
          ctx.reply('Done')
          leave()(ctx)
          break
        default:
          break
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
bot.command('changesettings', enter('change-settings'))

module.exports = bot
