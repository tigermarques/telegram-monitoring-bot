const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
require('dotenv').config()

module.exports.up = async function () {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    const db = await client.db()
    const workTypeCollection = await db.collection('work-types')
    const result = await workTypeCollection.insertMany([
      { name: 'Análise' },
      { name: 'Desenvolvimento' },
      { name: 'Testes de Integração' }
    ])
    assert.deepStrictEqual(result.result.ok, 1)
    await client.close()
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.down = async function () {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    const db = await client.db()
    const workTypeCollection = await db.collection('work-types')
    let result = await workTypeCollection.deleteOne({ name: 'Análise' })
    assert.deepStrictEqual(result.result.ok, 1)
    result = await workTypeCollection.deleteOne({ name: 'Desenvolvimento' })
    assert.deepStrictEqual(result.result.ok, 1)
    result = await workTypeCollection.deleteOne({ name: 'Testes de Integração' })
    assert.deepStrictEqual(result.result.ok, 1)
    await client.close()
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.description = 'add work types "Análise", "Desenvolvimento" and "Testes de Integração"'
