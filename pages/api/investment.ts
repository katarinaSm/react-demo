import 'pg';
import pick from 'lodash/pick';

import { addInvestment, validateInvestment } from '../../server/services/investment';
import db from '../../server/services/db';
import { sendEmail } from '../../server/services/email';
import { addInvestmentToCrm } from '../../server/services/crm';
import Logger from '../../server/services/logger';

const log = Logger('api:investment');

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const OK = 200;
const BAD_REQUEST = 400;
const METHOD_NOT_ALLOWED = 405;
const INTERNAL_SERVER_ERROR = 500;
const BAD_GATEWAY = 503;

let simulateError = 0;

// not a pattern that I will suggested to use
// demonstrates how can an exception be ignored
const ignoreException = async (fn, ...args) => {
  try {
    await fn(...args);
  } catch (e) {
    log.error(e.message);
  }
};

const handler = async (req, res) => {
  if (process.env.SIMULATE_NETWORK_LOAD === 'true') {
    // slow down in order to make animation visible
    await new Promise((resolve) => setTimeout(resolve, 3000)); // sleep(3000)
  }

  if (req.method !== 'POST') {
    res.status(METHOD_NOT_ALLOWED).end();
    return;
  }

  const investment = pick(req.body, ['email', 'investment_amount', 'project_id']);

  if (!validateInvestment(investment)) {
    res.status(BAD_REQUEST).json({});
    return;
  }

  simulateError += 1;
  if (simulateError % 2 !== 0 && process.env.SIMULATE_NETWORK_LOAD === 'true') {
    // simulate error in order to demonstrate alert
    res.status(BAD_GATEWAY).json({});
    return;
  }
  try {
    // returns inserted object - we are not interested in it here
    await db.transaction(async (trx) => {
      await addInvestment(trx, investment);

      // will throw an exception on failure
      // should be business decision whether the data will be saved in DB
      // For this demo we won't save if CMR update/patch fails
      await addInvestmentToCrm(investment);

      // won't throw exception - on failure will add email to queue
      // or can use email provider with retry mechanism
      await ignoreException(sendEmail, investment);
    });
    res.status(OK).json({});
  } catch (err) {
    // don't expose actual  error messages in production
    // for demo purpose messages of errors will be part of a failed response
    log.debug(err?.message);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err?.message,
    });
  }
};

export default handler;
