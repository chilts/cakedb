// npm
import test from 'tape'
import Database from 'better-sqlite3'
import zid from 'zid'

// local
import PieDB from '../pie-db.js'

// setup
const expUsers = [
  {
    ns: 'user',
    k: 'jane',
    v: { email: 'jane@example.com' },
    updates: 1,
  },
  {
    ns: 'user',
    k: 'john',
    v: { email: 'john@example.org' },
    updates: 1,
  },
  {
    ns: 'user',
    k: 'rita',
    v: { email: 'rita@example.io' },
    updates: 1,
  },
  {
    ns: 'user',
    k: 'xara',
    v: { email: 'xara@example.net' },
    updates: 1,
  }
]

// create the DB
const db = new Database('/tmp/' + zid(8) + '.db')
process.on('exit', () => {
  console.log('Closing DB')
  db.close()
})

// Pie DB
const pdb = new PieDB(db)

test('10 - multiple .put()', t => {
  t.plan(1)

  pdb.putJson('user', 'rita', { email: 'rita@example.io' })
  pdb.putJson('user', 'xara', { email: 'xara@example.net' })
  pdb.putJson('user', 'jane', { email: 'jane@example.com' })
  pdb.putJson('user', 'john', { email: 'john@example.org' })
  t.pass('Put x 4')

  t.end()
})

test('10 - .all()', t => {
  t.plan(1)

  const users = pdb.allJson('user')
  for ( const user of users ) {
    delete user.inserted
    delete user.updated
  }

  t.deepEqual(users, expUsers, 'All users are present and correct')

  t.end()
})


test('10 - .all()', t => {
  t.plan(expUsers.length)

  let i = 0
  for ( const user of pdb.iterate('user') ) {
    delete user.inserted
    delete user.updated
    user.v = JSON.parse(user.v)
    t.deepEqual(user, expUsers[i], `User at index ${i} is okay`)
    i += 1
  }

  t.end()
})
