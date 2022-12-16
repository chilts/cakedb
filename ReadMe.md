# Pie DB

A key/value store that uses Sqlite3. Has more than other kv stores.

## Snyopsis

```
import Database from 'better-sqlite3'
import PieDB from 'pie-db'

// create the DB
const db = new Database('/tmp/my.db')
const pdb = new PieDB(db)

// Now you can put, get, and del.
// The 'user' namespace, 'key' is 'chilts', and value is the email address.
pdb.put('user', 'chilts', 'andychilton@gmail.com')

// get the user back out
const row = pdb.get('user', 'chilts')
const usename = row.k
const email = row.v

// delete this user
pdb.del('user', 'chilts')

// you can also put and get an object (serialised as JSON)
pdb.putJson('user', 'chilts', { email: 'andychilton@gmail.com' })
const { v: user } = pdb.getJson('user', 'chilts')
pdb.del('user', 'chilts')

// get all users
const users = pdb.allJson('user')

// iterate over all users
for ( const user of pdf.iterate('user') ) {
  // Note: the `user.v` is still JSON and you should parse it.
  user.v = JSON.parse(user.v)
  // use `user` here
}
```

Remember that `SQLite3 can only bind numbers, strings, bigints, buffers, and
null`, so they're the only things you can pass as the value 'v'.

## `ns`, `k` and `v`

Note that `k` must be unique within each `ns`.

* ns = namespace
* k = key
* v = value

In the case of the `.*Json()` methods you can pass an object (or indeed
anything that `JSON.stringify()` can serialise) and it'll be encoded with
`.putJson()` and decoded with `.getJson()` automatically.

If you actually want the JSON from a previous `.putJson()` you can always call
`.get()` instead of `.getJson()`.

## Attributes

You'll notice that after a `.put()` then `.get()`, the returned object actually
contains various other fields. You'll generally just want the `.v` which was
the value to gave to the `.put()` but sometimes the other fields help.

e.g.

```
pdb.put('user', 'chilts', 'andychilton@gmail.com')
const res = pdg.get('user', 'chilts')
console.log('res:', res)

// res: {
//   ns: 'user',
//   k: 'chilts',
//   v: 'andychilton@gmail.com',
//   updates: 1,
//   inserted: '2022-12-16 05:53:20',
//   updated: '2022-12-16 05:53:20'
// }
```

## API

* .put(ns, k, v)
* .putJson(ns, k, v)
* .get(ns, k)
* .getJson(ns, k)
* .del(ns, k)
* .all(ns)
* .allJson(ns)
* .iterate(ns) // Note: no `.iterateJson(ns)` method

(Ends)
