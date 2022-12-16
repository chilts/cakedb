const createTableSql = `
  CREATE TABLE IF NOT EXISTS kv (
    ns TEXT NOT NULL,
    k TEXT NOT NULL,
    v TEXT NOT NULL,
    -- ttl INTEGER DEFAULT -1,
    updates INTEGER DEFAULT 1,
    inserted DATETIME NOT NULL,
    updated DATETIME NO NULL,

    PRIMARY KEY (ns, k)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS kv_ns_k ON kv(ns, k);
`

const putSql = `
  INSERT INTO
    kv(ns, k, v, inserted, updated) VALUES (@ns, @k, @v, @ts, @ts)
  ON CONFLICT
    (ns, k)
  DO UPDATE SET
    ns = @ns, k = @k, v = @v, updates = updates + 1, updated = @ts
  ;
`

const getSql = `
  SELECT
    *
  FROM
    kv
  WHERE
    ns = @ns
  AND
    k = @k
  ;
`

const patchSql = `
  UPDATE
    kv
  SET
    v = json_patch(v, @p),
    updates = updates + 1,
    updated = @ts
  WHERE
    ns = @ns
  AND
    k = @k
  ;
`

const delSql = `
  DELETE FROM
    kv
  WHERE
    ns = @ns
  AND
    k = @k
  ;
`

const allSql = `
  SELECT * FROM kv WHERE ns = @ns ORDER BY k
`

export default class PieDB {
  constructor(db) {
    // always turn this on
    db.pragma('journal_mode = WAL')

    // remember the DB
    this.db = db

    // create the table
    db.exec(createTableSql)

    // prepare some statements
    this.putStmt = db.prepare(putSql)
    this.getStmt = db.prepare(getSql)
    this.patchStmt = db.prepare(patchSql)
    this.delStmt = db.prepare(delSql)
    this.allStmt = db.prepare(allSql)
  }

  put(ns, k, v) {
    // console.log({ ns, k, v })
    if ( arguments.length === 2 ) {
      v = k
      k = ns
      ns = ''
    }
    const ts = (new Date()).toISOString()
    this.putStmt.run({ ns, k, v, ts })
  }

  putJson(ns, k, v) {
    if ( arguments.length === 2 ) {
      v = k
      k = ns
      ns = ''
    }
    this.put(ns, k, JSON.stringify(v))
  }

  get(ns, k) {
    if ( arguments.length === 1 ) {
      k = ns
      ns = ''
    }
    return this.getStmt.get({ ns, k })
  }

  getJson(ns, k) {
    if ( arguments.length === 1 ) {
      k = ns
      ns = ''
    }
    const res = this.getStmt.get({ ns, k })
    // console.log('res:', res)
    return { ...res, v: JSON.parse(res.v) }
  }

  patchJson(ns, k, p) {
    if ( arguments.length === 2 ) {
      p = k
      k = ns
      ns = ''
    }
    const ts = (new Date()).toISOString()
    const params = {
      ns,
      k,
      p: JSON.stringify(p),
      ts,
    }
    // console.log('params:', params)
    const res = this.patchStmt.run(params)
    // console.log('res:', res)
    return res.changes
  }

  del(ns, k) {
    if ( arguments.length === 1 ) {
      k = ns
      ns = ''
    }
    return this.delStmt.run({ ns, k })
  }

  // returns ordered by 'k'
  all(ns) {
    if ( arguments.length === 0 ) {
      ns = ''
    }
    return this.allStmt.all({ ns })
  }

  // returns ordered by 'k'
  allJson(ns) {
    const items = this.all(ns)
    for ( const item of items ) {
      item.v = JSON.parse(item.v)
    }
    return items
  }

  iterate(ns) {
    return this.allStmt.iterate({ ns })
  }
}
