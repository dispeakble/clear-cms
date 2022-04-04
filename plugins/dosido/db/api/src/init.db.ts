import { Pool } from 'pg';

export default class InitDb {
  private pool;

  private config = {
    host: process.env.pg_host,
    port: process.env.pg_port || 5432,
    database: 'postgres',
    user: process.env.pg_user,
    password: process.env.pg_password,
    max: 2000000,
    connectionTimeoutMillis: 2000,
  };

  async start(): Promise<string[]> {
    this.pool = new Pool(this.config);

    const connectionsArg = process.env.pg_connections || '';
    const prefix = process.env.app || '';
    const connections = connectionsArg.trim().split(',');
    const response = await Promise.all(
      connections.map(async (dbName) => {
        return (await this.createDb(dbName, prefix))
          ? `${prefix}_${dbName}`
          : '';
      }),
    );

    this.pool.end();

    return response.filter(dbName => dbName.length > 0);
  }

  private createDb(dbName: string, prefix: string) {
    return new Promise((resolve) => {
      const query = `SELECT FROM pg_database WHERE datname = $1;`;

      try {
        this.pool.query(query, [`${prefix}_${dbName}`]).then((result) => {
          if (!result.rowCount) {
            const query = `CREATE DATABASE ${prefix}_${dbName} WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8'`;
            return this.pool.query(query).then(() => {
              resolve(true);
            });
          }
          resolve(false);
        });
      } catch (err) {
        console.log(err);
      }
    });
  }
}
