const mongoose = require('mongoose')
const Mockgoose = require('mockgoose').Mockgoose
const chai = require('chai')
const chaiSubset = require('chai-subset')
const db = require('../../bot/utils/db')
const workTypesModel = require('../../bot/model/workTypes')

chai.use(chaiSubset)
const expect = chai.expect
const mockStorage = new Mockgoose(mongoose)

before(async () => {
  await mockStorage.prepareStorage()
  await db.connect()
})

describe('workTypes', () => {
  beforeEach(async () => {
    await mockStorage.helper.reset()
  })

  it('should return no work types by default', async () => {
    const workTypes = await workTypesModel.getAll()
    expect(workTypes.length).to.equal(0)
  })

  it('should return the same work types given with replaceAll', async () => {
    let workTypes = await workTypesModel.getAll()
    expect(workTypes.length).to.equal(0)
    await workTypesModel.replaceAll([{
      name: 'type1'
    }, {
      name: 'type2'
    }])
    workTypes = await workTypesModel.getAll()
    expect(workTypes.length).to.equal(2)
    expect(workTypes).to.containSubset([{
      name: 'type1'
    }, {
      name: 'type2'
    }])
  })

  it('should return no work types after replaceAll removes entries', async () => {
    let workTypes = await workTypesModel.getAll()
    expect(workTypes.length).to.equal(0)
    await workTypesModel.replaceAll([{
      name: 'type1'
    }, {
      name: 'type2'
    }])
    workTypes = await workTypesModel.getAll()
    expect(workTypes.length).to.equal(2)
    expect(workTypes).to.containSubset([{
      name: 'type1'
    }, {
      name: 'type2'
    }])
    await workTypesModel.replaceAll([])
    workTypes = await workTypesModel.getAll()
    expect(workTypes.length).to.equal(0)
  })
})
