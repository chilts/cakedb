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

test('.putJson() and .modJson()', t => {
  t.plan(3)

  const user = {
    title: 'Andrew Chilton',
    email: 'andy@yahoo.com',
    logins: 1,
  }
  const r1 = pdb.putJson('user', 'andy', user)
  t.equal(r1, undefined, '.putJson() ok')

  // update the email address
  const modUser = {
    email: "andy@gmail.com",
  }
  const changes = pdb.modJson('user', 'andy', '$.email', "andy@gmail.com")
  t.equal(changes, 1, '.modJson() ok')

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

test('.modJson() to an unknown key', t => {
  t.plan(1)

  // update the email address
  const modUser = {
    email: "andy@gmail.com",
  }
  const changes = pdb.modJson('user', 'non-existant', '$.email', 'andy@gmail.com')
  t.equal(changes, 0, '.modJson() ok')

  t.end()
})
