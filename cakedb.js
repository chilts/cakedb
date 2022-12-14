const createTableSql = `
  CREATE TABLE IF NOT EXISTS kv (
    ns TEXT,
    k TEXT,
    v TEXT,
    -- ttl INTEGER DEFAULT -1,
    updates INTEGER DEFAULT 1,
    inserted DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (ns, k)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS kv_ns_k ON kv(ns, k);
`

const putSql = `
  INSERT INTO
    kv(ns, k, v) VALUES (@ns, @k, @v)
  ON CONFLICT
    (ns, k)
  DO UPDATE SET
    ns=@ns, k=@k, v=@v, updates = updates + 1, updated = CURRENT_TIMESTAMP
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

const delSql = `
  DELETE FROM
    kv
  WHERE
    ns = @ns
  AND
    k = @k
  ;
`

export default class CakeDB {
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
    this.delStmt = db.prepare(delSql)
  }

  // must provide all three (even if `ns=""`)
  put(ns, k, v) {
    this.putStmt.run({ ns, k, v })
  }

  get(ns, k) {
    return this.getStmt.get({ ns, k })
  }

  del(ns, k) {
    return this.delStmt.run({ ns, k })
  }
}
