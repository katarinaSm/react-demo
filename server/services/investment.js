import db from './db';
import Logger from './logger';

// https://www.npmjs.com/package/mock-knex
const log = Logger('investment');

const INVESTORS = 'investors';

export const addInvestment = (trx, investor) => {
  log.debug(
    `Add investor email=${investor.email} amount=${investor.investment_amount} project=${investor.project_id}`,
  );
  return db(INVESTORS)
    .transacting(trx)
    .insert(investor)
    .returning('*')
    .then((resp) => resp[0]);
};

export const validateInvestment = (investor) =>
  investor?.email &&
  typeof parseFloat(investor?.investment_amount) === 'number' &&
  typeof investor?.project_id === 'number';
