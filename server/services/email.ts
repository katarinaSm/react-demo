import sgMail from '@sendgrid/mail';
import { tracking } from './tracking';
import Logger from './logger';
import { formatCurrency } from '../../common/intl';
import EmailDeliveryError from './errors/EmailDeliveryError';

const log = Logger('email');

const EMAIL_SENT = 'EMAIL_SENT';
const EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED';
const FREUD_EMAIL_REJECTED = 'FREUD_EMAIL_REJECTED';
const BLACKLISTED_EMAIL_REJECTED = 'BLACKLISTED_EMAIL_REJECTED';

const setMessage = (email: string, investment_amount: number) => ({
  to: email,
  from: 'test@example.com',
  subject: 'Investment',
  text: `Lorem ipsum dolor sit amet ${formatCurrency(
    investment_amount,
  )} EUR, consectetur adipiscing elit`,
});

// eslint-disable-next-line no-unused-vars
const isFreud = (email: string): boolean => false;

// eslint-disable-next-line no-unused-vars
const isBlacklisted = (email: string): boolean => false; // TODO: implement me

export const sendEmail = async ({
  email,
  investment_amount,
}: {
  email: string;
  investment_amount: number;
}) => {
  log.debug(`Send email to ${email}`);
  if (isFreud(email)) {
    tracking.write(FREUD_EMAIL_REJECTED, email);
    throw new EmailDeliveryError('Freud detected');
  }

  if (isBlacklisted(email)) {
    tracking.write(BLACKLISTED_EMAIL_REJECTED, email);
    throw new EmailDeliveryError('Blacklisted mail rejected');
  }
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(setMessage(email, investment_amount));
    tracking.write(EMAIL_SENT, email);
  } catch (e) {
    // TODO:  handle unsuccessfully sent email - for example store it in a queue
    tracking.write(EMAIL_SEND_FAILED, email);
    throw new EmailDeliveryError('Email delivery failed');
  }
};
