const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
require('dotenv').config()

module.exports.up = async function () {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    const db = await client.db()
    const workTypeCollection = await db.collection('work-types')
    const result = await workTypeCollection.insertMany([
      { name: 'Acompanhamento a Testes' },
      { name: 'Coordenação' },
      { name: 'Suporte' },
      { name: 'Acompanhamento a Rollout' }
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
    let result = await workTypeCollection.deleteOne({ name: 'Acompanhamento a Testes' })
    assert.deepStrictEqual(result.result.ok, 1)
    result = await workTypeCollection.deleteOne({ name: 'Coordenação' })
    assert.deepStrictEqual(result.result.ok, 1)
    result = await workTypeCollection.deleteOne({ name: 'Suporte' })
    assert.deepStrictEqual(result.result.ok, 1)
    result = await workTypeCollection.deleteOne({ name: 'Acompanhamento a Rollout' })
    assert.deepStrictEqual(result.result.ok, 1)
    await client.close()
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.description = 'add work types "Acompanhamento a Testes", "Coordenação", "Suporte" and "Acompanhamento a Rollout"'
