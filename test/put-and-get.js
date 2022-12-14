// npm
import test from 'tape'
import Database from 'better-sqlite3'

// local
import PieDB from '../pie-db.js'

// create the DB
const db = new Database('foobar.db')
const pdb = new PieDB(db)

test('put and set (no ns)', t => {
  t.plan(5)

  const r1 = pdb.put('', 't', 'one')
  t.equal(r1, undefined)

  const r2 = pdb.get('', 't')
  t.equal(r2.ns, '')
  t.equal(r2.k, 't')
  t.equal(r2.v, 'one')
  t.equal(r2.updates, 1)

  t.end()
})

test('put and del (no ns)', t => {
  t.plan(2)

  const r1 = pdb.put('', 't', 'two')
  t.equal(r1, undefined)

  const r2 = [db.del('', 't')
  t.deepEqual(r2, { changes: 1, lastInsertRowid: 1 })

  t.end()
})
