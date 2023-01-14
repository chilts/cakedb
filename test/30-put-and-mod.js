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

test('30 - .putJson() and .modJson()', t => {
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

test('30 - .modJson() to an unknown key', t => {
  t.plan(1)

  // update the email address
  const modUser = {
    email: "andy@gmail.com",
  }
  const changes = pdb.modJson('user', 'non-existant', '$.email', 'andy@gmail.com')
  t.equal(changes, 0, '.modJson() ok')

  t.end()
})


test('30 - .putJson() and .modJson() of an array', t => {
  t.plan(5)

  const r1 = pdb.putJson('list', [])
  t.equal(r1, undefined, '.putJson() ok')

  // add a new item
  const modUser1 = {
    title: "Andrew Chilton",
    email: "andy@gmail.com",
    logins: 1,
  }
  const changes = pdb.modJson('list', '$[#]', modUser1)
  t.equal(changes, 1, '.modJson() ok')

  const expList1 = {
    ns: '',
    k: 'list',
    v: [
      {
        title: 'Andrew Chilton',
        email: 'andy@gmail.com',
        logins: 1,
      },
    ],
    updates: 2,
  }
  const list1 = pdb.getJson('list')
  delete list1.inserted
  delete list1.updated
  t.deepEqual(list1, expList1, 'list has updated correctly')

  // add a new item
  const modUser2 = {
    title: "Bob Jones",
    email: "bob@jones.com",
    logins: 11,
  }
  const changes2 = pdb.modJson('list', '$[#]', modUser2)
  t.equal(changes2, 1, '.modJson() ok again')

  const expList2 = {
    ns: '',
    k: 'list',
    v: [
      {
        title: 'Andrew Chilton',
        email: 'andy@gmail.com',
        logins: 1,
      },
      {
        title: 'Bob Jones',
        email: 'bob@jones.com',
        logins: 11,
      },
    ],
    updates: 3,
  }
  const list2 = pdb.getJson('list')
  delete list2.inserted
  delete list2.updated
  t.deepEqual(list2, expList2, 'list has updated correctly again')

  t.end()
})
