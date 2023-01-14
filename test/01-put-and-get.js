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

test('01 - put and set (empty ns)', t => {
  t.plan(9)

  const r1 = pdb.put('', 't', 'one')
  t.equal(r1, undefined, '.put() worked')

  const r2 = pdb.get('', 't')
  t.equal(r2.ns, '', 'ns is the empty string')
  t.equal(r2.k, 't', 'key is correct')
  t.equal(r2.v, 'one', 'v is correct')
  t.equal(r2.updates, 1, 'updates is correct')

  const r3 = pdb.get('t')
  t.equal(r3.ns, '', 'ns defaulted to the empty string')
  t.equal(r3.k, 't', 't was fine')
  t.equal(r3.v, 'one', 'v was fine')
  t.equal(r3.updates, 1, 'updates was fine')

  t.end()
})

test('01 - put and del (empty ns)', t => {
  t.plan(2)

  const r1 = pdb.put('', 't', 'two')
  t.equal(r1, undefined)

  const r2 = pdb.del('', 't')
  t.deepEqual(r2, { changes: 1, lastInsertRowid: 1 })

  t.end()
})

test('01 - put and set (ns)', t => {
  t.plan(9)

  const r1 = pdb.put('t', 'one')
  t.equal(r1, undefined)

  const r2 = pdb.get('t')
  t.equal(r2.ns, '', 'ns was okay')
  t.equal(r2.k, 't', 't was okay')
  t.equal(r2.v, 'one', 'v was okay')
  t.equal(r2.updates, 1, 'updates was okay')

  const r3 = pdb.get('', 't')
  t.equal(r3.ns, '', 'ns all good')
  t.equal(r3.k, 't', 't all good')
  t.equal(r3.v, 'one', 'v all good')
  t.equal(r3.updates, 1, 'updates all good')

  t.end()
})

test('01 - put and del (ns)', t => {
  t.plan(2)

  const r1 = pdb.put('t', 'two')
  t.equal(r1, undefined)

  const r2 = pdb.del('t')
  t.deepEqual(r2, { changes: 1, lastInsertRowid: 1 })

  t.end()
})

test('01 - get a non-existing key (no ns)', t => {
  t.plan(1)

  const item = pdb.get('nothing')
  t.equal(item, undefined)

  t.end()
})

test('01 - get a non-existing key (ns)', t => {
  t.plan(1)

  const item = pdb.get('t', 'nothing')
  t.equal(item, undefined)

  t.end()
})
