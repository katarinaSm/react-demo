import { navigateToInvestmentFormPage } from './projects.spec';
import { AMOUNT, EMAIL } from '../constants';

export const navigateToInfoPage = (browser) => {
  navigateToInvestmentFormPage(browser)

  browser.page.investorForm()
    .waitForElementVisible('@emailInputField')
    .setValue('@emailInputField', EMAIL)
    .setValue('@amountInputField', AMOUNT)
    .click('@submit')
}

const EMAIL_VALIDATION_ERROR = 'Email is a required field';
const AMOUNT_VALIDATION_ERROR = 'Expected a positive number';

describe('Investors data form', () => {
  it('Should open confirm info page after submission of valid form', (browser) => {
    navigateToInvestmentFormPage(browser);

    browser.page.investorForm()
      .assert.urlEquals(`${process.env.TEST_ENV_URL}/enter_information`)
      .setValue('@emailInputField', EMAIL)
      .setValue('@amountInputField', AMOUNT)
      .click('@submit')
      .assert.urlEquals(`${process.env.TEST_ENV_URL}/confirm_information`)
  })

  it('Should prevent submission of invalid form', (browser) => {
    navigateToInvestmentFormPage(browser);

    browser.page.investorForm()
      .assert.urlEquals(`${process.env.TEST_ENV_URL}/enter_information`)
      .waitForElementVisible('@submit')
      .submitForm('@submit')
      .assert.urlEquals(`${process.env.TEST_ENV_URL}/enter_information`)
      .waitForElementVisible('@emailErrorMessage')
      .assert.containsText('@emailErrorMessage', EMAIL_VALIDATION_ERROR)
      .assert.containsText('@amountErrorMessage', AMOUNT_VALIDATION_ERROR )
  });

});
