import { Knex } from 'knex';

import db from './db';
import Logger from './logger';
import { IInvestmentPayload } from '../../common/types';

// https://www.npmjs.com/package/mock-knex
const log = Logger('investment');

const INVESTORS = 'investors';

export const addInvestment = async (trx: Knex.Transaction, investor: IInvestmentPayload) => {
  log.debug(
    `Add investor email=${investor.email} amount=${investor.investment_amount} project=${investor.project_id}`,
  );
  return db(INVESTORS)
    .transacting(trx)
    .insert(investor)
    .returning('*')
    .then((resp) => resp[0]);
};

export const validateInvestment = (investor: IInvestmentPayload) =>
  investor.email &&
  typeof investor.investment_amount === 'number' &&
  typeof investor.project_id === 'number';
