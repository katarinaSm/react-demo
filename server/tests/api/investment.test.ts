import { createMocks } from 'node-mocks-http';

import handler from '../../../pages/api/investment';

import { addInvestment, validateInvestment } from '../../services/investment';
import { sendEmail } from '../../services/email';
import db from '../../services/db';
import EmailDeliveryError from '../../services/errors/EmailDeliveryError';
import { addInvestmentToCrm } from '../../services/crm';
import CrmError from '../../services/errors/CrmError';

jest.mock('../../services/investment');
jest.mock('../../services/db');
jest.mock('../../services/email');
jest.mock('../../services/crm');

const INVESTMENT_RESPONSE = {
  id: 1,
  email: 'mail@example.com',
  investment_amount: 125000,
  project_id: 1,
  created_at: 'date',
  updated_at: 'data',
};

const PAYLOAD = {
  email: 'mail@example.com',
  investment_amount: 125000,
  project_id: 1,
};

describe('investment API EP', () => {
  beforeEach(() => {
    (db.transaction as jest.Mock).mockImplementation(async (fn) => {
      try {
        await fn();
        return Promise.resolve(INVESTMENT_RESPONSE);
      } catch (e) {
        throw new Error(e.message);
      }
    });
    (validateInvestment as jest.Mock).mockReturnValue(true);
    (addInvestment as jest.Mock).mockReturnValue(Promise.resolve());
  });

  it('should add investment', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: PAYLOAD,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(expect.objectContaining({}));
  });

  it('should fail if investment is not saved to db', async () => {
    (addInvestment as jest.Mock).mockImplementationOnce(() => {
      throw new Error(`Connection to 127.0.0.1:5234 refused`);
    });
    const { req, res } = createMocks({
      method: 'POST',
      body: PAYLOAD,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(`{"message":"Connection to 127.0.0.1:5234 refused"}`);
  });

  it('should fail if investment is not added to CRM', async () => {
    (addInvestmentToCrm as jest.Mock).mockImplementationOnce(() => {
      throw new CrmError(`Failed to create a lead`);
    });
    const { req, res } = createMocks({
      method: 'POST',
      body: PAYLOAD,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(`{"message":"Failed to create a lead"}`);
  });

  it('should ignore failure on email delivery', async () => {
    (sendEmail as jest.Mock).mockImplementationOnce(() => {
      throw new EmailDeliveryError('Email delivery failed');
    });
    const { req, res } = createMocks({
      method: 'POST',
      body: PAYLOAD,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('should return BAD_REQUEST status for an invalid payload', async () => {
    (validateInvestment as jest.Mock).mockReturnValueOnce(false);

    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('should return METHOD_NOT_ALLOWED status if POST method is not used', async () => {
    (sendEmail as jest.Mock).mockImplementationOnce(() => {
      throw new EmailDeliveryError('Email delivery failed');
    });
    const { req, res } = createMocks({
      method: 'PATCH',
      body: {
        email: 'mail@example.com',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
