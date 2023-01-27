// npm
import test from 'tape'
import Database from 'better-sqlite3'
import zid from 'zid'

// local
import PieDB from '../pie-db.js'

// create the DB
const db = new Database('/tmp/' + zid(8) + '.db')
process.on('exit', () => {
  console.log('Closing DB')
  db.close()
})

// Pie DB
const pdb = new PieDB(db)

function removeInsertedAndUpdated(items) {
  for ( const item of items ) {
    delete item.inserted
    delete item.updated
  }
}

test('90 - query - recently inserted', t => {
  t.plan(4)

  const ns = 'iot'
  const k1 = 'temp:1'
  const v1 = 'mcu=esp32 mem=4kb'
  const r1 = pdb.put(ns, k1, v1)
  t.equal(r1, 1, '.put() worked')

  const expThings1 = [
    {
      ns,
      k: k1,
      v: v1,
      updates: 1,
    }
  ]
  const things1 = pdb.query('SELECT * FROM kv WHERE ns = @ns', { ns })
  removeInsertedAndUpdated(things1)
  t.deepEqual(things1, expThings1, 'All things are present and correct')

  const k2 = 'temp:2'
  const v2 = 'mcu=esp8266 mem=2kb'
  const r2 = pdb.put(ns, k2, v2)
  t.equal(r2, 1, '.put() worked')

  const expThings2 = [
    ...expThings1,
    {
      ns,
      k: k2,
      v: v2,
      updates: 1,
    }
  ]
  const things2 = pdb.query('SELECT * FROM kv WHERE ns = @ns', { ns })
  removeInsertedAndUpdated(things2)
  t.deepEqual(things2, expThings2, 'All things are still present and correct')

  t.end()
})

test('90 - queryJson - recently inserted', t => {
  t.plan(4)

  const ns = 'iot-json'
  const k1 = 'temp:1'
  const v1 = { mcu: "esp32", mem: "4kb" }
  const r1 = pdb.putJson(ns, k1, v1)
  t.equal(r1, 1, '.put() worked')

  const expThings1 = [
    {
      ns,
      k: k1,
      v: v1,
      updates: 1,
    }
  ]
  const things1 = pdb.queryJson('SELECT * FROM kv WHERE ns = @ns', { ns })
  removeInsertedAndUpdated(things1)
  t.deepEqual(things1, expThings1, 'All things are present and correct')

  const k2 = 'temp:2'
  const v2 = { mcu: "esp8266", mem: "2kb" }
  const r2 = pdb.putJson(ns, k2, v2)
  t.equal(r2, 1, '.put() worked')

  const expThings2 = [
    ...expThings1,
    {
      ns,
      k: k2,
      v: v2,
      updates: 1,
    }
  ]
  const things2 = pdb.queryJson('SELECT * FROM kv WHERE ns = @ns', { ns })
  removeInsertedAndUpdated(things2)
  t.deepEqual(things2, expThings2, 'All things are still present and correct')

  t.end()
})
