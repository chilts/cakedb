// npm
import test from 'tape'
import Database from 'better-sqlite3'

// local
import CakeDB from '../cakedb.js'

// create the DB
const db = new Database('foobar.db')
const cdb = new CakeDB(db)

test('put and set (no ns)', t => {
  t.plan(5)

  const r1 = cdb.put('', 't', 'one')
  t.equal(r1, undefined)

  const r2 = cdb.get('', 't')
  t.equal(r2.ns, '')
  t.equal(r2.k, 't')
  t.equal(r2.v, 'one')
  t.equal(r2.updates, 1)

  t.end()
})

test('put and del (no ns)', t => {
  t.plan(2)

  const r1 = cdb.put('', 't', 'two')
  t.equal(r1, undefined)

  const r2 = cdb.del('', 't')
  t.deepEqual(r2, { changes: 1, lastInsertRowid: 1 })

  t.end()
})
