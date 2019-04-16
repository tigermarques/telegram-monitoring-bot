const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
require('dotenv').config()

module.exports.up = async function () {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    const db = await client.db()
    const releaseCollection = await db.createCollection('releases')
    assert.notDeepStrictEqual(releaseCollection, null)
    const result = await releaseCollection.insertMany([
      { name: 'Gestão' },
      { name: 'Acompanhamento' },
      { name: 'RPA' },
      { name: 'Suporte' },
      { name: 'RCJAN2019.01' },
      { name: 'REWIZZIO' },
      { name: 'REMIGADHOC' },
      { name: 'REMIGACDO' },
      { name: 'RELEILAOF2' },
      { name: 'PERMANENTES' },
      { name: 'REMAR2019' },
      { name: 'REMAR2019.02' },
      { name: 'RERISCOCLIENTE' },
      { name: 'REGRASFRX' },
      { name: 'RCMAR2019.01' },
      { name: 'BANKA3G - IIB' },
      { name: 'RE3GCAC' },
      { name: 'RE3GNAT' },
      { name: 'RE3GFRX' },
      { name: 'RE3GACDO' },
      { name: 'RE3GMCX' },
      { name: 'RE3GSMP' },
      { name: 'RE3GADHOC' },
      { name: 'RE3GREQ' },
      { name: 'RE3GCC' },
      { name: 'RE3GGAFT' }
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
    const result = await db.dropCollection('releases')
    assert.deepStrictEqual(result, true)
    await client.close()
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.description = 'add releases collection'
