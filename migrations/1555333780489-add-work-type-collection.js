const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
require('dotenv').config()

module.exports.up = async function () {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    const db = await client.db()
    const workTypeCollection = await db.createCollection('work-types')
    assert.notDeepStrictEqual(workTypeCollection, null)
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
    const result = await db.dropCollection('work-types')
    assert.deepStrictEqual(result, true)
    await client.close()
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.description = 'add work-types collection'
