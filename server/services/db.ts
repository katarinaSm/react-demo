import knex, { Knex } from 'knex';
import dotenv from 'dotenv';
import Logger from './logger';

const log = Logger('db');

const dbLogger: Knex.Logger = {
  debug: (x) => log.debug(JSON.stringify(x)),
  warn: (x) => log.warn(JSON.stringify(x)),
  deprecate: (x) => log.warn(JSON.stringify(x)),
  error: (x) => log.error(JSON.stringify(x)),
};

dotenv.config();

const db = knex({
  client: 'pg',
  connection: process.env.CONNECTION_STRING,
  debug: process.env.PG_DEBUG_LOG === 'true',
  log: dbLogger,
});

export default db;
