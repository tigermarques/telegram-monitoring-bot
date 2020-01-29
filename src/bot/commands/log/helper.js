const releasesModel = require('../../../model/releases')
const workTypesModel = require('../../../model/workTypes')
const workModel = require('../../../model/work')

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const getQuestion1 = () => {
  return {
    type: 'action',
    text: [
      'Começa por escolher a data para o registo',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: months.map((item, i) => {
      return {
        name: item,
        value: i
      }
    })
  }
}

const getQuestion2 = (monthChosen) => {
  const numberOfDays = new Date(new Date().getFullYear(), monthChosen + 1, 0).getDate()
  const days = Array.apply(null, { length: numberOfDays }).map(Number.call, Number).map(item => item + 1)

  const arr = days.map(item => {
    return {
      name: item,
      value: item
    }
  })

  return {
    type: 'action',
    text: [
      'Começa por escolher a data para o registo',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: arr
  }
}

const getQuestion3 = async () => {
  let onGoingReleases = await releasesModel.getOngoing()

  return {
    type: 'action',
    text: [
      'Em que Release vais registar estas horas?',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: onGoingReleases.map(item => {
      return {
        name: item.name,
        value: item.name
      }
    })
  }
}

const getQuestion4 = async () => {
  const existingWorkTypes = await workTypesModel.getAll()

  return {
    type: 'action',
    text: [
      'Qual o tipo de trabalho desenvolvido?',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: existingWorkTypes.map(item => {
      return {
        name: item.name,
        value: item.name
      }
    })
  }
}

const getQuestion5 = () => {
  const hours = Array.apply(null, { length: 8 }).map(Number.call, Number).map(item => item + 1)

  return {
    type: 'action',
    text: [
      'Quantas horas pretendes registar?',
      'A qualquer momento podes cancelar o registo usando /cancel'
    ].join('\n'),
    options: hours.map(item => {
      return {
        name: item,
        value: item
      }
    })
  }
}

const handleAllAnswers = async (username, month, day, release, workType, hours) => {
  const newWork = await workModel.add(username, Number(month), Number(day), release, workType, Number(hours))
  return newWork
}

module.exports = {
  getQuestion1,
  getQuestion2,
  getQuestion3,
  getQuestion4,
  getQuestion5,
  handleAllAnswers
}
