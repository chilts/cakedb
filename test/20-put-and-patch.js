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

test('.putJson() and .patchJson()', t => {
  t.plan(3)

  const user = {
    title: 'Andrew Chilton',
    email: 'andy@yahoo.com',
    logins: 1,
  }
  const r1 = pdb.putJson('user', 'andy', user)
  t.equal(r1, undefined, '.putJson() ok')

  // update the email address
  const patchUser = {
    email: "andy@gmail.com",
  }
  const changes = pdb.patchJson('user', 'andy', patchUser)
  t.equal(changes, 1, '.patchJson() ok')

  const expUser = {
    ns: 'user',
    k: 'andy',
    v: {
      title: 'Andrew Chilton',
      email: 'andy@gmail.com',
      logins: 1,
    },
    updates: 2,
  }
  const newUser = pdb.getJson('user', 'andy')
  delete newUser.inserted
  delete newUser.updated
  t.deepEqual(newUser, expUser, 'user has updated correctly')

  t.end()
})

test('.patchJson() to an unknown key', t => {
  t.plan(1)

  // update the email address
  const patchUser = {
    email: "andy@gmail.com",
  }
  const changes = pdb.patchJson('user', 'non-existant', patchUser)
  t.equal(changes, 0, '.patchJson() ok')

  t.end()
})
