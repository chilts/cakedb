# Pie DB

A key/value store that uses Sqlite3. Has more than other kv stores. Why?
Because we utilise lots of stuff that Sqlite3 gives us.

A few examples are `.json_patch()` which we use in `.patchJson()`.

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
pdb.put('user', 'andy', 'andy@example.com')
const user = pdg.get('user', 'andy')
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
* .patchJson(ns, k, p) // Note: no `.patch()` method since JSON specific
* .del(ns, k)
* .all(ns)
* .allJson(ns)
* .iterate(ns) // Note: no `.iterateJson(ns)` method

### `.patchJson(ns, k, p)`

Allows easy use of `json_patch()` inside Sqlite3
(https://www.sqlite.org/json1.html#jpatch). This makes it simple to update a
part of a JSON value without having to read it out and write it back.

e.g. update a user's email address:

```
// When the user signs up, add the user.
const user = {
  title: "Andrew Chilton",
  email: "andy@yahoo.com",
}
pdb.putJson('user', 'andy', user)

// At some stage later they update their email address, but no need to
// `.getJson()` first.
pdb.patchJson('user', 'andy', { "email": "andy@gmail.com" })

// if we retrieve the user we can see title is the same but email has changed
const user = pdb.getJson('user', 'andy')
console.log('user:', user)
// user: {
//    ns: 'user',
//    k: 'andy',
//    v: {
//      title: "Andrew Chilton",
//      email: "andy@gmail.com",
//    },
//    updates: 2,
//    inserted: ...,
//    updated: ...,
// }
```

### query(sql, { ... }) / .queryJson(sql, { ... })

Allows you to use your own query against the `kv` table:

```
const user = {
  title: "Andrew Chilton",
  email: "andy@yahoo.com",
}

// put bob
pdb.put('user', 'bob', 'bob@example.com')

// new email address
pdb.put('user', 'bob', 'bob@example.org')

const regularUsers = pdb.query('SELECT v FROM kv WHERE updates > 1')
console.log(regularUsers)
// user: {
//    ns: 'user',
//    k: 'bob',
//    v: 'bob@example.org',
//    updates: 2,
//    inserted: ...,
//    updated: ...,
// }
```

## Changelog

* v0.7.0 - 20230127 - Added .query() and .queryJson()
* v0.6.0 - 20230114 - Make .put*() return the number of rows changed
* v0.5.0 - 20221217 - Added the .modJson() method, which is also awesome (uses Sqlite's `json_set()`)
* v0.4.0 - 20221216 - Added the .patchJson() method, which is awesome (uses Sqlite's `json_patch()`)
* v0.3.2 - 20221216 - Fixed some typos in the ReadMe.md
* v0.3.1 - 20221216 - Updated docs
* v0.3.0 - 20221216 - Added optional namespaces, JSON methods, all() and iterate()
* v0.2.0 - 20221216 - Renamed from CakeDB to PieDB
* v0.1.0 - 20221216 - First version with .get(), .put(), and .del()

(Ends)
