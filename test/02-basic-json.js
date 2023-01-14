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

test('02 - put and set (empty ns)', t => {
  t.plan(2)

  const r1 = pdb.putJson('user', 'jack', { name: 'Jack Sparrow' })
  t.equal(r1, 1, '.put() worked')

  const user = pdb.getJson('user', 'jack')
  delete user.inserted
  delete user.updated
  const expUser = {
    ns: 'user',
    k: 'jack',
    v: {
      name: 'Jack Sparrow',
    },
    updates: 1,
  }
  t.deepEqual(user, expUser, 'Got user as expected')

  t.end()
})
