// https://eu40.lightning.force.com/lightning/page/home
// https://jsforce.github.io/document/
// USER: dragansmiljanic-r7q1@force.com
// LOGIN: https://d09000007k4wdeaq.my.salesforce.com
// https://dragancom-dev-ed.my.salesforce.com dragan@dragan.com / admin1234
// reset token: https://dragancom-dev-ed.lightning.force.com/lightning/settings/personal/ResetApiToken/home?url=%2F_ui%2Fsystem%2Fsecurity%2FResetApiTokenConfirm%3FretURL%3D%252Fsetup%252FpersonalInformationSetup.apexp%26setupid%3DResetApiToken
// DEMO: https://medium.com/netscape/first-time-dev-building-a-fullstack-js-app-for-salesforce-with-oauth-login-jsforce-react-redux-ca5962fb7fe3
// create account - https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
// Leads DB - https://dragancom-dev-ed.lightning.force.com/lightning/o/Lead/list?filterName=Recent
// source: https://jsforce.github.io/jsforce/doc/Connection.html
// get object structure - rest -https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_retrieve_search_layouts.htm?search_text=lead
// wokrbanch https://workbench.developerforce.com/restExplorer.php

import jsforce from 'jsforce';
import CrmError from './errors/CrmError';
import Logger from './logger';

const log = Logger('crm');

const LEAD_INITIAL_STATUS = 'Open - Not Contacted';

const conn = new jsforce.Connection({
  instanceUrl: process.env.SF_INSTANCE_URL,
});

conn
  .login(
    process.env.SF_USER_NAME,
    `${process.env.SF_PASSWORD}${process.env.SF_AUTH_TOKEN}`,
    (err, userInfo) => {
      // don't expose accessToken in production log!!!
      log.debug(conn.accessToken);
      log.debug(conn.instanceUrl);
      // logged in user property
      log.debug(`User ID: ${userInfo.id}`);
      log.debug(`Org ID: ${userInfo.organizationId}`);
    },
  )
  .then(({ id, organizationId }) =>
    log.debug(`Logged in id=${id}, organizationId=${organizationId}`),
  )
  .catch((error) => log.warn('Failed to login', error));

const getCampaignToProjectMapping = async () => {
  try {
    const campaigns = await conn.sobject('Campaign').select('*').execute();

    return campaigns.reduce((acc, { Id: id, Project__c: projectId }) => {
      acc[projectId] = id;
      return acc;
    }, {});
  } catch (e) {
    throw new CrmError("Can't resolve campaign to project mapping");
  }
};

const addLead = async (email, amount) => {
  try {
    // just for demo - to make SalesForce happy
    const [fakeFullName, fakeCompany] = email.split('@');
    const [firstName, lastName] = fakeFullName.split('.');
    // ^^^^^
    return await conn.sobject('Lead').create({
      title: 'Mr/Ms',
      firstName,
      lastName: lastName ?? firstName,
      company: fakeCompany ?? 'N/A',
      email,
      amount__c: amount,
      status: LEAD_INITIAL_STATUS,
    });
  } catch (e) {
    throw new CrmError('Failed to create a lead');
  }
};

const assignLeadToCampaign = async (leadId, campaignId) => {
  try {
    return await conn.sobject('campaignMember').create({ leadId, campaignId });
  } catch (e) {
    throw new CrmError(`Can't assign lead ${leadId} to campaign ${campaignId}`);
  }
};

export const addInvestmentToCrm = async ({
  email,
  investment_amount: amount,
  project_id: projectId,
}) => {
  log.debug({ amount, projectId });
  const mapping = await getCampaignToProjectMapping();
  log.debug(`mapping=${JSON.stringify(mapping)}`);
  const campaignId = mapping[projectId];
  if (!mapping[projectId]) {
    throw new CrmError(`Project ${projectId} doesn't exist`);
  }
  const lead = await addLead(email, amount);
  log.debug(`Created lead=${lead.id}`);
  await assignLeadToCampaign(lead.id, campaignId);
};
