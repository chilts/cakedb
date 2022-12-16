# Pie DB

A key/value store that uses Sqlite3. Has more than other kv stores.

## Synopsis

```
// npm
import Database from 'better-sqlite3'
import PieDB from 'pie-db'

// create the DB
const db = new Database('/tmp/my.db')
const pdb = new PieDB(db)

// Now you can put, get, and del.
// * namespace = 'user'
// * key = 'andy'
// * value = 'andy@example.com'
pdb.put('user', 'andy', 'andy@example.com')

// get the user back out
const row = pdb.get('user', 'andy')
const { ns, k: username, v: email } = row

// delete this user
pdb.del('user', 'andy')
```

## `ns`, `k` and `v`

Note that `k` must be unique within each `ns`. By using the same `k` then
you'll overwrite any data already there.

* ns = namespace
* k = key
* v = value

In the case of the `.*Json()` methods you can pass an object (or indeed
anything that `JSON.stringify()` can serialise) and it'll be encoded inside
`.putJson()` and decoded inside `.getJson()` automatically.

Whilst this also happens when using `.allJson()` instead of `.all()`, there is
no JSON equivalent for `.iterate()` so you'll have to `JSON.parse(item.v)`
yourself if required.

If you actually want the JSON from a previous `.putJson()` you can always use
the non-JSON methods such as `.get()`, since the value `v` is just a string
anyway.

## Attributes Added on each Row

In each item returned, there is more than just `ns`, `k`, and `v`.

* `ns` = namespace
* `k` = key
* `v` = value
* `updates` = a count of the number of updates to this `ns` + `k`
* `inserted` = a string of the date of inserted, i.e. `(new Date()).toISOString()`
* `updated` = a string of the date of last update (similar to above)

e.g. put an email address, get more stuff back

```
pdb.put('user', 'chilts', 'andychilton@gmail.com')
const user = pdg.get('user', 'chilts')
console.log(user:', user)

// user: {
//   ns: 'user',
//   k: 'andy',
//   v: 'andy@example.com',
//   updates: 2,
//   inserted: '2022-12-16T09:20:33.081Z',
//   updated: '2022-12-16T09:20:34.664Z'
// }
```

If you want all of these fields, you could destructure the item:

```
const { ns, k, v, updates, inserted, updated } = user
```

Alternatively, you may just want the `v`, so feel free to do something like
this which is nicely succinct:

```
const { v: user } = pdg.get('user', 'andy')
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
