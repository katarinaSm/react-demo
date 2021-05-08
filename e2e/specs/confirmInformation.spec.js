import { navigateToInfoPage } from './investorForm.spec';
import { AMOUNT_FORMATTED, EMAIL } from '../constants';

describe('Investors data form', () => {
  beforeEach((browser) => {
    navigateToInfoPage(browser);

    browser.page.confirmInformation()
      .waitForElementVisible('@emailField');
  })

  it('Should show investor data', (browser) => {
    browser.page.confirmInformation()
      .assert.containsText('@emailField', EMAIL)
      .assert.containsText('@amountField', AMOUNT_FORMATTED)
  });

  it('Shouldnt submit without investors consent', (browser) => {
    browser.page.confirmInformation()
      .click('@submit')
      .assert.urlEquals(`${process.env.TEST_ENV_URL}/confirm_information`)
  });

  it('Should show error message if submission has failed', (browser) => {
    browser.page.confirmInformation()
      .click('@checkbox')
      .click('@submit')
      .assert.visible('@alert')
  });

  // Didn't provide a mechanism to restore the content of SalesForce
  // as well as generating of random accounts - mocking of BE can help in this case
  // it('Should submit investors data', async(browser) => {
  //   await browser.page.confirmInformation()
  //     .assert.urlEquals(`${process.env.TEST_ENV_URL}/confirm_information`)
  //     .click('@checkbox')
  //     .click('@submit')
  //     .assert.urlEquals(`${process.env.TEST_ENV_URL}/final_step`)
  // });
});
