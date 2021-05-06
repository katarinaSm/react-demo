import sgMail from '@sendgrid/mail';
import { tracking } from './tracking';
import Logger from './logger';
import { formatCurrency } from '../../common/intl';

const log = Logger('email');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EMAIL_SENT = 'EMAIL_SENT';
const EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED';
const FREUD_EMAIL_REJECTED = 'FREUD_EMAIL_REJECTED';
const BLACKLISTED_EMAIL_REJECTED = 'BLACKLISTED_EMAIL_REJECTED';

const setMessage = (email, investment_amount) => ({
  to: email,
  from: 'test@example.com',
  subject: 'Investment',
  text: `Lorem ipsum dolor sit amet ${formatCurrency(
    investment_amount,
  )} EUR, consectetur adipiscing elit`,
});

// eslint-disable-next-line no-unused-vars
const isFreud = (email) => false;

// eslint-disable-next-line no-unused-vars
const isBlacklisted = (email) => false; // TODO: implement me

export const sendEmail = async ({ email, investment_amount }) => {
  log.debug(`Send email to ${email}`);
  if (isFreud(email)) {
    log.info(`Freud ${email} rejected`);
    tracking.write(FREUD_EMAIL_REJECTED, email);
  }

  if (isBlacklisted(email)) {
    log.info(`Blacklisted ${email} rejected`);
    tracking.write(BLACKLISTED_EMAIL_REJECTED, email);
    return;
  }
  try {
    await sgMail.send(setMessage(email, investment_amount));
    log.info(`Email sent to ${email}`);
    tracking.write(EMAIL_SENT, email);
  } catch (e) {
    // TODO:  handle unsuccessfully sent email - for example store it in a queue
    log.error(`Failed to send email to ${email}`);
    tracking.write(EMAIL_SEND_FAILED, email);
  }
};
