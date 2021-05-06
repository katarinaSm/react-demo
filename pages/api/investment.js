import 'pg';
import pick from 'lodash/pick';

import { addInvestment, validateInvestment } from '../../server/services/investment';
import db from '../../server/services/db';
import { sendEmail } from '../../server/services/email';
import { addInvestmentToCrm } from '../../server/services/crm';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const OK = 200;
const BAD_REQUEST = 400;
const METHOD_NOT_ALLOWED = 405;
const INTERNAL_SERVER_ERROR = 500;
const BAD_GATEWAY = 503;

let simulateError = 0;

export default async function handler(req, res) {
  // slow down in order to make animation visible
  await new Promise((resolve) => setTimeout(resolve, 3000)); // sleep(3000)

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
  if (simulateError % 2 !== 0) {
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
      addInvestmentToCrm(investment);

      // won't throw exception - on failure will add email to queue
      // or can use email provider with retry mechanism
      sendEmail(investment);
    });
    res.status(OK).json({});
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({
      // don't expose actual db error message in production
      message: err?.message,
    });
  }

  /*
    TEST:
    db.select('*')
      .from('investors')
      .then(rows => {
        res.status(200).json(rows)
      })
      .catch(err => {
          res.status(500).json({ error: 'n/a' })
      }) */
}
