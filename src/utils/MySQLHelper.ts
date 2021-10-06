import { createPool, Pool, PoolConnection } from "mysql2";

export default class MySQLHelper {
  public pool: Pool;
  constructor() {
    this.pool = createPool({
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      port: Number(process.env.MYSQL_PORT),
      connectionLimit: Number(process.env.MYSQL_MAX_POOL_SIZE),
      timezone: process.env.MYSQL_TIMEZONE,
    });
  }

  /**
   * Prints the given query without new lines and extra spaces vo avoid flooding logs
   * @param query
   * @param values
   */
  logQuery(query: string = "", values: any[] = []) {
    if (process.env.NODE_ENV === "development") {
      // \s{2,} matches any white space (length >= 2) character (equal to [\r\n\t\f\v ])
      const log = query.replace(/\s{2,}/g, " ");
      console.debug(`query: ${log} values: ${values}`);
    }
  }

  /**
   * Usage:
   * const result = await instance.query('SELECT * FROM my_table WHERE col1 = ? AND col2 = ?', ['val1', 'val2'])
   *
   * @param query
   * @param values
   * @param connection Used if query needs to be run from a specific connection (e.g. inside a transaction)
   */
  query = <T>(query: string, values: any[] = [], connection?: PoolConnection): Promise<T[]> => {
    this.logQuery(query);
    const conn = connection || this.pool;

    // Based on docs, https://www.npmjs.com/package/mysql#pooling-connections
    // pool.query(...) is a shortcut for the pool.getConnection() -> connection.query() -> connection.release()
    // so we don't have to worry about connection releasing here
    return new Promise<T[]>((resolve, reject) => {
      conn.query(query, values, (err, results: []) => {
        // see https://www.npmjs.com/package/mysql#error-handling to get more insights about the error
        if (err) reject(err);
        else resolve(results);
      });
    });
  };

  insert = (query: string, values: any[] = [], connection?: PoolConnection): Promise<number> =>
    new Promise<number>((resolve, reject) => {
      this.logQuery(query);
      const conn = connection || this.pool;
      conn.query(query, values, (err, results: any) => {
        if (err) reject(err);
        else {
          // will be different than 0 if our table has an autoincrement column
          resolve(results.insertId);
        }
      });
    });

  update = (query: string, values: any[] = [], connection?: PoolConnection): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      this.logQuery(query, values);
      const conn = connection || this.pool;
      conn.query(query, values, (err, results: any) => {
        if (err) reject(err);
        else {
          console.debug(`update results: ${JSON.stringify(results)}`);
          resolve(results);
        }
      });
    });

  getTables = (): Promise<any[]> => {
    return this.query<any>("SHOW TABLES");
  };

  beginTransaction = (): Promise<PoolConnection> =>
    new Promise<PoolConnection>((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) reject(err);
        else {
          conn.beginTransaction((err2) => {
            if (err2) reject(err2);
            else resolve(conn);
          });
        }
      });
    });

  rollbackTransaction = async (connection: PoolConnection): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => {
        connection.rollback(() => resolve());
      });
    } finally {
      connection.release();
    }
  };

  /**
   * Commits or rolls back the transaction in case of error during commit
   * @param connection
   */
  commitTransaction = async (connection: PoolConnection): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => {
        connection.commit((err) => {
          if (err) {
            connection.rollback(() => reject(err));
          } else resolve();
        });
      });
    } finally {
      connection.release();
    }
  };
  /**
   * Executes a delete query using an existing connection from a transaction
   * @param connection
   * @param query
   * @param values
   */
  delete = (connection: PoolConnection, query: string, values: [any]): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      this.logQuery(query);
      connection.query(query, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
}
