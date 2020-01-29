const mongoose = require('mongoose')
const Mockgoose = require('mockgoose').Mockgoose
const chai = require('chai')
// const chaiSubset = require('chai-subset')
const db = require('../../../../src/utils/db')
const releasesModel = require('../../../../src/model/releases')
const workTypesModel = require('../../../../src/model/workTypes')
const helper = require('../../../../src/bot/commands/log/helper')

// chai.use(chaiSubset)
const expect = chai.expect
const mockStorage = new Mockgoose(mongoose)

before(async () => {
  await mockStorage.prepareStorage()
  await db.connect()
})

describe('/log command helper', () => {
  beforeEach(async () => {
    await mockStorage.helper.reset()
  })

  it('should return all months in question 1', async () => {
    const question1 = await helper.getQuestion1()
    expect(question1).to.deep.eql({
      type: 'action',
      text: 'Começa por escolher a data para o registo\nA qualquer momento podes cancelar o registo usando /cancel',
      options: [
        { name: 'Janeiro', value: 0 },
        { name: 'Fevereiro', value: 1 },
        { name: 'Março', value: 2 },
        { name: 'Abril', value: 3 },
        { name: 'Maio', value: 4 },
        { name: 'Junho', value: 5 },
        { name: 'Julho', value: 6 },
        { name: 'Agosto', value: 7 },
        { name: 'Setembro', value: 8 },
        { name: 'Outubro', value: 9 },
        { name: 'Novembro', value: 10 },
        { name: 'Dezembro', value: 11 }
      ]
    })
  })

  const monthSetup = [
    { month: 0, days: 31, monthName: 'January' },
    { month: 1, days: 29, monthName: 'February' }, // hardcoded because 2020 changes
    { month: 2, days: 31, monthName: 'March' },
    { month: 3, days: 30, monthName: 'April' },
    { month: 4, days: 31, monthName: 'May' },
    { month: 5, days: 30, monthName: 'June' },
    { month: 6, days: 31, monthName: 'July' },
    { month: 7, days: 31, monthName: 'August' },
    { month: 8, days: 30, monthName: 'September' },
    { month: 9, days: 31, monthName: 'October' },
    { month: 10, days: 30, monthName: 'November' },
    { month: 11, days: 31, monthName: 'December' }
  ]

  monthSetup.forEach(item => {
    it(`should return the correct number of days for the month ${item.monthName}`, async () => {
      const question2 = await helper.getQuestion2(item.month)
      const days = []
      for (let i = 1; i <= item.days; i++) {
        days.push({
          name: i,
          value: i
        })
      }
      expect(question2).to.deep.eql({
        type: 'action',
        text: 'Começa por escolher a data para o registo\nA qualquer momento podes cancelar o registo usando /cancel',
        options: days
      })
    })
  })

  it('should return the correct releases', async () => {
    await releasesModel.replaceAll([
      { name: 'Release 1', status: 'Por Iniciar' },
      { name: 'Release 2', status: 'Em Desenvolvimento' },
      { name: 'Release 3', status: 'Em Testes de Integração' },
      { name: 'Release 4', status: 'Em Análise' },
      { name: 'Release 5', status: 'Em Testes de Qualidade' },
      { name: 'Release 6', status: 'Rollout Efectuado' }
    ])

    const question3 = await helper.getQuestion3()

    expect(question3).to.deep.eql({
      type: 'action',
      text: 'Em que Release vais registar estas horas?\nA qualquer momento podes cancelar o registo usando /cancel',
      options: [
        { name: 'Release 2', value: 'Release 2' },
        { name: 'Release 3', value: 'Release 3' },
        { name: 'Release 4', value: 'Release 4' },
        { name: 'Release 5', value: 'Release 5' }
      ]
    })
  })

  it('should return the correct workTypes', async () => {
    await workTypesModel.replaceAll([
      { name: 'Tipo 1' },
      { name: 'Tipo 2' },
      { name: 'Tipo 3' },
      { name: 'Tipo 4' },
      { name: 'Tipo 5' },
      { name: 'Tipo 6' }
    ])

    const question4 = await helper.getQuestion4()

    expect(question4).to.deep.eql({
      type: 'action',
      text: 'Qual o tipo de trabalho desenvolvido?\nA qualquer momento podes cancelar o registo usando /cancel',
      options: [
        { name: 'Tipo 1', value: 'Tipo 1' },
        { name: 'Tipo 2', value: 'Tipo 2' },
        { name: 'Tipo 3', value: 'Tipo 3' },
        { name: 'Tipo 4', value: 'Tipo 4' },
        { name: 'Tipo 5', value: 'Tipo 5' },
        { name: 'Tipo 6', value: 'Tipo 6' }
      ]
    })
  })

  it('should return the correct hours', async () => {
    const question5 = await helper.getQuestion5()

    expect(question5).to.deep.eql({
      type: 'action',
      text: 'Quantas horas pretendes registar?\nA qualquer momento podes cancelar o registo usando /cancel',
      options: [1, 2, 3, 4, 5, 6, 7, 8]
        .map(item => {
          return {
            name: item,
            value: item
          }
        })
    })
  })
})
